import moment from "moment";
import { useAuthState } from "react-firebase-hooks/auth";
import styled from "styled-components";
import { auth } from "../firebase";

function Message({user, message}) {

    const [userLoggedIn] = useAuthState(auth);

    const TypeOfMessage = user === userLoggedIn.email ? Sender : Receiver;
    return (
        <TypeOfMessage>
            <p>{message.message}</p>
            <Timestamp>
                {message.timestamp ?  moment(message.timestamp).format("LT") : "..."}
            </Timestamp>
        </TypeOfMessage>
    );
}

export default Message;

const Container = styled.div``;

const MessageElement = styled.p`
    width: fit-content;
    padding: 13px;
    border-radius: 8px;
    margin: 8px;
    min-width: 44px;
    font-size: 13px;
    padding-bottom: 21px;
    position: relative;
    text-align: right;
`;

const Sender = styled(MessageElement)`
    margin-left: auto;
    background-color: #6714A1;
    color: white
`;

const Receiver = styled(MessageElement)`
    background-color: #4EA114;
    text-align: left;
    color: white;
`;

const Timestamp = styled.span`
    color: white;
    padding: 8px;
    font-size: 9px;
    position: absolute;
    bottom: 0;
    text-align: right;
    right: 0;
`;