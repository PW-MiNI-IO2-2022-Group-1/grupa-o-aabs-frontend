import {ReportDisease} from "../types/adminAPITypes";
import {useState} from "react";
import {Button, Col, Collapse, Container, Row} from "react-bootstrap";
import {CaretDownFill, CaretLeftFill} from "react-bootstrap-icons";
import "./CollapsableDisease.css";

function CollapsableDisease({field}: { field: ReportDisease }) {
    const [showHide, setShowHide] = useState<boolean>(false);
    const bp = 4;
    const iconColor = "white";
    return (
        <Container>
            <button style={{width: "100%", border: "0px",}} onClick={() => setShowHide(!showHide)}>
                <Row style={{color: iconColor, backgroundColor: "#212529",}}>
                    <Col md={bp}>
                        {field.name}
                    </Col>
                    <Col md={bp} className="d-flex justify-content-end float-right no-gutters">
                        {field.count}
                    </Col>
                    <Col md={bp} className="d-flex justify-content-end align-content-center">
                        {showHide ? <CaretDownFill className="d-flex align-self-center" color={iconColor}/> : <CaretLeftFill className="d-flex align-self-center" color={iconColor}/>}
                    </Col>
                </Row>
            </button>
            <Collapse in={showHide}>
                <div>{field.vaccines.map((vaccine, index) => {
                    return <Row key={`${vaccine.name}_${index}`}>
                        <Col md={1}/>
                        <Col md={bp - 1}>
                            {vaccine.name}
                        </Col>
                        <Col md={bp} className="d-flex justify-content-end">
                            {vaccine.count}
                        </Col>
                    </Row>
                })}
                </div>
            </Collapse>

        </Container>
    );
}

export default CollapsableDisease;