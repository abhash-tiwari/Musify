import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './App.css';
import Sidebar from './Components/Sidebar/Sidebar';
import SongList from './Components/SongList/SongList';

function App() {
  const [songs, setSongs] = useState([]);
  const [currentSong, setCurrentSong] = useState(null);
  const appContainerRef = useRef(null);

  useEffect(()=> {
    const fetchSongs = async () => {
      try {
        const response = await axios.get('https://cms.samespace.com/items/songs');
        setSongs(response.data.data);
      } catch (err) {
        console.error('Error fetching songs:', err)
      }
    };

    fetchSongs();
  },[])
  return (
    <div className="App">
      {songs.map((ele) => (
        <div key={ele.id}>
          {ele.artist}
        </div>
      ))}
    </div>
  );
}

export default App;
