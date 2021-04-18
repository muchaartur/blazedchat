import { Avatar, Button, IconButton } from '@material-ui/core';
import styled from 'styled-components'
import WhatshotIcon from '@material-ui/icons/Whatshot';
import { purple } from '@material-ui/core/colors';
import SearchIcon from '@material-ui/icons/Search';
import * as EmailValidator from 'email-validator';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollection } from 'react-firebase-hooks/firestore';
import { auth, db } from '../firebase';
import Chat from './Chat';

function Sidebar() {

    const [user] = useAuthState(auth);
    const userChatRef = db.collection('chats').where('users', 'array-contains', user.email);
    const [chatsSnapshot] = useCollection(userChatRef);

    const createChat = () => {
        const input = prompt(
            " Please enter email address for the user you wish to chat with"
        );

        if (!input) return null;

        if (EmailValidator.validate(input) && !chatAlreadyExist(input) && input !== user.email) {
            //Chat into DB 
            db.collection('chats').add({
                users: [user.email, input],
            });
        }
    };

    const chatAlreadyExist = (recipientEmail) => 

        !!chatsSnapshot?.docs.find(
            (chat) => 
                chat.data().users.find((user) => user === recipientEmail)?.length > 0
        );
    

    return (
        <Container>
            <Header>
                <UserAvatar src={user.photoURL} onClick={() => auth.signOut()}/>
                <IconsContainer>
                    <IconButton>
                        <WhatshotIcon style={{ color: purple[800] }}/>
                    </IconButton>
                </IconsContainer>
            </Header>

            <Search>
                <SearchIcon style={{ color: purple[800] }}/>
                <SearchInput placeholder="Search in chats" />
            </Search>

            <SidebarButton style={{ color: purple[800] }} onClick={createChat} >
                Start a New Chat
            </SidebarButton>

            {/*List of chats*/}
            {chatsSnapshot?.docs.map(chat => (
                <Chat key={chat.id} id={chat.id} users={chat.data().users} />
                ))}
        </Container>
    );
}

export default Sidebar;

const Container = styled.div`
    flex: 0.55;
    border-right: 1px solid whitesmoke;
    height: 100vh;
    min-width: 144px;
    max-width: 333px;
    overflow-y: scroll;
    background-color: white;
    font-size: 12px;
    font-weight: bold;
    

    ::-webkit-scrollbar {
        display: none;
    }

    -ms-overflow-style: none;
    scrollbar-width: none;
`;

const IconsContainer = styled.form`
    display: flex;
    align-items: center;
    padding: 10px;
    position: sticky;
    bottom: 0;
    background-color: white;
    z-index: 100;
`;

const Search = styled.div`
    display: flex;
    align-items: center;
    padding: 21px;
    border-radius: 3px;
`;

const SidebarButton = styled(Button)`
    width: 100%;

    &&& {
        border-top: 1px whitesmoke;
        border-bottom: 1px whitesmoke;
    }
`;

const SearchInput = styled.input`
    outline-width: 0;
    border: none;
    flex: 1;
`;

const Header = styled.div`
    display: flex;
    position: sticky;
    top: 0;
    background-color: white;
    align-items: center;
    z-index: 1;
    justify-content: space-between;
    padding: 3px;
    height: 89px;
`;

const UserAvatar = styled(Avatar)`
    margin: 8px;
    cursor: pointer;
    :hover {
        opacity: 0.89;
    }
`;