import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { render } from "react-dom";
import HomePage from "./HomePage";
import PlaylistConfig from "./PlaylistConfig";
import AddArtistPage from "./AddArtistPage";

export default class App extends Component {
  render() {
    return (
      <Router basename="/festplay">
        <Switch>
          <Route exact path="/" component={HomePage} />
          <Route path="/playlist-config" component={PlaylistConfig} />
          <Route path="/add-artist" component={AddArtistPage} />
        </Switch>
      </Router>
    );
  }
}

const appDiv = document.getElementById("app");
render(<App />, appDiv);
