import React, { useContext, useEffect, useState } from 'react'
import UserTrackItem from '../items/UserTrackItem'
import PlayerContext from '../PlayerContext'
import axios from 'axios'

function UserPurchased() {
  const songContext = useContext(PlayerContext);
  const [songs, setSongs] = useState([]);
  useEffect(() => {
    axios.get(`http://localhost:9098/api/song`)
      .then(response => {
        setSongs(response.data);
      });
  }, []);
  return (
    <div className='userPurchasedContainer'>
      {songs.map((song, index) => <UserTrackItem item={song} song={songContext} tracks={songs} index={index}/>)}
    </div>
  )
}

export default UserPurchased
