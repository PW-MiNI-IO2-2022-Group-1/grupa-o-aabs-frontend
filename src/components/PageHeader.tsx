import { useNavigate } from 'react-router';
import { useAuth } from './AuthComponents';
import './PageHeader.css';

function PageHeader({children} : {children: React.ReactNode}) {
    const auth = useAuth();
    const navigate = useNavigate();

    const signOut = () => {
        auth.signOut();
        navigate('/');
    }

    const goToFrontPage = () => {
        if(auth.user == null)
            navigate('/');
    }

    return (<>
    <nav className='navbar navbar-light bg-dark m-0'>
        <h1 className='nav-brand text-light mx-4 my-0 p-0 noselect'
            onClick={goToFrontPage}>Szczepiarz</h1>
        {auth.user != null &&
        <div className='align-items-end mx-4'>
        <button onClick={signOut} className='btn btn-outline-success'>Sign out</button>
        </div>}
    </nav>
        <div className='container-fluid'>
            <div className='row'></div>
            <div className='app-content'>{children}</div>
        </div>
    </>);
}

export default PageHeader;