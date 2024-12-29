import { Link } from "react-router-dom";
import axios from "axios";
import "./Events.css";
import { useEffect, useState } from "react";

function Events({ user }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch events from the backend
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get("http://localhost:2000/jamNights/jamnights");
        setEvents(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching events:", error);
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

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

      {/* Display loading message if events are still being fetched */}
      {loading && <p>Loading events...</p>}

      {/* Display events if they are loaded */}
      {!loading && events.length > 0 ? (
        <div className="eventsList">
          <h2 style={{textAlign: "center"}}>Upcoming Jam Nights</h2>
          {events.map((event) => (
            <div key={event._id} className="eventCard">
              <h3>{event.title}</h3>
              <p><strong>Date:</strong> {event.date}</p>
              <p><strong>Location:</strong> {event.location}</p>
              <p><strong>Summary:</strong> {event.summary}</p>
              <div>
                <h4>Participants:</h4>
                {/* List the participants here if you have that data */}
                {event.participants && event.participants.length > 0 ? (
                  <ul>
                    {event.participants.map((participant) => (
                      <li key={participant.id}>{participant.name}</li>
                    ))}
                  </ul>
                ) : (
                  <p>No participants yet. Be the first to join!</p>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        !loading && <p>No events available. Create one now!</p>
      )}
    </div>
  );
}

export default Events;