package com.example.demo.redis;

import java.util.Random;
import java.util.stream.IntStream;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;

import com.example.demo.redis.entity.Book;
import com.example.demo.redis.entity.BookRating;
import com.example.demo.redis.entity.User;
import com.example.demo.redis.repo.BookRatingRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@RequiredArgsConstructor
@Order(4)
@Slf4j
public class CreateBookRatingCmd implements CommandLineRunner {

    @Value("${app.numberOfRatings}")
    private Integer numberOfRatings;

    @Value("${app.ratingStars}")
    private Integer ratingStars;

    private final RedisTemplate<String, String> tmp;

    private final BookRatingRepository bookRatingRepository;

    @Override
    public void run(String... args) throws Exception {
        if (bookRatingRepository.count() == 0) {
            Random random = new Random();
            IntStream.range(0, numberOfRatings).forEach(e -> {
                String bookId = tmp.opsForSet().randomMember(Book.class.getName());
                String userId = tmp.opsForSet().randomMember(User.class.getName());
                int stars = random.nextInt(ratingStars) + 1;

                User user = new User();
                user.setId(userId);

                Book book = new Book();
                book.setId(bookId);

                BookRating bookRating = new BookRating();
                bookRating.setBook(book);
                bookRating.setUser(user);
                bookRating.setRating(stars);
                bookRatingRepository.save(bookRating);
            });

            log.info(">>>> BookRating created...");
        }
    }

}
