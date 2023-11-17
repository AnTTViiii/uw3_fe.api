import React, { useEffect, useState} from 'react'
import ArtistItem from '../items/ArtistItem'
import { ArtistData } from '../data/ArtistData'
import axios from 'axios'

function AllArtists() {
  const [artists, setArtists] = useState([]);
  useEffect(() => {
    axios.get(`http://localhost:9098/api/artist`)
    .then(response => {
      setArtists(response.data);
    });
  }, [artists]);
  return (
    <div className='allArtistsContainer'>
      {artists.map((item, key) => 
        <ArtistItem item={item} key={key} />
      )}
    </div>
  )
}

export default AllArtists
