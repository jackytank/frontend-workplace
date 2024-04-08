/* eslint-disable @typescript-eslint/no-unused-vars */
import { MessageList, TypingIndicator, MessageSeparator, Message, MessageInput, Avatar } from '@chatscope/chat-ui-kit-react';
import React from 'react';

type ChatContentProps = {
    chats: unknown[],
    sendFunction: () => void,
    isPrivate: boolean;
};

const ChatContent = () => {
    return (
        <MessageList typingIndicator={<TypingIndicator content="Zoe is typing" />}>
            <MessageSeparator content="Saturday, 30 November 2019" />
            <Message
                avatarSpacer
                model={{
                    direction: 'incoming',
                    message: 'Hello my friend',
                    position: 'first',
                    sender: 'Zoe',
                    sentTime: '15 mins ago'
                }}
            />
            <Message
                model={{
                    direction: 'incoming',
                    message: 'Hello my friend',
                    position: 'last',
                    sender: 'Zoe',
                    sentTime: '15 mins ago'
                }}
            >
                <Avatar
                    name='Zoe'
                    src="https://chatscope.io/storybook/react/assets/zoe-E7ZdmXF0.svg"
                />
            </Message>
            <Message
                model={{
                    direction: 'outgoing',
                    message: 'Hello my friend',
                    position: 'first',
                    sender: 'Patrik',
                    sentTime: '15 mins ago'
                }}
            />
        </MessageList>
    );
};

export default ChatContent;