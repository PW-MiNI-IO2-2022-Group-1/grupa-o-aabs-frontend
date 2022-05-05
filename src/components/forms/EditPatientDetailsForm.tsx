import {Col, Row} from "react-bootstrap";
import React from "react";
import {getOrDefault} from "../../utils/dictionaryUtils";
import EditField from "../EditField";
import {FormikProps, useFormik} from "formik";
import {PatientDetailsFormData} from "../../pages/EditPatientDetailsPage";
import * as Yup from "yup";


function EditPatientDetailsForm({onSubmit, initialValues}: {
    onSubmit: (data: PatientDetailsFormData) => void,
    initialValues: PatientDetailsFormData,
}) {
    const validationSchema = Yup.object().shape({
        firstName: Yup.string().min(2, 'First name is required')
            .matches(RegExp(/[A-Z].+/g), "First name has to start with uppercase letter"),
        lastName: Yup.string().min(2, 'Last name is required')
            .matches(RegExp(/[A-Z].+/g), "Last name has to start with uppercase letter"),
        city: Yup.string().required('City is required')
            .matches(RegExp(/[A-Z].+/g), "City has to start with uppercase letter"),
        zipCode: Yup.string().required('Zip code is required')
            .matches(RegExp(/\d\d-\d\d\d/g), "Zip code is invalid"),
        street: Yup.string().required('Street is required'),
        houseNumber: Yup.string().required('House number is required'),
        localNumber: Yup.string()
    });
    const form = useFormik<PatientDetailsFormData>({
        initialValues: initialValues,
        validationSchema: validationSchema,
        onSubmit: onSubmit
    });
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
    return <form onSubmit={form.handleSubmit} className='form-container' data-testid='form'
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