import { useEffect } from 'react'
import LoginForm, {UserLoginForm} from "../components/LoginForm";
import './LoginPage.css'
import { useAuth } from "../components/AuthComponents";
import {useNavigate} from "react-router-dom";
import { Role } from '../types/users';

function LoginPage({role}: {role: Role}) {
    const authState = useAuth()
    const navigate = useNavigate()

    const onSubmit = (data: UserLoginForm) => {
        authState.signIn(role, data.email, data.password);
    };

    useEffect(() => {
        if(authState.role != null) {
            if(authState.role !== role)
                authState.signOut();
            else
                navigate(`/${role.toLowerCase()}`);
        }
    });

    return (
        <div className="LoginPage">
            <header className="LoginPage-header"> Login as {role}
                <LoginForm onSubmit={onSubmit}/>
            </header>
        </div>
    );
}

export default LoginPage;
