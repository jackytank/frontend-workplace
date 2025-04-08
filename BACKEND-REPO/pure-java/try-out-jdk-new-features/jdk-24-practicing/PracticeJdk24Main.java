import java.lang.foreign.Arena;
import java.lang.foreign.FunctionDescriptor;
import java.lang.foreign.Linker;
import java.lang.foreign.MemorySegment;
import java.lang.foreign.SymbolLookup;
import java.lang.foreign.ValueLayout;
import java.lang.invoke.MethodHandle;
import java.util.LinkedList;
import java.util.List;
import java.util.function.Predicate;
import java.util.stream.Collectors;
import java.util.stream.Gatherers;

import dto.AnimalCareTaker;
import utils.MyUtils;

void main() {
    // jep488PrimitiveTypesInPatternsInstanceofAndSwitchSecondPreview();
    // jep492FlexibleConstructorBodiesThirdPreview();
    jep485StreamGatherers();
    // jep454ForeignFunctionAndMemoryAPIFinal_C_strlen();
    // jep456UnnamedVariablesAndPatterns(23);
}

void jep485StreamGatherers() {
    // Example 1: Gatherers.windowFixed() - You have a stream of sensor readings
    // taken sequentially. You want to process these readings in non-overlapping
    // batches (windows) of a fixed size (e.g., groups of 3 readings at a time) to
    // perform analysis on each batch.
    final var result1 = List.of("Jakarta", "", "EE", "will", "be", "released", "", "soon", "!")
            .stream()
            .filter(Predicate.not(String::isBlank))
            .gather(Gatherers.windowFixed(2))
            .collect(Collectors.toCollection(LinkedList::new));
    // expected: [[Jakarta, EE], [will, be], [released, soon], [!]]
    System.out.println(result1);

    // Example 2: Gatherers windowSliding() - multiply all elements
    final var result2 = List.of(1, 2, 3, 4, 5)
            .stream()
            .gather(Gatherers.fold(() -> 1, (a, b) -> a * b))
            .collect(Collectors.toCollection(LinkedList::new));
    // expected: [120]
    // Conclude: just like .reduce() but not return Optional
    System.out.println(result2);

    // Example 3: Gatherers.windowSliding() - You have a stream of daily stock
    // prices. You need to calculate the 3-day simple moving average. This requires
    // looking at a sliding window of prices (days 1-2-3, then days 2-3-4, then days
    // 3-4-5, etc.).
    final var result3 = List.of(100.0, 102.5, 101.0, 103.0, 105.5, 104.0)
            .stream()
            .gather(Gatherers.windowSliding(3));
    result3.forEach(window -> {
        final double sum = window.stream().mapToDouble(Double::doubleValue).sum();
        final double average = window.isEmpty() ? 0 : sum / window.size();
        System.out.printf("Window: %-15s Average: %.2f%n", window, average);
    });

    // Example 4: We need to ensure safe distribution of wolves, sheep, and
    // sheepdogs, avoiding any sequence of three that includes a wolf and a sheep
    // without a sheepdog. We'll start by defining these types with an enum.
    var validSequence = List.of(MyUtils.Animal.SHEEP, MyUtils.Animal.SHEEPDOG, MyUtils.Animal.WOLF,
            MyUtils.Animal.WOLF);
    validSequence.stream()
            .gather(MyUtils.isValidSeq())
            .forEach(seq -> {
                System.out.println("Valid sequence: " + seq);
            });
    var invalidSequence = List.of(MyUtils.Animal.SHEEPDOG, MyUtils.Animal.SHEEP,
            MyUtils.Animal.WOLF, MyUtils.Animal.WOLF);
    invalidSequence.stream()
            .gather(MyUtils.isValidSeq())
            .forEach(seq -> {
                System.out.println("Invalid sequence: " + seq);
            });

    // Example 5: Gatherers.scan
    var blogPostTitles = List.of("Java 21", "Java 22", "Java 23");
    blogPostTitles.stream()
            .gather(Gatherers.scan(
                    () -> "scan - Java JDK versions: ", (res, title) -> res + title + ", "))
            .forEach(System.out::println);

    blogPostTitles.stream()
            .gather(Gatherers.fold(() -> "fold - Java JDK versions: ", (res, title) -> res + title + ", "))
            .forEach(System.out::println);

}

void jep456UnnamedVariablesAndPatterns(final Object obj) {
    record User(String name, int age) {
    }
    // Example 1: Unnamed variables in patterns
    try {
        if (obj instanceof String _) { // _ is an unnamed variable
            System.out.println("obj is a String");
        } else {
            System.out.println("obj is not a String");
            // try to parse the object as a Integer
            final var integer = Integer.parseInt(obj.toString());
            System.out.println("obj is an Integer: " + integer);
        }
    } catch (NumberFormatException _) { // _ is an unnamed variable
        System.out.println("obj is not an Integer");
    }
    // Example 2: Unnamed variables in enhanced for loop
    int itemCount = 0;
    for (final String _ : List.of("Hello", "World")) {
        itemCount++;
    }
    System.out.println("Item count: " + itemCount);

    // Example 3: Unnamed variables in record patterns
    Object user = new User("John", 30);
    if (user instanceof User(String name, _)) { // _ is an unnamed variable
        System.out.println("User name: " + name);
    }

    // Example 4: Unnamed variables in switch expressions
    final var value = switch (obj) {
        case String _ -> "String";
        case Integer _ -> "Integer";
        case int _ -> "int";
        default -> "Unknown";
    };
    System.out.println("Value: " + value);
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

void jep454ForeignFunctionAndMemoryAPIFinal_C_strlen() {
    final String C_METHOD_STRLEN = "strlen";
    // Example 1: Foreign Function API
    final Linker linker = Linker.nativeLinker();
    final SymbolLookup stdlib = linker.defaultLookup();
    final MemorySegment strlen_address = stdlib.find(C_METHOD_STRLEN)
            .orElseThrow(() -> new UnsatisfiedLinkError("Cannot find " + C_METHOD_STRLEN + " in stdlib"));

    // define function signature: strlen(char*) -> long
    // Java: long strlen(String str)
    final FunctionDescriptor strlen_descriptor = FunctionDescriptor.of(
            ValueLayout.JAVA_LONG, // return type
            ValueLayout.ADDRESS // char*
    );

    // call the native method
    final MethodHandle strlen_handle = linker.downcallHandle(strlen_address, strlen_descriptor);

    // allocate off-heap memory and copy a Java String into it (null-terminated
    // C-string)
    final String java_string = "Hello, World!";
    try (final Arena arena = Arena.ofConfined()) {
        final MemorySegment c_string = arena.allocateFrom(java_string + '\0');// allocate and copy with null
        // invoke c method
        try {
            final long length = (long) strlen_handle.invokeExact(c_string);
            System.out.println("Length of C-string: " + length);
        } catch (Throwable e) {
            System.out.println("Error invoking strlen");
            e.printStackTrace();
        }
    }
}
