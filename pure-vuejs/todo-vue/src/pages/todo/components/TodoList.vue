<script setup lang="ts">
import { TodoType } from '../../../types/global';

const { todos, doneTodo, removeTodo } = defineProps<{
    todos: TodoType[];
    doneTodo: (todo: TodoType) => void;
    removeTodo: (index: number) => void;
}>();
</script>

<template>
    <h2>Todo list</h2>
    <ul>
        <li v-for="(todo, index) in todos" :key="index">
            <span :class="{ done: todo.done }" @click="doneTodo(todo)">{{ todo.content }}</span>
            <button @click="removeTodo(index)">Remove</button>
        </li>
    </ul>
    <h4 v-if="todos.length === 0">Empty todo list!!!</h4>
</template>

<style scoped>
ul {
    list-style-type: none;
    padding: 0;
}

li {
    display: flex;
    justify-content: space-between;
    padding: 10px;
    border-bottom: 1px solid #ccc;
}

span {
    cursor: pointer;
}

span.done {
    text-decoration: line-through;
    color: #999;
}

button {
    border: none;
    background-color: #dc3545;
    color: white;
    border-radius: 4px;
    cursor: pointer;
}

button:hover {
    background-color: #c82333;
}
</style>