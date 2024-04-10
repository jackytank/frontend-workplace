package com.examplebe.demo.learnwebsocket.chatuser;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Document(collection = "users")
public class ChatUser {
    @Id
    private String nickName;
    private Status status;
    
}
