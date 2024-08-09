package com.example.demo.redis.repo;

import org.springframework.stereotype.Repository;

import com.example.demo.redis.entity.Book;

import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.PagingAndSortingRepository;

@Repository
public interface BookRepository extends PagingAndSortingRepository<Book, String>, CrudRepository<Book, String> {

}
