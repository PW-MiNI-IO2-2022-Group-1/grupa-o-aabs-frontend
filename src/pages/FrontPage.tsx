import { useNavigate } from "react-router";
import * as Icon from 'react-bootstrap-icons';
import './FrontPage.css';

function FrontAuthPage(): JSX.Element {
    const navigate = useNavigate();

    return (<div className='container'>
        <div className='row mb-5'>
            <div className='col text-center'>
                <div className='mb-4' id='loginPatientPageBtn'>
                    <Icon.EmojiSunglassesFill onClick={() => navigate('loginPatient')} className='iconbutton' fontSize='5em'/>
                </div>
                <h1>Sign in as a patient</h1>
            </div>

            <div className='col text-center'>
                <div className='mb-4' id='loginDoctorPageBtn'>
                    <Icon.Clipboard2HeartFill onClick={() => navigate('loginDoctor')}
                        className='iconbutton' fontSize='5em'/>
                </div>
                <h1>Sign in as a doctor</h1>
            </div>

            <div className='col text-center'>
                <div className='mb-4' id='loginAdminPageBtn'>
                    <Icon.BriefcaseFill onClick={() => navigate('loginAdmin')}
                        className='iconbutton' fontSize='5em'/>
                </div>
                <h1>Sign in as an admin</h1>
            </div>
        </div>
        <div className='gap'/>
        <div className='row mt-5'>
            <div className='col text-center'>
                <div className='mb-4' id='registerPatientPageBtn'>
                    <Icon.PencilSquare onClick={() => navigate('patient/register')}
                        className='iconbutton' fontSize='5em'/>
                </div>
                <h1>Sign up as a patient</h1>
            </div>
        </div>
    </div>);
}

export default FrontAuthPage;