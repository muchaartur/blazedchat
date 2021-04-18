import { Button } from "@material-ui/core";
import Head from "next/head";
import styled from 'styled-components';
import { auth, provider } from "../firebase";

function Login() {

    const signIn = () => {
        auth.signInWithPopup(provider).catch(alert);
    }
    return (
        <Container>
            <Head>
                <title>Login</title>
            </Head>

            <LoginContainer>
                <Logo src="https://blazedcorner.com/wp-content/uploads/2020/10/Blazed-Corner.png" />
                <Button onClick={signIn} variant="outlined"> Sign In With Google </Button>
            </LoginContainer>
        </Container>
    );
}

export default Login;

const Container = styled.div`
    display: grid;
    place-items: center;
    height: 100vh;
    background-color: #310877;
`;

const LoginContainer =styled.div`
    padding: 100px;
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: whitesmoke;
    border-radius: 8px;
    box-shadow: 0px 3px 13px -3px rgba(0, 0, 0, 0.89)
`;

const Logo = styled.img`
    height: 233px;
    width: 233px;
    margin-bottom: 34px;
`;