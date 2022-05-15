import {act, render, screen, waitFor} from "@testing-library/react";
import user from "@testing-library/user-event";
import EditField from "../../components/EditField";

interface TestForm {
    key: string;
    key2: string;
}

describe('EditField', () => {
    const form: TestForm = {
        key: 'value',
        key2: ''
    };

    beforeEach(() => {
        render(<EditField valueKey='key'
            displayName='displayName'
            type='text'
            values={form}
            handleChange={(e) => { }} 
            error={undefined}/>);
    });

    it('displays correct values', () => {
        expect(screen.queryByTestId('editFieldInput')).toHaveValue('value');
    });

    it('is disabled by default', () => {
        expect(screen.queryByTestId('editFieldInput')).toBeDisabled();
    });

    it('enables/disables after button click', async () => {
        act(async () => user.click(await screen.findByTestId('editFieldButton')));
        await waitFor(() => 
            expect(screen.queryByTestId('editFieldInput')).not.toBeDisabled()
        );
        act(async () => user.click(await screen.findByTestId('editFieldButton')));
        await waitFor(() => 
            expect(screen.queryByTestId('editFieldInput')).toBeDisabled()
        );
    });
})