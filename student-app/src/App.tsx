import React, { useState } from 'react';
import OpenAI from 'openai';

type Note = { 
  id: number;
  title: string;
  content: string;
  sport: string;
  color?: string;
};

const App = () => {
  // Default profiles for testing
  const defaultStudentNotes: Note[] = [
    { id: 1, title: "Bob", content: "12 years old, complete beginner in basketball, looking to learn basics and have fun.", sport: "basketball" },
    { id: 2, title: "Sophie", content: "11 years old, competitive swimmer looking for advanced training.", sport: "swimming" },
    { id: 3, title: "David", content: "14 years old, plays competitive soccer and wants to train for high school team.", sport: "soccer" },
    { id: 4, title: "Maria", content: "13 years old, intermediate basketball player, wants to improve technique.", sport: "basketball" },
    { id: 5, title: "Charlie", content: "9 years old, beginner swimmer, needs to learn basic techniques.", sport: "swimming" },
    { id: 6, title: "Ethan", content: "15 years old, wants to play basketball at a competitive level, dreams of playing in college.", sport: "basketball" },
    { id: 7, title: "Alice", content: "10 years old, loves soccer and wants to improve her skills for fun and making friends.", sport: "soccer" },
  ];

  const defaultMentorNotes: Note[] = [
    { id: 1, title: "Coach Mike", content: "Basketball skills trainer, focuses on individual technique improvement for intermediate players.", sport: "basketball" },
    { id: 2, title: "Trainer Frank", content: "Swimming coach, specializes in teaching young beginners with patience and fun methods.", sport: "swimming" },
    { id: 3, title: "Coach John", content: "Former college player, trains competitive basketball players aiming for high school and college teams.", sport: "basketball" },
    { id: 4, title: "Coach Lisa", content: "Professional soccer trainer, focuses on competitive training and advanced techniques for teenagers.", sport: "soccer" },
    { id: 5, title: "Mentor Emma", content: "Basketball coach, specializes in teaching fundamentals to beginners in a fun environment.", sport: "basketball" },
    { id: 6, title: "Coach Sarah", content: "Former Olympic swimmer, trains competitive swimmers and advanced techniques.", sport: "swimming" },
    { id: 7, title: "Coach Dave", content: "Experienced soccer coach, specializes in youth development and fun training for ages 8-12.", sport: "soccer" },
  ];

  const [studentNotes, setStudentNotes] = useState<Note[]>(defaultStudentNotes);
  const [mentorNotes, setMentorNotes] = useState<Note[]>(defaultMentorNotes);
  
  const [studentTitle, setStudentTitle] = useState("");
  const [studentContent, setStudentContent] = useState("");
  const [studentSport, setStudentSport] = useState("");
  const [mentorTitle, setMentorTitle] = useState("");
  const [mentorContent, setMentorContent] = useState("");
  const [mentorSport, setMentorSport] = useState("");
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [matches, setMatches] = useState<{ studentId: number; mentorId: number; color: string }[]>([]);
  const [showStudentForm, setShowStudentForm] = useState(false);
  const [showMentorForm, setShowMentorForm] = useState(false);

  const openai = new OpenAI({
    apiKey: process.env.REACT_APP_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true,
  });

  const generateRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  const handleMatch = async () => {
    const prompt = `You are a matching algorithm. Your task is to match ALL students with mentors based on their sport and descriptions.

IMPORTANT RULES:
1. EVERY student must be matched with a mentor if there is a mentor available for their sport
2. EVERY mentor must be matched with a student if there is a student available for their sport
3. The sport MUST be exactly the same for a match to occur
4. Multiple mentors of the same sport should ALL be matched with students of that sport
5. Multiple students of the same sport should ALL be matched with mentors of that sport
6. If there are more students than mentors for a sport, mentors can be matched with multiple students
7. If there are more mentors than students for a sport, students can be matched with multiple mentors
8. Only leave someone unmatched if there is absolutely no available partner for their sport

COLOR RULES:
- Use ONLY light pastel colors that black text will be clearly readable on
- Each match must have a UNIQUE color, never repeat colors
- Use colors in this format: #RRGGBB where each pair ranges from 99 to FF
- Examples of good colors: #FFE4E1 (light pink), #E6F3FF (light blue), #F0FFF0 (light green), #FFF0F5 (lavender)
- Never use colors darker than #999999

Respond in exactly this format, one match per line:
Student: [Student Name], Mentor: [Mentor Name], Color: #[6-digit hex color]

Current profiles to match:

Students:
${studentNotes.map(note => `Name: ${note.title}, Sport: ${note.sport}, Description: ${note.content}`).join('\n')}

Mentors:
${mentorNotes.map(note => `Name: ${note.title}, Sport: ${note.sport}, Description: ${note.content}`).join('\n')}

Remember: 
1. EVERYONE with the same sport must be matched
2. Each match must have a unique, light pastel color
3. All colors must be light enough for black text to be readable
4. Never repeat colors between matches`;

    console.log("Prompt sent to OpenAI API:", prompt);

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ 
          role: "system", 
          content: "You are a matching algorithm that must match ALL possible pairs and assign unique, light pastel colors (#RRGGBB where RR,GG,BB range from 99 to FF) to each match. Ensure colors are light enough for black text to be readable."
        },
        { 
          role: "user", 
          content: prompt 
        }],
        max_tokens: 500,
        temperature: 0.3,
      });

      const matchesText = response.choices[0]?.message?.content?.trim();
      
      console.log('------------------------');
      console.log('🤖 OpenAI Raw Response:');
      console.log('------------------------');
      console.log(matchesText);
      console.log('------------------------');

      if (matchesText) {
        // Split the response into lines and process each match
        const newMatches = matchesText
          .split('\n')
          .map((match) => {
            // Log each match line for debugging
            console.log("Processing match line:", match);

            // Extract the parts using regex to be more precise
            const studentMatch = match.match(/Student: (.*?),/);
            const mentorMatch = match.match(/Mentor: (.*?),/);
            const colorMatch = match.match(/Color: (#[A-Fa-f0-9]{6})/);

            if (!studentMatch || !mentorMatch || !colorMatch) {
              console.log("Skipping invalid match format:", match);
              return null;
            }

            const studentName = studentMatch[1].trim();
            const mentorName = mentorMatch[1].trim();
            const color = colorMatch[1];

            // Find the corresponding student and mentor
            const student = studentNotes.find(s => s.title === studentName);
            const mentor = mentorNotes.find(m => m.title === mentorName);

            if (!student || !mentor) {
              console.log("Could not find student or mentor:", { studentName, mentorName });
              return null;
            }

            // Log successful match
            console.log("Created match:", { 
              studentId: student.id, 
              mentorId: mentor.id, 
              color 
            });

            return {
              studentId: student.id,
              mentorId: mentor.id,
              color: color
            };
          })
          .filter((match): match is { studentId: number; mentorId: number; color: string } => 
            match !== null
          );

        console.log("Final matches:", newMatches);
        setMatches(newMatches);
      } else {
        console.error("No matches found in the response.");
      }
    } catch (error) {
      console.error('Error fetching matches:', error);
    }
  };

  const handleAddStudentNote = (event: React.FormEvent) => {
    event.preventDefault();
    const newNote: Note = {
      id: studentNotes.length + 1,
      title: studentTitle,
      content: studentContent,
      sport: studentSport,
    };
    setStudentNotes([newNote, ...studentNotes]);
    setStudentTitle("");
    setStudentContent("");
    setStudentSport("");
  };

  const handleAddMentorNote = (event: React.FormEvent) => {
    event.preventDefault();
    const newNote: Note = {
      id: mentorNotes.length + 1,
      title: mentorTitle,
      content: mentorContent,
      sport: mentorSport,
    };
    setMentorNotes([newNote, ...mentorNotes]);
    setMentorTitle("");
    setMentorContent("");
    setMentorSport("");
  };

  const deleteNote = (event: React.MouseEvent, noteId: number, isStudent: boolean) => {
    event.stopPropagation();
    if (isStudent) {
      const updatedNotes = studentNotes.filter((note) => note.id !== noteId);
      setStudentNotes(updatedNotes);
    } else {
      const updatedNotes = mentorNotes.filter((note) => note.id !== noteId);
      setMentorNotes(updatedNotes);
    }
  };

  // Update the scrollbar styles to be more subtle
  const scrollbarStyles = `
    ::-webkit-scrollbar {
      width: 6px;
    }
    ::-webkit-scrollbar-track {
      background: transparent;
    }
    ::-webkit-scrollbar-thumb {
      background: rgba(255, 255, 255, 0.2);
      border-radius: 20px;
    }
    ::-webkit-scrollbar-thumb:hover {
      background: rgba(255, 255, 255, 0.3);
    }
  `;

  return (
    <>
      <style>{scrollbarStyles}</style>
      <div className="h-screen bg-uiuc-blue flex gap-4 overflow-hidden p-4">
        {/* Fixed Left Sidebar with Forms - Made slightly narrower */}
        <div className="w-80 bg-white shadow-2xl h-full rounded-xl">
          {/* Student Form - Top Half */}
          <div className="h-1/2 border-b border-gray-200 overflow-y-auto">
            <div className="p-4">
              <h3 className="text-xl font-bold mb-4">Add Student</h3>
              <form onSubmit={handleAddStudentNote} className="space-y-4">
                <input
                  value={studentTitle}
                  onChange={(event) => setStudentTitle(event.target.value)}
                  placeholder="Name"
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-uiuc-blue focus:border-transparent"
                />
                <div className="space-y-2">
                  <label htmlFor="studentSport" className="block text-sm font-medium text-gray-700">
                    Choose a sport:
                  </label>
                  <select
                    id="studentSport"
                    value={studentSport}
                    onChange={(event) => setStudentSport(event.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-uiuc-blue focus:border-transparent"
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
                <textarea
                  value={studentContent}
                  onChange={(event) => setStudentContent(event.target.value)}
                  placeholder="What is your age, interests and background?"
                  rows={3}
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-uiuc-blue focus:border-transparent"
                ></textarea>
                <button 
                  type="submit" 
                  className="w-full px-4 py-3 bg-uiuc-blue hover:bg-opacity-90 text-white rounded-lg font-semibold transition-all"
                >
                  Add Student Profile
                </button>
              </form>
            </div>
          </div>

          {/* Mentor Form - Bottom Half */}
          <div className="h-1/2 overflow-y-auto">
            <div className="p-4">
              <h3 className="text-xl font-bold mb-4">Add Mentor</h3>
              <form onSubmit={handleAddMentorNote} className="space-y-4">
                <input
                  value={mentorTitle}
                  onChange={(event) => setMentorTitle(event.target.value)}
                  placeholder="Name"
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-uiuc-blue focus:border-transparent"
                />
                <div className="space-y-2">
                  <label htmlFor="mentorSport" className="block text-sm font-medium text-gray-700">
                    Choose a sport:
                  </label>
                  <select
                    id="mentorSport"
                    value={mentorSport}
                    onChange={(event) => setMentorSport(event.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-uiuc-blue focus:border-transparent"
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
                <textarea
                  value={mentorContent}
                  onChange={(event) => setMentorContent(event.target.value)}
                  placeholder="What is your age, interests and background?"
                  rows={3}
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-uiuc-blue focus:border-transparent"
                ></textarea>
                <button 
                  type="submit" 
                  className="w-full px-4 py-3 bg-uiuc-blue hover:bg-opacity-90 text-white rounded-lg font-semibold transition-all"
                >
                  Add Mentor Profile
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Main Content Area - Adjusted padding and spacing */}
        <div className="flex-1 flex flex-col h-screen overflow-hidden">
          {/* Header with Title and Match Button */}
          <div className="flex justify-between items-center mb-6 px-4">
            <h1 className="text-6xl font-bold text-white tracking-wider">
              Match<span className="text-yellow-500">ify</span>
              <span className="text-2xl text-gray-400 ml-4 tracking-normal">
                Building athletes, one bond at a time
              </span>
            </h1>
            
            <button 
              onClick={handleMatch} 
              className="px-8 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg text-xl font-semibold shadow-lg transition-all"
            >
              Match Profiles
            </button>
          </div>

          {/* Cards Container with Divider - Better spacing */}
          <div className="flex-1 flex gap-6 min-h-0 bg-white/5 rounded-xl p-4">
            {/* Student Cards Section */}
            <div className="flex-1 flex flex-col min-h-0">
              <h2 className="text-xl font-bold text-yellow-500 mb-4 px-2">Students</h2>
              <div className="flex-1 overflow-y-auto px-2">
                <div className="grid grid-cols-2 gap-3">
                  {studentNotes.map((note) => (
                    <div 
                      key={note.id} 
                      className="bg-white p-4 rounded-lg shadow-lg h-[200px] flex flex-col justify-between transition-all hover:shadow-xl"
                      style={{ backgroundColor: matches.find(m => m.studentId === note.id)?.color }}
                    >
                      <div>
                        <h3 className="text-xl font-semibold mb-3">{note.title}</h3>
                        <p className="text-gray-600 line-clamp-3">{note.content}</p>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                          {note.sport}
                        </span>
                        <button 
                          onClick={(event) => deleteNote(event, note.id, true)}
                          className="text-red-500"
                        >
                          X
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Vertical Divider - Made more subtle */}
            <div className="w-px bg-white/10"></div>

            {/* Mentor Cards Section */}
            <div className="flex-1 flex flex-col min-h-0">
              <h2 className="text-xl font-bold text-yellow-500 mb-4 px-2">Mentors</h2>
              <div className="flex-1 overflow-y-auto px-2">
                <div className="grid grid-cols-2 gap-3">
                  {mentorNotes.map((note) => (
                    <div 
                      key={note.id} 
                      className="bg-white p-4 rounded-lg shadow-lg h-[200px] flex flex-col justify-between transition-all hover:shadow-xl"
                      style={{ backgroundColor: matches.find(m => m.mentorId === note.id)?.color }}
                    >
                      <div>
                        <h3 className="text-xl font-semibold mb-3">{note.title}</h3>
                        <p className="text-gray-600 line-clamp-3">{note.content}</p>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                          {note.sport}
                        </span>
                        <button 
                          onClick={(event) => deleteNote(event, note.id, false)}
                          className="text-red-500"
                        >
                          X
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default App;
