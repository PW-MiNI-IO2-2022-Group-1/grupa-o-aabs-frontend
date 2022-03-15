import React from 'react';
// import {Button, Form, Container} from 'react-bootstrap'
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import './LoginPage.css'
type UserLoginForm = {
    email: string;
    password: string;
};

function EnterSchedulePage() {

    const validationSchema = Yup.object().shape({
        email: Yup.string()
            .required('Email is required')
            .email('Email is invalid'),
        password: Yup.string()
            .required('Password is required')
    });
    const {
        register,
        handleSubmit,
        formState: {errors},
    } = useForm<UserLoginForm>({
        resolver: yupResolver(validationSchema)
    });
    const onSubmit = (data: UserLoginForm) => {
        console.log(JSON.stringify(data, null, 2));
    };
    return (
        <div className="LoginPage">
            <header className="LoginPage-header">
                <form onSubmit={handleSubmit(onSubmit)} className="form-container" data-testid="form">
                    <div className="form-group">
                        <button type="submit" className="btn btn-primary" name="login">
                            Log in
                        </button>
                    </div>
                </form>
            </header>
        </div>

    );
}
export default EnterSchedulePage;
