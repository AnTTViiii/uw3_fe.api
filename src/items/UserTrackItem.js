import React, { useState, useRef, useEffect } from 'react';
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
import { Autocomplete, TextField } from '@mui/material';
import { authActions } from "../stores/auth";
import '../styles/UserTrackItem.css';
import axios from 'axios';

function UserTrackItem({item, song, index, tracks}) {
    const { isAuthed } = useSelector((state) => state.auth); //user
    const user = isAuthed ? JSON.parse(localStorage.getItem("user")) : [];
    const cloudName = "dpwehcnso";
    var POST_URL = "https://api.cloudinary.com/v1_1/" + cloudName + "/upload";

    const [audioUrl, setAudioUrl] = useState("");
    const [audioDuration, setAudioDuration] = useState();
    const [selectedArtist, setSelectedArtist] = useState([]);
    const [selectedAlbum, setSelectedAlbum] = useState([]);

    //Upload song
    const sNameRef = useRef();
    const albumidRef = useRef();
    const artistsRef = useRef([]);
    const genreRef = useRef();
    const lyricsRef = useRef();
    const priceRef = useRef();

    const upLoadAudio = (file) => {
        var formdata = new FormData();
        formdata.append("file", file[0]);
        formdata.append("upload_preset", "musicplayer_audio");

        axios.post(POST_URL, formdata).then((res)=>{
            console.log(res.data); 
            setAudioUrl(res.data.url); 
            setAudioDuration(res.data.duration); 
            alert("Upload file successfully!")
        });
    }

    const handleUpdate = async(e, song) => {
        e.preventDefault();
        try {
            const performers = [];
            selectedArtist.length === 0 
            ?   song.performer.map((a)=>performers.push({'id': a.id}))
            :   selectedArtist.map((a)=>performers.push({'id': a.id}));
            const body= {
                songname: sNameRef.current.value === undefined ? song.songname : sNameRef.current.value,
                albumid: selectedAlbum.id === undefined ? song.albumid : selectedAlbum.id,
                img: selectedAlbum.img === undefined ? song.img : selectedAlbum.img,
                audio: audioUrl === '' ? song.audio : audioUrl,
                duration: audioUrl === '' ? song.duration : Math.ceil(audioDuration),
                performer: performers,
                genre: genreRef.current.value === '' ? song.genre : genreRef.current.value,
                lyrics: lyricsRef.current.value === '' ? song.lyrics : lyricsRef.current.value,
                price: priceRef.current.value === '' ? song.price : priceRef.current.value
            };
            await axios.put(`http://localhost:9098/api/song/${song.id}`, body);
            alert("Updated Successfully!");
          } catch (error) {
            alert(error);
        }
        closeEditPopup();
    }

    const handleRemove = async(e) => {
        e.preventDefault();
        try {
            await axios.delete(`http://localhost:9098/api/song/${item.id}`);
            alert("Deleted Successfully!");
          } catch (error) {
            alert(error);
        }
        closeRemovePopup();
    }

    const [albums, setAlbums] = useState([]);
    const [artists, setArtists] = useState([]);
    useEffect(() => {
        axios.get(`http://localhost:9098/api/artist/${user.id}/album`)
            .then(response => {
                setAlbums(response.data);
        });

        axios.get('http://localhost:9098/api/user')
            .then((res)=>setArtists(res.data));
    }, []);

    const [fav, setFav] = useState(false);
    useEffect(() => {
        axios.get(`http://localhost:9098/api/user/${user.id}/islikedsong/${item.id}`)
            .then(response => {
                setFav(response.data);
        });
    }, [fav, item.id, user.id]);

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
                    }} style={(song.isUsing && song.play && JSON.parse(localStorage.getItem("song")).songid === item.id) ? {display: `flex`} : {display: `none`}}>
                    {(song.isUsing && song.play && JSON.parse(localStorage.getItem("song")).songid === item.id) ? <PauseRoundedIcon /> : <PlayArrowRoundedIcon style={{display: `flex`, zIndex:2}} />}
                </IconButton>
            </p>
            <img src={item.img} alt={item.songname} />
            <p title={item.songname}><Link to={`/song/${item.id}`}>{item.songname}</Link></p>
            <p className='artist'>
                {item.performer?.map((p) => 
                    <span><Link to={`/artist/${p.id}`}>{p.username}</Link></span>
                )}
            </p>
            <p><Link to={`/album/${item.albumid}`}>{item.album.albumname}</Link></p>
            <p>{item.genre}</p>
            <p>{dot3digits(item.streams)}</p>
            <p className='last-col'>
                <IconButton onClick={handleFav} className='favsIcon'>
                    {isAuthed ? (
                        fav ? <FavoriteRoundedIcon className='favIcon' onClick={(e)=>unlikeSong(e)} /> : <FavoriteBorderRoundedIcon onClick={(e)=>likeSong(e)} />
                    ) : ( <FavoriteBorderRoundedIcon /> )}
                </IconButton>
                <p id='duration'>{getStringDuration(item.duration)}</p>
            </p>
            <p>$0.0025</p>
            <p>
                <ModeEditRounded fontSize='small' sx={{cursor: 'pointer'}} onClick={openEditPopup} />
                <DeleteForeverRounded fontSize='small' sx={{cursor: 'pointer'}} onClick={openRemovePopup} />
            </p>
            <Popup ref={editRef} modal closeOnDocumentClick={false}
                contentStyle={{ zIndex: "11", margin: "auto", borderRadius: "10px", padding: "20px 20px 5px", width: "45%", maxWidth: "400px", }}>
                <div>
                    <div id="fontVI" className="btnCloseForm" onClick={closeEditPopup}>✖️</div>
                    <h2 align="center" style={{marginBlock: 0}}>Update Song Properties</h2>
                    <div className="updateSong">
                        <form>
                            <p>Song title: 	<input type='text' ref={sNameRef} defaultValue={item.songname} /></p>
                            <p>Choose audio file: 
                                <input type='file' accept="audio/*" onChange={(e) => upLoadAudio(e.target.files)} />
                            </p>
                            <p>Album:
                                <Autocomplete id="tags-standard" className='artistLiveSearch' ref={albumidRef}
                                    options={albums}
                                    getOptionLabel={(option) => option.albumname}
                                    onChange={(e, a)=>setSelectedAlbum(a)}
                                    renderInput={(params) => (
                                        <TextField {...params} variant="standard" placeholder="Select Album ..." />
                                    )}
                                    sx={{ width: "65%" }}
                                />
                            </p>
                            <p>Artists: 
                                <Autocomplete multiple id="tags-standard" className='artistLiveSearch' ref={artistsRef}
                                    options={artists} disableCloseOnSelect={true}
                                    getOptionLabel={(option) => option.username}
                                    onChange={(e, a)=>{setSelectedArtist(a)}}
                                    renderInput={(params) => (
                                        <TextField {...params} variant="standard" placeholder="Select Artists ..." />
                                    )}
                                    sx={{ width: "65%" }}
                                />
                            </p>
                            <p title='Each genre must be separated by a slash (/).'>Genre: <input type='text' placeholder='Pop/Dance/...' ref={genreRef} defaultValue={item.genre} /></p>
                            <p>Lyrics <textarea rows="3" ref={lyricsRef} defaultValue={item.lyrics} /></p>

                            <p>Price (eth): <input type='text' placeholder='0.0025' ref={priceRef} defaultValue={item.price} /></p>
                            <input type="button" className="btnSubmit" id="fontEN"
                                onClick={(e) => { handleUpdate(e, item); }} value={`Update`} />
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
                        onClick={(e) => { handleRemove(e); }}> Confirm </Button>
                </div>
                </div>
            </Popup>
        </div>
    )
}

export default UserTrackItem
