import { Avatar, Conversation, ConversationList, Search, Sidebar } from '@chatscope/chat-ui-kit-react';
import ManLogo from '../../../assets/man.png';
import WomanLogo from '../../../assets/woman.png'

const ChatLeftSideBar = () => {
    return (
        <Sidebar
            position="left"
        >
            <Search placeholder="Search..." />
            <ConversationList>
                <Conversation
                    info="Yes i can do it for you"
                    lastSenderName="Lilly"
                    name="Lilly"
                >
                    <Avatar
                        name="Lilly"
                        src={WomanLogo}
                        status="available"
                    />
                </Conversation>
                <Conversation
                    info="Yes i can do it for you"
                    lastSenderName="Joe"
                    name="Joe"
                >
                    <Avatar
                        name="Joe"
                        src={ManLogo}
                        status="dnd"
                    />
                </Conversation>
            </ConversationList>
        </Sidebar>
    );
};

export default ChatLeftSideBar;