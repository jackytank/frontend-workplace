import { Button, Card, Form, Input, Space } from "antd";
import FormItem from "antd/es/form/FormItem";
import { useReducer, useState } from "react";

type Action =
  | { type: 'ADD_TODO'; payload: string; }
  | { type: 'TOGGLE_TODO'; payload: number; }
  | { type: 'DELETE_TODO'; payload: number; };

type TodoType = {
  id: number;
  text: string;
  done: boolean;
};

type State = {
  todos: TodoType[];
};

const initialState: State = {
  todos: [],
};

const todoReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'ADD_TODO':
      return {
        ...state,
        todos: [
          ...state.todos,
          { id: Date.now(), text: action.payload, done: false },
        ],
      };
    case 'TOGGLE_TODO':
      return {
        ...state,
        todos: state.todos.map((e) =>
          e.id === action.payload ? { ...e, done: !e.done } : e
        ),
      };
    case 'DELETE_TODO':
      return {
        ...state,
        todos: state.todos.filter((e) => e.id !== action.payload),
      };
    default:
      return state;
  }
};

type TodoFormProps = {
  addTodo: (text: string) => void;
};

const TodoForm = ({ addTodo }: TodoFormProps) => {
  const [value, setValue] = useState('');

  const handleSubmit = () => {
    addTodo(value);
    setValue('');
  };

  return (
    <Form onFinish={handleSubmit}>
      <Space direction="horizontal">
        <FormItem>
          <Input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        </FormItem>
        <FormItem>
          <Button type="primary" htmlType="submit" disabled={value.length === 0}>Add Todo</Button>
        </FormItem>
      </Space>
    </Form>
  );
};

type TodoItemProps = {
  todo: TodoType;
  toggleTodo: (id: number) => void;
  deleteTodo: (id: number) => void;
};

const TodoItem = ({ todo, toggleTodo, deleteTodo }: TodoItemProps) => {
  return (
    <li>
      <Space direction="horizontal">
        <Input
          type="checkbox"
          checked={todo.done}
          onChange={() => toggleTodo(todo.id)}
        />
        <span
          style={{
            textDecoration: todo.done ? 'line-through' : 'none',
            width: '100px',
          }}
        >
          {todo.text}
        </span>
        <Button size="small" type="dashed" danger onClick={() => deleteTodo(todo.id)}>X</Button>
      </Space>
    </li>
  );
};

type TodoListProps = {
  todos: TodoType[];
  toggleTodo: (id: number) => void;
  deleteTodo: (id: number) => void;
};

const TodoList = ({ todos, toggleTodo, deleteTodo }: TodoListProps) => {
  return (
    <ul>
      {todos.map((e) => (
        <TodoItem
          key={e.id}
          todo={e}
          toggleTodo={toggleTodo}
          deleteTodo={deleteTodo}
        />
      ))}
    </ul>
  );
};


const UserReducer = () => {
  const [state, dispatch] = useReducer(todoReducer, initialState);

  const addTodo = (text: string) => {
    dispatch({ type: 'ADD_TODO', payload: text });
  };

  const toggleTodo = (id: number) => {
    dispatch({ type: 'TOGGLE_TODO', payload: id });
  };

  const deleteTodo = (id: number) => {
    dispatch({ type: 'DELETE_TODO', payload: id });
  };
  return (
    <Card title="REACT TS TODO useReducer">
      <Space direction="vertical">
        <TodoForm addTodo={addTodo} />
        <TodoList
          todos={state.todos}
          toggleTodo={toggleTodo}
          deleteTodo={deleteTodo}
        />
      </Space>
    </Card>
  );
};

export default UserReducer;