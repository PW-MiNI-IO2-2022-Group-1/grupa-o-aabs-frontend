import React, { useState } from 'react';
import * as Icon from 'react-bootstrap-icons';
import { Container, Row, Col } from 'react-bootstrap';

interface EditFieldProps<T> {
    valueKey: string;
    displayName: string;
    type: string;
    values: T;
    handleChange: React.ChangeEventHandler<HTMLInputElement>;
    error: string | undefined;
};

function EditField<T>(props: EditFieldProps<T>) {
    const key = props.valueKey;
    const [isEnabled, setEnabled] = useState<boolean>(false);

    const toggleEnabled = (e: React.MouseEvent) => {
        e.preventDefault();
        setEnabled((isEnabled) => !isEnabled);
    }

    return (<Container className='d-flex p-0'
            style={{width: '300px'}}>
        <Col>
            <Row>
                <small className='d-flex form-label text-sm' 
                    id={key}>{props.displayName}
                </small>
            </Row>
            <Row className='justify-content-center'>
                <input
                    id={key}
                    disabled={!isEnabled}
                    type={props.type}
                    onChange={props.handleChange}    
                    value={(props.values as any)[key]}
                    style={{width: '250px'}}
                    className={`form-control${props.error === undefined 
                        ? '' 
                        : ' is-invalid'}`}
                />
                <button type="button" 
                    onClick={toggleEnabled}
                    className="btn btn-dark \
                    btn-sm pb-1 pt-0 mx-2"
                    style={{width: '40px', height: '40px'}}>
                        <Icon.PencilSquare/>
                </button>
            </Row>
            <Row>
                {props.error === undefined
                    ? <div className='gap'/>
                    : <div className='invalidfeedback text-small'>
                        {props.error}
                    </div>
                }
            </Row>
        </Col>
    </Container>);
}

export default EditField;