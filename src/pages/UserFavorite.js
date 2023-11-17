import React, { useContext, useEffect, useState } from 'react'
import UserTrackItem from '../items/UserTrackItem'
import ArtistAlbumItem from '../items/ArtistAlbumItem'
import ArtistItem from '../items/ArtistItem'
import PlayerContext from '../PlayerContext'
import axios from 'axios'

function UserFavorite() {
  const user = JSON.parse(localStorage.getItem("user"));
  const songContext = useContext(PlayerContext);
  const [favSongs, setSongs]=useState([]);
  const [favAlbums, setAlbums] = useState([]);
  const [favArtists, setArtists] = useState([]);
  useEffect(() => {
    axios.get(`http://localhost:9098/api/user/${user.id}/favSongs`)
      .then(response => {
        setSongs(response.data);
      });
    axios.get(`http://localhost:9098/api/user/${user.id}/favAlbums`)
    .then(response => {
      setAlbums(response.data);
    });
    axios.get(`http://localhost:9098/api/user/${user.id}`)
    .then(response => {
      setArtists(response.data.favArtists);
    });
  }, []);
  return (
    <div>
        <div className='favPlaylist'>
            <h3>❤️ Favorite Songs</h3>
            <div className='playlist'>
              {favSongs.map((song, index) => <UserTrackItem item={song} song={songContext} tracks={favSongs} index={index}/>)}
            </div>
        </div>
        <div className='favAlbumContainer'>
            <h3>❤️ Favorite Albums</h3>
            <div className='favAlbumBody'>
              {favAlbums.map((album) => <ArtistAlbumItem item={album} />)}
            </div>
        </div>
        <div className='following'>
            <h3>⭐ Following Artists</h3>
            <div className='followingArtists'>
              {favArtists.map((artist) => <ArtistItem item={artist} />)}
            </div>
        </div>
    </div>
  )
}

export default UserFavorite
