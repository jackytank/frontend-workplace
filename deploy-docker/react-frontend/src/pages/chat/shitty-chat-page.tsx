/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Avatar, ChatContainer, Conversation, ConversationHeader, ConversationList, InfoButton, MainContainer, Message, MessageInput, MessageList,
  Search,
  Sidebar,
  TypingIndicator, VideoCallButton, VoiceCallButton
} from "@chatscope/chat-ui-kit-react";
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { useEffect, useState } from "react";
import { Button, Card, Form, Input, Radio, RadioChangeEvent, message } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { Client, Frame, over } from 'stompjs';
import SockJS from "sockjs-client/dist/sockjs";
import ManLogo from '../../assets/man.png';
import ChatroomLogo from '../../assets/group.png';
import { ChatMessage, CHAT_ROOM, FormType, UserDataType, GenderEnum, MessageStatus, PositionMessType } from "../../utils/helper";

const { Item } = Form;
let stompClient: Client | null = null;
const ChatPage = () => {
  const [privateChats, setPrivateChats] = useState(new Map<string, ChatMessage[]>());
  const [publicChats, setPublicChats] = useState<ChatMessage[]>([]);
  const [tab, setTab] = useState(CHAT_ROOM);
  const [form] = useForm<FormType>();

  const [userData, setUserData] = useState<UserDataType>({
    username: '',
    gender: GenderEnum.MALE,
    receiverName: '',
    connected: false,
    message: ''
  });
  const WS_URL = import.meta.env.VITE_WS_URL as string;

  const connect = () => {
    const sock = new SockJS(WS_URL);
    stompClient = over(sock);
    stompClient.connect({}, onConnected, onError);
  };

  const onConnected = () => {
    setUserData(prev => ({
      ...prev,
      connected: true
    }));
    if (!stompClient) return;
    stompClient.subscribe('/mychatroom/public', onMessageReceived);
    stompClient.subscribe(`/mychatuser/${userData.username}/private`, onPrivateMessageReceived);
    userJoin();
  };

  const onError = (err: string | Frame) => {
    setUserData(prev => ({
      ...prev,
      connected: false
    }));
    console.log('Error', err);
  };

  const userJoin = () => {
    const chatMessage: ChatMessage = {
      senderName: userData.username,
      status: MessageStatus.JOIN
    };
    if (!stompClient) return;
    console.log('user joining', userData);
    stompClient.send('/mychatapp/message', {}, JSON.stringify(chatMessage));
    stompClient?.send('/mychatapp/mychatuser.addUser', {}, JSON.stringify({ nickName: userData.username, status: 'ONLINE' }));
  };

  const onMessageReceived = (payload: { body: string; }) => {
    console.log('onMessageReceived::payload', payload);
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
    console.log('onPrivateMessageReceived::payload', payload);
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

  // const handleMessage = (event: { target: { value: string; }; }) => {
  //   const { value } = event.target;
  //   setUserData({
  //     ...userData,
  //     message: value
  //   });
  // };

  const sendValue = () => {
    console.log('sendValue', stompClient);
    if (stompClient) {
      const chatMessage: ChatMessage = {
        senderName: userData.username,
        message: userData.message,
        status: MessageStatus.MESSAGE
      };
      console.log('Sending message', chatMessage);
      stompClient.send('/mychatapp/message', {}, JSON.stringify(chatMessage));
      setUserData(prev => ({ ...prev, message: '' }));
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
      stompClient.send("/mychatapp/private-message", {}, JSON.stringify(chatMessage));
      setUserData(prev => ({ ...prev, "message": "" }));
    }
  };

  const handleUsername = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setUserData(prev => ({
      ...prev,
      username: value
    }));
  };

  const handleGender = (event: RadioChangeEvent) => {
    const { value } = event.target;
    setUserData(prev => ({
      ...prev,
      gender: value
    }));
  };

  const onFinish = (values: FormType) => {
    message.info(`Welcome to The TriBook! ${values.username}`);
    setUserData(prev => ({
      ...prev,
      username: values.username,
      gender: values.gender
    }));
    connect();
  };

  const handleMessageType = (val: string) => {
    setUserData(prev => ({
      ...prev,
      message: val
    }));
  };

  const getChatList = (tabStr: string) => (tabStr === CHAT_ROOM ? publicChats : [...privateChats.get(tab) ?? []]);

  useEffect(() => {
    console.log('tab', tab);
  }, [tab]);

  return (
    <>
      {userData.connected === true ? (
        <div style={{ position: "relative", height: "70vh", width: "100vw" }}>
          <MainContainer
            responsive
            style={{
            }}
          >
            <Sidebar
              position="left"
            >
              <Search placeholder="Search..." />
              <ConversationList>
                <Conversation
                  info="Amen..."
                  lastSenderName="Trisus"
                  name="Chatroom"
                  onClick={() => setTab(CHAT_ROOM)}
                >
                  <Avatar
                    name="Chatroom"
                    src={ChatroomLogo}
                    status={tab === CHAT_ROOM ? 'available' : 'dnd'}
                  />
                  <Conversation.Operations>
                    <InfoButton />
                  </Conversation.Operations>
                </Conversation>
                {[...privateChats.keys()].map((val, idx) => {
                  return (
                    <Conversation
                      info="just a sample message..."
                      lastSenderName={val}
                      name={val}
                      onClick={() => setTab(val)}
                      key={`${idx}-${val}`}
                    >
                      <Avatar
                        name={val}
                        src={ManLogo}
                        status={tab === val ? 'available' : 'dnd'}
                      />
                      <Conversation.Operations>
                        <VoiceCallButton />
                        <VideoCallButton />
                        <InfoButton />
                      </Conversation.Operations>
                    </Conversation>
                  );
                })}

              </ConversationList>
            </Sidebar>
            <ChatContainer>
              <ConversationHeader>
                <ConversationHeader.Back />
                <Avatar
                  name={tab}
                  src="https://chatscope.io/storybook/react/assets/zoe-E7ZdmXF0.svg"
                />
                <ConversationHeader.Content
                  // info="Active 10 mins ago"
                  userName="Zoe"
                />
                <ConversationHeader.Actions>
                  <VoiceCallButton />
                  <VideoCallButton />
                  <InfoButton />
                </ConversationHeader.Actions>
              </ConversationHeader>
              <MessageList typingIndicator={<TypingIndicator content="Zoe is typing" />}>
                {/* <MessageSeparator content="Saturday, 30 November 2019" /> */}
                {getChatList(tab).map((chat, index) => {
                  const position = index === 0
                    ? 'first'
                    : index === getChatList(tab).length - 1 ? 'last' : 'middle' as PositionMessType;
                  return (
                    <Message
                      avatarSpacer
                      key={index}
                      model={{
                        direction: chat.senderName === userData.username ? 'outgoing' : 'incoming',
                        message: chat.message,
                        position: position,
                        sender: chat.senderName,
                        sentTime: chat.date
                      }}
                    >
                      <Avatar
                        name={chat.senderName}
                        src={ManLogo}
                      />
                    </Message>
                  );
                })}
              </MessageList>
              <MessageInput
                placeholder="Type message here"
                onChange={(e) => handleMessageType(e)}
                onSend={tab === CHAT_ROOM ? sendValue : sendPrivateValue}
              />
            </ChatContainer>
            {/* <ChatRightSideBar /> */}
          </MainContainer>
        </div>
      ) : (
        <Card title={<div style={{ textAlign: 'center' }}>Sign up to Chat</div>}>
          <Form<FormType>
            form={form}
            name='signup-chat-form'
            style={{
              maxWidth: 600,
            }}
            initialValues={{
              gender: GenderEnum.MALE
            } as FormType}
            variant='filled'
            onFinish={onFinish}
            autoComplete='off'
          >
            <Item<FormType>
              label='Username'
              name='username'
              rules={[{ required: true, message: 'Please input your username' }]}
            >
              <Input
                type='text'
                placeholder='Username...'
                onChange={handleUsername}
              />
            </Item>
            <Item<FormType>
              label='Gender'
              name='gender'
              rules={[{ required: true, message: 'Please input your gender' }]}
            >
              <Radio.Group
                onChange={handleGender}
              >
                <Radio value={GenderEnum.MALE}>Male</Radio>
                <Radio value={GenderEnum.FEMALE}>Female</Radio>
              </Radio.Group>
            </Item>
            <Item>
              <Button
                type='primary'
                htmlType='submit'
                style={{
                  width: '100%',
                }}
              >
                Go Chat
              </Button>
            </Item>
          </Form>
        </Card>
      )}
    </>
  );
};

export default ChatPage;