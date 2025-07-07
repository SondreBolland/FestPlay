import React, { Component } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { render } from "react-dom";
import HomePage from "./HomePage";
import PlaylistConfig from "./PlaylistConfig";
import AddArtistPage from "./AddArtistPage";

export default class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Router basename="/festplay">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/playlist-config" element={<PlaylistConfig />} />
          <Route path="/add-artist" element={<AddArtistPage />} />
        </Routes>
      </Router>
    );
  }
}

const appDiv = document.getElementById("app");
render(<App />, appDiv);
