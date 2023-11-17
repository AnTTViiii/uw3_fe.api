import React, { useContext, useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { useSelector } from 'react-redux';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import PauseRoundedIcon from '@mui/icons-material/PauseRounded';
import FavoriteBorderRoundedIcon from '@mui/icons-material/FavoriteBorderRounded';
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';
import { IconButton } from '@mui/material';
import PlayerContext from '../PlayerContext';
import axios from 'axios';

function AlbumItem({item}) {
    const { isAuthed } = useSelector((state) => state.auth); //user
    const user = isAuthed ? JSON.parse(localStorage.getItem("user")) : [];
    
    const [fav, setFav] = useState(false);
    useEffect(() => {
        if (isAuthed) {
            axios.get(`http://localhost:9098/api/user/${user.id}/islikedalbum/${item.id}`)
            .then(response => {
                setFav(response.data);
            });
        }
        
    }, [fav, isAuthed, item.id, user.id]);
    async function likeAlbum(event) {
        event.preventDefault();
        try {
            await axios.put(`http://localhost:9098/api/user/${user.id}/likeAlbum/${item.id}`);
        } catch (error) {
            alert(error);
        }
    }

    async function unlikeAlbum(event) {
        event.preventDefault();
        try {
            await axios.put(`http://localhost:9098/api/user/${user.id}/unlikeAlbum/${item.id}`);
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

    const [songs, setSongs]=useState([]);
    useEffect(() => {
    axios.get(`http://localhost:9098/api/song/album=${item.id}`)
        .then(response => {
        setSongs(response.data);
        });
    }, []);

    const playAlbum = () => {
        song.setUsing(true);
        song.setTracks(songs);
        song.setSongIndex(0);
        song.setSong(songs[0]);
        song.setPlay(true);
        setPlay(play);
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
        <div className='albumItemContainer'>
            <img src={item.albumimg} alt={item.albumname} />
            <p title={item.albumname}>
                <Link to={`/album/${item.id}`} state={{id: item.id}}>{item.albumname}</Link>
            </p>
            <p>
                <Link to={`/artist/${item.poster}`} state={{id: item.poster}}>{item.owner}</Link>
            </p>
            <div className='lastRow'>
                <IconButton className='playerIcon' onClick={playAlbum}>
                {(song.isUsing && song.play && JSON.parse(localStorage.getItem("song")).albumid === item.id) ? <PauseRoundedIcon /> : <PlayArrowRoundedIcon />}
                </IconButton>
                <div>
                    <IconButton className='playerIcon' onClick={handleFav}>
                        {isAuthed ? (fav ? <FavoriteRoundedIcon className='favIcon' onClick={(e)=>unlikeAlbum(e)}/> : <FavoriteBorderRoundedIcon onClick={(e)=>likeAlbum(e)} />) : (<FavoriteBorderRoundedIcon />)}
                    </IconButton>
                </div>
            </div>
        </div>
    )
}

export default AlbumItem
