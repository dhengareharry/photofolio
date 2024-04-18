// AlbumsForm.js
import { useEffect, useReducer, useState } from "react";
import "../CSS/AlbumsForm.css";
import { db } from "../Firebase";
import { collection, addDoc, onSnapshot } from "firebase/firestore";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Reducer function for albums state
function AlbumReducer(state, action) {
  switch (action.type) {
    case "ADD":
      return [...state, action.album];
    case "SET_ALBUMS":
      return action.albums;
    default:
      return state;
  }
}

export default function AlbumsForm({ showForm, handleForm, handleAlbumClick }) {
  const [form, setForm] = useState("");
  const [Albums, dispatch] = useReducer(AlbumReducer, []);

  // Fetch albums data from Firestore
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "Albums"), (snapshot) => {
      const fetchedAlbums = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      dispatch({ type: "SET_ALBUMS", albums: fetchedAlbums });
    });

    return () => unsubscribe();
  }, []);

  // Handle album submission
  async function handleSubmit(e) {
    e.preventDefault();
    if (form.trim() === "") return;

    const newAlbum = form;
    const albumRef = await addDoc(collection(db, "Albums"), {
      name: newAlbum,
      time: new Date(),
    });

    setForm("");
    
    // Show a success toast for album creation
    toast.success("Album created successfully!", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  }
// JSX for AlbumsForm component
  return (
    <div className="container">
      <div className="App-content">
        {showForm && (
          <div className="form">
            <div>Create an album</div>
            <form onSubmit={handleSubmit}>
              <input
                required
                placeholder="Album Name"
                value={form}
                onChange={(e) => setForm(e.target.value)}
              />
              <button type="button" onClick={() => setForm("")}>
                Clear
              </button>
              <button type="submit">Create</button>
            </form>
          </div>
        )}
        <div className="Album-top">
          <h1>Your Albums</h1>
          <button
            className={showForm ? "Cancel-btn" : "Add-btn"}
            onClick={handleForm}
          >
            {showForm ? "Cancel" : "Add Album"}
          </button>
        </div>
        <div className="Album-container">
          {Albums.map((album) => (
            <div
              className="Album-Item"
              key={album.id}
              onClick={() => handleAlbumClick(album.name)}
            >
              <img
                src="https://cdn-icons-png.flaticon.com/128/2659/2659360.png"
                alt="logo"
              />
              <span>{album.name}</span>
            </div>
          ))}
        </div>
      </div>
      <ToastContainer /> {/* Add ToastContainer at the root level */}
    </div>
  );
}
