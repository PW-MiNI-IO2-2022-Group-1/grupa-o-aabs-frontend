import {Col, Row} from "react-bootstrap";
import React from "react";
import {PatientDetailsFormData} from "../../pages/EditPatientDetailsPage";
import {useFormik} from "formik";
import {getOrDefault} from "../../utils/dictionaryUtils";
import {EditField} from "../EditField";
import * as Yup from "yup";
import {Patient} from "../../types/users";
import {useAuth} from "../AuthComponents";


function EditPatientDetailsForm({onSubmit, form}: {
    onSubmit: (e: React.FormEvent) => void,
    form: any
}) {
    const displayNames = new Map<String, String>([
        ['firstName', 'First name'],
        ['lastName', 'Last name'],
        ['password', 'Password'],
        ['city', 'City'],
        ['zipCode', 'Zip code'],
        ['street', 'Street'],
        ['houseNumber', 'House number'],
        ['localNumber', 'Local number'],
    ]);
    const inputTypes = new Map<String, String>();
    inputTypes.set('password', 'password');

    const renderEditField = (key: string): JSX.Element => {
        const error = (form.errors as any)[key];
        const displayName = getOrDefault(displayNames, key, '').valueOf();
        const inputType = getOrDefault(inputTypes, key, 'text').valueOf();
        return <EditField key={key} valueKey={key} displayName={displayName}
                          values={form.values} handleChange={form.handleChange}
                          error={error} type={inputType}/>
    }
    return <form onSubmit={onSubmit} className='form-container' data-testid='form'
                 style={{width: '800px'}}>
        <Row>
            <Col>{renderEditField('firstName')}</Col>
            <Col>{renderEditField('lastName')}</Col>
        </Row>
        <Row>
            <Col>{renderEditField('password')}</Col>
            <Col/>
        </Row>
        <Row><div style={{height: '50px'}}/></Row>
        <Row>
            <Col>{renderEditField('city')}</Col>
            <Col>{renderEditField('zipCode')}</Col>
        </Row>
        <Row>
            <Col>{renderEditField('street')}</Col>
            <Col>{renderEditField('houseNumber')}</Col>
        </Row>
        <Row>
            <Col>{renderEditField('localNumber')}</Col>
            <Col/>
        </Row>
        <Row><div style={{height: '50px'}}/></Row>
        <Row className='justify-content-center'>
            <input type='submit' className='btn btn-light btn-outline-dark'
                   style={{width: '150px'}} value='Change details'/>
        </Row>
    </form>
}

export default EditPatientDetailsForm;