interface PaginationMenuProps {
    currentPage: number;
    pageCount: number;
    setPage: (page: number) => void
    modifyPage: (pageDelta: number) => void
}

export default function PaginationMenu(props: PaginationMenuProps) {
    const visiblePages: number[] = [];
    const minPage = Math.max(1, props.currentPage - 3);
    const maxPage = Math.min(props.pageCount, props.currentPage + 3);
    for(let i = minPage; i <= maxPage; i++)
        visiblePages.push(i);

    return (<nav className='d-flex justify-content-center'>
        <ul className='pagination'>
            <li className='page-item' style={{cursor: 'pointer'}}>
                <a className='page-link text-dark'
                    onClick={() => props.modifyPage(-1)}>&laquo;</a>
            </li>
            {visiblePages.map(x => {
                return (<li style={{cursor: 'pointer'}} className='page-item'>
                    <a className={'page-link ' + (props.currentPage == x ? ' text-light bg-dark' : ' text-dark')}
                        onClick={() => {
                            props.setPage(x);
                            return false;
                        }}
                    >{x}</a>
                </li>);
            })}
            <li style={{cursor: 'pointer'}} className='page-item'>
                <a className='page-link text-dark' onClick={() => props.modifyPage(1)}>&raquo;</a>
            </li>
        </ul>
    </nav>);
}