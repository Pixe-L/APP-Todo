import html from './app.html?raw';
import todoStore, { Filters } from '../store/store';
import { renderTodos, renderPending } from './use-cases';

const ElementIDs = {
    TodoList: '.todo-list',
    NewTodoInput: '#new-todo-input',
    ClearCompleted: '.clear-completed',
    TodoFilters: '.filtro',
    PendingCount: '#pending-count',
}

/**
 * 
 * @param {String} elementId 
 */
export const App = (elementId) => {

    //? RENDERIZAR TODOS
    const displayTodos = () => {
        const todos = todoStore.getTodos(todoStore.getCurrentFilter());
        renderTodos(ElementIDs.TodoList, todos);
        updatePendingCount();
    }

    //? ENUMERAR PENDIENTES
    const updatePendingCount = () => {
        renderPending(ElementIDs.PendingCount);
    }

    //? CUANDO LA FUNCION App() SE LLAMA
    (() => {
        const app = document.createElement('div');
        app.innerHTML = html;
        document.querySelector(elementId).append(app);
        displayTodos();
    })();

    //? Referencias HTML
    const newDescriptionInput = document.querySelector(ElementIDs.NewTodoInput);
    const todoListUL = document.querySelector(ElementIDs.TodoList);
    const clearcompleted = document.querySelector(ElementIDs.ClearCompleted);
    const filtersLI = document.querySelectorAll(ElementIDs.TodoFilters);

    //? Listeners INSERTAR NUEVO TODO
    newDescriptionInput.addEventListener('keyup', (event) => {
        if (event.keyCode !== 13) return;
        if (event.target.value.trim().length === 0) return;

        todoStore.addTodo(event.target.value);
        displayTodos();
        event.target.value = '';
    });

    //? CHECK TODO Y TACHAR TODO
    todoListUL.addEventListener('click', (event) => {
        const element = event.target.closest('[data-id]');
        todoStore.toogleTodo(element.getAttribute('data-id'));
        displayTodos();
    })

    //? BORRAR UN TODO
    todoListUL.addEventListener('click', (event) => {
        const isDestroyElement = event.target.className === 'destroy';
        const element = event.target.closest('[data-id]');
        if (!element || !isDestroyElement) return;

        todoStore.deleteTodo(element.getAttribute('data-id'));
        displayTodos();
    })

    //? BORRAR COMPLETADOS
    clearcompleted.addEventListener('click', (event) => {
        if (todoStore.getTodos().length === 0) {
            alert('No hay tareas asignadas.')
        } else {
            todoStore.deleteCompleted();
            displayTodos();
        }
    })


    //? MARCAR EL FILTRO SELECCIONADO
    filtersLI.forEach(element => {
        element.addEventListener('click', (element) => {
            filtersLI.forEach(item => item.classList.remove('selected'));
            element.target.classList.add('selected');

            switch (element.target.text) {
                case 'Todos':
                    todoStore.setFilter(Filters.All)
                    break;
                case 'Pendientes':
                    todoStore.setFilter(Filters.Pending)
                    break;
                case 'Completados':
                    todoStore.setFilter(Filters.Completed)
                    break;
            }

            displayTodos();

        })
    })
}