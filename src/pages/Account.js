import React, { useState, useContext, useRef, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import { authActions } from "../stores/auth";
import "../styles/User.css";
import UserFavorite from './UserFavorite';
import UserPurchased from './UserPurchased';
import UserCollection from './UserCollection';
import axios from 'axios';
import '../styles/User.css'

function Account() {
  const { isAuthed, account } = useSelector((state) => state.auth);
  const user = isAuthed ? JSON.parse(localStorage.getItem("user")) : [];

  const [tab, setTab] = useState(1);
  const toggleTab = (index) => {
    setTab(index);
  };
  const Page = (tab === 1) ? UserFavorite : (tab === 2 ? UserPurchased : UserCollection);

  const cloudName = "dpwehcnso";
  var POST_URL = "https://api.cloudinary.com/v1_1/" + cloudName + "/upload";
  const [imgUrl, setImgUrl] = useState("");
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

  const closeEditPopup = () => editRef.current.close();
  const openEditPopup = () => editRef.current.open();

  const dispatch = useDispatch();
  const handleUpdate = async(e) => {
    e.preventDefault();
    try {
        const body= {
          username: user.username,
          avatar: imgUrl === '' ? user.avatar : imgUrl,
          ethwallet: user.ethwallet
        };
        console.log(body);
        await axios.put(`http://localhost:9098/api/user/${user.id}`, body)
          .then(res=>{dispatch(authActions.setAuth(res.data))});
        alert("Updated Successfully! (userid:" + user.id + ")");
      } catch (error) {
        alert(error);
    }
    closeEditPopup();
  }

  return (
    isAuthed ? (
      <div className='accountPageContainer' style={{width: "80%", margin: 'auto', position: 'relative'}}>
        <div className='accHeader'>
          <div className='avatar'>
            <img src={user.avatar} alt={user.username} />
            <div className='avt_hover' style={{cursor: 'pointer'}} onClick={openEditPopup}>Change</div>
            <Popup ref={editRef} modal
                contentStyle={{ zIndex: "11", margin: "auto", borderRadius: "10px", padding: "20px 20px 5px", width: "45%", maxWidth: "400px", }}>
                <div>
                    <div id="fontVI" className="btnCloseForm" onClick={closeEditPopup}>✖️</div>
                    <h2 align="center" style={{marginBlock: 0}}>Update Album Properties</h2>
                    <div className="updateSong">
                        <form>
                          <p>Choose image: <input type='file' accept="image/*" onChange={(e) => upLoadImage(e.target.files)} title='Change Avatar' /> </p>
                          <div style={{textAlign: 'center', fontSize: 'small', marginBottom: '15px'}}><i>(Please wait for a while to upload the file)</i></div>
                          <input type="button" className="btnSubmit" id="fontEN"
                              onClick={(e) => { handleUpdate(e); }} value={`Update`} />
                        </form>
                    </div>
                </div>
            </Popup>
          </div>
          <div className='accInfo'>
            <h1>{user.username}</h1>
            <p>{user.ethwallet != null ? 'Wallet Address: ' + user.ethwallet : 'Connect ethereum wallet'}</p>
          </div>
        </div>
        <div className='accBody'>
          <div className='accountTabContainer'>
            <button className={tab === 1 ? "accountTab active" : "accountTab"} onClick={() => toggleTab(1)}>Favorite</button>
            <button className={tab === 2 ? "accountTab active" : "accountTab"} onClick={() => toggleTab(2)}>Purchased</button>
            <button className={tab === 3 ? "accountTab active" : "accountTab"} onClick={() => toggleTab(3)}>Your Collection</button>
          </div>
          <Page />
        </div>
      </div>
    ) : (
      <div className='accountPageContainer' style={{width: "80%", margin: 'auto', textAlign: 'center', position: 'relative'}}>
        <div style={{ fontSize: 'x-large', color: 'yellow', fontWeight: 'bold', marginTop: '10vh' }}>Members only. Login to use!</div>
      </div>
    )
    
  )
}

export default Account
