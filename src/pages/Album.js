import React, { useContext, useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import "../styles/Song.css"
import { PlayArrowRounded, PauseRounded } from '@mui/icons-material';
import { FavoriteBorderRounded, FavoriteRounded } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import TrackItem from '../items/TrackItem';
import PlayerContext from '../PlayerContext';
import axios from 'axios';

function Album() {
  const location = useLocation();
  const path = location.pathname.split("/");
  let id = parseInt(path[2]);

  const [songs, setSongs]=useState([]);
  const [album, setAlbum] = useState([]);
  useEffect(() => {
    axios.get(`http://localhost:9098/api/album/${id}`)
    .then(response => {
      setAlbum(response.data);
    });
    axios.get(`http://localhost:9098/api/song/album=${id}`)
      .then(response => {
        setSongs(response.data);
      });
  }, []);
  let streams = 0;
  songs.map((item) => {
    streams += item.streams;
  });
  
  const { isAuthed } = useSelector((state) => state.auth); //user
  const user = isAuthed ? JSON.parse(localStorage.getItem("user")) : [];

  const [fav, setFav] = useState(false);
  useEffect(() => {
    if (isAuthed) {
      axios.get(`http://localhost:9098/api/user/${user.id}/islikedalbum/${id}`)
          .then(response => {
              setFav(response.data);
      });
    }
  }, [fav, id, isAuthed, user.id]);
  async function likeAlbum(event) {
      event.preventDefault();
      try {
          await axios.put(`http://localhost:9098/api/user/${user.id}/likeAlbum/${id}`);
      } catch (error) {
          alert(error);
      }
  }

  async function unlikeAlbum(event) {
      event.preventDefault();
      try {
          await axios.put(`http://localhost:9098/api/user/${user.id}/unlikeAlbum/${id}`);
      } catch (error) {
          alert(error);
      }
  }

  const [play, setPlay] = useState(false);
  const handlePlay = () => {
      setPlay(!play);
  }
  const handleFav = () => {
      setFav(!fav);
  }
  const song = useContext(PlayerContext);
  function dot3digits(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }
  const playAlbum = () => {
    song.setUsing(true);
    song.setTracks(songs);
    song.setSongIndex(0);
    song.setSong(songs[0]);
    song.setPlay(true);
    // song.setPlaylist(song[0]);
    localStorage.setItem("song", JSON.stringify(songs[0]));
    localStorage.setItem("tracks", JSON.stringify(songs));
    localStorage.setItem("playlist", JSON.stringify(songs));
    localStorage.setItem("index", JSON.stringify(0));
    localStorage.setItem("play", JSON.stringify(true));
    localStorage.setItem("currentTime", 0);
    song.setCurrentTime(0);
    song.setPlaylist(songs);
  };

  return (
      <div className='albumContainer'>
        <div className='trackHeader'>
            <img id="i" src={album.albumimg} alt={album.albumname} />
            <div className='trackDetails'>
                <p>{ (songs.length) > 1 ? 'Album' : 'Single' }</p>
                <h1>{album.albumname}</h1>
                <p>
                    <Link to={`/artist/${album.poster}`}>{album.owner}</Link>
                    &nbsp;• <span title={new Date(album.releaseDate).toUTCString()}>{new Date(album.releaseDate).getFullYear()}</span>
                    &nbsp;• {songs.length} songs
                    &nbsp;• {dot3digits(streams)} streams</p>
            </div>
        </div>
        <div className='trackActions'>
            <IconButton className='playerIcon' onClick={playAlbum}>
                {song.isUsing && play ? <PauseRounded className='trackActionIcon' /> : <PlayArrowRounded className='trackActionIcon' />}
            </IconButton>
            <IconButton className='playerIcon' onClick={handleFav}>
                {isAuthed ? (fav ? <FavoriteRounded className='favIcon trackActionIcon' onClick={(e)=>unlikeAlbum(e)} /> : <FavoriteBorderRounded className='trackActionIcon' onClick={(e)=>likeAlbum(e)}/>) : <FavoriteBorderRounded className='trackActionIcon'/>}
            </IconButton>
        </div>
        <div className='trackList'>
          <div className='tl-header'>
            <p>#</p>
            <p>Title</p>
            <p>Streams</p>
            <p>Duration</p>
          </div>
          {songs.map((item,key) => 
            <TrackItem item={item} index={key} tracks={songs} song={song} />
          )}
        </div>      
      </div>
  )
}

export default Album
