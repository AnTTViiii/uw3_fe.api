import React, { useState } from 'react';
import { Link } from "react-router-dom";
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import PauseRoundedIcon from '@mui/icons-material/PauseRounded';
import FavoriteBorderRoundedIcon from '@mui/icons-material/FavoriteBorderRounded';
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';
import { IconButton } from '@mui/material';

function ArtistAlbumItem({item}) {
    const [fav, setFav] = useState(false);
    const [play, setPlay] = useState(false);
    const handlePlay = () => {
        setPlay(!play);
    }
    const handleFav = () => {
        setFav(!fav);
    }
    return (
        <div className='aAlbumItemContainer'>
            <img src={item.albumimg} alt={item.albumname} />
            <p title={item.albumname}><Link to={`/album/${item.albumid}`} state={{id: item.albumid}}>{item.albumname}</Link></p>
            <p>{new Date(item.releaseDate).getFullYear()}</p>
            <div className='lastRow'>
                <IconButton className='playerIcon' onClick={handlePlay}>
                {play ? <PauseRoundedIcon /> : <PlayArrowRoundedIcon />}
                </IconButton>
                <div>
                    <IconButton className='playerIcon' onClick={handleFav}>
                        {fav ? <FavoriteRoundedIcon className='favIcon'/> : <FavoriteBorderRoundedIcon />}
                    </IconButton>
                </div>
            </div>
        </div>
    )
}

export default ArtistAlbumItem