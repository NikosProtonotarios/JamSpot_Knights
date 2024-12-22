import { useState } from "react";
import "./CreateEvent.css"; // Optional: Add styling for the form

function CreateEvent() {
  const [songs, setSongs] = useState([{ name: "", artist: "", roles: [""] }]);

  const handleAddSong = () => {
    setSongs([...songs, { name: "", artist: "", roles: [""] }]);
  };

  const handleRemoveSong = (index) => {
    const updatedSongs = songs.filter((_, i) => i !== index);
    setSongs(updatedSongs);
  };

  const handleSongChange = (index, field, value) => {
    const updatedSongs = [...songs];
    updatedSongs[index][field] = value;
    setSongs(updatedSongs);
  };

  const handleRoleChange = (songIndex, roleIndex, value) => {
    const updatedSongs = [...songs];
    updatedSongs[songIndex].roles[roleIndex] = value;
    setSongs(updatedSongs);
  };

  const handleAddRole = (index) => {
    const updatedSongs = [...songs];
    updatedSongs[index].roles.push("");
    setSongs(updatedSongs);
  };

  const handleRemoveRole = (songIndex, roleIndex) => {
    const updatedSongs = [...songs];
    updatedSongs[songIndex].roles = updatedSongs[songIndex].roles.filter(
      (_, i) => i !== roleIndex
    );
    setSongs(updatedSongs);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log("Event Submitted", { songs });
  };

  return (
    <div className="createEventContainer">
      <h2>Create a New Event</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="eventName">Event Name:</label>
          <input type="text" id="eventName" required />
        </div>

        <div className="form-group">
          <label htmlFor="eventDate">Event Date:</label>
          <input type="date" id="eventDate" required />
        </div>

        <div className="form-group">
          <label htmlFor="eventPlace">Event Place:</label>
          <input type="text" id="eventPlace" required />
        </div>

        <div className="form-group">
          <label htmlFor="eventDescription">Description:</label>
          <textarea id="eventDescription" required></textarea>
        </div>

        <div className="form-group">
          <label>Number of Songs: {songs.length}</label>
          <button type="button" onClick={handleAddSong}>
            Add Song
          </button>
        </div>

        {songs.map((song, songIndex) => (
          <div key={songIndex} className="song-section">
            <h3>Song {songIndex + 1}</h3>
            <div className="form-group">
              <label>Song Name:</label>
              <input
                type="text"
                value={song.name}
                onChange={(e) =>
                  handleSongChange(songIndex, "name", e.target.value)
                }
                required
              />
            </div>

            <div className="form-group">
              <label>Artist/Band:</label>
              <input
                type="text"
                value={song.artist}
                onChange={(e) =>
                  handleSongChange(songIndex, "artist", e.target.value)
                }
                required
              />
            </div>

            <div className="form-group">
              <label>Roles Needed:</label>
              {song.roles.map((role, roleIndex) => (
                <div key={roleIndex} className="role-group">
                  <input
                    type="text"
                    value={role}
                    onChange={(e) =>
                      handleRoleChange(songIndex, roleIndex, e.target.value)
                    }
                    placeholder="Role (e.g. vocals, guitar)"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveRole(songIndex, roleIndex)}
                  >
                    Remove Role
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => handleAddRole(songIndex)}
                className="add-role"
              >
                Add Role
              </button>
            </div>

            <button
              type="button"
              onClick={() => handleRemoveSong(songIndex)}
              className="remove-song"
            >
              Remove Song
            </button>
          </div>
        ))}

        <button type="submit" className="create-submit-button">
          Create Event
        </button>
      </form>
    </div>
  );
}

export default CreateEvent;
