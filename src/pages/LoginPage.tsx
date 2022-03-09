import React from 'react';
import {Button, Form, Container} from 'react-bootstrap'
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import './LoginPage.css'
type UserLoginForm = {
    email: string;
    password: string;
};

const LoginPage: React.FC = () => {
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
        formState: { errors }
    } = useForm<UserLoginForm>({
        resolver: yupResolver(validationSchema)
    });
    const onSubmit = (data: UserLoginForm) => {
        console.log(JSON.stringify(data, null, 2));
    };
    return (
        <div className="LoginPage">
            <header className="LoginPage-header">
                <Container className="formContainer">
                    <Form onSubmit={handleSubmit(onSubmit)}>
                        <Form.Group controlId="formEmail" {...register('email')}>

                            <Form.Label
                                className="formLabel">
                                Email Address
                            </Form.Label>
                            <Form.Control
                                className="formControl"
                                type="email"
                                placeholder="name@example.com"
                                required
                            />
                            <Form.Control.Feedback type="invalid">
                                errors.email
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group controlId="formPassword">
                            <Form.Label
                                className="formLabel">
                                Password
                            </Form.Label>
                            <Form.Control
                                className="formControl"
                                type="Password"
                                placeholder="Password"
                                {...register('password')}
                                isInvalid={!!errors.password}
                                required/>
                            <Form.Control.Feedback type="invalid">
                                errors.password
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Button variant="primary" type="submit">Login</Button>
                    </Form>
                </Container>

            </header>
        </div>

    );
}
export default LoginPage;
