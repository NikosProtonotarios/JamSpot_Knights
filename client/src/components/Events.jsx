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
        const response = await axios.get(
          "http://localhost:2000/jamNights/jamnights"
        );
        setEvents(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching events:", error);
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  // Function to delete an event
  const handleDeleteEvent = async (eventId) => {
    try {
      await axios.delete(`http://localhost:2000/jamNights/${eventId}`);
      setEvents(events.filter(event => event._id !== eventId)); // Remove the event from the state
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  // Function to confirm an event
  const handleConfirmEvent = async (eventId) => {
    try {
      await axios.patch(`http://localhost:2000/jamNights/${eventId}/confirm`);
      // Optionally update the UI or show a confirmation message
    } catch (error) {
      console.error("Error confirming event:", error);
    }
  };

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
          <h2 style={{ textAlign: "center" }}>Upcoming Jam Nights</h2>
          {events.map((event) => (
            <div key={event._id} className="eventCard">
              <h3>{event.title}</h3>
              <p>
                <strong>Date:</strong>{" "}
                {new Date(event.date).toLocaleDateString()}
              </p>
              <p>
                <strong>Location:</strong> {event.location}
              </p>
              <p>
                <strong>Summary:</strong> {event.summary}
              </p>

              {/* Display the songs and roles */}
              <div>
                <h4 style={{ textAlign: "center" }}>Songs and Roles</h4>
                {event.songs && event.songs.length > 0 ? (
                  <div>
                    {event.songs.map((song, songIndex) => (
                      <div key={songIndex} className="song">
                        <h5>{song.title}</h5>
                        <ul>
                          {song.roles.map((role, roleIndex) => (
                            <li key={roleIndex}>
                              <div>
                                <strong>Instrument:</strong> {role.instrument}
                                <button className="roleButtons">
                                  Take the role
                                </button>
                              </div>
                              <div>
                                <strong>Musician:</strong>{" "}
                                {role.musician
                                  ? role.musician.name
                                  : "Not yet assigned"}
                                <button className="deleteButtons">
                                  Delete Musician from the Role
                                </button>
                                <br />
                                <br />
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>No songs available for this event.</p>
                )}
              </div>

              {/* Add buttons to delete and confirm the event */}
              <div className="eventActions">
                <button
                  className="deleteEventButton"
                  onClick={() => handleDeleteEvent(event._id)}
                >
                  Delete this event
                </button>
                <button
                  className="confirmEventButton"
                  onClick={() => handleConfirmEvent(event._id)}
                >
                  Confirm this event
                </button>
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
