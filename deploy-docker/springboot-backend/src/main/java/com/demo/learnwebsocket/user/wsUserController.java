package com.demo.learnwebsocket.user;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

import lombok.RequiredArgsConstructor;

@Controller
@RequiredArgsConstructor
public class wsUserController {
    private final wsUserService chatUserService;

    @MessageMapping("/mychatuser.addUser")
    @SendTo("/mychatroom/public")
    public wsUser saveUser(@Payload wsUser chatUser) {
        chatUserService.saveUser(chatUser);
        var users = chatUserService.findConnectedUsers();
        users.forEach(System.out::println);
        return chatUser;
    }

    @MessageMapping("/mychatuser.disconnectUser")
    @SendTo("/mychatroom/public")
    public wsUser disconnect(@Payload wsUser chatUser) {
        chatUserService.disconnect(chatUser);
        return chatUser;
    }
}
