package com.example.demo.redis.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.OptionalLong;
import java.util.stream.LongStream;

import org.springframework.stereotype.Service;

import com.example.demo.redis.entity.Book;
import com.example.demo.redis.entity.Cart;
import com.example.demo.redis.entity.CartItem;
import com.example.demo.redis.entity.User;
import com.example.demo.redis.repo.BookRepository;
import com.example.demo.redis.repo.CartRepository;
import com.example.demo.redis.repo.UserRepository;
import com.redislabs.modules.rejson.JReJSON;
import com.redislabs.modules.rejson.Path;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CartService {
    private final CartRepository cartRepository;
    private final BookRepository bookRepository;
    private final UserRepository userRepository;
    private JReJSON redisJson = new JReJSON();
    Path cartItemsPath = Path.of(".cartItems");

    public Cart get(String id) {
        Optional<Cart> cartOpt = cartRepository.findById(id);
        if (cartOpt.isPresent()) {
            return cartOpt.get();
        }
        return null;
    }

    public void addToCart(String id, CartItem item) {
        Optional<Book> book = bookRepository.findById(item.getId());
        if (book.isPresent()) {
            String cartKey = CartRepository.getKey(id);
            item.setPrice(book.get().getPrice());
            redisJson.arrAppend(cartKey, cartItemsPath, item);
        }
    }

    public void removeFromCart(String id, String isbn) {
        Optional<Cart> cartFinder = cartRepository.findById(id);
        if (cartFinder.isPresent()) {
            Cart cart = cartFinder.get();
            String cartKey = CartRepository.getKey(cart.getId());
            List<CartItem> cartItems = new ArrayList<CartItem>(cart.getCartItems());
            OptionalLong cartItemIndex = LongStream.range(0, cartItems.size())
                    .filter(i -> cartItems.get((int) i).getId().equals(isbn)).findFirst();
            if (cartItemIndex.isPresent()) {
                redisJson.arrPop(cartKey, CartItem.class, cartItemsPath, cartItemIndex.getAsLong());
            }
        }
    }

}
