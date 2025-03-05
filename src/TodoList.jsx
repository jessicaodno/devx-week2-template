import { useState } from 'react'
import AddTodo from './AddTodo';
import TodoItem from './TodoItem';

function TodoList () {
    // dummy tasks we start with
    const [tasks, setTasks] = useState([
        ["task 1 title", "task 1 notes", "task 1 due date"],
        ["task 2 title", "task 2 notes", "task 2 due date"],
        ["task 3 title", "task 3 notes", "task 3 due date"]
    ]);
    cont [showAddTodo, setShowAddTodo] = useState(false);

    function addTask (title, notes, due) {
        setTasks([...tasks, [title, notes, due]]);
    }

    function deleteTask (index) {
        const newTasks = [...tasks]
        newTasks.splice(index, 1)
        setTasks(newTasks)
    }

    return (
        <div className="todo-list">
            <button onClick={() => setShowAddTodo(!showAddTodo)}>Make a New Task!</button>
            {showAddTodo ? (<AddTodo addTask={addTask} /> ) : null } 
            <AddTodo addTask={addTask} />

            {tasks.map((task, index) => (
                <TodoItem 
                    key={index} 
                    index={index}
                    task={task}
                    deleteTask={deleteTask}
                />
            ))}
        </div>
    );
}

export default TodoList;