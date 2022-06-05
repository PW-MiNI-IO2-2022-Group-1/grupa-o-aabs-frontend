import {render, screen, waitFor} from "@testing-library/react";
import user from "@testing-library/user-event";
import PaginationMenu from "../../components/PaginationMenu";

describe('Pagination menu', () => {
    const setPage = jest.fn();
    const modifyPage = jest.fn();

    beforeEach(() => {
        render(<PaginationMenu currentPage={3}
            pageCount={10} setPage={setPage} modifyPage={modifyPage}/>);
    });

    it('displays correct number of pages', async () => {
        for(let i = 1; i <= 6; i++)
            expect(screen.queryByText(new RegExp(i.toString()))).toBeInTheDocument();

        expect(screen.queryByText('/0/')).not.toBeInTheDocument();

        for(let i = 7; i <= 10; i++)
            expect(screen.queryByText(new RegExp(i.toString()))).not.toBeInTheDocument();
    });

    it('calls setPage function with correct arguments', async () => {
        user.click(await screen.findByText(/3/i));
        expect(setPage).toBeCalledWith(3);
        user.click(await screen.findByText(/2/i));
        expect(setPage).toBeCalledWith(2);
    });

    it('calls modifyPage function with correct arguments', async () => {
        user.click(await screen.findByText(/«/));
        expect(modifyPage).toBeCalledWith(-1);
        user.click(await screen.findByText(/»/));
        expect(modifyPage).toBeCalledWith(1);
    });
});