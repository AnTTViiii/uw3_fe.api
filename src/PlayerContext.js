import React, { createContext, useState } from "react";
const PlayerContext = createContext();
export const PlayerProvider = ({ children }) => {
    const [isUsing, setUsing] = useState(
      localStorage.getItem("song") === null ? false : true
    );

    const [tracks, setTracks] = useState(
        localStorage.getItem("tracks") !== null
            ? JSON.parse(localStorage.getItem("tracks"))
            : []
    );

    const [song, setSong] = useState(
        localStorage.getItem("song") !== null
            ? JSON.parse(localStorage.getItem("song"))
            : ""
    );

    const [songIndex, setSongIndex] = useState(
        JSON.parse(localStorage.getItem("song")) !== ""
            ? JSON.parse(localStorage.getItem("index"))
            : 0
    );

    const [playlist, setPlaylist] = useState(
        localStorage.getItem("playlist") !== null
            ? JSON.parse(localStorage.getItem("playlist"))
            : []
    );

    const [play, setPlay] = useState(false);

    const [currentTime, setCurrentTime] = useState(
        localStorage.getItem("currentTime") !== null
            ? JSON.parse(localStorage.getItem("currentTime"))
            : 0
    );
    
    return (
        <PlayerContext.Provider
            value={{
                isUsing, setUsing,
                tracks, setTracks,
                song, setSong,
                songIndex, setSongIndex,
                playlist, setPlaylist,
                play, setPlay,
                currentTime, setCurrentTime,
            }}
        >
            {children}
        </PlayerContext.Provider>
    );
};
export default PlayerContext;