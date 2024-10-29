import { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import Navbar from "./components/Navbar";
import { v4 as uuidv4 } from "uuid";



function DeleteConfirmation({ isOpen, onClose, onConfirm }) {
  if (!isOpen) return null;

  return (
    <div style={modalStyles.overlay}>
      <div style={modalStyles.modal}>
        <p>Are you sure you want to delete this item?</p>
        <div className="delete-buttons flex gap-40 justify-center m-3">
          <button className="bg-violet-800 hover:bg-violet-950 p-2 py-1 text-sm font-bold text-white rounded-md mx-6" onClick={onConfirm}>Yes</button>
          <button className="bg-violet-800 hover:bg-violet-950 p-2 py-1 text-sm font-bold text-white rounded-md mx-6" onClick={onClose}>No</button>
        </div>
      </div>
    </div>
  );
}

function App() {

  const [todo, setTodo] = useState("");
  const [todos, setTodos] = useState([]);

  const [showFinished, setShowFinished] = useState(true)


  const [isModalOpen, setModalOpen] = useState(false);


  useEffect(() => {
    let todoString = localStorage.getItem("todos")
    if(todoString)
    {
      let todos=JSON.parse(localStorage.getItem("todos"));
      setTodos(todos);
    }
  }, [])
  
  

  const saveToLS = (params) => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }
  

  const handleDelete =(e, id)=>{
    let newtodos=todos.filter(item=>{
      return item.id!==id;
    });

    setTodos(newtodos);
    saveToLS();
  }

  const handlePrompt = (e, id) => {
    handleDelete(e, id)
    // console.log("Item deleted.");
    setModalOpen(false);
  };


  // const promptBox = (e, id) => {
  //   if (window.confirm("Are you sure you want to delete this item?")) {
  //     handleDelete(e, id)
  //     console.log(`Item with id ${id} deleted.`);
  //   } 
  // }

  const toggleFinished = (e) => {
    setShowFinished(!showFinished);
  }
  
  
  

  const handleAdd =()=>{
    setTodos([...todos, {id:uuidv4(), todo, isCompleted:false}]);
    setTodo("");
    saveToLS();
  }

  const handleChange =(e)=>{
    setTodo(e.target.value);
  }

  const handleEdit =(e, id)=>{
    
    let t=todos.filter(i=>i.id===id)
    setTodo(t[0].todo);
    let newtodos=todos.filter(item=>{
      return item.id!==id;
    });

    setTodos(newtodos);
    saveToLS();

  }

  const handleCheckbox= (e) => {
    let id=e.target.name;
    let index=todos.findIndex(item=>{
      return item.id===id;
    })
    let newtodos=[...todos];
    newtodos[index].isCompleted=!newtodos[index].isCompleted;
    setTodos(newtodos);
    saveToLS();
  }
  


  return (
    <>
      <Navbar />
      <div className="mx-3 md:container md:mx-auto w-4/6 my-5 rounded-xl p-5 bg-violet-100 min-h-[80vh]">
      <div className="addTodo">
        <h1 className="text-lg font-bold">Add Todo</h1>
        <input onChange={handleChange} value={todo} type="text" name="" id="" className="w-80"/>
        <button onClick={handleAdd} disabled:bg-violet-700 disabled={todo.length<=0} className="bg-violet-800 hover:bg-violet-950 p-2 py-1 text-sm font-bold text-white rounded-md mx-6">Add</button>
      </div>
          <input onClick={toggleFinished} type="checkbox" name="" id="" checked={showFinished}/> Show finished
          <h1 className="text-xl font-bold">Your todo</h1>
          <div className="todos">

            {todos.length===0 && <div className="m-4">No Todos</div>}
            {todos.map(item=>{

              return (showFinished || !item.isCompleted) && <div key={item.id} className="todo flex justify-between w-full my-3">
                <div className="flex gap-4">

                <input onChange={handleCheckbox} type="checkbox" name={item.id} id="" checked={item.isCompleted}/>
                <div className={item.isCompleted?"line-through":""}>{item.todo}</div>
                </div>
              <div className="buttons flex h-full">
                <button onClick={(e)=>handleEdit(e, item.id)} className="bg-violet-800 hover:bg-violet-950 p-2 py-1 text-sm font-bold text-white rounded-md mx-6">Edit</button>
                {/* <button onClick={(e)=>{handleDelete(e, item.id)}} className="bg-violet-800 hover:bg-violet-950 p-2 py-1 text-sm font-bold text-white rounded-md mx-6">Delete</button> */}

                {/* <button onClick={(e)=>promptBox(e, item.id)} className="bg-violet-800 hover:bg-violet-950 p-2 py-1 text-sm font-bold text-white rounded-md mx-6">Delete</button> */}

                <div>
                <button className="bg-violet-800 hover:bg-violet-950 p-2 py-1 text-sm font-bold text-white rounded-md mx-6" onClick={() => setModalOpen(true)}>Delete</button>
                <DeleteConfirmation
                  isOpen={isModalOpen}
                  onClose={() => setModalOpen(false)}
                  onConfirm={(e)=>handlePrompt(e, item.id)}
                />
              </div>
              </div>
            </div>
            })}
          </div>
      </div>
    </>
  );
}



const modalStyles = {
  overlay: {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex', justifyContent: 'center', alignItems: 'center'
  },
  modal: {
    backgroundColor: '#fff', padding: '20px', borderRadius: '8px',
    width: '400px', textAlign: 'center'
  }
};

export default App;
