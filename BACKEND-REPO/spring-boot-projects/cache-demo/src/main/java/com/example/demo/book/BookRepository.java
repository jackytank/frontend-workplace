package com.example.demo.book;

import org.springframework.stereotype.Repository;

@Repository
public interface BookRepository {
    Book getByIsbn(String isbn);
}
