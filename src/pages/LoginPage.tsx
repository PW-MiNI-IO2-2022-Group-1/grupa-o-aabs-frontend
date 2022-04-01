import React, { useState } from 'react';
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

function LoginPage({role}: {role: string}) {
    const onChangeHandler= (field: string)=>(e: any)=>setformdata({...formdata,[field]:e.target.data})
    const [formdata, setformdata] = useState({
        email:"",
        password:"",
    });

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
        reset,
    } = useForm<UserLoginForm>({
        resolver: yupResolver(validationSchema),
        defaultValues:
            {
                email: "",
                password: ""
            }
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
        console.log(JSON.stringify(data, null, 2));
        reset();
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
                            data-testid="email-input"
                            className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                        />
                        {errors.email ?
                        <div className="invalidfeedback text-sm-center text-small" id="emailError">{errors.email?.message}</div>:
                        <div className="gap"/>}
                    </div>
                    <div className="form-group">
                        <label className="form-label text-sm-start" id="password">Password</label>
                        <input
                            aria-labelledby="password"
                            placeholder="Password"
                            type="password"
                            {...register('password')}
                            data-testid="password-input"
                            className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                        />
                        {errors.password ?
                        <div className="invalidfeedback text-sm-center text-small" id="passwordError">{errors.password?.message}</div>:
                        <div className="gap"/>}
                    </div>
                    <div className="form-group">
                        <button type="submit" className="btn btn-primary" data-testid="login">
                            Log in
                        </button>
                    </div>
                </form>
            </header>
        </div>

    );
}

export default LoginPage;
