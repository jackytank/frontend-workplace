/* eslint-disable @typescript-eslint/no-unused-vars */
import { AutoDraft, BasicStorage, ChatProvider, Conversation, ConversationId, ConversationRole, IStorage, Participant, Presence, TypingUsersList, UpdateState, User, UserStatus } from "@chatscope/use-chat";
import { ExampleChatService } from "@chatscope/use-chat/dist/examples";
import { nanoid } from "nanoid";
import ManLogo from '../../assets/man.png';
import GroupLogo from '../../assets/group.png';
import Chat from "./components/ImprovChat";
import { Card, Input, Radio, Button, Form, RadioChangeEvent, message } from "antd";
import { FormType, GenderEnum } from "../../utils/helper";
import { useForm } from "antd/es/form/Form";
import { useEffect, useRef, useState } from "react";
import SockJS from "sockjs-client/dist/sockjs";
import { Client, Frame, over } from "stompjs";
import { MyChatService } from "./components/MyChatService";

const messageIdGenerator = () => nanoid();
const groupIdGenerator = () => nanoid();

const serviceFactory = (storage: IStorage, updateState: UpdateState) => {
    return new MyChatService(storage, updateState);
};

// const namStorage = new BasicStorage({ groupIdGenerator, messageIdGenerator });
// const nuStorage = new BasicStorage({ groupIdGenerator, messageIdGenerator });
const chatroomStorage = new BasicStorage({ groupIdGenerator, messageIdGenerator });

const chatRoom = new User({
    id: "Chatroom",
    presence: new Presence({ status: UserStatus.Available, description: "" }),
    firstName: "",
    lastName: "",
    username: 'Chatroom',
    email: "",
    avatar: GroupLogo,
    bio: ""
});

// const chats = [
//     // { name: "Nam", storage: namStorage },
//     // { name: "Nu", storage: nuStorage },
//     { name: "Chatroom", storage: chatroomStorage },
// ];

// const users = [
//     {
//         name: "Nam",
//         avatar: ManLogo
//     },
//     {
//         name: "Nu",
//         avatar: WomanLogo
//     },
//     {
//         name: "Chatroom",
//         avatar: ManLogo
//     },
// ];

function createConversation(id: ConversationId, name: string): Conversation {
    return new Conversation({
        id,
        participants: [
            new Participant({
                id: name,
                role: new ConversationRole([])
            })
        ],
        unreadCounter: 0,
        typingUsers: new TypingUsersList({ items: [] }),
        draft: ""
    });
}

// chats.forEach(c => {
//     users.forEach(u => {
//         if (u.name !== c.name) {
//             c.storage.addUser(new User({
//                 id: u.name,
//                 presence: new Presence({ status: UserStatus.Available, description: "" }),
//                 firstName: "",
//                 lastName: "",
//                 username: u.name,
//                 email: "",
//                 avatar: u.avatar,
//                 bio: ""
//             }));
//             const conversationId = nanoid();
//             const myConversation = c.storage.getState().conversations.find(cv => typeof cv.participants.find(p => p.id === u.name) !== "undefined");
//             if (!myConversation) {
//                 c.storage.addConversation(createConversation(conversationId, u.name));
//                 const chat = chats.find(chat => chat.name === u.name);
//                 if (chat) {
//                     const hisConversation = chat.storage.getState().conversations.find(cv => typeof cv.participants.find(p => p.id === c.name) !== "undefined");
//                     if (!hisConversation) {
//                         chat.storage.addConversation(createConversation(conversationId, c.name));
//                     }
//                 }
//             }
//         }
//     });
// });

const { Item } = Form;
let stompClient: Client | null = null;

const ImprovedChatPage = () => {
    const [form] = useForm<FormType>();
    const [userData, setUserData] = useState<User & { gender: GenderEnum; }>({
        id: "",
        presence: new Presence({ status: UserStatus.Unknown, description: "" }),
        firstName: "",
        lastName: "",
        username: "",
        email: "",
        avatar: ManLogo,
        bio: "",
        gender: GenderEnum.MALE
    });
    const userStorageRef = useRef(new BasicStorage({ groupIdGenerator, messageIdGenerator }));

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
            gender: values.gender,
            presence: new Presence({ status: UserStatus.Available, description: "" })
        }));
        connect();
        // implement add public chatRoom to the current user conversation
        userStorageRef.current.addUser(chatRoom);
        userStorageRef.current.addConversation(createConversation(chatRoom.id, chatRoom.username));
        chatroomStorage.addConversation(createConversation(chatRoom.id, values.username));
    };

    const WS_URL = 'http://localhost:8080/ws';

    const connect = () => {
        const sock = new SockJS(WS_URL);
        stompClient = over(sock);
        stompClient.connect({}, onConnected, onError);
    };

    const onConnected = () => {
        setUserData(prev => ({
            ...prev,
            presence: new Presence({ status: UserStatus.Available, description: "" })
        }));
        if (!stompClient) return;
        // stompClient.subscribe('/mychatroom/public', onMessageReceived);
        // stompClient.subscribe(`/mychatuser/${userData.username}/private`, onPrivateMessageReceived);
        userJoin();
    };

    const onError = (err: string | Frame) => {
        setUserData(prev => ({
            ...prev,
            presence: new Presence({ status: UserStatus.Dnd, description: "" })
        }));
        console.log('Error', err);
    };

    const userJoin = () => {
        console.log('User join', userData);
        const chatMessage = {
            senderName: userData.username,
            status: 'JOIN'
        };
        if (!stompClient) return;
        console.log('user joining', stompClient);
        stompClient.send('/mychatapp/message', {}, JSON.stringify(chatMessage));
    };

    useEffect(() => {
    }, []);

    return (
        <>
            {userData.presence.status === UserStatus.Available ? (
                <ChatProvider
                    serviceFactory={serviceFactory}
                    storage={userStorageRef.current}
                    config={{
                        typingThrottleTime: 250,
                        typingDebounceTime: 900,
                        debounceTyping: true,
                        autoDraft: AutoDraft.Save | AutoDraft.Restore,
                    }}
                >
                    <Chat user={userData} />
                </ChatProvider>
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

export default ImprovedChatPage;