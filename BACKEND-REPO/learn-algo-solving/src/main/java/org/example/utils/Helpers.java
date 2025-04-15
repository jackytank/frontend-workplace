package org.example.utils;

import java.util.ArrayDeque;
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

    public <T> void dfsNoRecursive(Node<T> start, Predicate<Node<T>> nodeFilter, Consumer<Node<T>> nodeProcessor) {
        final Set<Node<T>> visited = new HashSet<>();
        final Deque<Node<T>> stack = new ArrayDeque<>();

        stack.push(start);
        while (!stack.isEmpty()) {
            final Node<T> current = stack.pop();
            if (visited.add(current) && nodeFilter.test(current)) {
                nodeProcessor.accept(current);
            }

            // Iterate the list in reverse order (replacing reversed() method)
            final List<Node<T>> neighbors = current.getNeighbors();
            for (int i = neighbors.size() - 1; i >= 0; i--) {
                final Node<T> neighbor = neighbors.get(i);
                if (!visited.contains(neighbor)) {
                    stack.push(neighbor);
                }
            }
        }
    }

    public void dfsNoRecursive(
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
}
