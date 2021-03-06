import { useNavigate } from 'react-router';
import { useAuth } from './AuthComponents';
import { logOut } from '../logic/login';
import './PageHeader.css';
import { Role } from '../types/users';

function PageHeader({children} : {children: React.ReactNode}) {
    const auth = useAuth();
    const navigate = useNavigate();

    const signOut = () => {
        logOut(auth);
        navigate('/');
    }

    const goToFrontPage = () => {
        if(auth.role === null)
            navigate('/');
        else if(auth.role === Role.Patient)
            navigate('/patient');
        else if(auth.role === Role.Doctor)
            navigate('/patient');
        else if(auth.role === Role.Admin)
            navigate('/admin');
    }

    return (<>
    <nav className='navbar navbar-light bg-dark m-0'>
        <button className='nav-brand text-light mx-4 my-0 p-0'
            style={{padding: 0, border: 'none', background: 'none'}}
            onClick={goToFrontPage}><h1>Szczepiarz</h1></button>
        {auth.user != null &&
        <div className='align-items-end mx-4 d-flex'>
        {window.location.pathname !== '/bugs' &&
            <button className='btn mx-5 btn-outline-secondary'
            onClick={() => navigate('/bugs')}>Report a bug</button>}
        <button onClick={signOut} className='btn btn-outline-success'
            id='signOutBtn'>Sign out</button>
        </div>}
    </nav>
        <div className='container-fluid'>
            <div className='app-content'>{children}</div>
        </div>
    </>);
}

export default PageHeader;