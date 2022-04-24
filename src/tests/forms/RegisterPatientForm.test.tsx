import React from 'react'
import {render, screen, waitFor} from "@testing-library/react";
import user from '@testing-library/user-event'
import RegisterPatientForm from "../../components/forms/RegisterPatientForm";


describe('RegisterPatientForm', () => {
    const onSubmit = jest.fn();

    beforeEach(() => {
        onSubmit.mockClear()
        render(<RegisterPatientForm onSubmit={onSubmit}/>)
    })

    test('onSubmit is called when all fields pass validation', async () => {
        user.type(getInput('email'), 'abc@wp.pl')
        user.type(getPasswordInput(), 'abc')
        user.type(getInput('first name'), 'adam')
        user.type(getInput('last name'), 'abacki')
        user.type(getInput('pesel'), '98071962617')
        user.type(getInput('city'), 'Warsaw')
        user.type(getInput('zip code'), '12-123')
        user.type(getInput('street'), 'Ogrodowa')
        user.type(getInput('house number'), '11A')
        user.type(getInput('local number'), '3')

        user.click(screen.getByRole('button', {name: /register/i}))

        await waitFor(() => {
            expect(onSubmit).toHaveBeenCalledTimes(1)
        })

        expect(onSubmit).toHaveBeenCalledWith({
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
        }, expect.anything())
    })

    describe('validates properly', () => {
        test('and not submit if something is wrong', async () => {
            user.type(getInput('email'), 'abc@wp.pl')
            user.type(getPasswordInput(), 'abc')
            user.type(getInput('first name'), 'adam')
            user.type(getInput('last name'), 'abacki')
            user.type(getInput('pesel'), '98071962617')
            user.type(getInput('city'), 'Warsaw')
            user.type(getInput('zip code'), '12-123')
            user.type(getInput('street'), 'Ogrodowa')
            user.type(getInput('house number'), '11A')
            user.type(getInput('local number'), '3')

            user.click(screen.getByRole('button', {name: /register/i}))

            await waitFor(() => {
                expect(onSubmit).toHaveBeenCalledTimes(1)
            })
        })
    })
})


function getInput(name: string) {
    return screen.getByRole('textbox', {
        name: new RegExp(name, 'i')
    })
}

function getPasswordInput() {
    return screen.getByLabelText(/password/i)
}