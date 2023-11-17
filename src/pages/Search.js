import React, { useContext, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { SongData } from '../data/SongData';
import { AlbumData } from '../data/AlbumData';
import { ArtistData } from '../data/ArtistData';
import PlayerContext from '../PlayerContext';
function Search() {
    const [searchTerm, setSearchTerm] = useState("");
    const albums = [], songs = [], artists = [];
    if (searchTerm !== "") {
        SongData.map((item) => {
            if (item.songname.toLowerCase().includes(searchTerm.toLowerCase()) || 
                item.lyrics.toLowerCase().includes(searchTerm.toLowerCase())) {
                songs.push(item);
            }
        });
    }
    AlbumData.map((item) => {
        if (item.albumname.toLowerCase().includes(searchTerm.toLowerCase()))
            albums.push(item);
    });
    
    ArtistData.map((item) => {
        if (item.artistname.toLowerCase().includes(searchTerm.toLowerCase())) {
            artists.push(item);
        }
    });
    const [fav, setFav] = useState(false);
    const [play, setPlay] = useState(false);
    const handlePlay = () => {
        setPlay(!play);
    }
    const handleFav = () => {
        setFav(!fav);
    }
    const song = useContext(PlayerContext);
    return (
        <div>
        adfgsdfhj
        </div>
    )
}

export default Search
