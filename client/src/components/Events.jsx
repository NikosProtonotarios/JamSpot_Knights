import { Link } from "react-router-dom";
import React from "react";
import "./Events.css";

function Events({user}) {
  return (
    <div>
      <div className="EventContainer">
        <div>
          <Link to="/createEvent">
            <button>Create Event</button>
          </Link>
        </div>
        <div>
          <Link to="/checkOlderEvents">
            <button>Check Older Events</button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Events;