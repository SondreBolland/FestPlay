// App.js
import React, { Component } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import PlaylistConfig from "./pages/PlaylistConfigPage";
import AddArtistPage from "./pages/AddArtistPage";

export default class App extends Component {
    //<Router basename="/festplay">
  render() {
    return (
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/playlist-config" element={<PlaylistConfig />} />
          <Route path="/add-artist" element={<AddArtistPage />} />
        </Routes>
      </Router>
    );
  }
}
