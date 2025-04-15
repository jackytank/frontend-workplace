package org.example.utils;

import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Deque;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.function.Consumer;
import java.util.function.IntConsumer;
import java.util.function.IntPredicate;
import java.util.function.Predicate;

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
        // Creating nodes with initial values (without connections)
        final List<Node<String>> nodes = new ArrayList<>();
        for (int i = 0; i < 20; i++) {
            nodes.add(new Node<>("Node" + i, new ArrayList<>()));
        }

        // Connect nodes to create a complex graph structure
        // Node0 connections
        nodes.get(0).getNeighbors().add(nodes.get(1));
        nodes.get(0).getNeighbors().add(nodes.get(2));
        nodes.get(0).getNeighbors().add(nodes.get(3));

        // Node1 connections
        nodes.get(1).getNeighbors().add(nodes.get(4));
        nodes.get(1).getNeighbors().add(nodes.get(5));

        // Node2 connections
        nodes.get(2).getNeighbors().add(nodes.get(6));
        nodes.get(2).getNeighbors().add(nodes.get(7));
        nodes.get(2).getNeighbors().add(nodes.get(8));

        // Node3 connections
        nodes.get(3).getNeighbors().add(nodes.get(9));

        // Node4 connections
        nodes.get(4).getNeighbors().add(nodes.get(10));
        nodes.get(4).getNeighbors().add(nodes.get(11));

        // Node5 connections
        nodes.get(5).getNeighbors().add(nodes.get(12));

        // Node6 connections
        nodes.get(6).getNeighbors().add(nodes.get(13));

        // Node7 connections
        nodes.get(7).getNeighbors().add(nodes.get(14));
        nodes.get(7).getNeighbors().add(nodes.get(15));

        // Node8 connections
        nodes.get(8).getNeighbors().add(nodes.get(16));

        // Node9 connections
        nodes.get(9).getNeighbors().add(nodes.get(17));

        // Add some cycles and complex relationships
        nodes.get(10).getNeighbors().add(nodes.get(18));
        nodes.get(11).getNeighbors().add(nodes.get(19));
        nodes.get(12).getNeighbors().add(nodes.get(5)); // Cycle between 5 and 12
        nodes.get(13).getNeighbors().add(nodes.get(2)); // Cycle back to 2
        nodes.get(14).getNeighbors().add(nodes.get(0)); // Cycle back to root
        nodes.get(15).getNeighbors().add(nodes.get(9)); // Cross connection
        nodes.get(16).getNeighbors().add(nodes.get(3)); // Cross connection
        nodes.get(17).getNeighbors().add(nodes.get(11)); // Cross connection
        nodes.get(18).getNeighbors().add(nodes.get(4)); // Cycle between 4, 10, and 18
        nodes.get(19).getNeighbors().add(nodes.get(1)); // Cycle between 1, 4, 11, and 19

        return nodes;
    }
}
