import { Avatar, ChatContainer, Conversation, ConversationHeader, ConversationList, MainContainer, Message, MessageGroup, MessageInput, MessageList, Sidebar, TypingIndicator } from '@chatscope/chat-ui-kit-react';
import { ChatMessage, MessageContent, MessageContentType, MessageDirection, MessageStatus, TextContent, User, useChat } from '@chatscope/use-chat';
import { useCallback, useEffect, useMemo } from 'react';
import ManLogo from '../../../assets/man.png';

const ImprovChat = ({ user }: { user: User; }) => {
  const { currentMessages, conversations, activeConversation, setActiveConversation,
    sendMessage, getUser, currentMessage, setCurrentMessage, sendTyping, setCurrentUser } = useChat();
  useEffect(() => {
    // in the current user, add the public Chatroom that anyone can chat to

  }, []);

  useEffect(() => {
    setCurrentUser(user);
  }, [user, setCurrentUser]);

  const [currentUserAvatar, currentUsername] = useMemo(() => {
    if (activeConversation) {
      const participant = activeConversation.participants.length > 1 ? activeConversation.participants[0] : undefined;
      if (participant) {
        const user = getUser(participant.id);
        if (user) {
          return [<Avatar src={ManLogo} />, user.username];
        }
      }
    }
    return [undefined, undefined];
  }, [activeConversation, getUser]);

  const handleChange = (value: string) => {
    setCurrentMessage(value);
    if (activeConversation) {
      sendTyping({
        conversationId: activeConversation.id,
        isTyping: true,
        userId: user.id,
        content: value,
        throttle: true
      });
    }
  };

  const handleSend = (text: string) => {
    const message = new ChatMessage({
      id: '',
      content: text as unknown as MessageContent<TextContent>,
      contentType: MessageContentType.TextHtml,
      senderId: user.id,
      direction: MessageDirection.Outgoing,
      status: MessageStatus.Sent
    });

    if (activeConversation) {
      sendMessage({
        message,
        conversationId: activeConversation.id,
        senderId: user.id
      });
    }
  };

  const getTypingIndicator = useCallback(
    () => {
      if (activeConversation) {
        const typingUsers = activeConversation.typingUsers;
        if (typingUsers.length > 0) {
          const typingUserId = typingUsers.items[0].userId;
          // Check if typing user participates in the conversation
          if (activeConversation.participantExists(typingUserId)) {
            const typingUser = getUser(typingUserId);
            if (typingUser) {
              return <TypingIndicator content={`${typingUser.username} is typing`} />;
            }
          }
        }
      }
      return undefined;
    }, [activeConversation, getUser],
  );

  return (
    <MainContainer responsive style={{ position: "relative", height: "70vh", width: "100vw" }}>
      <Sidebar
        position='left'
        scrollable
      >
        <ConversationHeader style={{ backgroundColor: '#fff' }}>
          <ConversationHeader.Back />
          <Avatar
            name={user.username}
            src={user.avatar}
          />
          <ConversationHeader.Content>
            {user.username}
          </ConversationHeader.Content>
        </ConversationHeader>
        <ConversationList>
          {conversations.map((c) => {
            const [avatar, name] = (() => {
              const participant = c.participants.length > 0 ? c.participants[0] : undefined;
              if (participant) {
                const user = getUser(participant.id);
                if (user) {
                  return [<Avatar src={user.avatar} />, user.username];
                }
              }
              return [undefined, undefined];
            })();
            return (
              <Conversation key={c.id}
                name={name}
                info={c.draft ? `Draft: ${c.draft.replace(/<br>/g, "\n").replace(/&nbsp;/g, " ")}` : ``}
                active={activeConversation?.id === c.id}
                unreadCnt={c.unreadCounter}
                onClick={() => setActiveConversation(c.id)}
              >
                {avatar}
              </Conversation>
            );
          })}
        </ConversationList>
      </Sidebar>
      <ChatContainer>
        {activeConversation && (
          <ConversationHeader>
            {currentUserAvatar}
            <ConversationHeader.Content userName={currentUsername} />
          </ConversationHeader>
        )}
        <MessageList typingIndicator={getTypingIndicator()}>
          {activeConversation && currentMessages.map((g) => (
            <MessageGroup key={g.id} direction={g.direction}>
              <MessageGroup.Messages>
                {g.messages.map((m: ChatMessage<MessageContentType>) => <Message key={m.id} model={{
                  type: "html",
                  payload: m.content,
                  direction: m.direction,
                  position: "normal"
                }} />)}
              </MessageGroup.Messages>
            </MessageGroup>
          ))}
        </MessageList>
        <MessageInput
          value={currentMessage}
          onChange={handleChange}
          onSend={handleSend}
          disabled={!activeConversation}
          attachButton={false}
          placeholder="Type here..."
        />
      </ChatContainer>
    </MainContainer>

  );
};

export default ImprovChat;