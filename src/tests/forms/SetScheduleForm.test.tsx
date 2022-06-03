import {render, screen, waitFor} from "@testing-library/react";
import ScheduleForm from "../../components/forms/ScheduleForm";
import user from "@testing-library/user-event";
import React from "react";
import {TimeSlot} from "../../components/forms/ScheduleForm";
import {addDays, getBeginningOfWeek} from "../../utils/dateUtils";
import moment from "moment";
import {wait} from "@testing-library/user-event/dist/utils";

const onSubmit = jest.fn();

jest.setTimeout(10000);

describe("Set Schedule Form", () => {
    it('validates form on save', async () => {
        render(<ScheduleForm onSubmit={onSubmit}/>)
        user.click(screen.getByRole('button', {name: /Save/i}))
        await waitFor(() => {
            expect(onSubmit).toHaveBeenCalled();
        })
    });

    const beginning = getBeginningOfWeek(new Date());
    beginning.setHours(0,0,0,0);
    for (let i = 0; i < 7; i++) {
        const myDay = addDays(beginning, i);
        const regEx = new RegExp(moment(myDay).format("MMMM D, YYYY").toLowerCase(), 'i');

        it(`changes week on calendar to beginning of the week on day ${i + 1} of the week clicked`, async () => {
            render(<ScheduleForm onSubmit={onSubmit}/>)
            const dayButton = screen.getByRole('button', {name: regEx})
            await waitFor(() => {
                expect(dayButton).toBeInTheDocument()
            })
            user.click(dayButton);
            await wait(20);
            user.click(screen.getByRole('button', {name: /Save/i}))
            await waitFor(() => {
                expect(onSubmit).toHaveBeenCalledWith(
                    {
                    monSlots: initSlots,
                    tueSlots: initSlots,
                    wedSlots: initSlots,
                    thuSlots: initSlots,
                    friSlots: initSlots,
                    satSlots: [],
                    sunSlots: [],
                        week: beginning,
                    },
                    expect.anything()
                );
            });
        })

    }
});
jest.setTimeout(5000)
const initSlots = [
    {
        beginning: {
            hour: '8',
            minute: '00'
        },
        end: {
            hour: '12',
            minute: '00'
        }
    },
    {
        beginning: {
            hour: '12',
            minute: '30'
        },
        end: {
            hour: '17',
            minute: '00'
        }
    },

];