import React from 'react';
import {act, fireEvent, render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './LoginPage';
describe("Login page" , () => {
  it('renders login button and form', () => {
    render(<LoginPage/>);
    const linkElement = screen.getByTestId("login");
    expect(screen.getByLabelText(
        'Email', {selector: 'input'}))
        .toBeInTheDocument();
    expect(screen.getByLabelText(
        'Password', {selector: 'input'}))
        .toBeInTheDocument();
    expect(linkElement).toBeInTheDocument();
  });

  it("invalidates incorrect email format", () => {
    render(<LoginPage/>);
    const emailInput = screen.getByTestId("email-input");
    act(() => {
      userEvent.type(emailInput, "testmailcom");
      //email with invalid format
      screen.getByTestId("login").dispatchEvent(new MouseEvent('click', {bubbles: true}));
    });
    //const errorMsg = screen.getByText("Email is invalid");
    //expect(errorMsg).toBeInTheDocument()  ;
  });

  it("invalidates empty fields", () => {
    render(<LoginPage/>);
    act(()=> {
      fireEvent.submit(screen.getByTestId("form"));
    });
    //expect two errors (objects with class "invalid-feedback"`
  });
  test("validates correct email", async () => {
    render(<LoginPage/>);
    act(()=> {
      fireEvent.input(screen.getByPlaceholderText('email@example.com'), {
        target: {
          value:
              "email@example.com"
        }
      });//email with valid format
      fireEvent.click(screen.getByTestId("login"));
    });

    //expect no error (object with class "invalid-feedback"` containing "email"
  });
  it("validates non-empty password", async () => {
    render(<LoginPage/>);
    act(()=> {
      fireEvent.input(screen.getByPlaceholderText('Password'), {
        target: {
          value:
              "agna aliqua."
        }
      });//email with invalid format
      fireEvent.submit(screen.getByTestId("form"));
    });
    //expect no error (object with class "invalid-feedback"` containing "password"
  });
});

