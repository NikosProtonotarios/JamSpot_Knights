import { Link } from "react-router-dom";
import axios from "axios";
import "./Events.css";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

function Events({ user }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [musicians, setMusicians] = useState([]);


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
          "https://jamspot-knights-2.onrender.com/jamNights/jamnights"
        );
        setEvents(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching events:", error);
        setLoading(false);
      }
    };
    fetchEvents();
  }, [events]);

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

    // Check if the user is a ShowRunner and prevent them from taking a role
    if (decoded.userType === "showRunner") {
      alert(
        `🎩 Your Majesty, only the brave musicians can take up the roles in the jam! You already orchestrate the event like a true ShowRunner Knight! 🏰`
      );
      return;
    }

    console.log(instrument);

    // Check if the musician already has a role in this song
    const musicianHasRoleInSong = currentSong.roles.some(
      (role) => role.musician && role.musician._id === musicianId
    );

    if (musicianHasRoleInSong) {
      alert(
        "You already have a role in this song! You can't take another role in the same song."
      );
      return;
    }

    if (currentRole.musician) {
      alert("Role is already taken by another musician");
      return;
    } else {
      // Ask for confirmation before taking the role
      const confirmTakeRole = window.confirm(
        `Are you sure you want to take the role of ${instrument} for the song "${currentSongTitle}"?`
      );

      if (!confirmTakeRole) {
        return;
      }

      // Update the role with musician ID
      currentRole.musician = decoded.userId;
      currentEvent.songs[songIndex].roles[roleIndex] = currentRole;
      console.log(events);

      try {
        const response = await axios.put(
          `https://jamspot-knights-2.onrender.com/users/musician/${musicianId}/${jamNightId}`,
          { currentSongTitle, instrument },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log(response.data);

        // Show a cool message when the role is successfully taken
        alert(
          `🎸 You have successfully claimed the role of ${instrument} for "${currentSongTitle}"! Get ready to jam like a true Knight of the JamSpot! ⚔️`
        );
      } catch (error) {
        console.error("Error updating role:", error);
      }
    }
  };

  // Function to delete an event
  const handleRemoveMusician = async (eventId, musicianId) => {
    try {
      const confirmRemoval = window.confirm(
        "Are you sure you want to remove this musician from the jam night? 🥁🎸💥"
      );

      if (!confirmRemoval) {
        alert("Phew! The musician is safe! 🎉");
        return;
      }

      // Retrieve the token from localStorage (or wherever you're storing it)
      const token = localStorage.getItem("authToken");

      if (!token) {
        alert("You must be logged in to remove a musician.");
        return;
      }

      // Make PUT request to remove musician with Authorization header
      const response = await axios.put(
        `https://jamspot-knights-2.onrender.com/users/jamNight/${eventId}/remove/${musicianId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Log response for debugging purposes
      console.log(response.data);

      alert("Musician removed successfully! 🎶🎤 The stage is yours!");
    } catch (error) {
      if (error.response && error.response.status === 403) {
        // If the error is a 403 (Unauthorized), show a cool alert message
        alert(
          "🛑 Whoa! Only the ShowRunner of this jam night can remove musicians! 👑⚔️ This isn't your jam, brave warrior! ⚔️"
        );
      } else {
        console.error(
          "Error removing musician:",
          error.response ? error.response.data : error.message
        );
        alert("Oops! Something went wrong! 😬 Please try again.");
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
        `https://jamspot-knights-2.onrender.com/jamNights/jamnight/${eventId}/confirm`,
        {},
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

    console.log("Event ID:", eventId); // Check if eventId is being passed
    console.log("Musician ID:", musicianId); // Check if musicianId is being passed

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        alert("You must be logged in to confirm a musician.");
        return;
      }

      const response = await axios.put(
        `https://jamspot-knights-2.onrender.com/jamNights/jamnight/${eventId}/confirmMusician`,
        { musicianId: musicianId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Show success message if the musician is confirmed
      alert("🎉 The musician has been confirmed! Let the jam begin! 🎶");

      // Optionally update the UI or show a confirmation message
    } catch (error) {
      if (error.response && error.response.status === 400) {
        // Musician already confirmed
        alert("🛡️ This musician is already confirmed for the jam night! 🎸✨");
      } else if (error.response && error.response.status === 403) {
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
        `https://jamspot-knights-2.onrender.com/jamNights/jamnight/${jamNightId}`,
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
        {token && decoded.userType ? (
          <div>
            <Link to="/createEvent">
              <button className="eventsButtons">Create Event</button>
            </Link>
          </div>
        ) : null}

        <div>
          <Link to="/checkOlderEvents">
            <button className="eventsButtons">Check Older Events</button>
          </Link>
        </div>
      </div>

      {/* Display loading message if events are still being fetched */}
      {loading && <p className="loadingEvents">Loading events...</p>}
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
                            <div
                              key={roleIndex}
                              className={`songsInfoContainer ${
                                event.confirmedMusicians?.includes(
                                  role.musician?._id
                                )
                                  ? "confirmedMusician"
                                  : ""
                              }`}
                            >
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
                                    {role.musician
                                      ? "Role is taken"
                                      : "Take the Role"}
                                  </button>
                                </div>
                                <div className="rolesSongsContainer">
                                  <strong className="instrumentMusician">
                                    Musician:
                                  </strong>{" "}
                                  {role.musician ? (
                                    <>
                                      {role.musician.username}
                                      {/* Display confirmation message if the musician is assigned */}
                                      {event.confirmedMusicians?.includes(
                                        role.musician?._id
                                      ) && (
                                        <span
                                          style={{
                                            color: "green",
                                            fontWeight: "bold",
                                            marginLeft: "10px",
                                            fontSize: "1.2rem",
                                          }}
                                        >
                                          ✅ This musician is confirmed
                                        </span>
                                      )}
                                    </>
                                  ) : (
                                    "Not yet assigned"
                                  )}
                                  {/* Only show the buttons if musician is not confirmed */}
                                  {!event.confirmedMusicians?.includes(
                                    role.musician?._id
                                  ) && (
                                    <>
                                      <button
                                        className="deleteButtons"
                                        onClick={() => {
                                          if (
                                            role.musician &&
                                            role.musician._id
                                          ) {
                                            handleRemoveMusician(
                                              event._id,
                                              role.musician._id
                                            );
                                          }
                                        }}
                                      >
                                        Remove Musician
                                      </button>
                                      <button
                                        onClick={() => {
                                          handleConfirmMusician(
                                            event._id,
                                            role.musician._id
                                          );
                                        }}
                                        className="deleteButtons"
                                      >
                                        Confirm Musician
                                      </button>
                                    </>
                                  )}
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
