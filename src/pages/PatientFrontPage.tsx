import { useNavigate } from "react-router";

export function PatientFrontPage(): JSX.Element {
    const navigate = useNavigate();

    return (<div>
        <button className='btn btn-light btn-outline-dark btn-lg'
                onClick={() => navigate('/patient/vaccineRegistration')}>
                    Register for the vaccine
        </button>
        <button className='btn btn-light btn-outline-dark btn-lg'
                onClick={() => navigate('/patient/editDetails')}>
                    Edit patient details
        </button>
    </div>);
}