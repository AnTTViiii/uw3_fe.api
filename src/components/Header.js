import React, { useState, useEffect, useContext } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Account from './Account'
import '../styles/Header.css'
import Popup from 'reactjs-popup';
import { AlbumData } from "../data/AlbumData";
import { ArtistData } from "../data/ArtistData";
import { SongData } from "../data/SongData";
import PlayerContext from "../PlayerContext"

function Header() {
  // const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname.split("/");
  let page = path[1];
  const [header, setHeader] = useState("bg-scroll")
  const listenScrollEvent = (event) => {
    if (window.scrollY >= 20) {
      return setHeader("bg-scroll")
    } else if (window.scrollY < 20) {
      return setHeader("bg-notscroll")
    } 
  }
  useEffect(() => {
    window.addEventListener('scroll', listenScrollEvent);
    return () =>
      window.removeEventListener('scroll', listenScrollEvent);
  }, []);

  const song = useContext(PlayerContext);
  const [searchTerm, setSearchTerm] = useState("");
  const rsSong = [], rsArtist = [], rsAlbum = [];
  if (searchTerm !== "") {
    SongData.map((val) => {
      if (val.songname.toLowerCase().includes(searchTerm.toLowerCase())) {
        rsSong.push(val);
      }
    });
    ArtistData.map((val) => {
      if (val.artistname.toLowerCase().includes(searchTerm.toLowerCase())) {
        rsArtist.push(val);
      }
    });
    AlbumData.map((val) => {
      if (val.albumname.toLowerCase().includes(searchTerm.toLowerCase())) {
        rsAlbum.push(val);
      }
    });
  }
  return (
    <div className={header + ' appHeader'}>
        <div className='webLogo'>
            <Link to={`/home`}>
                <img src='https://res.cloudinary.com/dpwehcnso/image/upload/v1686779415/h6dbhih7jpsrc1rwdsar.png' alt='UW3 mStream' />
                <p>UW3</p>
            </Link>
        </div>
        <Link className={page === "home" ? 'active' : ''} to={`/home`}>Featured</Link>
        <Link className={page === "newreleases" ? 'active' : ''} to={`/newreleases`}>New Releases</Link>
        <Link className={page === "artists" ? 'active' : ''} to={`/artists`}>Artists</Link>
        <div className='headerRight'>
          <div className='searchBar'>
            {/* <input type='search' placeholder='Songs, Albums, Artists?' className='searchBox' /> */}
            <Popup contentStyle={{ zIndex: "10", width: "35vw", padding: 0, }}
              trigger={<input type='search' onChange={(e) => setSearchTerm(e.target.value)} placeholder='Songs, Albums, Artists?' className='searchBox' />}
              position={"bottom right"} >
              <div className={searchTerm !== "" ? "rsSearch" : "hideRS"}>
                {rsSong.length <= 0 && rsArtist.length <= 0 && rsAlbum.length <= 0 ? (
                  <p align="center"> <i>Not found!</i> </p>
                ) : ( "" )}
                {rsSong.length <= 0 ? ( "" ) : (
                  <div>
                    <div id="headingSearchSong">Song</div>
                    <div className="rs_songs">
                      {rsSong.map((val) => {
                        return (
                          <div className="songResult">
                            <img src={val.songImg} alt={val.songname} />
                            <p><Link to={`/song/${val.songid}`}>{val.songname}</Link></p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
                {rsArtist.length <= 0 ? ( "" ) : (
                  <div>
                    <div id="headingSearchArtist">Artist</div>
                    <div className="rs_artists">
                      {rsArtist.map((val) => {
                        // if (val.artistname.toLowerCase().includes(searchTerm.toLowerCase())) {
                          return (
                            <div className="artistResult">
                              <img src={val.avatar} alt={val.artistname} />
                              <p>
                                <Link className="artist" to={`/artist/${val.artistid}`}>{val.artistname}</Link>
                              </p>
                            </div>
                          );
                        // }
                      })}
                    </div>
                  </div>
                )}
                {rsAlbum.length <= 0 ? ( "" ) : (
                  <div>
                    <div id="headingSearchAlbum">Album</div>
                    <div className="rs_albums">
                      {rsAlbum.map((val) => {
                        // if (val.albumname.toLowerCase().includes(searchTerm.toLowerCase())) {
                          return (
                            <div className="albumResult">
                              <img src={val.albumimg} alt={val.albumname} />
                              <p className="rs_albumName">
                                <Link to={`/album/${val.albumid}`}>
                                  {val.albumname}
                                </Link>
                              </p>
                            </div>
                          );
                        // }
                      })}
                    </div>
                  </div>
                )}
              </div>
            </Popup>
          </div>
          <Account />
        </div>
    </div>
  )
}

export default Header
