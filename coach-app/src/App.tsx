import React, { useRef } from 'react';
import { useState } from "react";
// import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
// import Home from './pages/HomePage/Home';
// import Student from './pages/StudentPage/Student';
// import Coach from './pages/CoachPage/Coach';
import "./App.css";
// import Nav from "./components/Nav/Nav";
// import style from "./components/Nav/Nav.module.css";

type Note = { /* creates object type Notes */
    id: number;
    title: string;
    content: string;
 }
 
 const App = () => {
   const [notes, setNotes] = useState<
     Note[] /* creates array of type Note */
   >([
    //  {
    //    id: 1,
    //    title: "note title 1",
    //    content: "content 1",
    //  },
    //  {
    //    id: 2,
    //    title: "note title 2",
    //    content: "content 2",
    //  },
    //  {
    //    id: 3,
    //    title: "note title 3",
    //    content: "content 3",
    //  },
    //  {
    //    id: 4,
    //    title: "note title 4",
    //    content: "content 4",
    //  },
   ]);
 
   const [dropdown, setDropdown] = useState("");
   const [title, setTitle] = useState("");
   const [content, setContent] = useState("");
 
   const [selectedNote, setSelectedNote] =
     useState<Note | null>(null);
 
   // const [selectedOption, setSelectedOption] = useState('');
 
   // const handleChange = (event) => {
   //   setSelectedOption(event.target.value);
   // };
 
   const handleDropdown = (event: React.ChangeEvent<HTMLSelectElement>) => {
     setDropdown(event.target.value);
   };
 
   const handleNoteClick = (note:Note) => { /* handles changes made to a specific note */
     setSelectedNote(note);
     setTitle(note.title);
     setContent(note.content);
   }
 
   const handleAddNote = ( /* adds new note */
     event: React.FormEvent
   ) => {
     event.preventDefault();
 
     const newNote: Note = {
       id: notes.length + 1,
       title: title,
       content: content,
     };
 
     setNotes([newNote, ...notes]); /* the ... is the separator operator which takes the old notes array and puts it in this new array */
     setTitle("");
     setContent("");
   };
 
   const handleUpdateNote = ( /* handles updating a selected note */
     event: React.FormEvent
   ) => {
     event.preventDefault();
 
     if (!selectedNote) { /* handles case where no note is selected */
       return;
     }
 
     const updatedNote: Note = {
       id: selectedNote.id,
       title: title,
       content: content,
     }
 
     const updatedNotesList = notes.map((note)=>
       note.id === selectedNote.id
         ? updatedNote
         : note
     )
     /* resets form */
     setNotes(updatedNotesList)
     setTitle("")
     setContent("")
     setSelectedNote(null);
   };
 
   const handleCancel = () => { /* handles canceling a note */
     setTitle("")
     setContent("")
     setSelectedNote(null);
   }
 
   const deleteNote = (
     event: React.MouseEvent,
     noteId: number
   ) => {
     event.stopPropagation(); /* this function stops the delete note event
     from intefering with the add note click event - only necessary when 
     there are nested on-click events */
 
     const updatedNotes = notes.filter( /* iterates through an array and applies the function defined in each item to the array */
       (note)=> note.id !== noteId
     )
 
     setNotes(updatedNotes);
   };
 
   return(
     <div className="app-container">
        {/* <Nav />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/student" element={<Student />} />
          <Route path="/coach" element={<Coach />} />
        </Routes> */}
       <form
         className="note-form"
         onSubmit={(event) => 
           selectedNote
             ? handleUpdateNote(event)
             : handleAddNote(event)
         }
       >
         <input
         value={title}
         onChange={(event)=> /* this changes title state value based on what the user has inputed */
           setTitle(event.target.value)
         }
           placeholder="Name"
           required
         ></input>
         <textarea
           value={content}
           onChange={(event)=> /* this changes note text state value based on what the user has inputed */
             setContent(event.target.value)
           }
           placeholder={"Teaching Level:\nAge:\nBackground:\n"}
           rows={10}
           required
         ></textarea>
 
           {selectedNote ? (
             <div className = "edit-buttons">
               <button type = "submit"> Save </button>
               <button onClick = {handleCancel}>
                 Cancel
               </button>
             </div>
           ) : (
             <><button type="submit"> Add Profile </button><button type="submit"> Match </button></> /*match button does same thing as add profile for now */
           )}
       </form>
       <div className="notes-grid">
         {notes.map((note) => (
           <div 
             className="notes-item"
             onClick={() => handleNoteClick(note)} /* each note now has a onClick function added to it; users can now edit selected notes */
             >
             <div className="notes-header">
               <button onClick={(event) =>
                 deleteNote(event, note.id)
               }
               >
                 x
               </button>
             </div>
             <h2>{note.title}</h2>
             <p>{note.content}</p>
           </div>        
         ))}
 
         <label htmlFor="dropdown">Choose a sport:</label>
 
         <select id="dropdown" value={dropdown} onChange={handleDropdown}>
           <option value=""></option>
           <option value="soccer">Soccer</option>
           <option value="basketball">Basketball</option>
           <option value="tennis">Tennis</option>
           <option value="volleyball">Volleyball</option>
           <option value="swimming">Swimming</option>
           <option value="football">Football</option>
           <option value="golf">Golf</option>
           <option value="table tennis">Table Tennis</option>
           <option value="badminton">Badminton</option>
           <option value="handball">Handball</option>
           <option value="wrestling">Wrestling</option>
           <option value="boxing">Boxing</option>
           <option value="cross country">Cross Country</option>
           <option value="track">Track</option>
           <option value="baseball">Baseball</option>
           <option value="cricket">Cricket</option>
           <option value="ice hockey">Ice Hockey</option>
         </select>
       </div>
     </div>  
   );
 };
 
 export default App;

