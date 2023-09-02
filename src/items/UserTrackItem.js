import React, { useState, useRef } from 'react';
import Popup from "reactjs-popup";
import { Link, useNavigate } from 'react-router-dom';
import "reactjs-popup/dist/index.css";
import { useDispatch, useSelector } from "react-redux";
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import PauseRoundedIcon from '@mui/icons-material/PauseRounded';
import FavoriteBorderRoundedIcon from '@mui/icons-material/FavoriteBorderRounded';
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';
import { ModeEditRounded, DeleteForeverRounded } from '@mui/icons-material'
import { Button, IconButton } from '@mui/material';
import { authActions } from "../stores/auth";
import '../styles/UserTrackItem.css';

function UserTrackItem({item, song, index, tracks}) {
    const { isAuthed } = useSelector((state) => state.auth); //user
    const [fav, setFav] = useState(false);
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
    const editRef = useRef();
    const removeRef = useRef();

    const closeEditPopup = () => editRef.current.close();
    const openEditPopup = () => editRef.current.open();

    const closeRemovePopup = () => removeRef.current.close();
    const openRemovePopup = () => removeRef.current.open();
    
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [showAlert, setShowAlert] = useState(error !== null ? true : false);
    const setAlertError = (error) => {
        setError(error);
        setShowAlert(true);
    };
    const dispatch = useDispatch();

    const handleUpdate = () => {
        closeEditPopup();
    }
    const handleRemove = () => {
        closeRemovePopup();
    }

    return (
        <div className='userTrackContainer'>
            <p className='first-col'>
                <p style={!(song.isUsing && song.play && JSON.parse(localStorage.getItem("song")).songid === item.songid) ? {display: `flex`} : {display: `none`}}>{index+1}</p>
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
                    }} style={(song.isUsing && song.play && JSON.parse(localStorage.getItem("song")).songid === item.songid) ? {display: `flex`} : {display: `none`}}>
                    {(song.isUsing && song.play && JSON.parse(localStorage.getItem("song")).songid === item.songid) ? <PauseRoundedIcon /> : <PlayArrowRoundedIcon style={{display: `flex`, zIndex:2}} />}
                </IconButton>
            </p>
            <img src={item.songImg} alt={item.songname} />
            <p title={item.songname}><Link to={`/song/${item.songid}`}>{item.songname}</Link></p>
            <p className='artist'>
                {item.artist.map((p) => 
                    <span><Link to={`/artist/${p.artistid}`}>{p.artistname}</Link></span>
                )}
            </p>
            <p><Link to={`/album/${item.albumid}`}>{item.albumname}</Link></p>
            <p>{item.genre}</p>
            <p>{dot3digits(item.streams)}</p>
            <p className='last-col'>
                <IconButton onClick={handleFav} className='favsIcon'>
                    {isAuthed ? (
                        fav ? <FavoriteRoundedIcon className='favIcon' /> : <FavoriteBorderRoundedIcon />
                    ) : ( <FavoriteBorderRoundedIcon /> )}
                </IconButton>
                <p id='duration'>{getStringDuration(item.duration)}</p>
            </p>
            <p>$0.0025</p>
            <p>
                <ModeEditRounded fontSize='small' sx={{cursor: 'pointer'}} onClick={openEditPopup} />
                <DeleteForeverRounded fontSize='small' sx={{cursor: 'pointer'}} onClick={openRemovePopup} />
            </p>
            <Popup ref={editRef} modal
                contentStyle={{ zIndex: "11", margin: "auto", borderRadius: "10px", padding: "20px 20px 5px", width: "45%", maxWidth: "400px", }}>
                <div>
                    <div id="fontVI" className="btnCloseForm" onClick={closeEditPopup}>✖️</div>
                    <h2 align="center" style={{marginBlock: 0}}>Update Song Properties</h2>
                    <div className="updateSong">
                        <form>
                            <p>Song title: 	<input type='text' value={item.songname} /></p>
                            <p>Album: <input type='text' value={item.albumname} /></p>
                            <p title='Each genre must be separated by a slash (/).'>Genre: <input type='text' value={item.genre} /></p>
                            <p>Lyrics <textarea rows="3" value={item.lyrics} /></p>
                            <p>Choose audio file: <input type='file' /></p>
                            <p>Price (eth): <input type='text' value='0.0025' /></p>
                            <input type="button" className="btnSubmit" id="fontEN"
                                onClick={(e) => { handleUpdate(); }} value={`Update`} />
                        </form>
                    </div>
                </div>
            </Popup>
            <Popup ref={removeRef} modal
                contentStyle={{ zIndex: "11", borderRadius: "10px", padding: "10px 20px 20px", width: "40%", }}>
                <div>
                <h2>Delete song</h2>
                <p style={{ margin: "10px 0" }}> Are you sure you want to delete this song forever? </p>
                <div
                    style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", }}>
                    <Button variant="contained" color="inherit"
                        sx={{ backgroundColor: "white", color: "#2a2854", marginRight: "30px",
                            ":hover": { backgroundColor: "whitesmoke", color: "#2a2854", }, }}
                        onClick={closeRemovePopup} > Cancel </Button>
                    <Button variant="contained"
                        sx={{ backgroundColor: "#2a2854", ":hover": { backgroundColor: "#2a2835" }, }}
                        onClick={(e) => { handleRemove(); }}> Confirm </Button>
                </div>
                </div>
            </Popup>
        </div>
    )
}

export default UserTrackItem
