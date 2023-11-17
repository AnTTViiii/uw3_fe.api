import React, { useContext, useEffect, useState, useRef } from 'react'
import "reactjs-popup/dist/index.css";
import { CountryName } from '../data/CountryName';
import UserTrackItem from '../items/UserTrackItem'
import PlayerContext from '../PlayerContext';
import { Autocomplete, TextField } from '@mui/material';
import axios from 'axios';
import '../styles/User.css'
import OwnAlbumHeader from '../items/OwnAlbumHeader';

function UserCollection() {
    const user = JSON.parse(localStorage.getItem("user"));
    const cloudName = "dpwehcnso";
    var POST_URL = "https://api.cloudinary.com/v1_1/" + cloudName + "/upload";
    const [audioUrl, setAudioUrl] = useState("");
    const [audioDuration, setAudioDuration] = useState();
    const [imgUrl, setImgUrl] = useState("");
    const [selectedArtist, setSelectedArtist] = useState([]);
    const [selectedAlbum, setSelectedAlbum] = useState([]);

    //Create album
    const aNameRef = useRef();
    const aCountryRef = useRef();
    const aDateRef = useRef();

    async function createAlbum(e) {
        e.preventDefault();
        try {
            const body= {
                albumname: aNameRef.current.value,
                img: imgUrl,
                country: aCountryRef.current.value,
                releaseDate: aDateRef.current.value
            };
            console.log(body);
            await axios.post(`http://localhost:9098/api/user/${user.id}/album`, body);
            alert("Create Album Successfully!");
          } catch (error) {
            alert(error);
        }
    }
    //Upload song
    const sNameRef = useRef();
    const albumidRef = useRef();
    const artistsRef = useRef([]);
    const genreRef = useRef();
    const lyricsRef = useRef();
    const priceRef = useRef();

    async function addSong(e) {
        e.preventDefault();
        try {
            const performers = [];
            selectedArtist.map((a)=>performers.push({'id': a.id}));
            const body= {
                songname: sNameRef.current.value,
                albumid: selectedAlbum.id,
                img: selectedAlbum.img,
                audio: audioUrl,
                duration: Math.ceil(audioDuration),
                performer: performers,
                genre: genreRef.current.value,
                lyrics: lyricsRef.current.value,
                price: priceRef.current.value
            };
            console.log(body);
            await axios.post(`http://localhost:9098/api/song`, body);
            alert("Add Song Successfully!");
          } catch (error) {
            alert(error);
        }
        
    }

    let seq = 0;
    const songContext = useContext(PlayerContext);
    const [songs, setSongs]=useState([]);
    const [albums, setAlbums] = useState([]);
    
    const [artists, setArtists] = useState([]);
    useEffect(() => {
        axios.get(`http://localhost:9098/api/artist/${user.id}/song`)
            .then(response => {
                setSongs(response.data);
        });
        axios.get(`http://localhost:9098/api/artist/${user.id}/album`)
            .then(response => {
                setAlbums(response.data);
        });

        axios.get('http://localhost:9098/api/user')
            .then((res)=>setArtists(res.data));
    }, [songs, albums]);
    
    const upLoadImage = (file) => {
        var formdata = new FormData();
        formdata.append("file", file[0]);
        formdata.append("upload_preset", "musicplayer_image");

        axios.post(POST_URL, formdata).then((res)=>{
            console.log(res.data); 
            setImgUrl(res.data.url); 
            alert("Upload file successfully!")
        });
    }
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

    return (
        <div>
            <div className='formCreateALbum'>
                <div className='createAlbum'>
                    <form>
                        <p>Album name: <input type='text' ref={aNameRef} /></p>
                        <p>Release Date: <input type='datetime-local' ref={aDateRef} /></p>
                        <p>Album's Cover: <input type='file' accept="image/*" title={"Choose image"} onChange={(e) => upLoadImage(e.target.files)} /></p>
                        <p>Country: 
                            <select ref={aCountryRef}>
                                <option value=''>--Please select--</option>
                                {CountryName.map((c) => <option value={c}>{c}</option>)}
                            </select>
                        </p>
                        <input type='button' value={'Create Album'} onClick={(e)=>createAlbum(e)} />
                    </form>
                </div>
                <div className="upload">
                    <form>
                        <p>Song title: 	<input type='text' ref={sNameRef} /></p>
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
                                options={artists}
                                getOptionLabel={(option) => option.username}
                                onChange={(e, a)=>setSelectedArtist(a)}
                                renderInput={(params) => (
                                    <TextField {...params} variant="standard" placeholder="Select Artists ..." />
                                )}
                                sx={{ width: "65%" }}
                            />
                        </p>
                        <p title='Each genre must be separated by a slash (/).'>Genre: <input type='text' placeholder='Pop/Dance/...' ref={genreRef} /></p>
                        <p>Lyrics <textarea rows="3" ref={lyricsRef} /></p>

                        <p>Price (eth): <input type='text' placeholder='0.0025' ref={priceRef} /></p>
                        <input type='button' value={'Upload Song'} onClick={(e)=>addSong(e)} />
                    </form>
                </div>
            </div>
            <div className='allSongs'>
                {albums.map((a) => 
                    <div>
                        <OwnAlbumHeader item={a} />

                        <div className='ownTracks'>
                            {songs.map((s) => s.albumid === a.id && (
                                <UserTrackItem item={s} song={songContext} tracks={songs} index={seq++}/>
                            ))}
                        </div>
                            {console.log(seq = 0)}
                    </div>
                )}
            </div>
        </div>
    )
}

export default UserCollection
