import {render, screen, waitFor} from "@testing-library/react";
import ScheduleForm, {DoctorScheduleForm} from "../components/ScheduleForm";
import user from "@testing-library/user-event";
import React from "react";
import {setupServer} from "msw/node";
import {MockedRequest, ResponseComposition, rest} from "msw";
import {SubmitHandler} from "react-hook-form";
import EnterSchedulePage from "../pages/EnterSchedulePage";
import {MemoryRouter, Router} from "react-router-dom";
import { AuthState } from "../types/auth";
const slots = [
    {
        beginning: {
            hour: '8',
            minute: '00'
        },
        end: {
            hour: '12',
            minute: '00'
        }
    },
    {
        beginning: {
            hour: '12',
            minute: '30'
        },
        end: {
            hour: '17',
            minute: '00'
        }
    },

];

const mockedData = {
    week: new Date("2022-04-10T00:00:00Z"),
    monSlots: slots,
    tueSlots: slots,
    wedSlots: slots,
    thuSlots: slots,
    friSlots: slots,
    satSlots: [],
    sunSlots: [],
}


const server = setupServer(
    rest.post('*/doctor/vaccination-slots', async (request: MockedRequest, response: ResponseComposition, ctx) => {
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

jest.mock('../components/AuthComponents', () => ({
    useAuth: () =>  {
        return {
            token: "sampleToken",
            modifyState: (modifyFunc: React.SetStateAction<AuthState>) => { }
        }
    }

}));

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
}));

jest.mock("../components/ScheduleForm", () => {
    return function DummyScheduleForm(props: { onSubmit: SubmitHandler<DoctorScheduleForm> }) {
        return (<button onClick={() => props.onSubmit(mockedData)}>Save</button>)
    };
});

describe("Enter Schedule Page", () => {

    beforeAll(() => {
        server.listen();
    });

    beforeEach(() => {
        render(<EnterSchedulePage/>, {wrapper: MemoryRouter });
    })

    afterAll(() => server.close());

    afterEach(() => server.resetHandlers());

    it('routes to dashboard form on save', async () => {
        await user.click(screen.getByRole('button', {name: /Save/i }))
        
        await waitFor(() =>{
                expect(mockNavigate).toHaveBeenCalledWith('/doctor');
            })
        })

    it('routes to login page on auth error', async () => {
        server.use(
            rest.post('*/doctor/vaccination-slots', async (req, res, ctx) => {
                return res(
                    ctx.status(401),
                    ctx.json(
                        {
                        message: 'User unauthorised: invalid or empty bearer token'
                    })
                )
            }),
        )

        await user.click(screen.getByRole('button', {name: /Save/i }))

        await waitFor(() =>{
            expect(mockNavigate).toHaveBeenCalledWith('/loginDoctor');
        })
    })
});