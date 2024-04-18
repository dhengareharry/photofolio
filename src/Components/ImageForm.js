import { useState, useEffect } from "react";
import "../CSS/Imageform.css";
import { db } from "../Firebase";
import { collection, getDocs, deleteDoc, doc, addDoc, updateDoc } from "firebase/firestore";
import FullImageView from "./fullImageView";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ImageForm({ navigateToAlbumsForm, selectedAlbum, showForm, handleForm }) {
  const [imageForm, setImageForm] = useState({ title: "", url: "" });
  const [inputVisible, setInputVisible] = useState(false); // State for input visibility
  const [images, setImages] = useState([]);
  const [fullImageView, setFullImageView] = useState({
    open: false,
    currentIndex: 0,
  });
  const [search,setSearch] = useState("") // State for search term
  const [loading, setLoading] = useState(true);
  const [editingIndex, setEditingIndex] = useState(-1);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedUrl, setEditedUrl] = useState("");

  useEffect(() => {
    fetchImages();
  }, [selectedAlbum,setSearch]);// Update when selectedAlbum or searchTerm changes

  
async function fetchImages() {
  if (!selectedAlbum) {
    return;
  }
  setLoading(true)

  const albumRef = doc(collection(db, "Albums"), selectedAlbum);
  const imagesQuery = collection(albumRef, "Images");

  const querySnapshot = await getDocs(imagesQuery);
  const fetchedImages = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  // Filter images based on the search term (first letter of the title)
  const filteredImages = fetchedImages.filter((image) =>
    image.title.toLowerCase().startsWith(search.toLowerCase())
  );

  setImages(filteredImages);
  setLoading(false)
}
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const handleInputToggle = () => {
    setInputVisible(!inputVisible);
  };

  const goBackToAlbumsForm = () => {
    navigateToAlbumsForm(); // Call the callback to navigate
  };

  // Handle image submission
  async function handleImgaeSubmit(e) {
    e.preventDefault();

    const albumRef = doc(collection(db, "Albums"), selectedAlbum);
    const imageRef = collection(albumRef, "Images");

    if (editingIndex !== -1) {
      // Update existing image
      const imageId = images[editingIndex].id;

      await updateDoc(doc(imageRef, imageId), {
        title: editedTitle,
        url: editedUrl,
      });

      setEditingIndex(-1);
      setEditedTitle("");
      setEditedUrl("");
    } else {
      // Add new image
      await addDoc(imageRef, {
        title: imageForm.title,
        url: imageForm.url,
        time: new Date(),
      });

      setImageForm({ title: "", url: "" });
    }

    // Refetch images after updating or adding
    fetchImages();
    const toastMessage = editingIndex !== -1 ? "Image updated successfully!" : "Image added successfully!";
    toast.success(toastMessage, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  }

  // Handle Delete Image from Database
  async function handleImageDelete(id) {
    try {
      const albumRef = doc(db, "Albums", selectedAlbum);
      const imageRef = collection(albumRef, "Images");
      await deleteDoc(doc(imageRef, id));

      // Refetch images after deleting an image
      fetchImages();
       // Show success or error toast notification
       toast.success("Image deleted successfully!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } catch (error) {
      console.error("Error deleting image:", error);
      toast.error("Error deleting image. Please try again later.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  }

  const openFullImageView = (index) => {
    setFullImageView({
      open: true,
      currentIndex: index,
    });
  };

  const closeFullImageView = () => {
    setFullImageView({
      open: false,
      currentIndex: 0,
    });
  };

  const startEdit = (index) => {
    const image = images[index];
    setEditingIndex(index);
    setEditedTitle(image.title);
    setEditedUrl(image.url);
    handleForm();
  };

  const handleUpdate = async (index) => {
    try {
      const albumRef = doc(collection(db, "Albums"), selectedAlbum);
      const imageRef = collection(albumRef, "Images");
      const imageId = images[index].id;

      await updateDoc(doc(imageRef, imageId), {
        title: editedTitle,
        url: editedUrl,
      });

      fetchImages();
      setEditingIndex(-1);
      setEditedTitle("");
      setEditedUrl("");
    } catch (error) {
      console.error("Error editing image:", error);
    }
  };

  const cancelEdit = () => {
    setEditingIndex(-1);
    setEditedTitle("");
    setEditedUrl("");
  };

  // JSX for ImageForm component
  return (
    <div className="App-content">
      {showForm && (
        <div className="form">
          <div>
            {editingIndex !== -1
              ? `Update Image in ${selectedAlbum}`
              : `Add Image to ${selectedAlbum}`}
          </div>
          <form onSubmit={handleImgaeSubmit}>
            <input
              required
              placeholder="Title"
              value={editingIndex !== -1 ? editedTitle : imageForm.title}
              onChange={(e) =>
                editingIndex !== -1
                  ? setEditedTitle(e.target.value)
                  : setImageForm({ ...imageForm, title: e.target.value })
              }
            />
            <input
              required
              placeholder="Image Url"
              value={editingIndex !== -1 ? editedUrl : imageForm.url}
              onChange={(e) =>
                editingIndex !== -1
                  ? setEditedUrl(e.target.value)
                  : setImageForm({ ...imageForm, url: e.target.value })
              }
            />
            {editingIndex !== -1 ? (
              <>
                <button type="button" onClick={cancelEdit}>
                  Cancel
                </button>
                <button type="button" onClick={() => handleUpdate(editingIndex)}>
                  Update Image
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => setImageForm({ title: "", url: "" })}
                >
                  Clear
                </button>
                <button type="submit">Add Image</button>
              </>
            )}
          </form>
        </div>
      )}
      
      <div className="Album-top">
        <span>
          <img
            src="https://cdn-icons-png.flaticon.com/128/2099/2099238.png"
            onClick={goBackToAlbumsForm}
          />
        </span>
        <h1>Images in {selectedAlbum}</h1>
        <div className="Album-top2">
          {inputVisible && (
            <input
              placeholder="Enter something"
              value={search}
            onChange={handleSearchChange}
            />
          )}
          <img
            src="https://cdn-icons-png.flaticon.com/128/9177/9177086.png"
            onClick={handleInputToggle}
          />
        </div>
        <button
          className={showForm ? "Cancel-btn" : "Add-btn"}
          onClick={handleForm}
        >
          {showForm ? "Cancel" : "Add Image"}
        </button>
      </div>
      <div className="Image-container">
      {loading ? (
          <div>Loading...</div>
        ) : images.length === 0 ? (
          <div>No images found in the album.</div>
        ):(
          images.map((image, index) => (
            <div className="Image-Item" key={image.id}>
              <div className="Image-Actions">
                <img
                  className="EditButton"
                  src="https://cdn-icons-png.flaticon.com/128/10336/10336582.png"
                  alt="Edit"
                  onClick={() => startEdit(index)}
                />
              </div>
              <div className="Image-Actions2" onClick={() => handleImageDelete(image.id)}>
                <img
                  className="DeleteButton"
                  src="https://cdn-icons-png.flaticon.com/128/9790/9790368.png"
                  alt="Delete"
                />
              </div>
              <img src={image.url} alt="Image" onClick={() => openFullImageView(index)} />
              <span>{image.title}</span>
            </div>
          ))
        )}
        
      </div>
      {fullImageView.open && (
        <FullImageView
          images={images}
          currentIndex={fullImageView.currentIndex}
          onClose={closeFullImageView}
          onNext={() => openFullImageView((fullImageView.currentIndex + 1) % images.length)}
          onPrev={() => openFullImageView((fullImageView.currentIndex - 1 + images.length) % images.length)}
        />
      )}
      <ToastContainer /> 
    </div>
  );
}
