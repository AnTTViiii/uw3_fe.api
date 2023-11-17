import React, { useContext, useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import axios from 'axios'
import "../styles/Song.css"
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import PauseRoundedIcon from '@mui/icons-material/PauseRounded';
import { StarBorderRounded, StarRounded } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import TrackItem from '../items/TrackItem';
import ArtistAlbumItem from '../items/ArtistAlbumItem';
import PlayerContext from '../PlayerContext';

function Artist() {
  const location = useLocation();
  const path = location.pathname.split("/");
  let id = parseInt(path[2]);

  const [artist, setArtist] = useState([]);
  const [songs, setSongs]=useState([]);
  const [albums, setAlbums] = useState([]);
  const [colabAlbums, setColabAlbums] = useState([]);
  useEffect(() => {
    axios.get(`http://localhost:9098/api/user/${id}`)
    .then(response => {
      setArtist(response.data);
    });
    axios.get(`http://localhost:9098/api/artist/${id}/song`)
      .then(response => {
        setSongs(response.data);
      });
    axios.get(`http://localhost:9098/api/artist/${id}/album`)
      .then(response => {
        setAlbums(response.data);
      });
    axios.get(`http://localhost:9098/api/artist/${id}/colabAlbum`)
    .then(response => {
      setColabAlbums(response.data);
    });
  }, [artist, songs, albums, colabAlbums]);

  console.log('Total of songs: ' + songs.length);
  let streams = 0;
  songs.map((s) => streams += s.streams);

  const { isAuthed } = useSelector((state) => state.auth); //user
  const user = isAuthed ? JSON.parse(localStorage.getItem("user")) : [];

  const [isFollow, setFollow] = useState(false);
  useEffect(() => {
    if (isAuthed) {
      axios.get(`http://localhost:9098/api/user/${user.id}/isfollow/${id}`)
          .then(response => {
              setFollow(response.data);
      });
    }
  }, [id, isAuthed, isFollow, user.id]);
  async function follow(event) {
      event.preventDefault();
      try {
        await axios.put(`http://localhost:9098/api/user/${user.id}/follow/${id}`);
      } catch (error) {
        alert(error);
      }
  }

  async function unfollow(event) {
      event.preventDefault();
      try {
        await axios.put(`http://localhost:9098/api/user/${user.id}/unfollow/${id}`);
      } catch (error) {
        alert(error);
      }
  }

  const [play, setPlay] = useState(false);
  const handlePlay = () => {
      setPlay(!play);
  }
  const handleFollow = () => {
    setFollow(!follow);
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
    <div className='artistContainer'>
      <div className='trackHeader'>
          <img id="i" src={artist.avatar} alt={artist.username} />
          <div className='trackDetails'>
              <p>Artist</p>
              <h1>{artist.username}</h1>
              <p>
                {dot3digits(parseInt(artist['followercount']))} followers
                &nbsp;• {songs.length} songs
                &nbsp;• {albums.length} albums
                &nbsp;• {dot3digits(streams)} streams
              </p>
          </div>
      </div>
      <div className='trackActions'>
          <IconButton className='playerIcon' onClick={()=>{handlePlay(); playAlbum()}}>
              {play ? <PauseRoundedIcon className='trackActionIcon' /> : <PlayArrowRoundedIcon className='trackActionIcon' />}
          </IconButton>
          <IconButton className='playerIcon' onClick={handleFollow}>
            {isAuthed ? (isFollow ? <StarRounded className='starIcon trackActionIcon' onClick={(e)=>unfollow(e)} /> : <StarBorderRounded className='trackActionIcon' onClick={(e)=>follow(e)} />) : <StarBorderRounded className='trackActionIcon'/>}
          </IconButton>
      </div>
      <div className='trackList'>
        <h2>🎵 Featured Songs</h2>
        <div className='tl-header'>
          <p>#</p>
          <p>Title</p>
          <p>Streams</p>
          <p>Duration</p>
        </div>
        <div style={{overflow: `hidden`, overflowY: `scroll`, maxHeight: `513px`, margin: 0, padding: 0}}>
        {songs.map((item,key) => 
          <TrackItem item={item} index={key} tracks={songs} song={song} />
        )}</div>
      </div>
      <div className='artistAlbums'>
        <h2>💿 Featured Albums</h2>
        <div>{albums.map((item,key) => 
          <ArtistAlbumItem item={item} seq={key} />
        )}</div>
      </div>
      <div className='artistAlbums'>
        <h2>💿 Collab Albums</h2>
        <div>{colabAlbums.map((item,key) => 
          <ArtistAlbumItem item={item} seq={key} />
        )}</div>
      </div>
    </div>
  )
}

export default Artist
