import React from "react";
import { Outlet } from "react-router-dom";
import Player from "./Player";
import Footer from "./Footer";
import Header from "./Header";
// import PlayingQueue from "./PlayingQueue";
import "../styles/AppRoot.css";
function AppRoot() {
    return (
        <div className="container">
            <div className="header">
                <Header />
            </div>
            <div className="outlet">
                <Outlet />
            </div>
            <div className="footer">
                <Footer />
            </div>
            <Player />
            {/* <PlayingQueue /> */}
        </div>
    )
}

export default AppRoot;