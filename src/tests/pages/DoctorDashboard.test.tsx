import {render, screen, waitFor} from "@testing-library/react";
import user from "@testing-library/user-event";

describe("DoctorDashboard", () => {
    it('routes to setSchedule', async () => {
        //TODO
    });
    it('calls API for visits', async () => {
        //TODO
    });

    it('calls API for visits when reserved filter changes', async () => {
        await waitFor(() =>{
            expect(mockServerGetCheck).toHaveBeenCalled();
        })
        user.click(getReservedButton());
        await waitFor(() => {
            expect(mockServerGetCheck).toBeCalledTimes(2);
        })
    });
    
    it('calls API for visits when page button is clicked', async () => {
        await waitFor(() =>{
            expect(mockServerGetCheck).toHaveBeenCalled();
        })
        user.click(getNextPageButton());
        await waitFor(() => {
            expect(mockServerGetCheck).toBeCalledTimes(2);
        })
        user.click(getPrevPageButton());

        await waitFor(() => {
            expect(mockServerGetCheck).toBeCalledTimes(3);
        })
    });

    it('deletes free visit', async () => {
        await waitFor(() =>{
            expect(mockServerGetCheck).toHaveBeenCalled();
        })
        const moreInfoButtons = screen.getAllByText(/more info/i);
        await waitFor(()=>{
            expect(moreInfoButtons[0]).toBeInTheDocument()
        })
        user.click(moreInfoButtons[0])
        user.click(screen.getByText(/Delete/i));
        await wait(200);
        await waitFor(() =>{
            expect(mockDeleteVisit).toHaveBeenCalled();
        })

    })
});

/*describe('Doctor Dashboard on getSlots error', () => {
    beforeAll(() => {
        server.listen();
    });

    beforeEach(() => {
        render(<DoctorDashboard/>, {wrapper: MemoryRouter});
    })

    afterAll(() => server.close());

    afterEach(() => {
        server.resetHandlers()
    });

    it('routes to login page on auth error', async () => {
        server.use(
            rest.get('*!/doctor/vaccination-slots', async (request: MockedRequest, response: ResponseComposition, ctx) => {
                return response(
                    ctx.json({success: false, message: "You, my dude, are not authorised"}),
                    ctx.status(401)
                )
            }),
        );
        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith('/loginDoctor');
        })
    })

    it('displays modal on validation error', async () => {
        server.use(...validationErrorHandlers);
        await waitFor(() => {
            expect(screen.getByText(/Validation error/i)).toBeInTheDocument();
        })
    })

    it('displays modal on unknown error', async () => {
        server.use(...unknownErrorHandlers);
        await waitFor(() => {
            expect(screen.getByText(/Unknown error/i)).toBeInTheDocument();
        })
    })
})*/
function getSetScheduleButton() {
    return screen.getByRole('button', {
        name: /set schedule/i
    })
}

function getNextPageButton() {
    return screen.getByRole('button', {
        name: /next page/i
    })
}

function getPrevPageButton() {
    return screen.getByRole('button', {
        name: /previous page/i
    });
}

function getReservedButton() {
    return screen.getByRole('radio', {
        name: /reserved/i
    });
}

function getMockedStartDatePicker() {
    return screen.getByRole('button', {
        name: /startdatepicker/i
    });
}

function getMockedEndDatePicker() {
    return screen.getByRole('button', {
        name: /enddatepicker/i
    });
}

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
}));

jest.mock('../../components/AuthComponents', () => ({
    useAuth: () => {
        return {
            token: "sampleToken",
            modifyState: (modifyFunc: React.SetStateAction<AuthState>) => {
            },
        }
    }

}));

jest.mock('react-date-picker', () => {
    return function DummyDatePicker(props: {
        onChange: (date: Date | null) => void,
        disabled: boolean,
        minDate: Date,
        value: Date | Date[] | null | undefined,
        format: string,
        'data-testid': string,
    }): JSX.Element {
        return (
            <button onClick={() => props.onChange(null)}>{`${props["data-testid"]}DatePicker`}</button>
        );
    }
});

const server = setupServer(
    rest.delete('*/doctor/vaccination-slots/:slotId', async (request: MockedRequest, response: ResponseComposition, ctx) => {
        return response(
                ctx.delay(100),
                ctx.json({}),
                ctx.status(200)
            )
    }),
    rest.get('*/doctor/vaccination-slots', async (request: MockedRequest, response: ResponseComposition, ctx) => {
        return response(
            ctx.json(mockedInfo),
            ctx.status(200)
        )
    }),
);

const mockedInfo = {
    pagination: {
        currentPage: 1,
        totalPages: 10,
        currentRecords: 5,
        totalRecords: 30
    },
    data: [
        {
            id: 1,
            date: "2024-06-20T10:00:00Z",
            vaccination: null
        },
        {
            id: 2,
            date: "2024-06-20T11:00:00Z",
            vaccination: null
        },
        {
            id: 3,
            date: "2024-06-20T12:00:00Z",
            vaccination: null
        },
        {
            id: 4,
            date: "2024-06-20T10:30:00Z",
            vaccination: {
                id: 1,
                vaccine: {
                    id: 1,
                    name: "Phizer",
                    disease: "COVID-19",
                    requiredDoses: 2
                },
                status: "Planned",
                patient: {
                    id: 1,
                    firstName: "Patient",
                    lastName: "Patient",
                    pesel: "003005039981",
                    email: "john.doe@patient.com",
                    address: {
                        id: 1,
                        city: "Biłgoraj",
                        zipCode: "23-400",
                        street: "Aleja chorych",
                        houseNumber: "25",
                    }
                }
            }
        },
        {
            id: 5,
            date: "2024-06-20T10:15:00Z",
            vaccination: {
                id: 1,
                vaccine: null,
                status: "Planned",
                patient: {
                    id: 1,
                    firstName: "Patient2",
                    lastName: "Patient2",
                    pesel: "22222222222",
                    email: "john.doe2@patient.com",
                    address: {
                        id: 1,
                        city: "Chernobyl",
                        zipCode: "69-420",
                        street: "Jana Pawła II",
                        houseNumber: "21",
                        localNumber: "37"
                    }
                }
            }
        },
    ]
}
