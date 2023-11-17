import { AlbumData } from "./data/AlbumData";

export const getAlbumDetail = (albumid) => {
    return AlbumData.find((album) => album.albumid === albumid);
};

export const addSongToLocalPlaylist = (song, player) => {
    const playlist = JSON.parse(localStorage.getItem("playlist"));
    playlist.push(song);
    player.setPlaylist(playlist);
    localStorage.setItem("playlist", JSON.stringify(playlist));
    console.log(playlist);
};

export const addAlbumToLocalPlaylist = (albumid, player) => {
    const albumDetail = getAlbumDetail(albumid);
    const playlist = JSON.parse(localStorage.getItem("playlist"));
    albumDetail.songs.map((item) => {
      playlist.push(item);
    });
    player.setPlaylist(playlist);
    localStorage.setItem("playlist", JSON.stringify(playlist));
    console.log(playlist);
};

export const deleteLocalPlaylist = (player) => {
    player.setUsing(false);
    localStorage.removeItem("playlist");
    player.setPlaylist([]);
    localStorage.removeItem("song");
    localStorage.removeItem("tracks");
    localStorage.removeItem("index");
    localStorage.removeItem("currentTime");
    localStorage.setItem("play", false);
};