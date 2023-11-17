import React, { useContext, useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import '../styles/MusicPlayer.css'
import {  SkipNextRounded, SkipPreviousRounded, 
          PlayArrowRounded, PauseRounded,
          VolumeUpRounded, PlaylistPlay, VolumeOffRounded,
          FavoriteBorderRounded, FavoriteRounded } from '@mui/icons-material';
import { IconButton, Slider } from '@mui/material';
import PlayerContext from "../PlayerContext";
import LocalPlaylistContext from "../LocalPlaylistContext";
import axios from 'axios';
import { useSelector } from 'react-redux';

function Player() {
  const localPlaylist = useContext(LocalPlaylistContext);
  const player = useContext(PlayerContext);
  const songLocalStorage = localStorage.getItem("song") !== null
  ? JSON.parse(localStorage.getItem("song"))
  : player.song;
  const tracklist = player.isUsing ? player.tracks : [];
  const playlist = localStorage.getItem("playlist") !== null
    ? JSON.parse(localStorage.getItem("playlist"))
    : player.playlist;
  const tracklistLength = tracklist.length;
  let index = player.songIndex;
  let song = player.isUsing ? (playlist[index] !== undefined ? playlist[index] : songLocalStorage) : "";
  const audioRef = useRef();
  const [duration, setDuration] = useState(0); //seconds
  const [currentTime, setCurrentTime] = useState(player.currentTime);
  const [play, setPlay] = useState(player.play);

  window.onbeforeunload = function() {
    if(song!==""){
      localStorage.setItem("song", JSON.stringify(song));
    }
    if(index!==0){
      localStorage.setItem("index", JSON.stringify(index));
    }
  };
  const handleLoadedData = () => {
    setDuration(Math.ceil(audioRef.current.duration));
    if(!player.play) {
      audioRef.current.currentTime = player.currentTime;
      audioRef.current.volume = 0.1;
    }
    if(player.play) {
      if(!play) {
        setPlay(true);
        audioRef.current.volume = 0.1;
      }
      audioRef.current.play();
      audioRef.current.volume = 0.1;
    }
  }
  const handlePlayClick = () => {
    if(play) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
      if(!player.play) {
        player.setPlay(true);
        audioRef.current.volume = 0.1;
        localStorage.setItem("play", true);
      }
      localStorage.setItem("play", true);
    }
    setPlay(!play);
  }
  const handleDurationSlider = (x) => {
    audioRef.current.currentTime = x;
    setCurrentTime(x);
    if(!play) {
      setPlay(true);
      audioRef.current.play();
    }
  }; 
  function formatDuration(value) {
    value = Math.ceil(value);
    const minute = Math.floor(value / 60);
    const secondLeft = value - minute * 60;
    return `${minute}:${secondLeft < 10 ? `0${secondLeft}` : secondLeft}`;
  }
  const setNextIndex = () => {
    player.setSongIndex((index+1)%tracklistLength);
    player.setSong(song);
    localStorage.setItem("song", JSON.stringify(song));
    localStorage.setItem("index", JSON.stringify(player.songIndex));

    setPlay(true);
    audioRef.current.play();
    localStorage.setItem("currentTime", 0);
    player.setCurrentTime(0);
  };
  const setPrevIndex = () => {
    player.setSongIndex(index-1<0?tracklistLength-1:index-1);
    player.setSong(song);
    localStorage.setItem("song", JSON.stringify(song));
    localStorage.setItem("index", JSON.stringify(player.songIndex))

    setPlay(true);
    audioRef.current.play();
    localStorage.setItem("play", true);
    localStorage.setItem("currentTime", 0);
    player.setCurrentTime(0);
  }
  const removePlayerStatus = () => {
    localStorage.removeItem("play");
    localStorage.removeItem("song");
    localStorage.removeItem("tracks");
    localStorage.removeItem("index");
    localStorage.removeItem("currentTime");
    player.setUsing(false);
  };

  const { isAuthed } = useSelector((state) => state.auth); //user
  const user = isAuthed ? JSON.parse(localStorage.getItem("user")) : [];

  const [fav, setFav] = useState(false);
  useEffect(() => {
      if (isAuthed && player.isUsing) {
          axios.get(`http://localhost:9098/api/user/${user.id}/islikedsong/${song.id}`)
              .then(response => {
                  setFav(response.data);
          });
      }
  }, [fav, isAuthed, song.id, user.id]);
  async function likeSong(event) {
      event.preventDefault();
      try {
        await axios.put(`http://localhost:9098/api/user/${user.id}/likeSong/${song.id}`);
      } catch (error) {
        alert(error);
      }
  }

  async function unlikeSong(event) {
      event.preventDefault();
      try {
        await axios.put(`http://localhost:9098/api/user/${user.id}/unlikeSong/${song.id}`);
      } catch (error) {
        alert(error);
      }
  }
  const handleFav = () => {
    setFav(!fav);
  }
  const [mute, setMute] = useState(false);
  const handleMute = () => {
    setMute(!mute);
  }

  const playerMinimize = () => {
    document.getElementById('musicplayer').classList.add('miniPlayer');
    document.getElementById('musicplayer').classList.add('onleft');
    document.getElementById('musicplayer').classList.remove('musicplayer');
  }

  const playerMaximize = () => {
    document.getElementById('musicplayer').classList.add('musicplayer');
    document.getElementById('musicplayer').classList.remove('miniPlayer');
    document.getElementById('musicplayer').classList.remove('onleft');
  }

  return (
    //miniPlayer onleft
    player.isUsing && (
    <div id='musicplayer' className='musicplayer' style={player.isUsing ? {backgroundImage: `url(${song.img})`} : { display: "none" }}>
      <audio ref={audioRef} src={song.audio} onLoadedData={handleLoadedData}
        onTimeUpdate={() => {
          setCurrentTime(audioRef.current.currentTime);
          localStorage.setItem("currentTime", JSON.stringify(currentTime));
          player.setCurrentTime(currentTime);
        }}
        onEnded={() => {
          player.setSongIndex((index+1)%tracklistLength);
          player.setSong(playlist[player.songIndex]);
          localStorage.setItem("song", JSON.stringify(player.song));
          localStorage.setItem("index", JSON.stringify(player.songIndex));
        }}
      />
      <div className='playerDisplay'>
        <div className='windowControl'>
          <button id='fontVI' style={{fontWeight: '900', background: 'transparent', cursor: 'pointer', border: 'none', borderRadius: '50%', color: 'white', position: 'absolute', top: '0px', left: '0px', fontSize: 'smaller'}}
            className='minimize'
            onClick={() => {playerMinimize()}}
          >–</button>
          <button id='fontVI' style={{background: 'transparent', cursor: 'pointer', border: 'none', borderRadius: '50%', color: 'white', position: 'absolute', top: '0px', left: '0px', fontSize: 'smaller'}}
            className='maximize'
            onClick={() => {playerMaximize()}}
          >▢</button>
          <button id='fontVI' style={{background: 'transparent', cursor: 'pointer', border: 'none', borderRadius: '50%', color: 'white', position: 'absolute', top: '0px', right: '0px', fontSize: 'smaller'}}
            onClick={() => {
              removePlayerStatus();
              // localStorage.setItem("openLocalPlaylist", false);
              // localPlaylist.setOpen(false);
            }}>✖️</button>
        </div>
        <button id='fontVI' style={{background: 'transparent', cursor: 'pointer', border: 'none', borderRadius: '50%', color: 'white', position: 'absolute', top: '0px', right: '0px', fontSize: 'smaller'}}
          onClick={() => {
            removePlayerStatus();
            // localStorage.setItem("openLocalPlaylist", false);
            // localPlaylist.setOpen(false);
          }}>✖️</button>
        <div id='scroll-container' className='info'>
          <p id="scroll-text"><Link id='fontVI' to={`/song/${song.id}`}><b>{song.songname}</b></Link></p>
          <p id="scroll-text">
          {song.performer.map((artist, index) => 
            <span id='fontVI' key={index} item={artist} className="artist">
              <Link to={`/artist/${artist.id}`}>{artist.username}</Link></span>
          )}
          </p>
        </div>
        <div className='playcontrol'>
          <div className='playerRow1'>
            <IconButton onClick={() => {setPrevIndex();}} className='playerIcon'>
              <SkipPreviousRounded />
            </IconButton>
            <IconButton onClick={handlePlayClick} className='playerIcon'>
              {!play ? <PlayArrowRounded /> : <PauseRounded />}
            </IconButton>
            <IconButton onClick={() => {setNextIndex();}} className='playerIcon'>
              <SkipNextRounded />
            </IconButton>
          </div>
          <div className='playerRow2'>
            <p>{formatDuration(currentTime)}</p>
            <Slider size='small' value={currentTime} min={0} step={1} max={duration}
              onChange={(_, value) => handleDurationSlider(value)}
              sx={{color: `#fff`, height: 3, width: `14vh`, maxWidth: `100%`, margin: `0`,
                ".MuiSlider-thumb": { padding: 0, margin: 0, width: 6, height: 6, transition: "0.3s cubic-bezier(.47,1.64,.41,.8)" }, 
                ".MuiSlider-rail": { padding: 0, margin: 0, opacity: 0.28 } }} />
            <p>{formatDuration(duration - currentTime)}</p>
          </div>
          <div className='lastRow'>
            <div className='volume'>
              <IconButton className='playerIcon' onClick={handleMute}>
                {mute ? <VolumeOffRounded onClick={() => {audioRef.current.muted = false}} style={{fontSize: `18px`}} /> : <VolumeUpRounded onClick={() => {audioRef.current.muted = true}} style={{fontSize: `18px`}} />}
              </IconButton>
              <Slider defaultValue={10} size='small' min={0} step={1} max={100} 
                onChange={(e) => (audioRef.current.volume = e.target.value / 100)}
                sx={{color: `#fff`, height: 3, width: `6vh`, maxWidth: `100%`, margin: `0`,
                    ".MuiSlider-thumb": { padding: 0, margin: 0, width: 6, height: 6, transition: "0.3s cubic-bezier(.47,1.64,.41,.8)" }, 
                    ".MuiSlider-rail": { padding: 0, margin: 0, opacity: 0.28 } }} />
            </div>
            <div className='playlist'>
              <IconButton className='playerIcon' onClick={handleFav}>
                {isAuthed ? (
                  fav ? <FavoriteRounded className='favIcon' style={{fontSize: `18px`}} onClick={(e)=>unlikeSong(e)} /> : <FavoriteBorderRounded style={{fontSize: `18px`}} onClick={(e)=>likeSong(e)}/>
                ) : ( <FavoriteBorderRounded style={{fontSize: `18px`}} /> )}
              </IconButton>
              {/* <PlaylistPlay style={{cursor: 'pointer', fontSize: `18px`}} 
                // sx={localPlaylist.open ? { color: "yellow" } : { color: "white" }}
                onClick={() => {
                  localStorage.setItem("openLocalPlaylist", !localPlaylist.open);
                  localPlaylist.setOpen(!localPlaylist.open);
                }} /> */}
            </div>
          </div>
        </div>
      </div>
    </div>
    )
  )
}

export default Player
