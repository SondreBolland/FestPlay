import React from "react";
import ArtistList from "./ArtistList";
import "./Layout.css";

export default function Layout({ children }) {
  return (
    <div className="homepage-container">
        <div className="main-pane">
            {children}
        </div>
      <div className="right-pane">
        <ArtistList />
      </div>
    </div>
  );
}
