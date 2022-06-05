import {Download} from "react-bootstrap-icons";
import {useState} from "react";
import {Spinner, Button} from "react-bootstrap";
import {useAuth} from "../AuthComponents";
import {UnauthorizedRequestError} from "../../types/requestErrors";
import {logOut} from "../../logic/login";
import {useNavigate} from "react-router-dom";
function DownloadPDFButton({onDownload, disabled}: ({onDownload: () => Promise<void>, disabled?: boolean})) {
    const [loading, setLoading] = useState(false)
    const auth = useAuth()
    const navigate = useNavigate()
    const downloadFile = () => {
        setLoading(true)
        onDownload().catch((error) => {
            if(error instanceof UnauthorizedRequestError){
                logOut(auth)
                navigate('/loginPatient')
            }
            else {
                console.log(error.msg)
            }
        }).finally(() => {setLoading(false)})
    }
    return (
            <Button disabled={disabled}
                onClick={downloadFile}
                variant="dark"
            >
                {loading?
                    <Spinner animation="border" size="sm"/>:
                    <Download color="white"/>}
            </Button>

    )
}
export default DownloadPDFButton;