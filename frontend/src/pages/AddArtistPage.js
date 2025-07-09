// src/pages/AddArtistPage.js
import React, { useState } from "react";
import axios from "axios";
import { API_ROOT } from "../config";
import { Button } from "@mui/material";
import Layout from "../components/Layout";
import "./AddArtistPage.css";

function AddArtistPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedArtist, setSelectedArtist] = useState(null);
  const [statusMessage, setStatusMessage] = useState("");

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;

    try {
      const response = await axios.get(`${API_ROOT}api/artist-search/`, {
        params: { q: searchTerm },
      });
      setSearchResults(response.data);
      setSelectedArtist(null);
      setStatusMessage("");
    } catch (error) {
      console.error("Error searching artists:", error);
      setStatusMessage("Search failed. Please try again.");
    }
  };

  const handleSelect = (artist) => {
    setSelectedArtist(artist);
    setStatusMessage("");
  };

  const handleAddArtist = async () => {
    if (!selectedArtist) return;

    try {
      setStatusMessage(`⌛️🔄 Loading "${selectedArtist.name}"`);
      const response = await axios.post(`${API_ROOT}api/add-artist/`, {
        name: selectedArtist.name,
        mbid: selectedArtist.mbid,
      });

      if (response.status === 201) {
        setStatusMessage(
          `✅ Artist "${selectedArtist.name}" added successfully.`
        );
      } else if (response.status === 208) {
        setStatusMessage(`ℹ️ Artist "${selectedArtist.name}" already exists.`);
      }
    } catch (error) {
      console.error("Error adding artist:", error);
      setStatusMessage("Error adding artist.");
    }
  };

  return (
    <div className="main-pane">
      <div className="add-artist-container">
        <div className="back-button-right">
          <Button
            className="back-search-button"
            onClick={() => window.history.back()}
          >
            Back
          </Button>
        </div>

        <div className="search-artist-container">
          <h2>Add Artist</h2>

          <input
            type="text"
            placeholder="Search for an artist..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <button className="back-search-button" onClick={handleSearch}>
            Search
          </button>

          {searchResults.length > 0 && (
            <ul className="search-results">
              {searchResults.map((artist, index) => (
                <li
                  key={index}
                  className={
                    selectedArtist?.mbid === artist.mbid ? "selected" : ""
                  }
                  onClick={() => handleSelect(artist)}
                >
                  {artist.name}
                  {artist.disambiguation && ` (${artist.disambiguation})`}
                </li>
              ))}
            </ul>
          )}

          {selectedArtist && (
            <div className="selected-artist">
              <p>
                Selected: <strong>{selectedArtist.name}</strong>
              </p>
              <button className="back-search-button" onClick={handleAddArtist}>
                Add Artist
              </button>
            </div>
          )}

          {statusMessage && <p className="status-message">{statusMessage}</p>}
        </div>
      </div>
      <div className="desktop-only">
        <div className="right-pane">
          <ArtistList />
        </div>
      </div>
    </div>
  );
}

export default AddArtistPage;
