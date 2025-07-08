import React, { useState, useEffect } from "react";
import SetlistInfoTooltip from "./SetlistInfoTooltip";
import "./ArtistList.css";

export default function ArtistList() {
  const [artists, setArtists] = useState([]);
  const [openArtistId, setOpenArtistId] = useState(null);
  const [topSongsByArtist, setTopSongsByArtist] = useState({});
  const [nSetlists, setNSetlists] = useState(null);

  useEffect(() => {
    fetch("/festplay/api/artists/")
      .then((res) => res.json())
      .then((data) => setArtists(data))
      .catch(console.error);
  }, []);

  function toggleArtist(artistId) {
    if (openArtistId === artistId) {
      setOpenArtistId(null);
      return;
    }

    setOpenArtistId(artistId);

    if (!topSongsByArtist[artistId]) {
      fetch(`/festplay/api/top-songs/?artist=${artistId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.length > 0 && data[0].n_setlists) {
            setNSetlists(data[0].n_setlists);
          }
          setTopSongsByArtist((prev) => ({ ...prev, [artistId]: data }));
        })
        .catch(console.error);
    }
  }

  return (
    <div className="artist-list">
      <div className="artist-header-row">
        <h2>Artists' Most Played Songs</h2>
        <SetlistInfoTooltip />
      </div>
      <ul>
        {artists.map((artist) => (
          <li key={artist.id} className="artist-card">
            <div className="artist-header">
              <div
                className="artist-name"
                onClick={() => toggleArtist(artist.id)}
              >
                {artist.name}
              </div>
              <button
                className="remove-button"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent parent div from toggling artist
                  handleRemoveArtist(artist.id);
                }}
                title="Remove artist"
              >
                X
              </button>
            </div>
            {openArtistId === artist.id && (
              <ul className="song-list">
                <h5>
                  {" "}
                  Top {(topSongsByArtist[artist.id] || []).length} songs, past{" "}
                  {nSetlists ?? "—"} concerts
                </h5>
                {(topSongsByArtist[artist.id] || []).map((song) => (
                  <li key={song.id}>
                    - {song.title} ({song.count})
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
      <div className="bottom">
        <p>Made by <a href="https://sondrebolland.com">Sondre Sæther Bolland</a></p>
      </div>
    </div>
  );

  async function handleRemoveArtist(artistId) {
    try {
      const response = await fetch(`/festplay/api/artists/${artistId}/`, {
        method: "DELETE",
      });

      if (response.ok) {
        setArtists((prev) => prev.filter((a) => a.id !== artistId));
        setTopSongsByArtist((prev) => {
          const copy = { ...prev };
          delete copy[artistId];
          return copy;
        });
        if (openArtistId === artistId) {
          setOpenArtistId(null);
        }
      } else {
        console.error("Failed to delete artist");
      }
    } catch (err) {
      console.error("Error deleting artist:", err);
    }
  }
}
