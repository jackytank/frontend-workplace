package com.cipherian.cipherianmongodb.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import com.cipherian.cipherianmongodb.model.User;


public interface UserRepository extends MongoRepository<User, Integer> {

}
