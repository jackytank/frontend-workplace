package com.examplebe.demo.learnwebsocket.chatuser;

import java.util.List;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ChatUserService {

    private final ChatUserRepository chatUserRepository;

    public void saveUser(ChatUser chatUser) {
        chatUser.setStatus(Status.ONLINE);
        chatUserRepository.save(chatUser);
    }

    public void disconnect(ChatUser chatUser) {
        var existedUser = chatUserRepository.findById(chatUser.getNickName())
                .orElse(null);
        if (existedUser == null) {
            return;
        }
        existedUser.setStatus(Status.OFFLINE);
        chatUserRepository.save(existedUser);
    }

    public List<ChatUser> findConnectedUsers() {
        return chatUserRepository.findAllByStatus(Status.ONLINE);
    }

}
