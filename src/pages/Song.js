import React, { useContext, useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import "../styles/Song.css"
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import PauseRoundedIcon from '@mui/icons-material/PauseRounded';
import VerticalAlignBottomRoundedIcon from '@mui/icons-material/VerticalAlignBottomRounded';
import FavoriteBorderRoundedIcon from '@mui/icons-material/FavoriteBorderRounded';
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';
import { IconButton } from '@mui/material';
import PlayerContext from '../PlayerContext';
import axios from 'axios';

function Song() {
    const location = useLocation();
    // let id = location.state.id;
    const path = location.pathname.split("/");
    let id = parseInt(path[2]);

    const [song, setSong]=useState([]);
    const [album, setAlbum]=useState([]);
    useEffect(() => {
        axios.get(`http://localhost:9098/api/song/${id}`)
        .then(response => {
            setSong(response.data);
            setAlbum(response.data.album);
        });
    }, []);


    const { isAuthed } = useSelector((state) => state.auth); //user
    const user = isAuthed ? JSON.parse(localStorage.getItem("user")) : [];

    const [fav, setFav] = useState(false);
    useEffect(() => {
        if (isAuthed) {
            axios.get(`http://localhost:9098/api/user/${user.id}/islikedsong/${id}`)
                .then(response => {
                    setFav(response.data);
            });
        }
    }, [id, isAuthed, user.id]);
    async function likeSong(event) {
        event.preventDefault();
        try {
          await axios.put(`http://localhost:9098/api/user/${user.id}/likeSong/${id}`);
        } catch (error) {
          alert(error);
        }
    }

    async function unlikeSong(event) {
        event.preventDefault();
        try {
          await axios.put(`http://localhost:9098/api/user/${user.id}/unlikeSong/${id}`);
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
    function dot3digits(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }
    const songContext = useContext(PlayerContext);
    const playSong = () => {
        songContext.setUsing(true);
        songContext.setTracks(song);
        songContext.setSongIndex(0);
        songContext.setSong(song);
        songContext.setPlay(true);
        // song.setPlaylist(song[0]);
        localStorage.setItem("song", JSON.stringify(song));
        localStorage.setItem("tracks", JSON.stringify(song));
        localStorage.setItem("playlist", JSON.stringify(song));
        localStorage.setItem("index", JSON.stringify(0));
        localStorage.setItem("play", JSON.stringify(true));
        localStorage.setItem("currentTime", 0);
        songContext.setCurrentTime(0);
        songContext.setPlaylist(song);
    };
    return (
        <div className='songContainer'>
            <div className='trackHeader'>
                <img id="i" src={song.img} alt={song.songname} />
                <div className='trackDetails'>
                    <p>Song</p>
                    <h1>{song.songname}</h1>
                    <p>
                        {song.performer?.map((a) => 
                            <span><Link to={`/artist/${a.id}`}>{a.username}</Link></span>
                        )}
                        &nbsp;• <Link to={`/album/${song.albumid}`}>{album.albumname}</Link>
                        &nbsp;• {new Date(album.releaseDate).getFullYear()}
                        &nbsp;• {dot3digits(parseInt(song.streams))} streams
                    </p>
                </div>
            </div>
            <div className='trackActions'>
                <IconButton className='playerIcon' onClick={playSong}>
                    {songContext.isUsing && play ? <PauseRoundedIcon className='trackActionIcon' /> : <PlayArrowRoundedIcon className='trackActionIcon' />}
                </IconButton>
                <IconButton className='purchases'>
                    <p id='fontVI'>0.0025</p>
                    <VerticalAlignBottomRoundedIcon fontSize='small' />
                </IconButton>
                <IconButton className='playerIcon' onClick={handleFav}>
                    {isAuthed 
                        ? (fav ? <FavoriteRoundedIcon className='favIcon trackActionIcon' onClick={(e)=>unlikeSong(e)} /> : <FavoriteBorderRoundedIcon className='trackActionIcon' onClick={(e)=>likeSong(e)} />)
                        : <FavoriteBorderRoundedIcon className='trackActionIcon' onClick={(e)=>likeSong(e)} />
                    }
                </IconButton>
            </div>
            <pre className='lyrics'>
                {song.lyrics}
            </pre>
        </div>
    )
}

export default Song
