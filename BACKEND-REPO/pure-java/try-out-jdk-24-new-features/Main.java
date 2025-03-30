import dto.AnimalCareTaker;

void main() {
    jep488PrimitiveTypesInPatternsInstanceofAndSwitchSecondPreview();
    jep492FlexibleConstructorBodiesThirdPreview();
}

void jep485StreamGatherers() {
    
}

void jep492FlexibleConstructorBodiesThirdPreview() {
    final var animalCareTaker = new AnimalCareTaker(LocalDateTime.now());
}

void jep488PrimitiveTypesInPatternsInstanceofAndSwitchSecondPreview() {
    final var value = 42;
    if (value instanceof int i) {
        System.out.println("value is an int: " + i);
    }

    switch (value) {
        case byte b -> System.out.println("value is a byte: " + b);
        case short s -> System.out.println("value is a short: " + s);
        case int i -> System.out.println("value is an int: " + i);
        case long l -> System.out.println("value is a long: " + l);
        case float f -> System.out.println("value is a float: " + f);
        case double d -> System.out.println("value is a double: " + d);
    }
}
