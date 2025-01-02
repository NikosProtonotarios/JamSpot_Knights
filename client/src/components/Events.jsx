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
    const userConfirmed = confirm("⚔️ Are you sure, mighty ShowRunner? Once vanquished, this event will be lost to the sands of time! 🕰️");

    if (!userConfirmed) {
      return;
    }

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        alert("You must be logged in to delete an event.");
        return
      }

      await axios.delete(`http://localhost:2000/jamNights/jamnight/${eventId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("🎉 You have successfully vanquished this event, mighty ShowRunner! 🛡️ Your majesty reigns supreme! 👑");

      setEvents(events.filter((event) => event._id !== eventId));
    } catch (error) {
      if (error.response && error.response.status === 403) {
        // Forbidden error message (user is not the ShowRunner)
        alert("🚫 Hold your horses! You don't have the power to delete this jam night. Only the mighty ShowRunner who created it can do that. 🎸⚔️");
      } else {
        console.error("Error deleting event:", error);
        alert("An unexpected error occurred. Please try again later.");
      }
    }
  };

  // Function to confirm an event
  const handleConfirmEvent = async (eventId) => {
    const userConfirmed = confirm("⚔️ Are you sure you want to confirm this event and summon the knights to the stage? 🎶👑 This action can’t be undone!");

    if (!userConfirmed) {
      return;
    }

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        alert("You must be logged in to confirm an event.");
        return;
      }
  
      await axios.put(
        `http://localhost:2000/jamNights/jamnight/${eventId}/confirm`,
        {}, // You can pass any required data here, if needed (e.g., empty body or confirmation data)
        {
          headers: { Authorization: `Bearer ${token}` }, // Headers should be passed as the third argument
        }
      );
  
      alert("🎉 The event has been confirmed, mighty ShowRunner! Let the music begin! 🎶");
  
      // Optionally update the UI or show a confirmation message
    } catch (error) {
      if (error.response && error.response.status === 403) {
        alert("🚫 Only the ShowRunner of this event has the power to confirm it. 🎸⚔️");
      } else {
        console.error("Error confirming event:", error);
        alert("An unexpected error occurred. Please try again later.");
      }
    }
  };

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
      <div className="EventContainer">
        <div>
          <Link to="/createEvent">
            <button className="eventsButtons">Create Event</button>
          </Link>
        </div>
        <div>
          <Link to="/checkOlderEvents">
            <button className="eventsButtons">Check Older Events</button>
          </Link>
        </div>
      </div>

      {/* Display loading message if events are still being fetched */}
      {loading && <p>Loading events...</p>}
      {/* Display events if they are loaded */}
      {!loading && events.length > 0 ? (
        <div className="eventsList">
          <h2
            style={{
              fontFamily: "UnifrakturMaguntia",
              fontSize: "60px",
              textAlign: "center",
              marginTop: "20px",
              textShadow:
                "1px 1px 0px black, -1px -1px 0px black, 1px -1px 0px black, -1px 1px 0px black",
            }}
          >
            Upcoming Jam Nights
          </h2>
          {events.map((event) => (
            <div key={event._id} className="eventCard">
              <div className="eventTitleCardContainer">
                <h3
                  style={{
                    fontFamily: "Pirata One",
                    fontSize: "50px",
                    textShadow:
                      "1px 1px 0px black, -1px -1px 0px black, 1px -1px 0px black, -1px 1px 0px black",
                  }}
                >
                  {event.title}
                </h3>
              </div>
              <div className="infoEventContainer">
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

                {/* Display the number of songs */}
                <p>
                  <strong>Number of Songs:</strong>{" "}
                  {event.songs ? event.songs.length : 0}
                </p>
              </div>
              {/* Display the songs and roles */}
              <div>
                <h4
                  style={{
                    textAlign: "center",
                    textShadow: "0 2px 5px rgba(0, 0, 0, 0.7)",
                    color: "black",
                    fontFamily: "Pirata One",
                    fontSize: "25px",
                    marginTop: "40px",
                  }}
                >
                  Songs and Roles
                </h4>
                {event.songs && event.songs.length > 0 ? (
                  <div>
                    {event.songs.map((song, songIndex) => (
                      <div>
                        <div key={songIndex} className="song">
                          <h5 style={{ textAlign: "center", fontSize: "3rem" }}>
                            {song.title}
                          </h5>
                        </div>
                        <ul>
                          {song.roles.map((role, roleIndex) => (
                            <div className="songsInfoContainer">
                              <li key={roleIndex}>
                                <div className="instrumentsContainer">
                                  <strong className="instrumentMusician">
                                    Instrument:
                                  </strong>{" "}
                                  {role.instrument}
                                  <button className="deleteButtons">
                                    Take the role
                                  </button>
                                </div>
                                <div className="rolesSongsContainer">
                                  <strong className="instrumentMusician">
                                    Musician:
                                  </strong>{" "}
                                  {role.musician
                                    ? role.musician.name
                                    : "Not yet assigned"}
                                  <button className="deleteButtons">
                                    Delete Musician
                                  </button>
                                  <button className="deleteButtons">
                                    Confirm Musician
                                  </button>
                                  <br />
                                </div>
                              </li>
                            </div>
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
      <footer>
        <div className="footerContainer">
          <div className="footerLinks">
            <ul>
              <li>
                <a href="#about">About</a>
              </li>
              <li>
                <a href="#contact">Contact</a>
              </li>
              <li>
                <a href="#privacy">Privacy Policy</a>
              </li>
              <li>
                <a href="#terms">Terms & Conditions</a>
              </li>
            </ul>
          </div>
          <div className="socialMedia">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              Facebook
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              Twitter
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              Instagram
            </a>
          </div>
          <div className="contactInfo">
            <p>Email: info@jamspotknights.com</p>
            <p>Phone: +123 456 7890</p>
          </div>
          <div className="copyright">
            <p>&copy; 2024 JamSpot Knights. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Events;
