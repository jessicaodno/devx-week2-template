import { useState } from 'react'

function TodoList () {
    // dummy tasks we start with
    const [tasks, setTasks] = useState([
        ["task 1 title", "task 1 notes", "task 1 due date"],
        ["task 2 title", "task 2 notes", "task 2 due date"],
        ["task 3 title", "task 3 notes", "task 3 due date"]
    ]);
    const [title, setTitle] = useState('');
    const [notes, setNotes] = useState('');
    const [due, setDue] = useState('');

    // updates title, notes, and due-date variables on user input
    function handleChange(e, target){
        if (target == "title") {
            setTitle(e.target.value);
        } else if (target == "notes") {
            setNotes(e.target.value);
        } else {
            setDue(e.target.value);
        }
    }

    // reset state and update tasklist
    function addTask() {
        setTasks([...tasks, [title, notes, due]])
        setTitle('');
        setNotes('');
        setDue('');
    }

    function deleteTask (index) {
        const newTasks = [...tasks]
        newTasks.splice(index, 1)
        setTasks(newTasks)
    }

    return (
        <div className="todo-list">
            <div className="add-todo">
                <input type="text" value={title} onChange={(e) => handleChange(e, "title")} placeholder="Task Title" />
                <input type="text" value={notes} onChange={(e) => handleChange(e, "notes")} placeholder="Task Notes" />
                <input type="text" value={due} onChange={(e) => handleChange(e, "due")} placeholder="Task Due Date" />
                <button onClick={addTask}>Add Task</button>
            </div>
            
            {tasks.map((task, index) => (
                <div className="todo-item">
                    <p className="task-line">Task: {task[0]}</p>
                    <p className="task-line">Notes: {task[1]}</p>
                    <p className="task-line">Due: {task[2]}</p>
                    <button className="left-btn" onClick={() => deleteTask(index)}>Remove</button>
                </div>
            ))}
        </div>
    );
}

export default TodoList;