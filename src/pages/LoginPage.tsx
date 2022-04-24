import { useEffect, useState } from 'react'
import LoginForm, {UserLoginForm} from "../components/LoginForm";
import './LoginPage.css'
import { useAuth } from "../components/AuthComponents";
import {useNavigate} from "react-router-dom";
import { Role } from '../types/users';
import { UnauthorizedRequestError } from '../types/requestErrors';
import { Button, Modal } from 'react-bootstrap';
import { logIn, logOut } from '../logic/login';

function LoginPage({role}: {role: Role}) {
    const auth = useAuth()
    const navigate = useNavigate()
    const [show, setShow] = useState(false)
    const [modalMsg, setModalMsg] = useState("")

    const onSubmit = async (data: UserLoginForm) => {
        try {
            await logIn(auth, role, data.email, data.password);
        } 
        catch(error) {
            if(error instanceof UnauthorizedRequestError)
                handleShow('Invalid credentials');
            else
                handleShow('Unknown error');
        }
    };

    useEffect(() => {
        if(auth.role != null) {
            if(auth.role !== role)
                logOut(auth);
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
                    <Button variant="primary" onClick={handleClose}>OK</Button>
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
