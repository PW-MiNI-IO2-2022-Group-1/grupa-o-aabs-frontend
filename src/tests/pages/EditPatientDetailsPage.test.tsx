import {getByText, render, screen, waitFor} from "@testing-library/react";
import ScheduleForm, {DoctorScheduleForm} from "../../components/forms/ScheduleForm";
import user from "@testing-library/user-event";
import React from "react";
import {setupServer} from "msw/node";
import {MockedRequest, ResponseComposition, rest} from "msw";
import {SubmitHandler} from "react-hook-form";
import SetSchedulePage from "../../pages/SetSchedulePage";
import {MemoryRouter, Router} from "react-router-dom";
import { AuthState } from "../../types/auth";
import {FormikProps} from "formik";
import EditPatientDetailsPage, {PatientDetailsFormData} from "../../pages/EditPatientDetailsPage";
import {act} from "react-dom/test-utils";


const mockedData = {
    firstName: 'Adam',
    lastName: 'Abacki',
    password: 'password',
    city: 'Adamtown',
    zipCode: '69-420',
    street: 'Adama Adamowicza',
    houseNumber: '21',
    localNumber: '37',
}
const mockedUser = {
    firstName: 'Adam',
    lastName: 'Abacki',
    address: {
        city: 'Adamtown',
        zipCode: '69-420',
        street: 'Adama Adamowicza',
        houseNumber: '21',
        localNumber: 'l.37',
    },

}

const convertToEvent = (data: PatientDetailsFormData) => {
    return {
        preventDefault: () => {},
        target: {
            firstName: {
                value: data.firstName,
            },
            lastName: {
                value: data.lastName,
            },
            password: {
                value: data.password,
            },
            zipCode: {
                value: data.zipCode,
            },
            city: {
                value: data.city
            },
            houseNumber: {
                value: data.houseNumber,
            },
            localNumber: {
                value: data.localNumber,
            },
            street: {
                value: data.street,
            },
        }
    }
};

const server = setupServer(
    rest.put('*/patient/account', async (request: MockedRequest, response: ResponseComposition, ctx) => {
        if(request.headers.get('Authorisation') !== "")
            return response(
                ctx.delay(100),
                ctx.json({}));
        else
            return response(
                ctx.delay(100),
                ctx.json({message: 'not authorised'}),
                ctx.status(401),
            )
    })
);

const mockNavigate = jest.fn();
const mockAlert = jest.spyOn(window,'alert').mockImplementation();

jest.mock('../../components/AuthComponents', () => ({
    useAuth: () =>  {
        return {
            token: "sampleToken",
            modifyState: (modifyFunc: React.SetStateAction<AuthState>) => { },
            user: mockedUser,
        }
    }

}));

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
}));

jest.mock("../../components/forms/EditPatientDetailsForm", () => {
    return function DummyEditPatientDetailsForm(props: { onSubmit: (e: any) => void, initialValues: PatientDetailsFormData}) {
        return (<button onClick={
            () => props.onSubmit(convertToEvent(mockedData))
        }>
            Save
        </button>
        )
    };
});

describe("Edit Patient Details Page", () => {

    beforeAll(() => {
        server.listen();
    });

    beforeEach(() => {
        render(<EditPatientDetailsPage/>, {wrapper: MemoryRouter });
    })

    afterAll(() => server.close());

    afterEach(() => server.resetHandlers());

    it('displays success modal on data properly changed', async () => {
        server.use(
            rest.put('*/patient/account', async (request: MockedRequest, response: ResponseComposition, ctx) => {
                return response(
                    ctx.delay(100),
                    ctx.json({}),
                    ctx.status(200),
                )
        }));
        user.click(screen.getByRole('button', {name: /Save/i}))
        await waitFor(() =>{
            expect(screen.getByText(/successfully/i)).toBeInTheDocument();
        })
    })

    it('displays error modal on unknown error', async () => {
        server.use(
            rest.put('*/patient/account', async (req, res, ctx) => {
                return res(
                    ctx.status(422),
                    ctx.json(
                        {
                            success: false,
                            message: 'Smth wrongw'
                        })
                )
            }),
        )

        await user.click(screen.getByRole('button', {name: /Save/i }))
        await waitFor(() =>{
            expect(screen.getAllByText(/Error/i)[0]).toBeInTheDocument();
        })
    })

    it('routes on ok click on error modal', async () => {
        server.use(
            rest.put('*/patient/account', async (req, res, ctx) => {
                return res(
                    ctx.status(401),
                    ctx.json(
                        {
                            success: false,
                            message: 'User unauthorised: invalid or empty bearer token'
                        })
                )
            }),
        )
        user.click(screen.getByRole('button', {name: /Save/i}))

        await waitFor(() =>{
            expect(mockAlert).toHaveBeenCalled();
        })
    })
});