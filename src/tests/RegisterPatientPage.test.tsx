import React from 'react'
import RegisterPatientPage from "../pages/RegisterPatientPage";
import {render, screen, waitFor} from "@testing-library/react";
import user from '@testing-library/user-event'
import {RegistrationData} from "../components/RegisterPatientForm";
import {setupServer} from "msw/node";
import {MockedRequest, ResponseComposition, rest} from "msw";
import {SubmitHandler} from "react-hook-form";

const mockedData = {
    address: {
        city: "Warsaw",
        houseNumber: "11A",
        localNumber: "3",
        street: "Ogrodowa",
        zipCode: "12-123",
    },
    email: "abc@wp.pl",
    firstName: "adam",
    lastName: "abacki",
    password: "abc",
    pesel: "98071962617",
}

const server = setupServer(
    rest.post('*/patient/registration', async (request: MockedRequest, response: ResponseComposition, ctx) => {
        // returning the sent object when successful
        return response(
            ctx.delay(100),
            ctx.json(request.body));
    })
);

beforeAll(() => server.listen());
afterAll(() => server.close());
afterEach(() => server.resetHandlers());

jest.mock("../components/RegisterPatientForm", () => {
    return function DummyRegisterPatientForm(props: { onSubmit: SubmitHandler<RegistrationData> }) {
        return (<button onClick={() => props.onSubmit(mockedData)}>Click</button>)
    };
});


describe('RegisterPatientPage', () => {

    beforeEach(() => {
        render(<RegisterPatientPage/>)
    })

    describe("after success", () => {
        test("shows dialog with login button", async () => {
            const button = screen.getByRole('button', {
                name: /click/i
            })
            user.click(button)
            await waitFor(() =>
                expect(screen.getByRole('button', {name: /login/i})).toBeInTheDocument());
        })
    })

    describe("after error", () => {
        beforeEach(()=>{
            server.use(
                rest.post('*/patient/registration', async (request: MockedRequest, response: ResponseComposition, ctx) => {
                    // returning the sent object when successful
                    return response(
                        ctx.delay(100),
                        ctx.status(409),
                        ctx.json({success: false, msg: 'something wrong'})
                    )
                })
            )
        })

        test("shows dialog with error", async () => {
            const button = screen.getByRole('button', {
                name: /click/i
            })
            user.click(button)
            await waitFor(() =>
                expect(screen.getAllByText(/error/i)[0]).toBeInTheDocument());
        })
    })
})
