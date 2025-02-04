# Workshop 2 (Week 5)

## Getting Started

This contains the completed code and other resrouces for today's workshop.

We will be continuing from where we left off week 1. In this repository I initialized the app with `npm create vite@latest devx-week2 -- --template react` rather than `npm create-react-app devx-week2`. The latter command doesn't work well with node v22, though either is okay for our purposes.

```bash
# If you want to start from a clean slate:
git clone https://github.com/dmychen/devx-week2-template.git
cd devx-week1
npm install
```

## Resources

**Workshop Links**
- [Today's Slides](https://docs.google.com/presentation/d/130kXaKQ8cPWd08f40DfUmku2unK2BPywi5HaQCvA6m4/edit?usp=sharing)
- [Workshop 1 Github](https://github.com/cruizeship/devx-week1)

**Other Resources**
- An overview on web development: [Week 2 Writeup](https://docs.google.com/document/d/1GTdLg4tJJNAXYh2GVa8MVd_6595bGGll288u1SbztYk/edit?tab=t.0)
- How to approach building components with React: [Thinking in React](https://react.dev/learn/thinking-in-react)
- Principles we should follow when writing React: [S.O.L.I.D Principle in React](https://medium.com/@debashishrambhola/wrong-s-o-l-i-d-principle-in-react-js-applications-a-guide-with-some-simple-examples-406fbd1ec982)
- How React renders components: [React Rendering Behavior](https://blog.isquaredsoftware.com/2020/05/blogged-answers-a-mostly-complete-guide-to-react-rendering-behavior/)

## Code

1. Restructuring our code
2. Using props
3. Conditional Rendering
4. More state

### Isolating Components

In a small app like this, stuffing everything into a single component works. Generally, it is good practice to seperate components based on function. 

Currently, `TodoList.jsx` contains all our code. Lets split it up into multiple components:
- Header: The name of our page, "My Todo List"
- TaskList: Contain our AddTodo component, and a list of TodoItems
- AddTodo: A box where we input the title, notes, and due-date for a new todo
- TodoItem: An individual Todo, with a title, notes, and due-date section, and remove/edit buttons

**Header**

For now, lets just stick the title in `App.jsx` and remove it from `TodoList.jsx`, since it's just a single line.

```jsx
// in `App.jsx`
function App() {
  return (
    <div className="App">
      <header className="App-header">
        Todo List
      </header>
      <TodoList />
    </div>
  )
}
```

**AddTodo**

Lets first create a component to represent our AddTodo box.

```jsx
// In `AddTodo.jsx`
function AddTodo () {
    return (
        <div className="add-todo">
            <input type="text" value={title} onChange={(e) => handleChange(e, "title")} placeholder="Task Title" />
            <input type="text" value={notes} onChange={(e) => handleChange(e, "notes")} placeholder="Task Notes" />
            <input type="text" value={due} onChange={(e) => handleChange(e, "due")} placeholder="Task Due Date" />
            <button onClick={()=>addTask()}>Add Task</button>
        </div>
    );
}
export default AddTodo;
```

And replace the JSX in out TodoList component to instead display this new component.

```jsx
// in `TodoList.jsx`
import AddTodo from './AddTodo';

// ...other code

function TodoList () {
    // ...
    return (
        <div className="list-app">
            <AddTodo />
            ...
        </div>
    );
}
```

Now that AddTodo is a seperate component, we can no longer access the `title`, `notes`, and `date` [state variables](https://react.dev/reference/react/useState) from our TodoList. We also can't update our list of tasks from within our AddTodo component using our addTask function.

Our TodoList component doesn't ever need to access title, notes, and due-date, so we can just move those state variables to our AddTodo component. This also means we move our `handleChange` [callback function](https://www.w3schools.com/js/js_callback.asp) into AddTodo.

```jsx
// in `AddTodo.jsx`
function AddTodo () {
    const [title, setTitle] = useState('')
    const [notes, setNotes] = useState('')
    const [due, setDue] = useState('')

    function handleChange(e, target){
        if (target == "title") {
            setTitle(e.target.value)
        } else if (target == "notes") {
            setNotes(e.target.value)
        } else {
            setDue(e.target.value)
        }
    }

    // ...rest of component
}
```

We can't just move the `addTask` function into the AddTodo component, since it manipulates the `tasks` list which is stored in our TodoList component. We can't move `tasks` into the AddTodo component either, since TodoList needs to access our list of tasks. 

This means we have to store `tasks` in TodoLists, and somehow allow AddTodo to access that list or edit it. We use [props](https://react.dev/learn/passing-props-to-a-component), which are passed similarly to parameters/arguments of a function. You can pass objects, arrays, or functions as props.

```jsx
// We can rewrite our AddTask component definition to take in props
function AddTodo ({ tasks, setTasks }) {
    // and then use those props
    setTasks(newThingHere);
}
```

Our AddTodo component doesn't actually need to access tasks or setTasks directly, so we can instead simply pass a function `addTask` to the component. We define `addTask` in the parent TodoList component to correctly add a task, and then in the child AddTodo component we call that function.

```jsx
// update the props for AddTodo
function AddTodo ({ addTask }) {
    // ...somewhere in the component call addTask(title, notes, due) to update the list
}
```

```jsx
// update the addTask function in TodoList
function addTask({ title, notes, due }) {
    setTasks([...tasks, [title, notes, due]])
}
```

```jsx
// Update call to AddTodo in TodoList
<AddTodo addTask={addTask} />
```

In AddTodo, we create a function that will call `addTask`, and also correctly clear our state variables.

```jsx
// ...
function handleAddTask() {
    addTask({ title, notes, due });
    setTitle('');
    setNotes('');
    setDue('');
}

return (
    ...
    <button onClick={handleAddTask}>Add Task</button>
    ...
);
```

Our AddTodo component is complete. If we have any CSS styling for the AddTodo box, we should put it in a new file `AddTodo.css` and `import './AddTodo.css'`.

> One problem with passing props in pure javascript like we're doing now is it becomes hard to know the type of your props.
> ...how do we tell `addTask` is a function, not an object or array?  
> ...how do we know that addTask takes three parameters?  
> Many people prefer **[typescript](https://www.theserverside.com/tip/JavaScript-vs-TypeScript-Whats-the-difference)** to plain javascript beacuse it forces code to be explicitly typed.

**TodoItem**

We use a similar approach to create a component for the tasks the TodoList displays.

```jsx
// create TodoItem component in `TodoItem.jsx`
function TodoItem () {
    return (
        <div className="todo-item">
            <p className="task-line">Task: {task[0]}</p>
            <p className="task-line">Notes: {task[1]}</p>
            <p className="task-line">Due: {task[2]}</p>
            <button className="left-btn" onClick={() => deleteTask(index)}>Remove</button>
            <button onClick={() => editTask(index)}>Edit</button>
        </div>
    );
}
export default TodoItem;
```

Since our TodoList needs to render multiple TodoItems, one for each task, we still use a map. The map iterates through each task in `tasks`, and for each we render a TodoItem. 

We also need to pass a [unique 'key'](https://react.dev/learn/rendering-lists#keeping-list-items-in-order-with-key) to each of the TodoItem components we create. React uses this to tell apart each TodoItem, so it can render them correctly and avoid re-rendering components in a list when they don't change. For now we use the task's index as its key.

```jsx
// update TodoList
return (
    ...
    {tasks.map((task, index) => (
        <TodoItem key={index} />
    ))}
    ...
);
```

> Using an array index as a key is typically [bad practice](https://medium.com/@sriweb/avoid-using-array-index-as-a-key-in-react-components-1978799ed94b). Whenever we add or remove an item from our list, the index corresponding to each TodoItem may change, which both forces React to do unnecessary checking when re-rendering and sometimes causes React to render components incorrectly.  
> Instead of using the index, people typically assign each list item a unique id and use that instead.  

Same as AddTodo, we need to pass props to our TodoItem.

```jsx
// add props to TodoItem declaration
function TodoItem ( task, index, deleteTask ) {
    // ...
}
```

```jsx
// pass props to TodoItem
<TodoItem 
    key={index}
    task={task} 
    index={index} 
    deleteTask={deleteTask}
/>
```

Refactoring complete! 

## Adding Features

### Conditional Rendering

Let's say we want our AddTodo box to only show up if we click a button. This requires us to [conditionally render](https://react.dev/learn/conditional-rendering) that component. Implementing this is simple.

We create a state variable in our TodoList to track whether AddTodo should currently be shown.

```jsx
// in `TodoList.jsx`
const [showAddTodo, setShowAddTodo] = useState(false);
```

And then we create a button that toggles showAddTodo between true and false, and use a JS [conditional statement](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_operator) to render our AddTodo box when showAddTodo is true.

```jsx
// in `TodoList.jsx`
<button onClick={() => setShowAddTodo(!showAddTodo)}>Create New Todo</button>
{showAddTodo ? (<AddTodo addTask={addTask} />) : null }
```

## Next Steps

1. So far we have created a website with a single page. How do we make websites with multiple pages, and navigate between them.
- A good place to start is React Router, which is a widely used library & framework.
- There are several paradigms for creating websites that appear as multiple pages--look up SPAs versus MPAs. 
2. Change our list to use unique id's for keys, instead of indexes.

