import "./OlderEvents.css";
import React from "react";
import { Link } from "react-router-dom";

function OlderEvents() {
  return (
    <div>
        <div className="jamspotnav-title">
          <Link to="/">
            <h4
              style={{ fontFamily: "'Pirata One', serif" }}
              className="jamspotLetters"
            >
              JamSpot Knights
            </h4>
          </Link>
        </div>
        <div className="olderEventsContainer">
            <div className="OlderEventsCard">
                <p>It looks like the epic jam nights are still waiting to happen. Our stage is set, the spotlight’s ready, and the instruments are tuned — but no events have rocked the house just yet.
                Check back soon, and you'll find a collection of past performances to fuel your passion and inspiration! 🚀🎤</p>
            </div>
        </div>
      </div>
  );
}

export default OlderEvents;
