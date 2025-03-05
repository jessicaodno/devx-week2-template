import { useState } from 'react';

function AddTodo ({ addTask }) {
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

    // calls addTask which creates a new task item
    function handleAddTask () {
        addTask(title, notes, due);
        setTitle('');
        setNotes('');
        setDue('');
    };

    return (
        <div className="add-todo">
                <input type="text" value={title} onChange={(e) => handleChange(e, "title")} placeholder="Task Title" />
                <input type="text" value={notes} onChange={(e) => handleChange(e, "notes")} placeholder="Task Notes" />
                <input type="text" value={due} onChange={(e) => handleChange(e, "due")} placeholder="Task Due Date" />
                <button onClick={handleAddTask}>Add Task</button>
        </div>
    );
}

export default AddTodo;