import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@mui/material";
import ArtistList from "./ArtistList";
import "./PlaylistConfig.css";

export default function PlaylistConfig() {
  const [form, setForm] = useState({
    songs_per_artist: 15,
    playlist_name: "My Playlist",
    selected_artists: [],
  });

  const [artists, setArtists] = useState([]);
  const [statusMsg, setStatusMsg] = useState(null);

  const [spotifyAuthenticated, setSpotifyAuthenticated] = useState(false);

  useEffect(() => {
    authenticateSpotify();

    fetch("/api/artists")
      .then((res) => res.json())
      .then((data) => setArtists(data))
      .catch(console.error);
  }, []);

  const authenticateSpotify = () => {
    fetch("/spotify/is-authenticated")
      .then((response) => response.json())
      .then((data) => {
        setSpotifyAuthenticated(data.status);
        console.log("Spotify authenticated:", data.status);
        if (!data.status) {
          fetch("/spotify/get-auth-url")
            .then((response) => response.json())
            .then((data) => {
              window.location.replace(data.url);
            });
        }
      })
      .catch(console.error);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleArtistSelection = (e) => {
    const options = e.target.options;
    const selected = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) selected.push(parseInt(options[i].value));
    }
    setForm((prev) => ({ ...prev, selected_artists: selected }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatusMsg("Making playlist...");
    const payload = {
      ...form,
      songs_per_artist: Number(form.songs_per_artist),
      n_setlists_per_artist: Number(form.n_setlists_per_artist),
    };

    fetch("/spotify/generate-playlist/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then((errData) => {
            console.error("Error response:", errData);
            throw new Error(
              `Failed to save config: ${res.status} ${res.statusText}`
            );
          });
        }
        return res.json();
      })
      .then((data) => {
        let msg = "Playlist created! Check your Spotify :)";
        if (data.missing_tracks && data.missing_tracks.length > 0) {
          msg +=
            "\nSome tracks were not found:\n" + data.missing_tracks.join("\n");
        }
        setStatusMsg(msg);
      })
      .catch((error) => {
        console.error("Fetch error:", error);
        setStatusMsg("Error saving configuration");
      });
  };

  return (
    <div className="playlist-config-container">
      <div className="main-content-area">
        <div className="centered-form-pane">
          <div className="header-row">
            <h2 className="config-title">Create Playlist</h2>

            <div className="back-button-container">
              <Button
                className="back-button"
                onClick={() => window.history.back()}
              >
                Back
              </Button>
            </div>
          </div>
          <p>
            Choose which artists and how many of their most recently played
            songs to add!
          </p>

          <div className="status-message">
            {statusMsg &&
              statusMsg.split("\n").map((line, idx) => (
                <span key={idx}>
                  {line}
                  <br />
                </span>
              ))}
          </div>

          <form className="playlist-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Playlist Name:</label>
              <input
                type="text"
                name="playlist_name"
                value={form.playlist_name}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Songs per Artist:</label>
              <input
                type="number"
                name="songs_per_artist"
                value={form.songs_per_artist}
                onChange={handleChange}
                min="1"
                max="15"
              />
            </div>

            <div className="form-group">
              <label>Select Artists (Ctrl/Cmd+Click to select multiple):</label>
              <select
                multiple
                name="selected_artists"
                value={form.selected_artists}
                onChange={handleArtistSelection}
              >
                {artists.map((artist) => (
                  <option key={artist.id} value={artist.id}>
                    {artist.name}
                  </option>
                ))}
              </select>
            </div>

            <button type="submit" className="submit-button">
              Make Playlist
            </button>
          </form>
        </div>
      </div>

      <div className="right-pane">
        <Button className="add-artist-button" to="/add-artist" component={Link}>
          Add Artist
        </Button>
        <ArtistList />
      </div>
    </div>
  );
}
