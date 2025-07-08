import React from "react";
import Tooltip from "@mui/material/Tooltip";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

export default function SetlistInfoTooltip() {
  return (
    <Tooltip
      title={
        <span>
          These are the most frequently played live songs according to&nbsp;
          <a
            href="https://www.setlist.fm"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "lightblue", textDecoration: "underline" }}
          >
            setlist.fm
          </a>
          .
        </span>
      }
      arrow
      placement="left"
    >
      <InfoOutlinedIcon
        fontSize="small"
        style={{ marginLeft: "8px", cursor: "pointer", color: "#888" }}
      />
    </Tooltip>
  );
}