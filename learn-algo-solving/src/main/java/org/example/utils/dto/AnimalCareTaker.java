package org.example.utils.dto;

import java.time.LocalDateTime;
import java.util.Objects;

class CareTaker {
    private LocalDateTime start;

    public CareTaker(LocalDateTime start) {
        this.start = start;
    }
}

public class AnimalCareTaker extends CareTaker {
    public AnimalCareTaker(LocalDateTime start) {
        // JDK 24: now we can validate the input before calling the super constructor
        Objects.requireNonNull(start, "start must not be null");
        super(start);
    }
}
