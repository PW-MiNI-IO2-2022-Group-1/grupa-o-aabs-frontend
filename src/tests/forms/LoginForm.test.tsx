import {render, screen, waitFor} from "@testing-library/react";
import LoginForm from "../../components/forms/LoginForm";
import user from "@testing-library/user-event";
import React from "react";
const testEmail = "email@example.com"
const testPwd = "password"
const testInvEmail = "e@ecom"

const onSubmit = jest.fn();
describe("Login Form" , () => {

    beforeEach(() => {
        render(<LoginForm onSubmit={onSubmit}/>);
    })

    it('invalidates empty form', async () => {
        user.click(screen.getByRole('button', {name: /Log in/i}));
        await waitFor(() => {
            expect(onSubmit).not.toHaveBeenCalled();
        })
    });

    it('validates correct email and password', async () => {
        user.type(getEmailInput(), testEmail);
        user.type(getPasswordInput(), testPwd);
        user.click(screen.getByRole('button', {name: /Log in/i}));
        await waitFor(() => {
            expect(onSubmit).toHaveBeenCalled();
        });
    });

    it('invalidates incorrect email', async () => {
        user.type(getEmailInput(), testInvEmail);
        user.click(screen.getByRole('button', {name: /Log in/i}));
        await waitFor(() => {
            expect(onSubmit).not.toHaveBeenCalled();
        });
    });

    it('invalidates empty password', async () => {
        user.type(getEmailInput(), testEmail);
        user.click(screen.getByRole('button', {name: /Log in/i}));
        await waitFor(() => {
            expect(onSubmit).not.toHaveBeenCalled();
        });
    });
});

function getEmailInput() {
    return screen.getByTestId("email-input");
}

function getPasswordInput() {
    return screen.getByTestId("password-input");
}