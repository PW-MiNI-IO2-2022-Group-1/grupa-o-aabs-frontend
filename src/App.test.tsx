import React from 'react';
import {fireEvent, render, screen, waitFor} from '@testing-library/react';
import user  from '@testing-library/user-event';
import {act } from 'react-dom/test-utils';
import LoginForm from "./components/LoginForm";
import ScheduleForm from "./components/ScheduleForm";

const testEmail = "email@example.com"
const testPswd = "password"
const testInvEmail = "e@ecom"
const testInvPswd = ""
const onSubmit = jest.fn();

function getEmailInput() {
  return screen.getByTestId("email-input");
}

function getPasswordInput() {
  return screen.getByTestId("password-input");
}

describe("Login Form" , () => {
  it('invalidates empty form', async () => {
    render(<LoginForm onSubmit={onSubmit}/>);
    user.click(screen.getByRole('button', {name: /Log in/i}));
    await waitFor(() => {
      expect(onSubmit).not.toHaveBeenCalled();
    })
  });

  it('validates correct email and password', async () => {
    const onSubmit = jest.fn();
    render(<LoginForm onSubmit={onSubmit}/>);
      user.type(getEmailInput(), testEmail);
      user.type(getPasswordInput(), testPswd);
      user.click(screen.getByRole('button', {name: /Log in/i}));
    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalled();
    });
  });

  it('invalidates incorrect email', async () => {
    const onSubmit = jest.fn();
    render(<LoginForm onSubmit={onSubmit}/>);
    user.type(getEmailInput(), testInvEmail);
    user.click(screen.getByRole('button', {name: /Log in/i}));
    await waitFor(() => {
      expect(onSubmit).not.toHaveBeenCalled();
    });
  });

  it('invalidates empty password', async () => {
    const onSubmit = jest.fn();
    render(<LoginForm onSubmit={onSubmit}/>);
    user.type(getPasswordInput(), testInvPswd);
    user.click(screen.getByRole('button', {name: /Log in/i}));
    await waitFor(() => {
      expect(onSubmit).not.toHaveBeenCalled();
    });
  });
});

describe("Set Schedule Page", () => {
  it('validates on save', async () => {
    render(<ScheduleForm onSubmit={onSubmit}/>)
    user.click(screen.getByRole('button', {name: /Save/i }))
    await waitFor(() => {
      //expect(onSubmit).toHaveBeenCalled();
    })
  });

});
