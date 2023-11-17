import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from "react-redux";
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import PauseRoundedIcon from '@mui/icons-material/PauseRounded';
import FavoriteBorderRoundedIcon from '@mui/icons-material/FavoriteBorderRounded';
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';
import { IconButton } from '@mui/material';
import "../styles/TrackItem.css"
import axios from 'axios';

function TrackItem({item, song, index, tracks}) {
    const { isAuthed } = useSelector((state) => state.auth); //user
    const user = isAuthed ? JSON.parse(localStorage.getItem("user")) : [];

    const [fav, setFav] = useState(false);
    useEffect(() => {
        if (isAuthed) {
            axios.get(`http://localhost:9098/api/user/${user.id}/islikedsong/${item.id}`)
                .then(response => {
                    setFav(response.data);
            });
        }
    }, [fav, isAuthed, item.id, user.id]);
    async function likeSong(event) {
        event.preventDefault();
        try {
          await axios.put(`http://localhost:9098/api/user/${user.id}/likeSong/${item.id}`);
        } catch (error) {
          alert(error);
        }
    }

    async function unlikeSong(event) {
        event.preventDefault();
        try {
          await axios.put(`http://localhost:9098/api/user/${user.id}/unlikeSong/${item.id}`);
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
    function getStringDuration(duration) {
        let minutes = Math.floor(duration / 60);
        let seconds = Math.round(duration - (minutes * 60));
        if (seconds < 10) {seconds = "0"+seconds;}
        let time = "" + minutes + ":" + seconds;
        return time
    };
    function dot3digits(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }
    return (
        <div className='trackItemContainer'>
            <div className='first-col'>
                <p style={!(song.isUsing && song.play && JSON.parse(localStorage.getItem("song")).songid === item.id) ? {display: `flex`} : {display: `none`}}>{index+1}</p>
                <IconButton className='playIcon' onClick={() => {
                        if (song.isUsing !== true) { song.setUsing(true); }
                        song.setPlay(true);
                        song.setSong(item);
                        song.setTracks(tracks);
                        song.setPlaylist(tracks);
                        song.setSongIndex(index);
                        localStorage.setItem("song", JSON.stringify(item));
                        localStorage.setItem("tracks", JSON.stringify(tracks));
                        localStorage.setItem("playlist", JSON.stringify(tracks));
                        localStorage.setItem("index", JSON.stringify(index));
                        localStorage.setItem("play", JSON.stringify(true));
                        localStorage.setItem("currentTime", 0);
                        song.setCurrentTime(0);
                    }} style={(song.isUsing && song.play && JSON.parse(localStorage.getItem("song")).songid === item.id) ? {display: `flex`} : {display: `none`}}>
                    {(song.isUsing && song.play && JSON.parse(localStorage.getItem("song")).songid === item.id) ? <PauseRoundedIcon /> : <PlayArrowRoundedIcon style={{display: `flex`, zIndex:2}} />}
                </IconButton>
            </div>
            <div className='trackItemTitle'>
                <img src={item.songimg !== undefined ? item.songimg : item.img} alt={item.songname} />
                <p title={item.songname}><Link to={`/song/${item.id}`} state={{id: item.id}}>{item.songname}</Link></p>
            </div>
            <p className='trackStreams'>{dot3digits(item.streams)}</p>
            <p className='last-col'>
                <IconButton onClick={handleFav} className='favsIcon'>
                    {isAuthed ? (
                        fav ? <FavoriteRoundedIcon className='favIcon' onClick={(e)=>unlikeSong(e)} /> : <FavoriteBorderRoundedIcon onClick={(e)=>likeSong(e)} />
                    ) : ( <FavoriteBorderRoundedIcon /> )}
                </IconButton>
                <p id='duration'>{getStringDuration(item.duration)}</p>
            </p>
        </div>
    )
}

export default TrackItem
