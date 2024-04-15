package com.demo.learnwebsocket.chat;

import java.io.Serializable;

record Message(
                String senderName,
                String receiverName,
                String message,
                String date,
                ChatStatus status) implements Serializable {
}
