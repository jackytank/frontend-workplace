package com.example.demo.redis;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import com.example.demo.redis.entity.Book;
import com.example.demo.redis.entity.Category;
import com.example.demo.redis.repo.BookRepository;
import com.example.demo.redis.repo.CategoryRepository;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.github.javafaker.Faker;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@Order(3)
@RequiredArgsConstructor
@Slf4j
public class CreateBooksCmd implements CommandLineRunner {

    private final BookRepository bookRepository;

    private final CategoryRepository categoryRepository;

    @Override
    public void run(String... args) throws Exception {
        if (bookRepository.count() == 0) {
            Faker faker = new Faker();
            for (int i = 0; i < 2; i++) {
                Book book = new Book();
                book.setPageCount(100L);
                book.setThumbnail(faker.internet().image());
                book.setPrice(1000D);
                book.setSubtitle(faker.book().title());
                book.setDescription(faker.lorem().paragraph());
                book.setLanguage("en");
                book.setCurrency("USD");
                book.setTitle(faker.book().title());
                book.setInfoLink(faker.internet().url());
                book.setAuthors(Set.of(faker.book().author(), faker.book().author()));

                Category category1 = new Category();
                category1.setName(faker.book().genre());
                categoryRepository.save(category1);
                Category category2 = new Category();
                category2.setName(faker.book().genre());
                categoryRepository.save(category2);

                book.setCategories(Set.of(category1, category2));
                bookRepository.save(book);
            }
        }
    }

}
