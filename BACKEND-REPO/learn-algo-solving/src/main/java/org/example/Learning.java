package org.example;

import java.util.*;
import java.util.concurrent.*;
import java.util.function.*;
import java.util.stream.*;

import org.example.utils.Helpers;
import org.example.utils.Helpers.Node;
import org.example.utils.dto.AnimalCareTaker;
import org.jgrapht.Graph;
import org.jgrapht.alg.interfaces.ShortestPathAlgorithm.SingleSourcePaths;
import org.jgrapht.alg.shortestpath.DijkstraShortestPath;
import org.jgrapht.graph.DefaultDirectedGraph;
import org.jgrapht.graph.DefaultEdge;
import org.jgrapht.traverse.DepthFirstIterator;
import lombok.*;
import static java.util.Map.Entry.*;
import static java.util.stream.Collectors.*;
import java.io.*;
import java.lang.foreign.*;
import java.lang.invoke.MethodHandle;
import java.math.*;
import static java.nio.charset.StandardCharsets.*;
import java.nio.file.*;
import java.text.*;
import java.time.LocalDateTime;

public class Learning {
    public static void main(String[] args) {
        // do something
    }
}

class JavaFileIO {
    public static void main(String[] args) {
        // accessingResourcesUsingPaths();
        accessingResourcesUsingClazz();
    }

    @SneakyThrows(IOException.class)
    static void accessingResourcesUsingClazz() {
        @Cleanup
        final var is = JavaFileIO.class.getResourceAsStream("/mockdata/data.csv");
        if (is == null) {
            throw new IOException("Resource not found: /mockdata/data.csv");
        }
        // read all lines from the input stream
        @Cleanup
        final var reader = new BufferedReader(new InputStreamReader(is, UTF_8));
        // deserialize each line to Employee object
        final List<Employee> employees = reader.lines()
                .skip(1)
                .map(Employee::fromCsvLine)
                .toList();
        // print out the employees
        employees.forEach(System.out::println);
    }

