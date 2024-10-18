import React, { useState } from 'react';

type Note = { 
  id: number;
  title: string;
  content: string;
};

const App = () => {
  const [notes, setNotes] = useState<Note[]>([]);

  const [dropdown, setDropdown] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);

  const handleDropdown = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setDropdown(event.target.value);
  };

  const handleNoteClick = (note: Note) => {
    setSelectedNote(note);
    setTitle(note.title);
    setContent(note.content);
  };

  const handleAddNote = (event: React.FormEvent) => {
    event.preventDefault();

    const newNote: Note = {
      id: notes.length + 1,
      title: title,
      content: content,
    };

    setNotes([newNote, ...notes]);
    setTitle("");
    setContent("");
  };

  const handleUpdateNote = (event: React.FormEvent) => {
    event.preventDefault();

    if (!selectedNote) {
      return;
    }

    const updatedNote: Note = {
      id: selectedNote.id,
      title: title,
      content: content,
    };

    const updatedNotesList = notes.map((note) =>
      note.id === selectedNote.id ? updatedNote : note
    );

    setNotes(updatedNotesList);
    setTitle("");
    setContent("");
    setSelectedNote(null);
  };

  const handleCancel = () => {
    setTitle("");
    setContent("");
    setSelectedNote(null);
  };

  const deleteNote = (event: React.MouseEvent, noteId: number) => {
    event.stopPropagation();
    const updatedNotes = notes.filter((note) => note.id !== noteId);
    setNotes(updatedNotes);
  };

  return (
    <div className="min-h-screen bg-uiuc-blue p-6"> {/* Set background to uiuc-blue */}
      <form
        className="bg-white p-6 rounded-lg shadow-lg space-y-4"
        onSubmit={(event) =>
          selectedNote ? handleUpdateNote(event) : handleAddNote(event)
        }
      >
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Name"
          required
          className="w-full p-2 border border-gray-300 rounded-md"
        />
        <textarea
          value={content}
          onChange={(event) => setContent(event.target.value)}
          placeholder="What is your age, teaching level and background?"
          rows={10}
          required
          className="w-full p-2 border border-gray-300 rounded-md"
        ></textarea>

        {selectedNote ? (
          <div className="flex space-x-4">
            <button
              type="submit"
              className="px-4 py-2 bg-uiuc-blue text-white rounded-md"
            >
              Save
            </button>
            <button
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-500 text-white rounded-md"
            >
              Cancel
            </button>
          </div>
        ) : (
          <div className="flex space-x-4">
            <button
              type="submit"
              className="px-4 py-2 bg-uiuc-orange text-white rounded-md"
            >
              Add Profile
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-yellow-500 text-white rounded-md"
            >
              Match
            </button>
          </div>
        )}
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {notes.map((note) => (
          <div
            key={note.id}
            className="bg-white p-4 rounded-lg shadow-lg hover:shadow-xl transition-all cursor-pointer"
            onClick={() => handleNoteClick(note)}
          >
            <div className="flex justify-between items-center">
              <button
                onClick={(event) => deleteNote(event, note.id)}
                className="text-red-500"
              >
                x
              </button>
            </div>
            <h2 className="text-lg font-semibold">{note.title}</h2>
            <p className="text-sm text-gray-600">{note.content}</p>
          </div>
        ))}
      </div>

      <div className="mt-6">
        <label htmlFor="dropdown" className="block text-sm font-medium text-white">
          Choose a sport:
        </label>
        <select
          id="dropdown"
          value={dropdown}
          onChange={handleDropdown}
          className="w-full mt-2 p-2 border border-gray-300 rounded-md"
        >
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
