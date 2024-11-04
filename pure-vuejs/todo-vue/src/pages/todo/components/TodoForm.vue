<script lang="ts" setup>
import { ref } from 'vue';

const newTodo = ref('');
const props = defineProps<{
    addTodo: (todo: string) => void;
}>();

const handleSubmit = () => {
    if (newTodo.value) {
        props.addTodo(newTodo.value);
        newTodo.value = '';
    }
};
</script>

<template>
    <div>
        <form @submit.prevent="handleSubmit">
            <label for="newTodo">New Todo</label>
            <input type="text" v-model="newTodo" name="newTodo" autocomplete="off">
            <button>Add Todo</button>
        </form>
    </div>
</template>

<style scoped>
form {
    display: flex;
    justify-content: start;
    margin-bottom: 20px;
}

input {
    padding: 10px;
    margin-left: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
}

button {
    padding: 10px 20px;
    border: none;
    background-color: #28a745;
    color: white;
    border-radius: 4px;
    cursor: pointer;
    margin-left: 10px;
}

button:hover {
    background-color: #218838;
}
</style>