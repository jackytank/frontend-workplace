package com.examplebe.demo.learnwebsocket.chatuser;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

import lombok.RequiredArgsConstructor;

@Controller
@RequiredArgsConstructor
public class ChatUserController {
    private final ChatUserService chatUserService;

    @MessageMapping("/mychatuser.addUser")
    @SendTo("/mychatuser/topic")
    public ChatUser saveUser(@Payload ChatUser chatUser) {
        chatUserService.saveUser(chatUser);
        return chatUser;
    }

    @MessageMapping("/mychatuser.disconnectUser")
    @SendTo("/mychatuser/topic")
    public ChatUser disconnect(@Payload ChatUser chatUser) {
        chatUserService.disconnect(chatUser);
        return chatUser;
    }
}
