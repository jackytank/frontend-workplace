package org.example.utils;

import java.util.ArrayDeque;
import java.util.Collections;
import java.util.Deque;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.function.IntConsumer;
import java.util.function.IntPredicate;

import lombok.experimental.UtilityClass;

@UtilityClass
public class Helpers {
    record Vertex<T>(T value, List<Vertex<T>> neighbors) {
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
