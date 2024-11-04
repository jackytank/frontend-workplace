<script lang="ts" setup>
import { ref } from 'vue';
import TodoForm from './components/TodoForm.vue';
import { TodoType } from '../../types/global';
import TodoList from './components/TodoList.vue';

const defaultData = [{
    done: false,
    content: 'Enter a todo...'
}];
const todosData = JSON.parse(localStorage.getItem('todos') as string) || defaultData;
const todos = ref(todosData);
const addTodo = (newTodoVal: string) => {
    todos.value.push({
        done: false,
        content: newTodoVal
    });
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
    <TodoForm :add-todo="addTodo" />
    <TodoList :todos="todos" :done-todo="doneTodo" :remove-todo="removeTodo" />
</template>
<style scoped></style>