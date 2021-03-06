import {configure, render, screen, waitFor} from "@testing-library/react";
import user from "@testing-library/user-event";
import React from "react";
import {setupServer} from "msw/node";
import {MockedRequest, ResponseComposition, rest} from "msw";
import {MemoryRouter} from "react-router-dom";
import EditPatientDetailsPage, {PatientDetailsFormData} from "../../pages/EditPatientDetailsPage";

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

const server = setupServer();

const mockNavigate = jest.fn();
const mockAlert = jest.spyOn(window, 'alert').mockImplementation();

jest.mock('../../components/AuthComponents', () => ({
    useAuth: () => {
        return {
            token: "sampleToken",
            modifyState: ( ) => { },
            user: mockedUser,
        }
    }

}));

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
}));

jest.mock("../../components/forms/EditPatientDetailsForm", () => {
    return function DummyEditPatientDetailsForm(props: { onSubmit: (e: any) => void, initialValues: PatientDetailsFormData }) {
        return (<button onClick={
                () => props.onSubmit(mockedData)
            }>
                Save
            </button>
        )
    };
});

configure({ asyncUtilTimeout: 5000 });
describe("Edit Patient Details Page", () => {

    beforeAll(() => {
        server.listen();
    });

    beforeEach(() => {
        // eslint-disable-next-line testing-library/no-render-in-setup
        render(<EditPatientDetailsPage/>, {wrapper: MemoryRouter});
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
        await waitFor(() => {
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
                            message: 'Smth wrong'
                        })
                )
            }),
        )

        await user.click(screen.getByRole('button', {name: /Save/i}))
        await waitFor(() => {
            expect(screen.getAllByText(/Error/i)[0]).toBeInTheDocument();
        })
    })

    it('displays modal on unauthorised error', async () => {
        server.use(
            rest.put('*/patient/account', async (req, res, ctx) => {
                return res(
                    ctx.json(
                        {
                            success: false,
                            message: 'User unauthorised: invalid or empty bearer token'
                        }),
                    ctx.status(401),
                )
            }),
        )
        user.click(screen.getByRole('button', {name: /Save/i}))

        await waitFor(() => {
            expect(screen.getByText(/error/i)).toBeInTheDocument();
        })
    })
});