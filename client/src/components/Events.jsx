import { Link } from "react-router-dom";
import axios from "axios";
import "./Events.css";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

function Events({ user }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  let token = null;
  let decoded = null;

  try {
    if (localStorage.getItem("authToken")) {
      token = localStorage.getItem("authToken");
      decoded = jwtDecode(token);
      console.log(decoded.userId);
    }
  } catch (error) {
    console.log(error);
  }

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

  console.log(events);

  const handleTaketheRole = async (
    jamNightId,
    eventIndex,
    songIndex,
    roleIndex
  ) => {
  
    let currentEvent = events[eventIndex];
    let currentSong = currentEvent.songs[songIndex];
    let currentSongTitle = currentSong.title;
    let currentRole = currentSong.roles[roleIndex];
    let instrument = currentRole.instrument;
    let musicianId = decoded.userId;

    console.log(instrument);

    if (currentRole.musician) {
      alert("Role is already taken by another musician");
      return;
    } else {
      currentRole.musician = decoded.userId;
      currentEvent.songs[songIndex].roles[roleIndex] = currentRole;
      console.log(events);
      try {
        const response = await axios.put(
          `http://localhost:2000/users/musician/${musicianId}/${jamNightId}`,
          { currentSongTitle, instrument },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log(response.data);
      } catch (error) {
        console.error("Error updating role:", error);
      }
    }
  };

  // Function to delete an event
  const handleRemoveMusician = async (eventId, musicianId, isConfirmed) => {
    // If the musician is confirmed, don't allow removal
    if (isConfirmed) {
      alert(
        "⚔️ This musician is already confirmed for the jam night and cannot be removed. 🎸"
      );
      return;
    }

    const userConfirmed = confirm(
      "⚔️ Are you sure, mighty ShowRunner? Once vanquished, this musician will be lost to the sands of time! 🕰️"
    );

    if (!userConfirmed) {
      return;
    }

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        alert("You must be logged in to remove a musician.");
        return;
      }

      await axios.put(
        `http://localhost:2000/jamNight/${eventId}/remove/${musicianId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert(
        "🎉 You have successfully removed this musician from the jam night! 🛡️"
      );

      // Remove the musician from the UI
      setEvents(events.filter((event) => event._id !== eventId));
    } catch (error) {
      if (error.response && error.response.status === 403) {
        alert(
          "🚫 Hold your horses! You don't have the power to remove this musician. 🎸⚔️"
        );
      } else {
        console.error("Error removing musician:", error);
        alert("An unexpected error occurred. Please try again later.");
      }
    }
  };

  // Function to confirm an event
  const handleConfirmEvent = async (eventId) => {
    const userConfirmed = confirm(
      "⚔️ Are you sure you want to confirm this event and summon the knights to the stage? 🎶👑 This action can’t be undone!"
    );

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

      alert(
        "🎉 The event has been confirmed, mighty ShowRunner! Let the music begin! 🎶"
      );

      // Optionally update the UI or show a confirmation message
    } catch (error) {
      if (error.response && error.response.status === 403) {
        alert(
          "🚫 Only the ShowRunner of this event has the power to confirm it. 🎸⚔️"
        );
      } else {
        console.error("Error confirming event:", error);
        alert("An unexpected error occurred. Please try again later.");
      }
    }
  };

  const handleConfirmMusician = async (eventId, musicianId) => {
    const userConfirmed = confirm(
      "⚔️ Are you sure you want to confirm this musician and solidify their place in the jam night? 🎶👑"
    );

    if (!userConfirmed) {
      return;
    }

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        alert("You must be logged in to confirm a musician.");
        return;
      }

      const response = await axios.put(
        `http://localhost:2000/jamNights/jamnight/${eventId}/confirmMusician`,
        { musicianId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Show success message if the musician is confirmed
      alert("🎉 The musician has been confirmed! Let the jam begin! 🎶");

      // Optionally update the UI or show a confirmation message
    } catch (error) {
      if (error.response && error.response.status === 403) {
        alert(
          "🚫 Only the ShowRunner can confirm musicians for this jam night. 🎸⚔️"
        );
      } else {
        console.error("Error confirming musician:", error);
        alert("An unexpected error occurred. Please try again later.");
      }
    }
  };

  const handleDeleteEvent = async (jamNightId) => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      alert("No valid token found. Please log in again. 🔐");
      return;
    }

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this jam night? ⚔️ The stage will be empty without it! This action cannot be undone! 🔥"
    );

    try {
      const response = await axios.delete(
        `http://localhost:2000/jamNights/jamnight/${jamNightId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Attach token to the request
          },
        }
      );

      if (response.status === 200) {
        alert(
          "Event successfully deleted! 🎉 The stage is yours once again, mighty ShowRunner!"
        );
        // Optionally, update the UI by removing the event from the list
      }
    } catch (error) {
      if (error.response?.status === 403) {
        alert(
          "You don't have permission to delete this jam night! ⚔️ Only the event's ShowRunner can wield this power."
        );
      } else if (error.response?.status === 404) {
        alert("This jam night no longer exists. 🏰 It's already been erased.");
      } else if (error.response?.status === 401) {
        alert("Invalid token. Please log in again. 🔐"); // Handle invalid token error
      } else {
        console.error(
          "Error deleting jam night:",
          error.response?.data?.message || error.message
        );
        alert("An error occurred while trying to delete the jam night. 🛠️");
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
      {decoded.userType === "showRunner" ? <div>
          <Link to="/createEvent">
            <button className="eventsButtons">Create Event</button>
          </Link>
        </div> : null}
        
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
          {events.map((event, eventIndex) => (
            <div
              key={event._id}
              className={`eventCard ${
                event.isConfirmed ? "confirmedEvent" : ""
              }`}
            >
              {event.isConfirmed && (
                <div className="confirmedMessage">
                  ✅ This event is confirmed!
                </div>
              )}
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
                      <div key={songIndex}>
                        <div className="song">
                          <h5 style={{ textAlign: "center", fontSize: "3rem" }}>
                            {song.title}
                          </h5>
                        </div>
                        <ul>
                          {song.roles.map((role, roleIndex) => (
                            <div key={roleIndex} className="songsInfoContainer">
                              <li>
                                <div className="instrumentsContainer">
                                  <strong className="instrumentMusician">
                                    Instrument:
                                  </strong>{" "}
                                  {role.instrument}
                                  <button 
                                  disabled={role.musician ? true : false}
                                    className="deleteButtons"
                                    onClick={() => {
                                      handleTaketheRole(
                                        event._id,
                                        eventIndex,
                                        songIndex,
                                        roleIndex
                                      );
                                    }}
                                  >
                                    {role.musician ? "Role is taken" : "Take the Role"}
                                  </button>
                                </div>
                                <div className="rolesSongsContainer">
                                  <strong className="instrumentMusician">
                                    Musician:<span>{role.musician ? role.musician.username : ""}</span>
                                  </strong>{" "}
                                  {role.musician
                                    ? role.musician.username
                                    : "Not yet assigned"}
                                  <button
                                    className="deleteButtons"
                                    onClick={() =>
                                      handleRemoveMusician(
                                        event._id,
                                        musician._id
                                      )
                                    }
                                  >
                                    Remove Musician
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleConfirmMusician(
                                        event._id,
                                        musician._id
                                      )
                                    }
                                    className="deleteButtons"
                                  >
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
