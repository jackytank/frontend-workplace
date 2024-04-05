import { Avatar, Conversation, ConversationList, Search, Sidebar } from '@chatscope/chat-ui-kit-react';

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
                        src="https://chatscope.io/storybook/react/assets/lilly-aj6lnGPk.svg"
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
                        src="https://chatscope.io/storybook/react/assets/joe-v8Vy3KOS.svg"
                        status="dnd"
                    />
                </Conversation>
                <Conversation
                    info="Yes i can do it for you"
                    lastSenderName="Emily"
                    name="Emily"
                    unreadCnt={3}
                >
                    <Avatar
                        name="Emily"
                        src="https://chatscope.io/storybook/react/assets/emily-xzL8sDL2.svg"
                        status="available"
                    />
                </Conversation>
                <Conversation
                    info="Yes i can do it for you"
                    lastSenderName="Kai"
                    name="Kai"
                    unreadDot
                >
                    <Avatar
                        name="Kai"
                        src="https://chatscope.io/storybook/react/assets/kai-5wHRJGb2.svg"
                        status="unavailable"
                    />
                </Conversation>
                <Conversation
                    info="Yes i can do it for you"
                    lastSenderName="Akane"
                    name="Akane"
                >
                    <Avatar
                        name="Akane"
                        src="https://chatscope.io/storybook/react/assets/akane-MXhWvx63.svg"
                        status="eager"
                    />
                </Conversation>
                <Conversation
                    info="Yes i can do it for you"
                    lastSenderName="Eliot"
                    name="Eliot"
                >
                    <Avatar
                        name="Eliot"
                        src="https://chatscope.io/storybook/react/assets/eliot-JNkqSAth.svg"
                        status="away"
                    />
                </Conversation>
                <Conversation
                    active
                    info="Yes i can do it for you"
                    lastSenderName="Zoe"
                    name="Zoe"
                >
                    <Avatar
                        name="Zoe"
                        src="https://chatscope.io/storybook/react/assets/zoe-E7ZdmXF0.svg"
                        status="dnd"
                    />
                </Conversation>
                <Conversation
                    info="Yes i can do it for you"
                    lastSenderName="Patrik"
                    name="Patrik"
                >
                    <Avatar
                        name="Patrik"
                        src="https://chatscope.io/storybook/react/assets/patrik-yC7svbAR.svg"
                        status="invisible"
                    />
                </Conversation>
            </ConversationList>
        </Sidebar>
    );
};

export default ChatLeftSideBar;