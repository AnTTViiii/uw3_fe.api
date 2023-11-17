import React, { useState, useRef } from 'react'
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import { ModeEditRounded, DeleteForeverRounded } from '@mui/icons-material'
import { Button } from '@mui/material';
import { CountryName } from '../data/CountryName';
import axios from 'axios';
import '../styles/User.css'

function OwnAlbumHeader({item}) {
    const cloudName = "dpwehcnso";
    var POST_URL = "https://api.cloudinary.com/v1_1/" + cloudName + "/upload";
    const [imgUrl, setImgUrl] = useState("");

    //Create album
    const aNameRef = useRef();
    const aCountryRef = useRef();
    const aDateRef = useRef();

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

    const editRef = useRef();
    const removeRef = useRef();

    const closeEditPopup = () => editRef.current.close();
    const openEditPopup = () => editRef.current.open();

    const closeRemovePopup = () => removeRef.current.close();
    const openRemovePopup = () => removeRef.current.open();

    const handleUpdate = async(e, album) => {
        e.preventDefault();
        try {
            const body= {
                albumname: aNameRef.current.value === '' ? album.albumname : aNameRef.current.value,
                img: imgUrl === '' ? album.img : imgUrl,
                country: aCountryRef.current.value === '' ? album.country : aCountryRef.current.value,
                releaseDate: aDateRef.current.value === '' ? album.releaseDate : aDateRef.current.value
            };
            console.log(body);
            await axios.put(`http://localhost:9098/api/album/${album.id}`, body);
            alert("Updated Successfully! (albumid:" + album.id + ")");
          } catch (error) {
            alert(error);
        }
        closeEditPopup();
    }
    const handleRemove = async(e, id) => {
        e.preventDefault();
        try {
            await axios.delete(`http://localhost:9098/api/album/${id}`);
            alert("Deleted Successfully!");
          } catch (error) {
            alert(error);
        }
        closeRemovePopup();
    }
    return (
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'yellow'}}>
            <h3 id='fontVI'>{item['albumname']}</h3>
            <p>
                <ModeEditRounded fontSize='small' sx={{cursor: 'pointer'}} onClick={openEditPopup} />
                <DeleteForeverRounded fontSize='small' sx={{cursor: 'pointer'}} onClick={openRemovePopup} />
            </p>
            <Popup ref={editRef} modal
                contentStyle={{ zIndex: "11", margin: "auto", borderRadius: "10px", padding: "20px 20px 5px", width: "45%", maxWidth: "400px", }}>
                <div>
                    <div id="fontVI" className="btnCloseForm" onClick={closeEditPopup}>✖️</div>
                    <h2 align="center" style={{marginBlock: 0}}>Update Album Properties</h2>
                    <div className="updateSong">
                        <form>
                            <p>Album name: <input type='text' ref={aNameRef} defaultValue={item['albumname']} /></p>
                            <p>Release Date: <input type='datetime-local' ref={aDateRef} /></p>
                            <p>Album's Cover: <input type='file' accept="image/*" title={"Choose image"} onChange={(e) => {upLoadImage(e.target.files)}} /></p>
                            <p>Country: 
                                <select ref={aCountryRef} defaultValue={item['country']}> 
                                    <option value=''>-- Please select --</option>
                                    {CountryName.map((c) => <option value={c}>{c}</option>)}
                                </select>
                            </p>
                            <input type="button" className="btnSubmit" id="fontEN"
                                onClick={(e) => { handleUpdate(e, item); }} value={`Update`} />
                        </form>
                    </div>
                </div>
            </Popup>
            <Popup ref={removeRef} modal
                contentStyle={{ zIndex: "11", borderRadius: "10px", padding: "10px 20px 20px", width: "40%", }}>
                <div>
                <h2>Delete album</h2>
                <p style={{ margin: "10px 0" }}> Are you sure you want to delete this album forever? </p>
                <div
                    style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", }}>
                    <Button variant="contained" color="inherit"
                        sx={{ backgroundColor: "white", color: "#2a2854", marginRight: "30px",
                            ":hover": { backgroundColor: "whitesmoke", color: "#2a2854", }, }}
                        onClick={closeRemovePopup} > Cancel </Button>
                    <Button variant="contained"
                        sx={{ backgroundColor: "#2a2854", ":hover": { backgroundColor: "#2a2835" }, }}
                        onClick={(e) => { handleRemove(e, item['id']); }}> Confirm </Button>
                </div>
                </div>
            </Popup>
        </div>
    )
}

export default OwnAlbumHeader
