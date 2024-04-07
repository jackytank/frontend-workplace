/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Avatar, ChatContainer, ConversationHeader, InfoButton, MainContainer, Message, MessageInput, MessageList, MessageSeparator,
  TypingIndicator, VideoCallButton, VoiceCallButton
} from "@chatscope/chat-ui-kit-react";
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import ChatLeftSideBar from "./components/ChatLeftSideBar";
import { useEffect, useState } from "react";
import SignUpChat from "./components/SignUpChat";
import SockJS from 'sockjs-client';
import { Client, Frame, over } from 'stompjs';

export type UserDataType = {
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
  status: StatusEnum | MessageStatus;
};

enum StatusEnum {
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
  const [publicChats, setPublicChats] = useState<ChatMessage[]>([]);
  const [tab, setTab] = useState('CHATROOM');
  const [userData, setUserData] = useState<UserDataType>({
    username: '',
    receiverName: '',
    connected: true,
    message: ''
  });
  const WS_URL = import.meta.env.VITE_WS_URL as string;
  let stompClient: Client | null = null;

  useEffect(() => {
    console.log(userData);
  }, [userData]);

  const connect = () => {
    const sock = new SockJS(WS_URL);
    stompClient = over(sock);
    stompClient.connect({}, onConnected, onError);
  };

  const onConnected = () => {
    setUserData({
      ...userData,
      connected: true
    });
    if (!stompClient) return;
    stompClient.subscribe('/mychatroom/public', onPublicMessageReceived);
    stompClient.subscribe(`/mychatuser/${userData.username}/private`, onPrivateMessageReceived);
    userJoin();
  };

  const userJoin = () => {
    const chatMessage: ChatMessage = {
      senderName: userData.username,
      status: MessageStatus.JOIN
    };
    if (!stompClient) return;
    stompClient.send('/mychatapp/message', {}, JSON.stringify(chatMessage));
  };

  const onPublicMessageReceived = (payload: { body: string; }) => {
    console.log('Public message received', payload);
    const payloadData = JSON.parse(payload.body) as ChatMessage;
    switch (payloadData.status) {
      case MessageStatus.JOIN:
        if (!privateChats.get(payloadData.senderName)) {
          privateChats.set(payloadData.senderName, []);
          setPrivateChats(new Map(privateChats));
        }
        break;
      case MessageStatus.MESSAGE:
        publicChats.push(payloadData);
        setPublicChats([...publicChats]);
        break;
      default:
        break;
    }
  };

  const onPrivateMessageReceived = (payload: { body: string; }) => {
    console.log('Private message received', payload);
    const payloadData = JSON.parse(payload.body) as ChatMessage;
    if (privateChats.get(payloadData.senderName)) {
      privateChats.get(payloadData.senderName)?.push(payloadData);
      setPrivateChats(new Map(privateChats));
    } else {
      const list: ChatMessage[] = [];
      list.push(payloadData);
      privateChats.set(payloadData.senderName, list);
      setPrivateChats(new Map(privateChats));
    }
  };

  const onError = (err: string | Frame) => {
    setUserData({
      ...userData,
      connected: false
    });
    console.log('Error', err);
  };

  const handleMessage = (event: { target: { value: any; }; }) => {
    const { value } = event.target;
    setUserData({
      ...userData,
      message: value
    });
  };

  const sendValue = () => {
    if (stompClient) {
      const chatMessage: ChatMessage = {
        senderName: userData.username,
        message: userData.message,
        status: MessageStatus.MESSAGE
      };
      console.log('Sending message', chatMessage);
      stompClient.send('/mychatapp/message', {}, JSON.stringify(chatMessage));
      setUserData(prev => ({
        ...prev,
        message: ''
      }));
    }
  };

  const sendPrivateValue = () => {
    if (stompClient) {
      const chatMessage: ChatMessage = {
        senderName: userData.username,
        receiverName: tab,
        message: userData.message,
        status: MessageStatus.MESSAGE
      };
      if (userData.username !== tab) {
        privateChats.get(tab)?.push(chatMessage);
        setPrivateChats(new Map(privateChats));
      }
      stompClient.send('/mychatapp/private', {}, JSON.stringify(chatMessage));
      setUserData(prev => ({
        ...prev,
        message: ''
      }));
    }
  };

  const handleUsername = (event: { target: { value: any; }; }) => {
    const { value } = event.target;
    setUserData(prev => ({
      ...prev,
      username: value
    }));
  };

  const registerUser = () => {
    connect();
  };


  if (!userData.connected) {
    return (
      <SignUpChat
        setUserData={setUserData}
        registerUser={registerUser}
      />
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