package com.examplebe.demo.chat;

import java.io.Serializable;

record Message(
        String senderName,
        String receiverName,
        String message,
        String date,
        Status status) implements Serializable {
}
