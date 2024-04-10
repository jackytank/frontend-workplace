package com.examplebe.demo.websocket.chat;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
public class ChatController {

    @Autowired
    private SimpMessagingTemplate simpMessagingTemplate;

    @MessageMapping("/message")
    @SendTo("/mychatroom/public")
    public Message receiveMessage(@Payload Message message) {
        System.out.println("Public: " + message.toString());
        return message;
    }

    @SuppressWarnings("null")
    @MessageMapping("/private-message")
    public Message recMessage(@Payload Message message) {
        simpMessagingTemplate.convertAndSendToUser(message.receiverName(), "/private", message);
        System.out.println("Private: " + message.toString());
        return message;
    }
}
