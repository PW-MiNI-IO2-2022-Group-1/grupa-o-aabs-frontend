import { Container } from "react-bootstrap";
import { useNavigate } from "react-router";
import { useAuth } from "../components/AuthComponents";
import PatientVaccinationList from "../components/PatientVaccinationList";

export default function PatientDashboard() {
    const auth = useAuth();
    const navigate = useNavigate();

    return (<>
        <div style={{width: '1000px'}}>
            <h1 style={{textAlign: 'center'}}>Dashboard</h1>
            <hr style={{width: '1000px', borderTop: '1px rbga(0, 0, 0, 0.1) solid'}}/>
            <h4 style={{textAlign: 'left'}}>Welcome back, {auth.user?.firstName}!</h4>
        </div>
        <Container className='d-flex justify-content-around my-5'>
        <button className='btn btn-light btn-outline-dark btn-lg'
                style={{width: '300px'}}
                onClick={() => navigate('/patient/vaccineRegistration')}>
                    Register for the vaccine
        </button>
        <button className='btn btn-light btn-outline-dark btn-lg'
                style={{width: '300px'}}
                onClick={() => navigate('/patient/editDetails')}>
                    Edit account details
        </button>
        </Container>
        <div style={{width: '1000px', marginTop: '30px'}}>
            <h1>Your vaccination history</h1>
            <div style={{height: '20px'}}/>
            <Container>
                <PatientVaccinationList/>
            </Container>
        </div>
    </>);
}
