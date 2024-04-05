package com.examplebe.demo.chat;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Controller
public class ChatController {

    private final SimpMessagingTemplate simpMessagingTemplate;

    @MessageMapping("/message")
    @SendTo("/mychatroom/public")
    public Message sendPublicMessage(@Payload Message message) {
        return message;
    }

    @MessageMapping("/private-message")
    public Message sendPrivateMessage(@Payload Message message) {
        // /myuser/David/private
        simpMessagingTemplate.convertAndSendToUser(message.receiverName(), "/private", message);
        return message;
    }
}
