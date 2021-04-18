import { Avatar, IconButton } from "@material-ui/core";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import styled from "styled-components";
import { auth, db } from "../firebase";
import WhatshotIcon from '@material-ui/icons/Whatshot';
import { purple } from '@material-ui/core/colors';
import { useCollection } from "react-firebase-hooks/firestore";
import Message from "./Message";
import { useRef, useState } from 'react';
import firebase from 'firebase';
import getRecipientEmail from "../utils/getRecipientEmail";
import TimeAgo from 'timeago-react';

function ChatScreen({ chat, messages }) {
    console.log();
    const [user] = useAuthState(auth);

    const [input, setInput] = useState("");

    const endOfMessagesRef = useRef(null);

    const router = useRouter();

    const [messagesSnapshot] = useCollection(
        db
            .collection("chats")
            .doc(router.query.id)
            .collection("messages")
            .orderBy("timestamp", "asc")
        );

    const [recipientSnapshot] = useCollection(
        db
            .collection("users")
            .where("email", "==", getRecipientEmail(chat.users, user))
        );
            
    const showMessages = () => {

        if (messagesSnapshot) {
            return messagesSnapshot.docs.map((message) => (
                <Message 
                    key={message.id}
                    user={message.data().user}
                    message={{
                        ...message.data(),
                        timestamp: message.data().timestamp?.toDate().getTime(),
                    }}
                />
            ));
        } else {
            return JSON.parse(messages).map(message => (
                <Message key={message.id} user={message.user} message={message} />
            ))
        }    ;
    };

    const scrollToBottom = () => {
        endOfMessagesRef.current.scrollIntoView({
            behavior: "smooth",
            block: "start",
        });
    }

    const sendMessage = (e) => {
        e.preventDefault();

        //update last seen...
        db.collection("users").doc(user.uid).set(
            {
                lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
            }, 
            { merge: true }
        );

        db.collection("chats").doc(router.query.id).collection("messages").add({
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            message: input,
            user: user.email,
            photoURL: user.photoURL,
        });

        setInput("");
        scrollToBottom();
    };

    const recipient = recipientSnapshot?.docs?.[0]?.data();

    const recipientEmail = getRecipientEmail(chat.users, user);

    return (
        <Container>
            <Header>
                
                {recipient ? (
                    <Avatar src={recipient?.photoURL} />
                ) : (
                    <Avatar>{recipientEmail[0]}</Avatar>
                )}
            
                <HeaderInformation>
                    <h3>{recipientEmail}</h3>
                    {recipientSnapshot ? (
                        <p>last seen: {' '}
                        {recipient?.lastSeen?.toDate() ? (
                            <TimeAgo datetime={recipient?.lastSeen?.toDate()} />
                        ): "Unavaiable"}
                        </p>
                    ): (
                        <p>Loading...</p>
                    )}
                </HeaderInformation>
                <HeaderIcons>
                    <IconButton>
                        <WhatshotIcon style={{ color: purple[800] }}/>
                    </IconButton>
                </HeaderIcons>            
            </Header>

            <MessageContainer>
                {showMessages()}
                <EndOfMessage ref={endOfMessagesRef}/>
            </MessageContainer>
            <InputContainer>
                <Input value={input} onChange={e => setInput(e.target.value)} />
                <button hidden disabled={!input} type="submit" onClick={sendMessage}> 
                    Send Message
                </button>
                <WhatshotIcon style={{ color: purple[800] }} />
            </InputContainer>
        </Container>
    );
}

export default ChatScreen;

const Container = styled.div``;

const Header = styled.div`
    position: sticky;
    background-color: white;
    z-index: 100;
    top: 0;
    display: flex;
    padding: 8px;
    height: 89px;
    align-items: center;
    border-bottom: 1px solid purple;
`;

const HeaderInformation = styled.div`
    margin-left: 21px;
    flex: 1;
    word-break: break-word;
    font-size: 13px;

    > h3 {
        margin-bottom: 3px;
        color: #6714A1;
    }

    > p {
        font-size: 11px;
        color: green;
    }
`;

const MessageContainer = styled.div`
    padding: 21px;
    background-color: whitesmoke;
    min-height: 89vh;
`;

const EndOfMessage = styled.div`
    margin-bottom: 55px;
`;

const HeaderIcons = styled.div``;

const Input = styled.input`
    flex: 1;
    outline: 0;
    border: none;
    border-radius: 8px;
    align-items: center;
    padding: 13px;
    background-color: #6714A1;
    margin-left: 13px;
    margin-right: 13px;
    color: white;
`;

const InputContainer = styled.form`
    display: flex;
    align-items: center;
    padding: 13px;
    position: sticky;
    bottom: 0;
    background-color: white;
    z-index: 100;
`;
