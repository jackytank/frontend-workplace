/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Avatar, ChatContainer, ConversationHeader, InfoButton, MainContainer, Message, MessageInput, MessageList, MessageSeparator,
  TypingIndicator, VideoCallButton, VoiceCallButton
} from "@chatscope/chat-ui-kit-react";
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import ChatLeftSideBar from "./components/ChatLeftSideBar";
import { useRef, useState } from "react";
import SignUpChat from "./components/SignUpChat";
import SockJS from 'sockjs-client';
import { Client, over } from 'stompjs';

type UserDataType = {
  username: string;
  receiverName: string;
  connected: boolean;
  message: string;
};

type ChatMessage = {
  senderName: string;
  receiverName?: string;
  message?: string;
  date?: string;
  status: Status;
};

enum Status {
  JOIN,
  MESSAGE,
  LEAVE
}

enum MessageStatus {
  JOIN = 'JOIN',
  MESSAGE = 'MESSAGE',
  LEAVE = 'LEAVE'
}

const ChatPage = () => {
  const [privateChats, setPrivateChats] = useState(new Map<string, ChatMessage[]>());
  const [publicChats, setPublicChats] = useState([])
  const [tab, setTab] = useState('CHATROOM')
  const [userData, setUserData] = useState<UserDataType>({
    username: '',
    receiverName: '',
    connected: true,
    message: ''
  });
  const stompClientRef = useRef<Client | null>(null);

  const connect = () => {
    const sock = new SockJS('http://localhost:8080/ws');
    stompClientRef.current = over(sock);
    stompClientRef.current.connect({}, onConnected, onError);

  };

  const onConnected = () => {
    setUserData({
      ...userData,
      connected: true
    });
    stompClientRef.current?.subscribe('/mychatroom/public', onPublicMessageReceived);
    stompClientRef.current?.subscribe(`/mychatuser/${userData.username}/private`, onPrivateMessageReceived);
    userJoin();
  };

  const userJoin = () => {
    const chatMessage: ChatMessage = {
      senderName: userData.username,
      status: Status.JOIN
    };
    stompClientRef.current?.send('/mychatapp/message', {}, JSON.stringify(chatMessage));
  };

  const onPublicMessageReceived = (payload: { body: string; }) => {
    const payloadData = JSON.parse(payload.body) as ChatMessage;
    switch (payloadData.status) {
      case Status.JOIN:
        if (!)
          break;

      default:
        break;
    }
  };

  const onError = () => {
    setUserData({
      ...userData,
      connected: false
    });
  };


  if (!userData.connected) {
    return (
      <SignUpChat connect={connect} />
    );
  }

  return (
    <div style={{ position: "relative", height: "70vh", width: "100vw" }}>
      <MainContainer
        responsive
        style={{
        }}
      >
        <ChatLeftSideBar />
        <ChatContainer>
          <ConversationHeader>
            <ConversationHeader.Back />
            <Avatar
              name="Zoe"
              src="https://chatscope.io/storybook/react/assets/zoe-E7ZdmXF0.svg"
            />
            <ConversationHeader.Content
              info="Active 10 mins ago"
              userName="Zoe"
            />
            <ConversationHeader.Actions>
              <VoiceCallButton />
              <VideoCallButton />
              <InfoButton />
            </ConversationHeader.Actions>
          </ConversationHeader>
          <MessageList typingIndicator={<TypingIndicator content="Zoe is typing" />}>
            <MessageSeparator content="Saturday, 30 November 2019" />
            <Message
              model={{
                direction: 'incoming',
                message: 'Hello my friend',
                position: 'single',
                sender: 'Zoe',
                sentTime: '15 mins ago'
              }}
            >
              <Avatar
                name="Zoe"
                src="https://chatscope.io/storybook/react/assets/zoe-E7ZdmXF0.svg"
              />
            </Message>
            <Message
              avatarSpacer
              model={{
                direction: 'outgoing',
                message: 'Hello my friend',
                position: 'single',
                sender: 'Patrik',
                sentTime: '15 mins ago'
              }}
            />
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
              avatarSpacer
              model={{
                direction: 'incoming',
                message: 'Hello my friend',
                position: 'normal',
                sender: 'Zoe',
                sentTime: '15 mins ago'
              }}
            />
            <Message
              avatarSpacer
              model={{
                direction: 'incoming',
                message: 'Hello my friend',
                position: 'normal',
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
                name="Zoe"
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
            <Message
              model={{
                direction: 'outgoing',
                message: 'Hello my friend',
                position: 'normal',
                sender: 'Patrik',
                sentTime: '15 mins ago'
              }}
            />
            <Message
              model={{
                direction: 'outgoing',
                message: 'Hello my friend',
                position: 'normal',
                sender: 'Patrik',
                sentTime: '15 mins ago'
              }}
            />
            <Message
              model={{
                direction: 'outgoing',
                message: 'Hello my friend',
                position: 'last',
                sender: 'Patrik',
                sentTime: '15 mins ago'
              }}
            />
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
                name="Zoe"
                src="https://chatscope.io/storybook/react/assets/zoe-E7ZdmXF0.svg"
              />
            </Message>
          </MessageList>
          <MessageInput placeholder="Type message here" />
        </ChatContainer>
        {/* <ChatRightSideBar /> */}
      </MainContainer>
    </div>
  );
};

export default ChatPage;