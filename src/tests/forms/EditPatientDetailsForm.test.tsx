import {render, screen, waitFor} from "@testing-library/react";
import user from "@testing-library/user-event";
import React from "react";
import EditPatientDetailsForm from "../../components/forms/EditPatientDetailsForm";


const mockedInvalidData = {
    firstName: 'adam',
    lastName: 'abacki',
    city: 'adamtown',
    zipCode: 'aa=cfc',
}
const mockedRequiredData = {
    firstName: '',
    lastName: '',
    city: '',
    zipCode: '',
    street: '',
    houseNumber: '',
}
const mockedValidData = {
    firstName: 'Adam',
    lastName: 'Abacki',
    password: 'password',
    city: 'Adamtown',
    zipCode: '69-420',
    street: 'Adama Adamowicza',
    houseNumber: '21',
    localNumber: '37',
}

const mockedInitialValues = {
    firstName: 'Adam',
    lastName: 'Abacki',
    city: 'Adamtown',
    zipCode: '69-420',
    street: 'Adama Adamowicza',
    houseNumber: '21',
    localNumber: 'l.37',
}

const onSubmit = jest.fn();
describe("Edit Patient Details Form", () => {

    beforeEach(() => {
        // eslint-disable-next-line testing-library/no-render-in-setup
        render(<EditPatientDetailsForm onSubmit={onSubmit} initialValues={mockedInitialValues}/>);
    })

    it('validates non-edited form', async () => {
        user.click(getSubmitButton());
        await waitFor(() => {
            expect(onSubmit).toHaveBeenCalled();
        })
    });

    for (let key in mockedValidData) {
        it('validates properly edited ' + key, async () => {
            typeValidData(key);
            user.click(getSubmitButton());
            await waitFor(() => {
                expect(onSubmit).toHaveBeenCalled();
            })
        });
    }

    for (let key in mockedInvalidData) {
        it('invalidates incorrect ' + key, async () => {
            typeInvalidData(key);
            user.click(getSubmitButton());
            await waitFor(() => {
                expect(onSubmit).not.toHaveBeenCalled();
            });
        });
    }

    for (let key in mockedRequiredData) {
        it('invalidates empty required field ' + key, async () => {
            typeNothingToRequiredData(key);
            user.click(getSubmitButton());
            await waitFor(() => {
                expect(onSubmit).not.toHaveBeenCalled();
            });
        });
    }

});

async function typeData(key: string, data: string) {
    user.clear(getInputByKey(key));
    if (data !== '') user.type(getInputByKey(key), (mockedValidData as any)[key]);
    await waitFor(() => {
        expect(getInputByKey(key)).toHaveValue(data)
    })
}

function typeInvalidData(key: string) {
    typeData(key, (mockedInvalidData as any)[key]);
}

function typeValidData(key: string) {
    typeData(key, (mockedValidData as any)[key]);
}

function typeNothingToRequiredData(key: string) {
    typeData(key, '');
}

function getInputByKey(key: string) {
    return screen.getByTestId(key)
}

function getSubmitButton() {
    return screen.getByRole('button', {
        name: /change details/i
    })
}

jest.mock('../../components/EditField', () => {
    return function EditField<T>(props: {
        valueKey: string;
        displayName: string;
        type: string;
        values: T;
        handleChange: React.ChangeEventHandler<HTMLInputElement>;
        error: string | undefined;
    }) {
        return (<input
            id={props.valueKey}
            type={props.type}
            data-testid={props.valueKey}
            onChange={props.handleChange}
            value={(props.values as any)[props.valueKey]}
            style={{width: '250px'}}
            className={`form-control${props.error === undefined
                ? ''
                : ' is-invalid'}`}
        />);
    }
})

