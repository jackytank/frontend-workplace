package com.demo.learnwebsocket.user;

import java.util.List;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository chatUserRepository;

    public void saveUser(User chatUser) {
        chatUser.setStatus(Status.ONLINE);
        chatUserRepository.save(chatUser);
    }

    public void disconnect(User chatUser) {
        var existedUser = chatUserRepository.findById(chatUser.getNickName())
                .orElse(null);
        if (existedUser == null) {
            return;
        }
        existedUser.setStatus(Status.OFFLINE);
        chatUserRepository.save(existedUser);
    }

    public List<User> findConnectedUsers() {
        return chatUserRepository.findAllByStatus(Status.ONLINE);
    }

}
