import React, { useState, useEffect } from 'react'
import { useSelector } from "react-redux";
import { Link } from 'react-router-dom'
import StarBorderRoundedIcon from '@mui/icons-material/StarBorderRounded';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import { IconButton } from '@mui/material';
import axios from 'axios';

function ArtistItem({item}) {
  const { isAuthed } = useSelector((state) => state.auth); //user
  const user = isAuthed ? JSON.parse(localStorage.getItem("user")) : [];

  const [isFollow, setFollow] = useState(false);
  useEffect(() => {
    if (isAuthed) {
      axios.get(`http://localhost:9098/api/user/${user.id}/isfollow/${item.id}`)
          .then(response => {
              setFollow(response.data);
      });
    }
  }, [isAuthed, isFollow, item.id, user.id]);
  async function follow(event) {
      event.preventDefault();
      try {
        await axios.put(`http://localhost:9098/api/user/${user.id}/follow/${item.id}`);
      } catch (error) {
        alert(error);
      }
  }

  async function unfollow(event) {
      event.preventDefault();
      try {
        await axios.put(`http://localhost:9098/api/user/${user.id}/unfollow/${item.id}`);
      } catch (error) {
        alert(error);
      }
  }

  const handleFollow = () => {
      setFollow(!isFollow);
  }
  function dot3digits(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }
  return (
    <div className='artistItemContainer'>
      <img src={item.avatar} alt={item.username} />
      <div>
        <p><Link to={`/artist/${item.id}`} state={{ id: item.username }}>{item.username}</Link></p>
        <div className='artistFollower'>
            <p>{dot3digits(item.followercount)}</p>
            <IconButton className='followIcon' onClick={handleFollow}>
                {isAuthed ? (isFollow ? <StarRoundedIcon className='starIcon' onClick={(e)=>unfollow(e)} /> : <StarBorderRoundedIcon onClick={(e)=>follow(e)} />) : <StarBorderRoundedIcon />}
            </IconButton>
        </div>
      </div>
    </div>
  )
}

export default ArtistItem
