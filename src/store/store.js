import { Todo } from "../todos/models/todo";

export const Filters = {
    All: 'all',
    Completed: 'Completed',
    Pending: 'Pending',
}

const state = {
    todos: [
        // new Todo('Piedra del alma'),
        // new Todo('Piedra del tiempo'),
        // new Todo('Piedra del infinito'),
        // new Todo('Piedra del poder'),
        // new Todo('Piedra del universo'),
    ],
    filter: Filters.All,
}

const initStore = () => {
    loadStore();
    // console.log('InitStore 🍍');
}

const loadStore = () => {
    if (!localStorage.getItem('state')) return;

    const { todos = [] } = JSON.parse(localStorage.getItem('state'));
    state.todos = todos;
    state.filter = Filters.All;
}

const saveStateToLocalStorage = () => {
    localStorage.setItem('state', JSON.stringify(state));
}

const getTodos = (filter = Filters.All) => {
    switch (filter) {
        case Filters.All:
            return [...state.todos];

        case Filters.Completed:
            return state.todos.filter(todo => todo.done);

        case Filters.Pending:
            return state.todos.filter(todo => !todo.done);

        default:
            throw new Error(`Option ${filter} is not valid.`);
    }
}

/**
 * 
 * @param {String} description 
 */
const addTodo = (description) => {
    if (!description) throw new Error('Description is required');
    state.todos.push(new Todo(description));

    saveStateToLocalStorage();
}

const toogleTodo = (todoId) => {
    state.todos = state.todos.map(todo => {
        if (todo.id === todoId) {
            todo.done = !todo.done;
        }
        return todo;
    });

    saveStateToLocalStorage();
}

const deleteTodo = (todoId) => {
    state.todos = state.todos.filter(todo => todo.id !== todoId);
    saveStateToLocalStorage();
}

const deleteCompleted = () => {
    if (Todo.done == 0) {
        alert('Hola')
    } else {
        state.todos = state.todos.filter(todo => !todo.done);
        saveStateToLocalStorage();
    }
}

/**
 * 
 * @param {Filters} newFilter 
 */
const setFilter = (newFilter = Filters.All) => {
    Object.keys(Filters).includes(Filters.All, Filters.Completed, Filters.Pending);
    state.filter = newFilter;
    saveStateToLocalStorage();
}

const getCurrentFilter = () => {
    return state.filter;
}

export default {
    addTodo,
    deleteCompleted,
    deleteTodo,
    getCurrentFilter,
    getTodos,
    initStore,
    loadStore,
    setFilter,
    toogleTodo,
}