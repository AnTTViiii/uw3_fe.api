import React from 'react'
import AppBar from "./AppBar";

function AppBarPlaylist(openDeletePopup) {
  return (
    <div style={{ marginBottom: "35px" }}>
    <AppBar
        position="fixed"
        style={{ backgroundColor: "white", display: "flex",
            flexDirection: "row", justifyContent: "space-between",
            alignItems: "center", color: "black", width: 400, padding: 10,
        }}>
        <h2>Danh sách phát</h2>
        <div className="playlistItemPopup" onClick={openDeletePopup}>
            <p id='fontVI' title='Delete playlist'>✖️</p>
        </div>
    </AppBar>
    </div>
  )
}

export default AppBarPlaylist
