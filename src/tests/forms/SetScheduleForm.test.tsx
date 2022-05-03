import {render, screen, waitFor} from "@testing-library/react";
import ScheduleForm from "../../components/forms/ScheduleForm";
import user from "@testing-library/user-event";
import React from "react";
const onSubmit = jest.fn();

describe("Set Schedule Form", () => {
    it('validates form on save', async () => {
        render(<ScheduleForm onSubmit={onSubmit}/>)
        user.click(screen.getByRole('button', {name: /Save/i }))
        await waitFor(() => {
            expect(onSubmit).toHaveBeenCalled();
        })
    });
});