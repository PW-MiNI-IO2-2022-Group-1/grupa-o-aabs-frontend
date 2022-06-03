import {AuthContextType} from "../types/auth";
import {useAuth} from "../components/AuthComponents";
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {addDays, addMinutes} from "../utils/dateUtils";
import {useSimpleModal} from "../components/modals/useSimpleModal";
import {UnauthorizedRequestError} from "../types/requestErrors";
import {logOut} from "../logic/login";
import { Col, Container, Row, Spinner} from "react-bootstrap";
import DatePicker from "react-date-picker";
import {ReportDisease} from "../types/adminAPITypes";
import {downloadReport, getReportData} from "../logic/adminAPI";
import DownloadPDFButton from "../components/buttons/DownloadPDFButton";
import CollapsableDisease from "../components/CollapsableDisease";

function AdminVaccinationReportPage() {
    const auth: AuthContextType = useAuth();
    const navigate = useNavigate()
    let today = new Date();
    today.setHours(0, 0, 0, 0);
    const [startDate, onStartDateChange] = useState<Date>(today);
    const [endDate, onEndDateChange] = useState<Date>(addMinutes(addDays(today, 6), 1439));
    const [showErrorModal, renderErrorModal] = useSimpleModal();
    const [loading, setLoading] = useState(false);
    const [Data, setData] = useState<ReportDisease[]>([]);

    const getData = () => {
        setLoading(true);
        getReportData(auth, startDate, endDate)
            .then(setData)
            .catch(reason => {
            if (reason instanceof UnauthorizedRequestError) {
                logOut(auth);
                navigate('/loginDoctor');
            } else switch (reason.status) {
                case 422:
                    showErrorModal('Error', 'Validation error');
                    break;
                default:
                    showErrorModal('Error', 'Unknown error');
                    console.log(reason.message);
            }
            setData([]);
        }).finally(() => setLoading(false))

    };
    useEffect(() => {
        getData();
    }, [startDate, endDate])


    return (
        <>
            <Container style={{width: '500px', margin: 5}}>
                <Row>
                    <Col>Vaccinations Report </Col>
                    <Col className="d-flex justify-content-end">
                        <DownloadPDFButton
                        onDownload={() => downloadReport(auth, startDate, endDate)}
                        disabled={loading}/>
                    </Col>
                </Row>
                <Row style={{padding: '2px'}}>
                    <Col>From:</Col>
                    <Col className="d-flex justify-content-stretch" style={{paddingRight:"10px"}}><DatePicker
                        disabled={loading}
                        onChange={(date: Date) => {
                            onStartDateChange(date)
                        }}
                        minDate={new Date('1990-01-01')}
                        value={startDate}
                        format='dd.MM.y'
                        data-testid='Start'
                        className="col_stretch"
                    /></Col>
                </Row>
                <Row style={{padding: '2px'}}>
                    <Col>To:</Col>
                    <Col className="d-flex justify-content-stretch" style={{paddingRight:"10px"}}><DatePicker
                        disabled={loading}
                        onChange={(date: Date) => {
                            onEndDateChange(date)
                        }}
                        minDate={new Date('1990-01-02')}
                        value={endDate}
                        format='dd.MM.y'
                        data-testid='End'
                        className="col_stretch"
                    /></Col>
                </Row>
            </Container>

            {Data.length === 0 ?
                <div/> :
                <>
                    {loading?
                        <Spinner animation='border'/> :
                        (
                            Data.map((field, index) => {
                                return <CollapsableDisease field={field} key={`${field.name}_${index}`}/>
                            })
                        )}
                </>}
            {renderErrorModal()}
        </>

    )
}

export default AdminVaccinationReportPage;