    static void accessingResourcesUsingPaths() {
        // 1. read data.csv then deserialize it to a List Employee (use Path)
        final Path dataCsvFile = Paths.get("src", "main", "resources", "mockdata", "data.csv");
        // read all lines from the file
        try (final Stream<String> lines = Files.lines(dataCsvFile)) {
            // deserialize each line to Employee object
            // ignore header line
            final List<Employee> employees = lines.skip(1)
                    .map(Employee::fromCsvLine)
                    .toList();
            // print out the employees
            employees.forEach(System.out::println);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private record Employee(long employeeId, String name, short age) {
        public static Employee fromCsvLine(final String line) {
            final String[] parts = line.split(",");
            return new Employee(
                    Long.parseLong(parts[0].trim()),
                    parts[1].trim(),
                    Short.parseShort(parts[2].trim()));
        }
    }
}

class Boxing {
    public static void main(String[] args) {
        testIntegerCache();
    }

    static void testIntegerCache() {
        final Integer a = 127;
        final Integer b = 127;
        System.out.println(a == b); // true, because of Integer cache
        // best practice to compare Integer
        System.out.println(a.equals(b)); // true, because we compare the value
        final Integer c = 128;
        final Integer d = 128;
        System.out.println(c == d); // false, because of no Integer cache
        // best practice to compare Integer
        System.out.println(c.equals(d)); // true, because we compare the value
    }
}

class Jdk24NewFeatures {
    public static void main(String[] args) {
        // jep485StreamGatherers_1();
        // jep456UnnamedVariablesAndPatterns("Hello");
        // jep492FlexibleConstructorBodiesThirdPreview();
        // jep488PrimitiveTypesInPatternsInstanceofAndSwitchSecondPreview();
        // jep454ForeignFunctionAndMemoryAPIFinal_C_strlen();
    }

    void jep485StreamGatherers_1() {
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
        var validSequence = List.of(Helpers.Animal.SHEEP, Helpers.Animal.SHEEPDOG, Helpers.Animal.WOLF,
                Helpers.Animal.WOLF);
        validSequence.stream()
                .gather(Helpers.isValidSeq())
                .forEach(seq -> {
                    System.out.println("Valid sequence: " + seq);
                });
        var invalidSequence = List.of(Helpers.Animal.SHEEPDOG, Helpers.Animal.SHEEP,
                Helpers.Animal.WOLF, Helpers.Animal.WOLF);
        invalidSequence.stream()
                .gather(Helpers.isValidSeq())
                .forEach(seq -> {
                    System.out.println("Invalid sequence: " + seq);
                });

        // Example 5: Gatherers.scan just like reduce but return all intermediate
        // Gatherers.fold just like reduce but return only the final result
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
        System.out.println("AnimalCareTaker: " + animalCareTaker);
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
}

@SuppressWarnings("java:S106")
class LearnDSA {
    public static void main(String[] args) {
        // complexGraphDfsExample();
        jgraphtExample1();
    }

    public static void jgraphtExample1() {
        final List<Node<String>> nodes = Helpers.createComplexGraph();
        // using jgrapht
        final Graph<String, DefaultEdge> graph = new DefaultDirectedGraph<>(DefaultEdge.class);

        // Add all nodes to the graph
        nodes.forEach(node -> graph.addVertex(node.getValue()));
        // Add edges between nodes
        nodes.forEach(
                node -> node.getNeighbors().forEach(neighbor -> graph.addEdge(node.getValue(), neighbor.getValue())));

        final var startNode = graph.vertexSet().stream()
                .filter(node -> node.equals("Node0"))
                .findFirst()
                .orElseThrow();
        // dfs
        final Iterator<String> dfsIterator = new DepthFirstIterator<>(graph, startNode);
        while (dfsIterator.hasNext()) {
            final var vertex = dfsIterator.next();
            System.out.println("Vertex %s connected to %s"
                    .formatted(vertex, graph.edgesOf(vertex)));
        }

        // shortest path between two nodes
        final var source = "Node0";
        final var destination = "Node8";
        final var shortestPath = new DijkstraShortestPath<>(graph);
        final SingleSourcePaths<String, DefaultEdge> node0Path = shortestPath.getPaths(source);
        System.out.println(
                "Shortest path from %s to %s: %s".formatted(source, destination, node0Path.getPath(destination)));

        // export graph to Graphviz DOT format
        Helpers.exportGraph(graph);
    }

    public static void complexGraphDfsExample() {
        final List<Node<String>> nodes = Helpers.createComplexGraph();
        System.out.println("Complex Graph DFS Traversal (no recursive):");
        Helpers.dfsNoRecur2(
                nodes.get(0),
                _ -> true,
                node -> System.out.print(node.getValue() + " -> "));
        System.out.println("END\n");

        System.out.println("Complex Graph DFS Traversal (recursive):");
        Helpers.dfsRecur(nodes.get(0), _ -> true, node -> System.out.print(node.getValue() + " -> "));
        System.out.println("END\n");
    }

    public static void dfsSimpleExample1() {
        Map<Integer, List<Integer>> graph = new HashMap<>();
        graph.put(0, Arrays.asList(1, 2));
        graph.put(1, Arrays.asList(0, 3, 4));
        graph.put(2, Arrays.asList(0, 5));
        graph.put(3, Arrays.asList(1));
        graph.put(4, Arrays.asList(-1));
        graph.put(5, Arrays.asList(9));

        System.out.println("DFS Traversal:");
        Helpers.dfsNoRecur(
                graph,
                0,
                x -> x >= 0,
                x -> System.out.print(x + " "));
    }
}

class LearnStream {
    public static void main(String[] args) {
        test6();
    }

    static void test6() {
        // Thread-safe collections
        List<String> threadSafeList = Collections.synchronizedList(new ArrayList<>());
        Set<String> threadSafeSet = Collections.synchronizedSet(new HashSet<>());
        Map<String, String> threadSafeMap = Collections.synchronizedMap(new HashMap<>());

        // >= Java SE 5
        var safeList = new CopyOnWriteArrayList<String>();
    }

    static void test5() {
        // Section 57.19: Converting a Stream of Optional to a Stream of Values
        Optional<String> op1 = Optional.empty();
        Optional<String> op2 = Optional.of("Hello World");
        Optional<Integer> op3 = Optional.of(3);

        List<Object> result = Stream.of(op1, op2, op3)
                .filter(Optional::isPresent)
                .map(Optional::get)
                .collect(toList());

        // Section 57.21: Create a Map based on a Stream
        Stream<String> characters = Stream.of("A", "B", "C");
        Map<Integer, String> map = characters
                .collect(toMap(Object::hashCode, el -> el));

        List<Person> people = Arrays.asList(
                new Person("Sam", "Rossi"),
                new Person("Sam", "Verdi"),
                new Person("John", "Bianchi"),
                new Person("John", "Rossi"),
                new Person("John", "Verdi"));

        Map<String, List<String>> map2 = people.stream()
                .collect(groupingBy(Person::getFirstName,
                        mapping(Person::getLastName, toList())));
        System.out.println("people map2: " + map2);

        // Section 57.22: Joining a stream to a single String
        Stream<String> fruitStream = Stream.of("apple", "banana", "pear", "kiwi", "orange");
        String resultStr = fruitStream
                .map(String::toUpperCase)
                .sorted()
                .collect(joining(", ", "Fruits: ", "."));
        System.out.println("resultStr: " + resultStr);

        // Collect Results of a Stream into an Array
        List<String> fruits = Arrays.asList("apple", "banana", "pear", "kiwi", "orange");
        String[] filteredFruits = fruits.stream()
                .filter(x -> x.contains("a"))
                .toArray(String[]::new);
    }

    @Data
    @AllArgsConstructor
    static class Employee {
        Integer id;
        String name;
        Double salary;
    }

    @Data
    @AllArgsConstructor
    static class Person {
        String firstName;
        String lastName;
    }

    static void test4() {
        var pi = Math.sqrt(12) *
                IntStream.rangeClosed(0, 100)
                        .mapToDouble(k -> Math.pow(-3, -1 * k) / (2 * k + 1))
                        .sum();
        System.out.println("Math.PI: " + Math.PI);
        System.out.println("Pi: " + pi);

        int[] values = new int[] { 1, 2, 3, 4, 5 };
        IntStream stream = Arrays.stream(values, 1, 4);
        stream.forEach(System.out::println);

        // Summary
        List<Integer> naturalNumbers = Arrays.asList(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11);
        long start = System.currentTimeMillis();
        IntSummaryStatistics stats = naturalNumbers.stream()
                .mapToInt(x -> x)
                .summaryStatistics();
        DoubleSummaryStatistics statsDouble = naturalNumbers.stream()
                .mapToDouble(x -> x)
                .summaryStatistics();
        LongSummaryStatistics statsLong = naturalNumbers.stream()
                .mapToLong(x -> x)
                .summaryStatistics();
        long end = System.currentTimeMillis();
        System.out.println("ellapsed: " + (end - start));

        // Section 57.11: Converting an iterator to a stream
        Iterator<String> iterator = Arrays.asList("A", "B", "C").iterator();
        Spliterator<String> spliterator = Spliterators.spliteratorUnknownSize(iterator, 0);
        Stream<String> stream2 = StreamSupport.stream(spliterator, false);
        stream2.filter(x -> x.equalsIgnoreCase("b"));

        // Section 57.12: Using IntStream to iterate over indexes
        String[] names = { "Jon", "Darin", "Bauke", "Hans", "Marc" };
        IntStream.range(0, names.length)
                .mapToObj(i -> String.format("#%d %s", i + 1, names[i]))
                .forEach(System.out::println);
    }

    static void test3() {
        var employees = Arrays.asList(
                new Employee(1, "John", 1000.0),
                new Employee(2, "Paul", 2000.0),
                new Employee(3, "George", 3000.0),
                new Employee(4, "Ringo", 4000.0),
                new Employee(5, "Jack", 5000.0),
                new Employee(6, "Jill", 6000.0),
                new Employee(7, "Jeff Bezos", 100000.0),
                new Employee(8, "Bill Gates", 200000.0),
                new Employee(9, "Mark Zuckerberg", 300000.0));

        // 1. Print the name of the employee with the highest salary
        employees.stream()
                .max(Comparator.comparing(Employee::getSalary))
                .ifPresent(System.out::println);
        // 2. Find the average salary of all employees
        double averageSalary = employees.stream()
                .mapToDouble(Employee::getSalary)
                .average()
                .orElse(0.0);
        var optionalAverageSalary = OptionalDouble.of(averageSalary);
        optionalAverageSalary.ifPresentOrElse(
                value -> System.out.println("Average Salary: $" + value),
                () -> System.out.println("No employees to calculate average salary"));
        // 3. Group the employees by their first letter of name and print the count
        var inputChar = Optional.ofNullable(System.console())
                .map(c -> {
                    return c.readLine("Enter a character: ").charAt(0);
                }).orElseGet(() -> {
                    System.out.print("Enter a character: ");
                    return new Scanner(System.in).nextLine().charAt(0);
                });
        var groupByFirstLetter = employees.stream()
                .filter(e -> e.getName().charAt(0) == inputChar)
                .collect(groupingBy(e -> e.getName().charAt(0),
                        mapping(Employee::getName, toList())));
        System.out.println("Group by first letter: " + groupByFirstLetter);

        // 4. Sort the employees by their salary in descending order and print their
        // names
        employees.stream()
                .sorted(Comparator.comparing(Employee::getSalary).reversed())
                .forEach(employee -> System.out.println(employee.getName() + ": " + employee.getSalary()));
        // 5. Find the total salary of all employees
        var totalSalary = employees.stream()
                .mapToDouble(Employee::getSalary)
                .sum();
        System.out.println("Total Salary: " + totalSalary);

        // 6. Find the employee with the lowest salary and print his or her name
        employees.stream()
                .min(Comparator.comparing(Employee::getSalary))
                .ifPresent((e) -> System.out.println("Lowest Salary: " + e.getName() + " : " + e.getSalary()));
        // 7. Filter the employees who have a salary greater than $100,000 and print
        // their names and salaries
        employees.stream()
                .filter(e -> e.getSalary() > 100_000)
                .forEach(e -> System.out.println(">100000$ ->" + e.getName() + " : $" + e.getSalary()));
        // 8. Convert the employees list to a map with id as the key and name as the
        // value
        Map<Integer, String> empMap = employees.stream()
                .collect(toMap(Employee::getId, Employee::getName));
        System.out.println("Employee map: " + empMap);
        // 9. Concatenate the names of all employees into a single string
        String names = employees.stream()
                .map(Employee::getName)
                .collect(joining(", "));
        System.out.println("names: " + names);

        // 10. Partition the employees into two groups: one with salary less than $5000
        // and one with salary greater than or equal to $5000
        Map<Boolean, List<Employee>> partitionBySalary = employees.stream()
                .collect(partitioningBy(e -> e.getSalary() < 5000));
        System.out.println("Employees with low salary: " + partitionBySalary.get(true));
        System.out.println("Employees with high salary: " + partitionBySalary.get(false));
        // 11. Find the longest name among all employees
        var longestName = employees.stream()
                .map(Employee::getName)
                .max(Comparator.comparingInt(String::length));
        longestName.ifPresent(System.out::println);
        // 12. Find the employees whose name contains the letter 'o' and whose salary is
        // greater than the average salary
        var foundEmp = employees.stream()
                .filter(e -> e.getName().contains("o") && (e.getSalary() > averageSalary))
                .collect(toList());
        // 13. Find the employee with the second highest salary
        Optional<Employee> secondHighest = employees.stream()
                .sorted(Comparator.comparing(Employee::getSalary).reversed())
                .skip(1)
                .findFirst();
        secondHighest.ifPresent(System.out::println);
        // 14. Find the name of the employee with the shortest name
        var shortestName = employees.stream()
                .map(Employee::getName)
                .min(Comparator.comparingInt(String::length));
        shortestName.ifPresent(System.out::println);

    }

    static void test2() {
        Function<String, Integer> stringLengthFunction = s -> s.length();
        Supplier<Integer> randInt = () -> (int) (Math.random() * 256);
        Consumer<String> colorPrinter = message -> {
            String color = String.format("#%02X%02X%02X",
                    randInt.get(), randInt.get(), randInt.get());
            System.out.printf("%s: %s%n", color, message);
        };

        Stream<String> nameStream = Stream.of("John", "Paul", "George", "Ringo", "Jack", "Jill");
        nameStream.filter(s -> s.contains("a"))
                .map(stringLengthFunction)
                .map(Object::toString)
                .forEach(colorPrinter);
    }

    static void test1() {
        var fruitStream = Stream.of("apple", "banana", "pear", "kiwi", "orange");
        fruitStream.filter(s -> s.contains("a"))
                .map(String::toUpperCase)
                .sorted()
                .forEach(System.out::println);
    }
}

class ExampleCli {
    private static final String CMD_QUIT = "quit";
    private static final String CMD_HELLO = "hello";
    private static final String CMD_ANSWER = "answer";

    public static void main(String[] args) {
        ExampleCli exampleCli = new ExampleCli();
        try {
            exampleCli.start();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private void start() throws IOException {
        String cmd = "";

        BufferedReader reader = new BufferedReader(new InputStreamReader(System.in));
        while (!cmd.equals(CMD_QUIT)) {
            cmd = reader.readLine();
            String[] cmdArr = cmd.split(" ");
            if (cmdArr[0].equals(CMD_HELLO)) {
                hello(cmdArr);
            } else if (cmdArr[0].equals(CMD_ANSWER)) {
                answer(cmdArr);
            }
        }
    }

    // prints "Hello World!" on the screen if user input starts with "hello"
    private void hello(String[] cmdArr) {
        System.out.println("Hello World!");
    }

    // prints "42" on the screen if user input starts with "answer"
    private void answer(String[] cmdArr) {
        System.out.println("42");
    }

}

class PiCalculator {

    // Define a constant BigDecimal value for 640320, which appears in the formula.
    private static final BigDecimal C = BigDecimal.valueOf(640320);

    // Define a method that calculates the value of pi given a k value and a
    // MathContext object, using the formula and BigDecimal arithmetic.
    private static BigDecimal pi(int k, MathContext mc) {
        // Define a functional interface for calculating the factorial of an integer
        IntFunction<BigDecimal> factorial = n -> IntStream.rangeClosed(2, n).mapToObj(BigDecimal::valueOf)
                .reduce(BigDecimal.ONE, BigDecimal::multiply);

        // Define a functional interface for calculating the term inside the summation
        // of
        // the formula
        BiFunction<Integer, MathContext, BigDecimal> term = (n, m) -> {
            // Calculate (-1)^n using pow() method
            BigDecimal sign = BigDecimal.valueOf(-1).pow(n);
            // Calculate (6n)! using factorial() method
            BigDecimal a = factorial.apply(6 * n);
            // Calculate (13591409 + 545140134n) using multiply() and add() methods
            BigDecimal b = BigDecimal.valueOf(13591409)
                    .add(BigDecimal.valueOf(545140134).multiply(BigDecimal.valueOf(n)));
            // Calculate (3n)! using factorial() method
            BigDecimal c = factorial.apply(3 * n);
            // Calculate (n!)^3 using factorial() and pow() methods
            BigDecimal d = factorial.apply(n).pow(3);
            // Calculate (640320)^(3n + 3/2) using pow() method
            BigDecimal e = C.pow(3 * n).multiply(C.sqrt(m));
            // Calculate the numerator as sign * a * b using multiply() method
            BigDecimal numerator = sign.multiply(a).multiply(b);
            // Calculate the denominator as c * d * e using multiply() method
            BigDecimal denominator = c.multiply(d).multiply(e);
            // Return the term as numerator / denominator using divide() method
            return numerator.divide(denominator, m);
        };

        // Define a functional interface for calculating the summation of the terms up
        // to a given k value
        Function<Integer, BigDecimal> summation = n -> IntStream.rangeClosed(0, n).mapToObj(i -> term.apply(i, mc))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Calculate 12 / k using divide() method
        BigDecimal factor = BigDecimal.valueOf(12).divide(BigDecimal.valueOf(k), mc);
        // Calculate the summation using summation() method
        BigDecimal sum = summation.apply(k);
        // Calculate the numerator as 426880 * sqrt(10005) using multiply() and sqrt()
        // methods
        BigDecimal numerator = BigDecimal.valueOf(426880).multiply(BigDecimal.valueOf(10005).sqrt(mc));
        // Calculate the denominator as 13591409 * sum using multiply() method
        BigDecimal denominator = BigDecimal.valueOf(13591409).multiply(sum);
        // Return the value of pi as factor * numerator / denominator using multiply()
        // and divide() methods
        return factor.multiply(numerator).divide(denominator, mc);
    }

    public static void main(String[] args) {
        int k = 0;
        boolean validInput = false;
        while (!validInput) {
            try {
                k = Integer.parseInt(System.console().readLine("Enter k: "));
                validInput = true;
            } catch (NumberFormatException e) {
                System.out.println("Invalid input. Please enter a valid number.");
            }
        }
        MathContext mc = new MathContext(k, RoundingMode.HALF_UP);
        System.out.println("Pi: " + pi(k, mc));
    }
}

class FloatTest {
    private static MathContext mc = new MathContext(100000, RoundingMode.HALF_DOWN);

    public static void main(String[] args) {
        askInput();
    }

    static BigDecimal factorial(int n) {
        BigDecimal result = BigDecimal.ONE;
        for (int i = 1; i <= n; i++) {
            result = result.multiply(BigDecimal.valueOf(i));
        }
        return result;
    }

    static void movePoint() {
        BigDecimal bigDecimal = new BigDecimal("123.456789000001");
        BigDecimal movePointLeft = bigDecimal.stripTrailingZeros().movePointLeft(2).movePointRight(3);
        System.out.println(movePointLeft);
    }

    static void TestPI() {
        BigDecimal pi = BigDecimal.valueOf(Math.PI);
        pi = pi.setScale(mc.getPrecision(), mc.getRoundingMode());
        System.out.println("pi: " + pi);
    }

    static void compareFloatToBigDecimal() {
        float accountBalance = 100.00f;
        System.out.println("Operations using float");
        System.out.println("1000 operations for 1.99");
        for (int i = 0; i < 1000; i++) {
            accountBalance -= 1.99f;
        }
        System.out.println(String.format("Account balance after float operations: %f", accountBalance));

        BigDecimal accountBalanceTwo = new BigDecimal("10000.00");
        System.out.println("Operations using BigDecimal:");
        System.out.println("1000 operations for 1.99");
        BigDecimal operation = new BigDecimal("1.99");
        for (int i = 0; i < 1000; i++) {
            accountBalanceTwo = accountBalanceTwo.subtract(operation);
        }
        System.out.println(String.format("Account balance after BigDecimal operations: %f",
                accountBalanceTwo));
    }

    static void preferWayToCreate() {
        // preferred way tp create BigDecimal
        BigDecimal accountBalanceThree = BigDecimal.valueOf(598_234_258_987_234.2398239829389823);
        accountBalanceThree = accountBalanceThree.setScale(2, RoundingMode.UNNECESSARY);
        System.out.println("accountBalanceThree: " + accountBalanceThree);
    }

    static void predefinedConstant() {
        var num1 = BigDecimal.TEN;
        var num2 = BigDecimal.TEN;
        var res = num1.pow(num2.intValue(), mc);
        System.out.println("result: " + res);
    }

    static void askInput() {
        // user input, ask user input balance
        try (Scanner scanner = new Scanner(System.in)) {
            System.out.println("Enter balance: ");
            BigDecimal balance = scanner.nextBigDecimal();
            System.out.println("Enter interest rate: ");
            BigDecimal interestRate = scanner.nextBigDecimal();
            System.out.println("Enter number of years: ");
            int numberOfYears = scanner.nextInt();
            BigDecimal interest = balance
                    .multiply(interestRate).divide(BigDecimal.valueOf(100))
                    .multiply(BigDecimal.valueOf(numberOfYears));
            // print out after format to easy reading like adding "." separator
            System.out.println("Interest: " +
                    NumberFormat.getInstance().format(interest));
        }
    }
}

class DynamicArray {
    int size;
    int capacity = 10;
    Object[] array;

    public DynamicArray() {
        this.array = new Object[capacity];
    }

    public DynamicArray(int capacity) {
        this.capacity = capacity;
        this.array = new Object[capacity];
    }

    public void add(Object data) {
        if (size >= capacity) {
            grow();
        }
        array[size++] = data;
    }

    public void insert(int index, Object data) {

    }

    public void delete(Object data) {

    }

    public int search(Object data) {
        return -1;
    }

    private void grow() {

    }

    private void shrink() {

    }

    public boolean isEmpty() {
        return size == 0;
    }

    public String toString() {
        String string = "";
        for (int i = 0; i < size; i++) {
            string += array[i] + ", ";
        }
        if (string != "") {
            string = string.substring(0, string.length() - 2);
        }
        return string;
    }

}

class LearnCollections {
    public static boolean isPalinedrome(String s) {
        // Convert the string to lowercase and remove all non-alphanumeric characters
        s = s.toLowerCase().replaceAll("[^a-z0-9]", "");
        LinkedList<Character> queue = new LinkedList<>();
        for (int i = 0; i < s.length(); i++) {
            queue.offer(s.charAt(i));
        }
        while (queue.size() > 1) {
            char first = queue.poll();
            char last = queue.pollLast();
            if (first != last) {
                return false;
            }
        }
        return true;
    }
}

class StreamAPI {
    public static void learn() {
        // Minimum Length - minimum length of 5
        var list1 = Arrays.asList("computer", "usb", "asp");
        list1.stream().filter(x -> x.length() >= 5);

        // Select words - start with a, end with m
        var list2 = Arrays.asList("mum", "amsterdam", "bloom", "usb");
        list2.stream().filter(x -> x.startsWith("a") && x.endsWith("m"));

        // returns top 5 numbers from the list of integers in descending order.
        var list3 = Arrays.asList(78, -9, 0, 23, 54, 21, 7, 86);
        list3.stream().sorted(Comparator.reverseOrder()).limit(5);

        // square greater than 20
        var list4 = Arrays.asList(7, 2, 30, 1, -2, 3, 4);
        list4.stream().map(x -> Math.round(Math.pow(x, 2)))
                .filter(x -> x > 20);

        // replace ea to *
        var list5 = Arrays.asList("learn", "current", "deal");
        list5.stream().map(x -> x.replace("ea", "*"));

        // last word containing letter 'e'
        var list6 = Arrays.asList("plane", "ferry", "car", "bike");
        var res6 = list6.stream().sorted(Comparator.naturalOrder())
                .reduce((first, second) -> second).get();

        // shuffle sorted array
        var list7 = Arrays.asList(1, 2, 3, 4, 5, 6, 7, 8, 9, 10);
        Collections.shuffle(list7);

        // most frequent character
        var str8 = "n093nfv034nie9";
        var res8 = str8.chars()
                .mapToObj(x -> (char) x)
                .collect(groupingBy(x -> x, counting()))
                .entrySet()
                .stream()
                .max(comparingByValue())
                .get()
                .getKey();
        System.out.println(res8);
    }
}
