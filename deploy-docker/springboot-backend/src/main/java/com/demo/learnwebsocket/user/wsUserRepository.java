package com.demo.learnwebsocket.user;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

public interface wsUserRepository extends MongoRepository<wsUser, String> {

    List<wsUser> findAllByStatus(Status online);
}
