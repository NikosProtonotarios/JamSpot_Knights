import React, { useState, useCallback, useEffect } from "react";
import "./CreateEvent.css";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";

function CreateEvent() {
  const [eventDetails, setEventDetails] = useState({
    title: "",
    date: "",
    location: "",
    summary: "",
    songs: [{ title: "", roles: [{ instrument: "", musician: "null" }] }],
  });

  const navigate = useNavigate();

  const handleAddSong = useCallback(() => {
    setEventDetails({
      ...eventDetails,
      songs: [
        ...eventDetails.songs,
        { title: "", roles: [{ instrument: "", musician: "null" }] },
      ],
    });
  }, [eventDetails]);

  const handleRemoveSong = (index) => {
    const updatedSongs = eventDetails.songs.filter((_, i) => i !== index);
    setEventDetails({ ...eventDetails, songs: updatedSongs });
  };

  const handleSongChange = (index, field, value) => {
    const updatedSongs = [...eventDetails.songs];
    updatedSongs[index][field] = value;
    setEventDetails({ ...eventDetails, songs: updatedSongs });
  };

  const handleRoleChange = (songIndex, roleIndex, field, value) => {
    const updatedSongs = [...eventDetails.songs];
    updatedSongs[songIndex].roles[roleIndex][field] = value;
    setEventDetails({ ...eventDetails, songs: updatedSongs });
  };

  const handleAddRole = (songIndex) => {
    const updatedSongs = [...eventDetails.songs];
    updatedSongs[songIndex].roles.push({ instrument: "", musician: "null" });
    setEventDetails({ ...eventDetails, songs: updatedSongs });
  };

  const handleRemoveRole = (songIndex, roleIndex) => {
    const updatedSongs = [...eventDetails.songs];
    updatedSongs[songIndex].roles = updatedSongs[songIndex].roles.filter(
      (_, i) => i !== roleIndex
    );
    setEventDetails({ ...eventDetails, songs: updatedSongs });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEventDetails({ ...eventDetails, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("authToken"); // Or sessionStorage or any other method you are using to store the token

    if (!token) {
      alert("Please log in first!");
      return;
    }

    const data = {
      title: eventDetails.title,
      location: eventDetails.location,
      date: eventDetails.date,
      summary: eventDetails.summary,
      songs: eventDetails.songs.map((song) => ({
        title: song.title,
        roles: song.roles.map((role) => ({
          instrument: role.instrument,
          musician: role.musician,
        })),
      })),
    };

    try {
      const response = await axios.post(
        "http://localhost:2000/jamNights/jamNight",
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the headers
          },
        }
      );

      if (response.status === 201) {
        navigate("/events");
        alert(
          `Congrats! Your Jam Night event is now live. Musicians can join soon!`
        );
      }

      console.log("Jam Night Created:", response.data);
    } catch (error) {
      console.error("Error creating event:", error);
      if (error.response && error.response.status === 401) {
        alert("Unauthorized. Please log in again.");
      } else if (error.response && error.response.status === 403) {
        navigate("/events");
        alert(
          "Oops! 🚫🎸 It seems like you’re not a ShowRunner! But no worries, brave JamSpot Knight! ⚔️ You can still join epic Jam Nights and claim your role! 🥁🎤 Choose your next battle and shine like the hero you are! 💫"
        );
      }
    }
  };

  return (
    <div>
      <div className="jamspotnav-title">
        <Link to="/">
          <h4
            style={{ fontFamily: "'Pirata One', serif", fontSize: "30px" }}
            className="jamspotLetters"
          >
            JamSpot Knights
          </h4>
        </Link>
      </div>
      <div className="createEventContainer2">
        <div
          style={{ fontFamily: "'Pirate One', serif", color: "black" }}
          className="createEventContainer"
        >
          <h2
            style={{
              fontFamily: "'Pirata One', serif",
              color: "black",
              fontSize: "40px",
            }}
          >
            Create a New Jam Night Event
          </h2>
          <form onSubmit={handleSubmit}>
            {/* Event Title */}
            <div className="form-group">
              <label htmlFor="title">Event Title:</label>
              <input
                type="text"
                id="title"
                name="title"
                value={eventDetails.title}
                onChange={handleInputChange}
                required
              />
            </div>

            {/* Event Date */}
            <div className="form-group">
              <label htmlFor="date">Event Date:</label>
              <input
                type="date"
                id="date"
                name="date"
                value={eventDetails.date}
                onChange={handleInputChange}
                required
              />
            </div>

            {/* Event Location */}
            <div className="form-group">
              <label htmlFor="location">Event Location:</label>
              <input
                type="text"
                id="location"
                name="location"
                value={eventDetails.location}
                onChange={handleInputChange}
                required
              />
            </div>

            {/* Event Summary */}
            <div className="form-group">
              <label htmlFor="summary">Event Summary:</label>
              <textarea
                id="summary"
                name="summary"
                value={eventDetails.summary}
                onChange={handleInputChange}
                required
              ></textarea>
            </div>

            {/* Songs Section */}
            <div className="form-group">
              <label>Number of Songs: {eventDetails.songs.length}</label>
              <button
                className="createEventButton"
                type="button"
                onClick={handleAddSong}
              >
                Add Song
              </button>
            </div>

            {eventDetails.songs.map((song, songIndex) => (
              <div key={songIndex} className="song-section">
                <div className="songsContainer">
                <h3>Song {songIndex + 1}</h3>
                </div>
                {/* Song Title */}
                <div className="form-group">
                  <label>Song Title:</label>
                  <input
                    type="text"
                    value={song.title}
                    onChange={(e) =>
                      handleSongChange(songIndex, "title", e.target.value)
                    }
                    required
                  />
                </div>

                {/* Roles Needed */}
                <div className="form-group">
                  <label>Roles Needed:</label>
                  {song.roles.map((role, roleIndex) => (
                    <div key={roleIndex} className="role-group">
                      <input
                        type="text"
                        value={role.instrument}
                        onChange={(e) =>
                          handleRoleChange(
                            songIndex,
                            roleIndex,
                            "instrument",
                            e.target.value
                          )
                        }
                        placeholder="Instrument (e.g. guitar)"
                        required
                      />

                      <button
                        className="createEventButton"
                        type="button"
                        onClick={() => handleRemoveRole(songIndex, roleIndex)}
                      >
                        Remove Role
                      </button>
                    </div>
                  ))}

                  <button
                    className="createEventButton"
                    type="button"
                    onClick={() => handleAddRole(songIndex)}
                  >
                    Add Role
                  </button>
                </div>
                <div className="removeSongButton">
                  <button
                    className="createEventButton"
                    type="button"
                    onClick={() => handleRemoveSong(songIndex)}
                  >
                    Remove Song
                  </button>
                </div>
              </div>
            ))}

            {/* Submit Button */}
            <div className="createEventButtonContainer">
              <button type="submit" className="createEventButton3">
                Create Event
              </button>
            </div>
          </form>
        </div>
      </div>
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

export default CreateEvent;
