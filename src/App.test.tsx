import React from 'react';
import {fireEvent, render, screen} from '@testing-library/react';
import LoginPage from "./pages/LoginPage";

test('renders login button and form', () => {
  render(<LoginPage />);
  const linkElement = screen.getByText(/Log in/i);
  expect(screen.getByLabelText(
      'Email', {selector: 'input'}))
      .toBeInTheDocument();
  expect(screen.getByLabelText(
      'Password', {selector: 'input'}))
      .toBeInTheDocument();
  expect(linkElement).toBeInTheDocument();
});
test("invalidates incorrect email format", async () => {
  render(<LoginPage/>);
    fireEvent.input(screen.getByPlaceholderText('email@example.com'), {
      target: {
        value:
            "agna aliqua."
      }
    });//email with invalid format
    fireEvent.submit(screen.getByTestId("form"));
  //expect two errors (objects with class "invalid-feedback"`
});
test("invalidates empty fields", async () => {
  render(<LoginPage/>);
    fireEvent.submit(screen.getByTestId("form"));
  //expect two errors (objects with class "invalid-feedback"`
});
test("validates correct email", async () => {
  render(<LoginPage/>);
  fireEvent.input(screen.getByPlaceholderText('email@example.com'), {
    target: {
      value:
          "email@example.com"
    }
  });//email with valid format
  fireEvent.submit(screen.getByTestId("form"));
  //expect no error (object with class "invalid-feedback"` containing "email"
});
test("validates non-empty password", async () => {
  render(<LoginPage/>);
  fireEvent.input(screen.getByPlaceholderText('Password'), {
    target: {
      value:
          "agna aliqua."
    }
  });//email with invalid format
  fireEvent.submit(screen.getByTestId("form"));
  //expect no error (object with class "invalid-feedback"` containing "password"
});