// package com.example.demo;

// import org.springframework.boot.CommandLineRunner;
// import org.springframework.stereotype.Component;

// import com.example.demo.book.BookRepository;

// import lombok.RequiredArgsConstructor;
// import lombok.extern.slf4j.Slf4j;

// @Slf4j
// @RequiredArgsConstructor
// @Component
// public class AppRunner implements CommandLineRunner {

//   private final BookRepository bookRepository;

//   @Override
//   public void run(String... args) throws Exception {
//     log.info(".... Fetching books");
//     log.info("isbn-1234 -->" + bookRepository.getByIsbn("isbn-1234"));
//     log.info("isbn-4567 -->" + bookRepository.getByIsbn("isbn-4567"));
//     log.info("isbn-1234 -->" + bookRepository.getByIsbn("isbn-1234"));
//     log.info("isbn-4567 -->" + bookRepository.getByIsbn("isbn-4567"));
//     log.info("isbn-1234 -->" + bookRepository.getByIsbn("isbn-1234"));
//     log.info("isbn-1234 -->" + bookRepository.getByIsbn("isbn-1234"));
//   }

// }
