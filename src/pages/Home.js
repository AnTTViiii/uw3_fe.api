import React, { useContext, useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import axios from "axios";
import "../styles/Home.css";
import SongItem from '../items/SongItem';
import AlbumItem from '../items/AlbumItem';
import PlayerContext from '../PlayerContext';

function Home() {
  const song = useContext(PlayerContext);
  const [songs, setSongs]=useState([]);
  const [albums, setAlbums] = useState([]);
  useEffect(() => {
    fetch('http://localhost:9098/api/featuredSong')
      .then(response => response.json())
      .then(data => {
        setSongs(data);
      })
    fetch('http://localhost:9098/api/latestAlbum')
    .then(response => response.json())
    .then(data => {
      setAlbums(data);
    })
  }, [songs, albums]);
  return (
    <div className='homeContainer'>
        <div className='homeBody'>
            <div className='songs'>
                <h2>Featured Songs</h2>
                <div className='songsList'>
                  {songs.map((item, key) => 
                    <SongItem item={item} index={key} tracks={songs} song={song} />
                  )}
                </div>
            </div>
            <div className='albums'>
              <h2 style={{marginTop: `35px`}}>Featured Albums</h2>
              <div className='songsList'>
                  {albums.map((item, key) => 
                    <AlbumItem item={item} key={key} />
                  )}
              </div>
            </div>
            <div className='recommendForYou'>
              <h2 style={{marginTop: `35px`}}>For you</h2>
            </div>
            <div className='recentlyAlbums'>
              <h2 style={{marginTop: `35px`}}>Recently Streamed</h2>
            </div>
        </div>
    </div>
  )
}

export default Home
