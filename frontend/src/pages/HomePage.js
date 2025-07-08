import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@mui/material";
import Layout from "../components/Layout";
import "./HomePage.css";

export default function HomePage() {
  return (
    <Layout>
      <div className="description-box">
        <h2>🎧 FestPlay - Build Your Festival Playlist</h2>
        <p>
          Prepare for your upcoming festival by listening to the songs that will
          likely be played! This tool generates a custom Spotify playlist based
          on real setlists from your favorite artists.
        </p>
      </div>
      <div className="center-button-container">
        <Button
          variant="contained"
          className="create-playlist-button"
          to="/playlist-config"
          component={Link}
        >
          <h2>Create Festival Playlist</h2>
        </Button>
      </div>
    </Layout>
  );
}
