package com.example.demo.redis.controller;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.redis.entity.Book;
import com.example.demo.redis.entity.Category;
import com.example.demo.redis.repo.BookRepository;
import com.example.demo.redis.repo.CategoryRepository;

import lombok.RequiredArgsConstructor;
import redis.clients.jedis.search.RediSearchCommands;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/books")
public class BookController {
    private final BookRepository bookRepository;
    private final CategoryRepository categoryRepository;

    @GetMapping("")
    public ResponseEntity<Map<String, Object>> all(
            @RequestParam(defaultValue = "0") Integer page,
            @RequestParam(defaultValue = "10") Integer size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Book> pagedResult = bookRepository.findAll(pageable);
        List<Book> books = pagedResult.hasContent()
                ? pagedResult.getContent()
                : Collections.emptyList();
        var res = new HashMap<String, Object>();
        res.put("books", books);
        res.put("page", pagedResult.getNumber());
        res.put("pages", pagedResult.getTotalPages());
        res.put("total", pagedResult.getTotalElements());
        res.put("etc", pagedResult);
        return ResponseEntity.ok().body(res);
    }

    @GetMapping("/categories")
    public Iterable<Category> categories() {
        return categoryRepository.findAll();
    }

    @GetMapping("/{id}")
    public Book getBookById(@PathVariable String id) {
        var bookOpt = bookRepository.findById(id);
        if (bookOpt.isPresent()) {
            return bookOpt.get();
        }
        return null;
    }

}
