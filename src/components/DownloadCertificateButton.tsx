import {Visit} from "../types/vaccination";
import {Download} from "react-bootstrap-icons";
import {jsPDF} from "jspdf";
import {useState} from "react";
import {Spinner, Button} from "react-bootstrap";
function DownloadCertificateButton({visit}: ({visit: Visit})) {
    const [loading, setLoading] = useState(false)
    const downloadFile = () => {
        var pdf = new jsPDF()
        const text = injectVisitToLatex(visit);
        console.log(text)

        setLoading(true)
        pdf.text(text, 10, 10)
        pdf.save(`${visit.vaccination?.patient?.firstName}_${visit.vaccination?.patient?.lastName}_${visit.vaccination?.vaccine?.name}_certificate.pdf`)
        setLoading(false)

    }
    return (
        <Button /*disabled={visit.vaccination?.status !== "Completed"}*/
            onClick={downloadFile}
            variant="light"
        >
            {loading?
            <Spinner animation="border"/>:
            <Download color="royalblue"/>}
        </Button>
    )
}
export default DownloadCertificateButton;


function injectVisitToLatex(visit: Visit) {
    return `Certificate of vaccination:
            Vaccine:
            - Name: ${visit.vaccination?.vaccine.name}
            - Disease: ${visit.vaccination?.vaccine.disease}
            - Required doses: ${visit.vaccination?.vaccine.requiredDoses}
            Patient: ${visit.vaccination?.patient?.firstName} ${visit.vaccination?.patient?.lastName}
            PESEL: ${visit.vaccination?.patient?.pesel}
            Status: ${visit.vaccination?.status}`;
}