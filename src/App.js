import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
// import './App.css';
import Sidebar from './Components/Sidebar/Sidebar';
import SongList from './Components/SongList/SongList';
// import { FastAverageColor } from 'fast-average-color';
import styles from './App.module.css';
import dot from './assets/Group 7.png';
import sound from './assets/Frame.png';
import pre from './assets/Vector.png';
import play from './assets/Vector (2).png';
import pause from './assets/Frame 32.png';
import next from './assets/Vector (7).png';

function App() {
  const [songs, setSongs] = useState([]);
  const [currentSong, setCurrentSong] = useState(null);
  const appContainerRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [backgroundColor, setBackgroundColor] = useState('#000');
  const audioRef = useRef(null);
  // const fac = new FastAverageColor();
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

  const [durations, setDurations] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredSongs, setFilteredSongs] = useState(songs);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const getSongDuration = (url, id) => {
    const audio = new Audio(url);
    audio.addEventListener('loadedmetadata', () => {
      const duration = audio.duration;
      const minutes = Math.floor(duration / 60);
      const seconds = Math.floor(duration % 60);
      const formattedDuration = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
      setDurations((prevDurations) => ({ ...prevDurations, [id]: formattedDuration }));
    });
  };

  useEffect(() => {
    songs.forEach((song) => {
      if (!durations[song.id]) {
        getSongDuration(song.url, song.id);
      }
    });
  }, [songs, durations]);

  useEffect(() => {
    const lowerCaseQuery = searchQuery.toLowerCase();
    setFilteredSongs(
      songs.filter((song) =>
        song.name.toLowerCase().includes(lowerCaseQuery) ||
        song.artist.toLowerCase().includes(lowerCaseQuery)
      )
    );
  }, [searchQuery, songs]);

  return (
    <div className={`${styles.Container} ${isMenuOpen ? styles.menuOpen : ''}`}>
      <div className={styles.headerContainer}>
        <h2 className={styles.header}>
          <span>For You</span>
          <span style={{ opacity: '0.6' }}>Top Tracks</span>
        </h2>
        {/* <FaBars
          className={styles.hamburgerIcon}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        /> */}
      </div>
      <div className={styles.search}>
        <input
          type="text"
          placeholder="Search Song, Artist"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {/* <FaSearch className={styles.searchIcon} /> */}
      </div>
      <div className={styles.songListContainer}>
        {filteredSongs.map((song) => (
          <div
            key={song.id}
            className={styles.songItem}
            onClick={() => setCurrentSong(song)}
          >
            <div className={styles.songCont}>
              <img
                src={`https://cms.samespace.com/assets/${song.cover}`}
                alt={song.name}
                className={styles.img}
              />
              <div className={styles.textContainer}>
                <h2>{song.name}</h2>
                <p>{song.artist}</p>
              </div>
              <div className={styles.duration}>
                <p>{durations[song.id]}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
