<script lang="ts" setup>
import { ref } from 'vue';
type TodoType = {
    done: boolean,
    content: string;
};
const newTodo = ref('');
const defaultData = [{
    done: false,
    content: 'Enter a todo...'
}];
const todosData = JSON.parse(localStorage.getItem('todos') as string) || defaultData;
const todos = ref(todosData);
const addTodo = () => {
    if (newTodo.value) {
        todos.value.push({
            done: false,
            content: newTodo.value
        });
        newTodo.value = '';
    }
    saveData();
};
const doneTodo = (todo: TodoType) => {
    todo.done = !todo.done;
    saveData();
};
const removeTodo = (index: number) => {
    todos.value.splice(index, 1);
    saveData();
};
const saveData = () => {
    const storageData = JSON.stringify(todos.value);
    localStorage.setItem('todos', storageData);
};
</script>
<template>
    <h1>Todo App</h1>
    <form @submit.prevent="addTodo()">
        <label for="newTodo">New Todo</label>
        <input type="text" v-model="newTodo" name="newTodo" autocomplete="off">
        <button>Add Todo</button>
    </form>
    <h2>Todo list</h2>
    <ul>
        <li v-for="(todo, index) in todos" :key="index">
            <span :class="{ done: todo.done }" @click="doneTodo(todo)">{{ todo.content }}</span>
            <button @click="removeTodo(index)">Remove</button>
        </li>
    </ul>
    <h4 v-if="todos.length === 0">Empty todo list!!!</h4>
</template>
<style scoped></style>