package com.example.demo.redis.repo;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.redis.entity.BookRating;

@Repository
public interface BookRatingRepository extends CrudRepository<BookRating, String> {

}
