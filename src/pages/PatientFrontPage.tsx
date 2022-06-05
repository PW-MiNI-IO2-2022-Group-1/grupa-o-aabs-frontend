import { useNavigate } from "react-router";
import {Visit} from "../types/vaccination";
import DownloadPDFButton from "../components/buttons/DownloadPDFButton";
import {downloadCertificate} from "../logic/patientApi";
import {useAuth} from "../components/AuthComponents";

export function PatientFrontPage(): JSX.Element {
    const navigate = useNavigate();
    const auth = useAuth();
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
