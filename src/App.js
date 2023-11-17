import './App.css';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { PlayerProvider } from "./PlayerContext";
import store from "./stores/store";
import { Provider } from 'react-redux';
import React from "react";
import AppRoot from "./components/AppRoot";
import Home from "./pages/Home";
import Library from "./pages/Library";
import NewReleases from "./pages/NewReleases";
import AllArtists from './pages/AllArtists';
import Account from './pages/Account';
import Album from "./pages/Album";
import Song from './pages/Song';
import Artist from './pages/Artist';
import NotFound from './pages/NotFound';

function App() {
  window.onbeforeunload = localStorage.setItem("play", JSON.stringify(false));
  const router = createBrowserRouter([
    {
      path: "/",
      element: <AppRoot />,
      children: [
        {
          index: true,
          element: <Home />,
        },
        {
          path: "home",
          element: <Home />,
        },
        {
          path: "library",
          element: <Library />,
        },
        {
          path: "newreleases",
          element: <NewReleases />,
        },
        {
          path: "artists",
          element: <AllArtists />,
        },
        // {
        //   path: "recently",
        //   element: <Recently />,
        // },
        {
          path: "album/*",
          element: <Album />,
        },
        {
          path: "artist/*",
          element: <Artist />,
        },
        {
          path: "song/*",
          element: <Song />,
        },
        {
          path: "user",
          element: <Account />,
        },
        // {
        //   path: ":name/songs",
        //   element: <ArtistSongs />,
        // },
        // {
        //   path: ":name/albums",
        //   element: <ArtistAlbums />,
        // },
        {
          path: "*",
          element: <NotFound />,
        },
      ],
    },
  ]);
  return (
    <Provider store={store}>
      <PlayerProvider>
          <RouterProvider router={router} />
      </PlayerProvider>
    </Provider>
  );
}

export default App;
