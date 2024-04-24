package com.demo.learnwebsocket.user;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Document(collection = "users")
public class wsUser {
    @Id
    private String nickName;
    private Status status;
    
}
