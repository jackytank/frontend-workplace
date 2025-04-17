package org.example.utils;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.StringWriter;
import java.io.Writer;
import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.Deque;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.function.Consumer;
import java.util.function.IntConsumer;
import java.util.function.IntPredicate;
import java.util.function.Predicate;
import java.util.stream.IntStream;
import org.jgrapht.Graph;
import org.jgrapht.graph.DefaultEdge;
import org.jgrapht.nio.Attribute;
import org.jgrapht.nio.DefaultAttribute;
import org.jgrapht.nio.dot.DOTExporter;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.ToString;
import lombok.experimental.UtilityClass;

@UtilityClass
public class Helpers {
    @Getter
    @ToString
    @AllArgsConstructor
    @EqualsAndHashCode(onlyExplicitlyIncluded = true)
    public static class Node<T> {
        @EqualsAndHashCode.Include
        private final T value;
        private final List<Node<T>> neighbors;
    }

    public <T> void dfsRecur(Node<T> start, Predicate<Node<T>> nodeFilter, Consumer<Node<T>> nodeProcessor,
            Set<Node<T>> visited) {
        if (visited.contains(start)) {
            return;
        }
        visited.add(start);
        if (nodeFilter.test(start)) {
            nodeProcessor.accept(start);
        }
        // Iterate the list in reverse order
        for (final Node<T> neighbor : start.getNeighbors()) {
            if (!visited.contains(neighbor)) {
                dfsRecur(neighbor, nodeFilter, nodeProcessor, visited);
            }
        }
    }

    public <T> void dfsRecur(Node<T> start, Predicate<Node<T>> nodeFilter, Consumer<Node<T>> nodeProcessor) {
        final Set<Node<T>> visited = new HashSet<>();
        dfsRecur(start, nodeFilter, nodeProcessor, visited);
    }

    public <T> void dfsNoRecur2(Node<T> start, Predicate<Node<T>> nodeFilter, Consumer<Node<T>> nodeProcessor) {
        final Set<Node<T>> visited = new HashSet<>();
        final Deque<Node<T>> stack = new ArrayDeque<>();
        visited.add(start); // Explicitly mark the root as visited
        stack.push(start);
        while (!stack.isEmpty()) {
            final Node<T> current = stack.pop();
            if (nodeFilter.test(current)) {
                nodeProcessor.accept(current);
            }
            // Iterate the list in reverse order (replacing reversed() method)
            final List<Node<T>> neighbors = current.getNeighbors();
            for (int i = neighbors.size() - 1; i >= 0; i--) {
                final Node<T> neighbor = neighbors.get(i);
                if (visited.add(neighbor)) { // Only push if not visited
                    stack.push(neighbor);
                }
            }
        }
    }

    @SuppressWarnings("java:S3776")
    public void dfsNoRecur(
            Map<Integer, List<Integer>> graph,
            int root,
            IntPredicate filter,
            IntConsumer processor) {
        final Set<Integer> visited = new HashSet<>();
        final Deque<Integer> stack = new ArrayDeque<>();
        stack.push(root);
        while (!stack.isEmpty()) {
            final int current = stack.pop();
            if (!visited.contains(current)) {
                if (!visited.add(current))
                    continue;
                if (filter.test(current)) {
                    processor.accept(current);
                }
                final List<Integer> adjacentList = graph.getOrDefault(current, Collections.emptyList());
                for (int i = adjacentList.size() - 1; i >= 0; --i) {
                    final int neighbor = adjacentList.get(i);
                    if (!visited.contains(neighbor)) {
                        stack.push(neighbor);
                    }
                }
            }
        }
    }

    public List<Node<String>> createComplexGraph() {
        final List<Node<String>> nodes = IntStream.range(0, 20)
                .mapToObj(i -> new Node<>("Node" + i, new ArrayList<>()))
                .toList();
        final int[][] connections = {
                { 0, 1 }, { 0, 2 }, { 0, 3 }, { 1, 4 }, { 1, 5 }, { 2, 6 }, { 2, 7 }, { 2, 8 }, { 3, 9 },
                { 4, 10 }, { 4, 11 }, { 5, 12 }, { 6, 13 }, { 7, 14 }, { 7, 15 }, { 8, 16 }, { 9, 17 },
                { 10, 18 }, { 11, 19 }, { 12, 5 }, { 13, 2 }, { 14, 0 }, { 15, 9 }, { 16, 3 }, { 17, 11 }, { 18, 4 },
                { 19, 1 }
        };
        Arrays.stream(connections).forEach(c -> nodes.get(c[0]).getNeighbors().add(nodes.get(c[1])));
        return nodes;
    }

    public <T> void exportGraph(Graph<T, DefaultEdge> graph) {
        final var fileName = "exported_Graphviz.dot";
        final var exporter = new DOTExporter<T, DefaultEdge>();

        // Configure the exporter to use the vertex's toString() as the label
        exporter.setVertexAttributeProvider(v -> {
            final Map<String, Attribute> map = new LinkedHashMap<>();
            map.put("label", DefaultAttribute.createAttribute(v.toString()));
            return map;
        });

        final Writer writer = new StringWriter();
        exporter.exportGraph(graph, writer);

        // write to file
        final var file = new File(fileName);
        try (final var fos = new FileOutputStream(file)) {
            fos.write(writer.toString().getBytes());
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }
}
