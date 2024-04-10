package com.examplebe.demo.learnwebsocket.chatuser;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

public interface ChatUserRepository extends MongoRepository<ChatUser, String> {

    List<ChatUser> findAllByStatus(Status online);
}
