import React from 'react';
import {render, screen, waitFor} from '@testing-library/react';
import user  from '@testing-library/user-event';
import LoginForm from "../components/LoginForm";
import ScheduleForm from "../components/ScheduleForm";

const testEmail = "email@example.com"
const testPwd = "password"
const testInvEmail = "e@ecom"
const onSubmit = jest.fn();

function getEmailInput() {
  return screen.getByTestId("email-input");
}

function getPasswordInput() {
  return screen.getByTestId("password-input");
}

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

describe("Set Schedule Form", () => {
  it('validates form on save', async () => {
    render(<ScheduleForm onSubmit={onSubmit}/>)
    user.click(screen.getByRole('button', {name: /Save/i }))
    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalled();
    })
  });
});

describe("DoctorDashboard", () => {
  it('routes to setSchedule', async () => {
    //TODO
  });
  it('calls API for visits', async () => {
    //TODO
  });
});
