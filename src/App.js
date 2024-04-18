import AlbumsForm from './Components/AlbumsForm';
import { useState } from 'react';
import './App.css';
import Navbar from './Components/Navbar';
import ImageForm from './Components/ImageForm';
function App() {
  const [showForm, setShowForm] = useState(false);
  const [selectedAlbum, setSelectedAlbum] = useState(null);

  const handleAlbumClick = (albumName) => {
    setSelectedAlbum(albumName);
  };
  const handleForm = () => {
    setShowForm(!showForm);
  };
  const navigateToAlbumsForm = () => {
    setShowForm(false)
    setSelectedAlbum(null);
  };
  return (
    <div className="App">
<Navbar navigateToAlbumsForm={navigateToAlbumsForm} />      {
      selectedAlbum ? (
        <ImageForm showForm={showForm} handleForm={handleForm} selectedAlbum={selectedAlbum} navigateToAlbumsForm={navigateToAlbumsForm}/>
     ):
      (
        <AlbumsForm showForm={showForm} handleForm={handleForm} handleAlbumClick={handleAlbumClick}/>
      )
     }
     
    </div>
  );
}

export default App;
