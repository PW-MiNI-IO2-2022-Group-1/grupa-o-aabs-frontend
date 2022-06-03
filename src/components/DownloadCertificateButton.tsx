import {Visit} from "../types/vaccination";
import {Download} from "react-bootstrap-icons";
import {useState} from "react";
import {Spinner, Button} from "react-bootstrap";
import {downloadCertificate} from "../logic/patientApi";
import {useAuth} from "./AuthComponents";
import {UnauthorizedRequestError} from "../types/requestErrors";
import {logOut} from "../logic/login";
import {useNavigate} from "react-router-dom";
function DownloadCertificateButton({visit}: ({visit: Visit})) {
    const [loading, setLoading] = useState(false)
    const auth = useAuth()
    const navigate = useNavigate()
    const downloadFile = () => {
        setLoading(true)
        downloadCertificate(auth, visit.vaccination?.id ?? -1).catch((error) => {
            if(error instanceof UnauthorizedRequestError){
                logOut(auth)
                navigate('/patientLogin')
            }
            else {
                console.log(error.msg)
            }
        })
        setLoading(false)
    }

    return (
        <Button /*disabled={visit.vaccination?.status !== "Completed"}*/
            onClick={downloadFile}
            variant="dark"
        >
            Download a certificate &nbsp; &nbsp;
            {loading?
            <Spinner animation="border"/>:
            <Download color="white"/>}
        </Button>

    )
}
export default DownloadCertificateButton;