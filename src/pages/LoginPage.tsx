import { useEffect, useState } from 'react'
import LoginForm, {UserLoginForm} from "../components/LoginForm";
import './LoginPage.css'
import { useAuth } from "../components/AuthComponents";
import {useNavigate} from "react-router-dom";
import { Role } from '../types/users';
import { UnauthorizedRequestError } from '../types/unauthorizedRequestError';
import { Button, Modal } from 'react-bootstrap';

function LoginPage({role}: {role: Role}) {
    const authState = useAuth()
    const navigate = useNavigate()
    const [show, setShow] = useState(false)
    const [modalMsg, setModalMsg] = useState("")

    const onSubmit = async (data: UserLoginForm) => {
        try {
            await authState.signIn(role, data.email, data.password);
        } 
        catch(error) {
            if(error instanceof UnauthorizedRequestError)
                handleShow('Invalid credentials');
            else
                handleShow('Unknown error');
        }
    };

    useEffect(() => {
        if(authState.role != null) {
            if(authState.role !== role)
                authState.signOut();
            else
                navigate(`/${role.toLowerCase()}`);
        }
    });

    const handleClose = () => setShow(false);
    const handleShow = (msg: string) => {
        setModalMsg(msg)
        setShow(true);
    }

    return (<>
        <Modal show={show} onHide={handleClose} backdrop='static'>
            <Modal.Header>
                <Modal.Title>Error</Modal.Title>
            </Modal.Header>
            <Modal.Body>{modalMsg}</Modal.Body>
                <Modal.Footer>
                {
                    <Button variant="primary" onClick={handleClose}>OK</Button>
                }
                </Modal.Footer>
        </Modal>
        <div className="LoginPage">
            <header className="LoginPage-header"> Login as {role}
                <LoginForm onSubmit={onSubmit}/>
            </header>
        </div>
        </>
    );
}

export default LoginPage;
