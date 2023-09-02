import React, { useContext } from 'react'
import { SongData } from '../data/SongData';
import { AlbumData } from '../data/AlbumData';
import UserTrackItem from '../items/UserTrackItem'
import PlayerContext from '../PlayerContext'
import { ModeEditRounded, DeleteForeverRounded } from '@mui/icons-material';

function UserCollection() {
    let seq = 0;
    const songContext = useContext(PlayerContext);
    return (
        <div>
            <div className='formCreateALbum'>
                <div className='createAlbum'>
                    <form>
                        <p>Album name: <input type='text' /></p>
                        <p>Release Date: <input type='datetime-local' /></p>
                        <p>Album's Cover: <input type='file' title={"Choose image"} /></p>
                        <input type='button' value={'Create Album'} />
                    </form>
                </div>
                <div className="upload">
                    <form>
                        <p>Song title: 	<input type='text' /></p>
                        <p>Album: <input type='text' /></p>
                        <p title='Each genre must be separated by a slash (/).'>Genre: <input type='text' placeholder='Pop/Dance/...' /></p>
                        <p>Lyrics <textarea rows="3" /></p>
                        <p>Choose audio file: <input type='file' /></p>
                        <p>Price (eth): <input type='text' placeholder='0.0025' /></p>
                        <input type='button' value={'Upload Song'} />
                    </form>
                </div>
            </div>
            <div className='allSongs'>
                {AlbumData.map((a) => 
                    <div>
                        <h3 id='fontVI'>{a.albumname}</h3>
                        <div className='ownTracks'>
                            {SongData.map((s) => s.albumid === a.albumid && (
                                <UserTrackItem item={s} song={songContext} tracks={SongData} index={seq++}/>
                            ))}
                        </div>
                            {console.log(seq = 0)}
                    </div>)}
            </div>
        </div>
    )
}

export default UserCollection
