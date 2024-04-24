package com.demo.learnwebsocket.user;

import java.util.List;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class wsUserService {

    private final wsUserRepository chatUserRepository;

    public void saveUser(wsUser chatUser) {
        chatUser.setStatus(Status.ONLINE);
        chatUserRepository.save(chatUser);
    }

    public void disconnect(wsUser chatUser) {
        var existedUser = chatUserRepository.findById(chatUser.getNickName())
                .orElse(null);
        if (existedUser == null) {
            return;
        }
        existedUser.setStatus(Status.OFFLINE);
        chatUserRepository.save(existedUser);
    }

    public List<wsUser> findConnectedUsers() {
        return chatUserRepository.findAllByStatus(Status.ONLINE);
    }

}
