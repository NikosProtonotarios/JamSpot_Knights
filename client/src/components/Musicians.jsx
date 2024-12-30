import { useState, useEffect } from "react";
import axios from "axios";
import "./Musicians.css"; // Importing a separate CSS file for styling

function Musicians() {
  const [musicians, setMusicians] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loggedInUserId, setLoggedInUserId] = useState(null); // Assume you set logged-in user's ID
  const [originalMusicianData, setOriginalMusicianData] = useState(null); // Store original musician data for cancellation

  useEffect(() => {
    const fetchMusicians = async () => {
      try {
        const response = await axios.get("http://localhost:2000/users/musicians");
        setMusicians(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching musicians:", error);
        setLoading(false);
      }
    };
    fetchMusicians();
  }, []);

  const deleteProfile = async (musicianId, musicianUserId) => {
    if (loggedInUserId !== musicianUserId) {
      alert("Hold your horses, fellow Knight! Only the true owner of this mighty profile can erase it.");
      return;
    }

    // Cool confirmation popup for the profile owner
    const confirmed = window.confirm("Are you sure you want to erase your Mighty Profile, brave Knight?");
    if (confirmed) {
      try {
        // Send DELETE request to the backend
        await axios.delete(`http://localhost:2000/users/musicians/${musicianId}`);

        // Remove the musician from the frontend state
        setMusicians((prevMusicians) =>
          prevMusicians.filter((musician) => musician._id !== musicianId)
        );
        alert("Your Mighty Profile has been erased, brave Knight!");
      } catch (error) {
        console.error("Error deleting profile:", error);
        alert("Failed to erase the profile. Please try again.");
      }
    }
  };

  const handleUpdateButtonClick = (musician, isCancel = false) => {
    if (isCancel) {
      // Revert to the original musician data when canceling
      setMusicians((prevMusicians) =>
        prevMusicians.map((m) =>
          m._id === musician._id ? { ...m, ...originalMusicianData, isUpdating: false } : m
        )
      );
    } else {
      // Save the original data before updating
      setOriginalMusicianData({ ...musician });
      
      // Mark the musician for update
      const updatedMusician = { ...musician, isUpdating: true };
      setMusicians((prevMusicians) =>
        prevMusicians.map((m) =>
          m._id === musician._id ? updatedMusician : m
        )
      );
    }
  };

  const handleProfileUpdateChange = (e, musicianId, field) => {
    const newValue = e.target.value;
    setMusicians((prevMusicians) =>
      prevMusicians.map((musician) =>
        musician._id === musicianId
          ? { ...musician, [field]: newValue }
          : musician
      )
    );
  };

  const handleProfileUpdateFileChange = (e, musicianId) => {
    const newFile = e.target.files[0];
    setMusicians((prevMusicians) =>
      prevMusicians.map((musician) =>
        musician._id === musicianId ? { ...musician, photo: newFile } : musician
      )
    );
  };

  const handleUpdateProfile = async (musicianId, updatedInfo) => {
    try {
      const formData = new FormData();
      formData.append("name", updatedInfo.name); // Only the name field is updated
      formData.append("bio", updatedInfo.bio);
      formData.append("instruments", updatedInfo.instruments);
      if (updatedInfo.photo) formData.append("photo", updatedInfo.photo);

      const token = localStorage.getItem("token"); // Assuming token is stored in localStorage
      const response = await axios.put(
        `http://localhost:2000/users/profile/musician/${musicianId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.token) {
        localStorage.setItem("token", response.data.token); // Update the token if it has changed
      }

      // Update the local musicians list
      setMusicians((prevMusicians) =>
        prevMusicians.map((musician) =>
          musician._id === musicianId ? { ...musician, ...response.data.user, isUpdating: false } : musician
        )
      );

      alert("Your Mighty Profile has been updated, brave Knight!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update the profile. Please try again.");
    }
  };

  return (
    <div className="musiciansContainer">
      <h2>List of Jam Knights</h2>
      {loading ? (
        <p>Loading musicians...</p>
      ) : (
        <div className="musiciansGrid">
          {musicians.length > 0 ? (
            musicians.map((musician) => (
              <div key={musician._id} className="musicianCard">
                <h3>{musician.username}</h3>
                {musician.photo && (
                  <img
                    src={`http://localhost:2000${musician.photo}`}
                    alt={`${musician.username}'s photo`}
                    className="musicianPhoto"
                  />
                )}

                <div className="musicianInfoContainer">
                  <p>
                    <strong>Email</strong>: {musician.email}
                  </p>
                  <p>
                    <strong>Instruments</strong>:{" "}
                    {musician.instruments.length ? musician.instruments.join(", ") : "None"}
                  </p>
                  <p>
                    <strong>Current Roles</strong>:{" "}
                    {musician.roles.length ? musician.roles.join(", ") : "None"}
                  </p>
                  <p>
                    <strong>Jam Nights Participated</strong>:{" "}
                    {musician.jamNightsParticipated.length || 0}
                  </p>
                  {musician.bio && <p className="bio"><strong>Bio:</strong> {musician.bio}</p>}
                </div>

                {/* Update Profile Button */}
                <div>
                  <button className="deleteButton" onClick={() => deleteProfile(musician._id, musician.userId)}>Delete Profile</button>
                  <button
                    className="updateButton"
                    onClick={() => handleUpdateButtonClick(musician)}
                  >
                    Update Profile
                  </button>
                </div>

                {/* Display input fields to update name, bio, and instruments in the same card */}
                {musician.isUpdating && (
                  <div className="updateFields">
                    <div>
                      <label>Name</label>
                      <input
                        type="text"
                        value={musician.name || ""}
                        onChange={(e) => handleProfileUpdateChange(e, musician._id, "name")}
                      />
                    </div>
                    <div>
                      <label>Bio</label>
                      <input
                        type="text"
                        value={musician.bio || ""}
                        onChange={(e) => handleProfileUpdateChange(e, musician._id, "bio")}
                      />
                    </div>
                    <div>
                      <label>Instruments</label>
                      <input
                        type="text"
                        value={musician.instruments || ""}
                        onChange={(e) => handleProfileUpdateChange(e, musician._id, "instruments")}
                      />
                    </div>
                    <div>
                      <label>Upload New Photo</label>
                      <input
                        type="file"
                        onChange={(e) => handleProfileUpdateFileChange(e, musician._id)}
                      />
                    </div>
                    <button onClick={() => handleUpdateProfile(musician._id, musician)}>Save Changes</button>
                    <button onClick={() => handleUpdateButtonClick(musician, true)}>Cancel</button>
                  </div>
                )}
              </div>
            ))
          ) : (
            <p>No musicians available</p>
          )}
        </div>
      )}
    </div>
  );
}

export default Musicians;
