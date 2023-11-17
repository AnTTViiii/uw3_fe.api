import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from "react-redux";
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import PauseRoundedIcon from '@mui/icons-material/PauseRounded';
import VerticalAlignBottomRoundedIcon from '@mui/icons-material/VerticalAlignBottomRounded';
import FavoriteBorderRoundedIcon from '@mui/icons-material/FavoriteBorderRounded';
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';
import { IconButton } from '@mui/material';
import "../styles/SongItem.css";
import axios from 'axios';

function SongItem({item, song, index, tracks}) {
    const { isAuthed } = useSelector((state) => state.auth); //user
    const user = isAuthed ? JSON.parse(localStorage.getItem("user")) : [];
    const handleFav = () => {
        setFav(!fav);
    }
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

    return (
        <div className='songItemContainer'>
            <img src={item.img} alt={item.songname} />
            <p title={item.songname}>
                <Link to={`/song/${item.id}`} state={{id: item.id}}>{item.songname}</Link>
            </p>
            <p className='trackArtists'>{item.performer?.map((a, key) => 
                <span><Link to={`/artist/${a.id}`} state={{id: a.id}}>{a.username}</Link></span>
            )}</p>
            <div className='lastRow'>
                <IconButton className='playerIcon' 
                    onClick={() => {
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
                    }}>
                    {(song.isUsing && song.play && JSON.parse(localStorage.getItem("song")).songid === item.id) ? <PauseRoundedIcon /> : <PlayArrowRoundedIcon />}
                </IconButton>
                <IconButton className='purchases'>
                    <p id='fontVI'>0.0025</p>
                    <VerticalAlignBottomRoundedIcon fontSize='small' />
                </IconButton>
                <IconButton className='playerIcon' onClick={handleFav}>
                    {isAuthed ? (
                        fav ? <FavoriteRoundedIcon className='favIcon' onClick={(e)=>unlikeSong(e)} /> : <FavoriteBorderRoundedIcon onClick={(e)=>likeSong(e)}/>
                    ) : ( <FavoriteBorderRoundedIcon /> )}
                </IconButton>
            </div>
        </div>
    )
}

export default SongItem
