import {
  Avatar, ChatContainer, ConversationHeader, InfoButton, MainContainer, Message, MessageInput, MessageList, MessageSeparator,
  TypingIndicator, VideoCallButton, VoiceCallButton
} from "@chatscope/chat-ui-kit-react";
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import ChatLeftSideBar from "./components/ChatLeftSideBar";
import ChatRightSideBar from "./components/ChatRightSideBar";


const ChatPage = () => {
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
        <ChatRightSideBar />
      </MainContainer>
    </div>
  );
};

export default ChatPage;