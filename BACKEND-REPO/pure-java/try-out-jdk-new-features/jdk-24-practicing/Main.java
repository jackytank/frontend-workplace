import java.lang.foreign.Arena;
import java.lang.foreign.FunctionDescriptor;
import java.lang.foreign.Linker;
import java.lang.foreign.MemorySegment;
import java.lang.foreign.SymbolLookup;
import java.lang.foreign.ValueLayout;
import java.lang.invoke.MethodHandle;

import dto.AnimalCareTaker;

void main() {
    // jep488PrimitiveTypesInPatternsInstanceofAndSwitchSecondPreview();
    // jep492FlexibleConstructorBodiesThirdPreview();
    // jep485StreamGatherers();
    jep454ForeignFunctionAndMemoryAPIFinal_C_strlen();
    // jep456UnnamedVariablesAndPatterns(23);
}

void jep485StreamGatherers() {
    
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
