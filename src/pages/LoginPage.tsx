import React from 'react';
// import {Button, Form, Container} from 'react-bootstrap'
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import './LoginPage.css'
import { useAuth } from "../App";
import { useLocation, useNavigate } from "react-router-dom";

type UserLoginForm = {
    email: string;
    password: string;
};

function getRole(location: string): string {
    return location.substring(6).split('/')[0]
}

function LoginPage() {
    // const role: string = getRole(useLocation().pathname) # ta metoda uzyskiwania sciezki psuje testy
    const role: string = getRole(window.location.pathname)

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
        formState: { errors },
    } = useForm<UserLoginForm>({
        resolver: yupResolver(validationSchema)
    });
    const { token, signin } = useAuth()
    const navigate = useNavigate()
    const onSubmit = (data: UserLoginForm) => {
        signin(data.email, data.password)
        if (token === undefined) {
            navigate(`/${role.toLowerCase()}`)
        } else {
            console.log("wrong email or password")
        }
    };
    return (
        <div className="LoginPage">
            <header className="LoginPage-header"> Login as {role}
                <form onSubmit={handleSubmit(onSubmit)} className="form-container" data-testid="form">
                    <div className="form-group">
                        <label className="form-label text-sm-start " id="email">Email</label>
                        <input
                            aria-labelledby="email"
                            type="text"
                            placeholder="email@example.com"
                            {...register('email')}
                            className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                        />
                        {errors.email ?
                            <div className="invalid-feedback text-sm-start text-small">{errors.email?.message}</div> :
                            <div className="gap" />}
                    </div>
                    <div className="form-group">
                        <label className="form-label text-sm-start" id="password">Password</label>
                        <input
                            aria-labelledby="password"
                            placeholder="Password"
                            type="password"
                            {...register('password')}
                            className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                        />
                        {errors.password ?
                            <div
                                className="invalid-feedback text-sm-start text-small">{errors.password?.message}</div> :
                            <div className="gap" />}
                    </div>
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

export default LoginPage;
