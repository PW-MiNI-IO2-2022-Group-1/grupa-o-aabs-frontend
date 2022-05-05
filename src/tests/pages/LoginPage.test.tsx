import {render, screen, waitFor} from "@testing-library/react";
import {$enum} from "ts-enum-util";
import user from "@testing-library/user-event";
import React from "react";
import {setupServer} from "msw/node";
import {MockedRequest, ResponseComposition, rest} from "msw";
import {MemoryRouter} from "react-router-dom";
import {AuthState} from "../../types/auth";
import EditPatientDetailsPage, {PatientDetailsFormData} from "../../pages/EditPatientDetailsPage";
import {Role} from "../../types/users";
import LoginPage from "../../pages/LoginPage";
import mock = jest.mock;
import {wait} from "@testing-library/user-event/dist/utils";
import {AuthProvider} from "../../components/AuthComponents";

const mockUser = {
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
const mockValidLogin = {
    email: "test@test.com",
    password: "password"
}

const mockInvalidLogin = {
    email: "invalidTest@test.com",
    password: "invalidPassword"
}

const server = setupServer(
    ...$enum(Role).map((role: Role) =>  {
        return (rest.post(`*/${role}/login`, async (request: MockedRequest, response: ResponseComposition, ctx) => {
            // @ts-ignore
            const {email, password} = request.body;
                if(email === mockValidLogin.email && password === mockValidLogin.password)
                    return response(
                        ctx.delay(100),
                        ctx.json({}),
                        ctx.status(200));
                else
                    return response(
                        ctx.delay(100),
                        ctx.json({message: 'not authorised'}),
                        ctx.status(401),
                    )
            }));
        }
    )
)

const mockNavigate = jest.fn();

const AllTheProviders = ({ children }: any) => {
    return (
        <AuthProvider>
            <MemoryRouter>
                {children}
            </MemoryRouter>
        </AuthProvider>
    )
}


jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
}));

jest.mock("../../components/forms/LoginForm", () => {
    return function DummyEditPatientDetailsForm(props: { onSubmit: (e: any) => void, initialValues: PatientDetailsFormData}) {
        return (<button onClick={
                () => props.onSubmit(mockInvalidLogin)
            }>
                Save
            </button>
        )
    };
});
for(let role in Role){
    describe(role + "Login Page", () => {

        beforeAll(() => {
            server.listen();
        });

        beforeEach(() => {
            render(<LoginPage role={role}/>, {wrapper: AllTheProviders });
        })

        afterAll(() => server.close());

        afterEach(() => server.resetHandlers());

        it('routes to home page on proper login credentials', async () => {
            server.use(
                rest.post(`*/${role}/login`, async (request: MockedRequest, response: ResponseComposition, ctx) => {
                    return response(
                        ctx.json({
                            token: "sampleToken",
                            [role]: mockUser,
                        }),
                        ctx.status(200));
                })
            )
            user.click(screen.getByRole('button', {name: /Save/i}))
            wait(400);
            await waitFor(() =>{
                expect(mockNavigate).toHaveBeenCalledWith(`/${role.toLowerCase()}`);
            })
        })

        it('displays error modal on invalid credentials', async () => {
            await user.click(screen.getByRole('button', {name: /Save/i }))
            await waitFor(() =>{
                expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
            })
        })

        it('displays error modal on unknown error', async () => {
            server.use(
                rest.post(`*/${role}/login`, async (req, res, ctx) => {
                    return res(
                        ctx.status(404),
                        ctx.json(
                            {
                                success: false,
                                message: 'Smth else wrong'
                            })
                    )
                }),
            )
            user.click(screen.getByRole('button', {name: /Save/i}))

            await waitFor(() =>{
                expect(screen.getByText(/unknown error/i)).toBeInTheDocument();
            })
        })
    });
}
