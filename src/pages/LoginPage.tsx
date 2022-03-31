import LoginForm, {UserLoginForm} from "../components/LoginForm";
import './LoginPage.css'
import {useAuth} from "../App";
import {useNavigate} from "react-router-dom";

function LoginPage({role}: {role: string}) {
    const auth = useAuth()
    const navigate = useNavigate()
    const onSubmit = (data: UserLoginForm) => {
        auth.signin(data.email, data.password)
        if (auth.token === undefined) {
            navigate(`/${role.toLowerCase()}`)
        } else {
            console.log("wrong email or password")
        }
        console.log(JSON.stringify(data, null, 2));
    };
    return (
        <div className="LoginPage">
            <header className="LoginPage-header"> Login as {role}
                <LoginForm onSubmit={onSubmit}/>
            </header>
        </div>

    );
}

export default LoginPage;
