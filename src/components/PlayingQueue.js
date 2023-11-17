import React, { useContext, useRef } from 'react';
import { Button, Box, SwipeableDrawer } from "@mui/material";
import PlayerContext from '../PlayerContext';
import LocalPlaylistContext from '../LocalPlaylistContext';
import { deleteLocalPlaylist } from "../Service";
import Popup from 'reactjs-popup';
import SongItem from '../items/SongItem'
import AppBarPlaylist from './AppBarPlaylist';

function PlayingQueue() {
    const localPlaylist = useContext(LocalPlaylistContext);
    const toggleDrawer = (open) => (event) => {
        if (
          (event && event.type === "keydown" && event.key === "Tab") ||
          event.key === "Shift"
        ) {
          return;
        }
        localPlaylist.setOpen(open);
        localStorage.setItem(open);
    };

    const player = useContext(PlayerContext);
    let playlist = JSON.parse(localStorage.getItem("playlist"));
    
    const deleteRef = useRef();
    const closeDeletePopup = () => deleteRef.current.close();
    const openDeletePopup = () => deleteRef.current.open();
    return (
        <div style={{ zIndex: "8", position: "absolute" }}>
            <div>
                <SwipeableDrawer variant="persistent"
                  onOpen={toggleDrawer(true)} onClose={toggleDrawer(false)}
                //   open={localPlaylist.open} 
                  anchor="right" >
                    <Box sx={{ padding: 3, width: 400 }}>
                        <AppBarPlaylist openDeletePopup={openDeletePopup}/>
                        {localStorage.getItem("playlist") !== null ? (
                            playlist.map((item, index) => (
                                <div className="song shadowDiv" key={index}>
                                    <SongItem item={item} tracks={playlist} song={player} index={index} />
                                </div>
                            ))
                        ) : ( <div></div> )}
                    </Box>
                </SwipeableDrawer>        
            </div>
            <Popup ref={deleteRef} modal
                lockScroll={true} contentStyle={{ zIndex: "11", borderRadius: "10px", padding: "25px 30px", width: "40%", }}
            >
                <div>
                    <h2>Delete playlist</h2>
                    <p style={{ margin: "10px 0" }}>
                        Are you sure you want to delete this playlist?
                    </p>
                    <div style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "flex-end", }} >
                        <Button variant="contained" color="inherit"
                          sx={{ marginRight: "30px", ":hover": { backgroundColor: "lightgray", }, }}
                          onClick={closeDeletePopup}
                        > Cancel </Button>
                        <Button
                            variant="contained"
                            sx={{ backgroundColor: "#ff7394",
                                ":hover": { backgroundColor: "rgb(244, 161, 175)", },
                            }}
                            onClick={(e) => {
                                playlist = player.playlist; localPlaylist.setOpen(false);
                                localStorage.setItem("openLocalPlaylist", false);
                                deleteLocalPlaylist(player); closeDeletePopup();
                            }} 
                        > Confirm </Button>
                    </div>
                    </div>
            </Popup>
        </div>
    )
}

export default PlayingQueue
