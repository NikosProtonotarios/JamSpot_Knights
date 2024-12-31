import { useState, useEffect } from "react";
import axios from "axios";
import "./Musicians.css";
import { Link } from "react-router-dom";

function Musicians() {
  const [musicians, setMusicians] = useState([]);
  const [loading, setLoading] = useState(true);
  const [originalMusicianData, setOriginalMusicianData] = useState(null); // Store original musician data for cancellation

  useEffect(() => {
    const fetchMusicians = async () => {
      try {
        const response = await axios.get(
          "http://localhost:2000/users/musicians"
        );
        setMusicians(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching musicians:", error);
        setLoading(false);
      }
    };
    fetchMusicians();
  }, []);

  const deleteProfile = async (musicianId) => {

    const confirmed = window.confirm(
      "Are you sure you want to erase your Mighty Profile, brave Knight?"
    );
    if (confirmed) {
      try {
        // Retrieve the token from localStorage (or wherever you store it)
        const token = localStorage.getItem("authToken");

        if (!token) {
          alert("No authentication token found. Please log in again.");
          return;
        }
        // Send DELETE request to the backend
        await axios.delete(
          `http://localhost:2000/users/musician/${musicianId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Remove the musician from the frontend state
        setMusicians((prevMusicians) =>
          prevMusicians.filter((musician) => musician._id !== musicianId)
        );
        alert("Your Mighty Profile has been erased, brave Knight!");
      } catch (error) {
        console.error("Error deleting profile:", error);
        alert("Hold your horses, fellow Knight🛡️! Only the true owner of this mighty profile can erase it.");
      }
    }
  };

  const handleUpdateButtonClick = (musician, isCancel = false) => {
    if (isCancel) {
      // Revert to the original musician data when canceling
      setMusicians((prevMusicians) =>
        prevMusicians.map((m) =>
          m._id === musician._id
            ? { ...m, ...originalMusicianData, isUpdating: false }
            : m
        )
      );
    } else {
      // Save the original data before updating
      setOriginalMusicianData({ ...musician });

      // Mark the musician for update
      const updatedMusician = { ...musician, isUpdating: true };
      setMusicians((prevMusicians) =>
        prevMusicians.map((m) => (m._id === musician._id ? updatedMusician : m))
      );
    }
  };

  const handleProfileUpdateChange = (e, musicianId, field) => {
    const newValue = e.target.value;

    // Special handling for 'instruments' field
    if (field === "instruments") {
      // If it's a string, we can split it into an array
      const instrumentsArray = newValue.split(",").map((item) => item.trim());
      setMusicians((prevMusicians) =>
        prevMusicians.map((musician) =>
          musician._id === musicianId
            ? { ...musician, [field]: instrumentsArray }
            : musician
        )
      );
    } else {
      setMusicians((prevMusicians) =>
        prevMusicians.map((musician) =>
          musician._id === musicianId
            ? { ...musician, [field]: newValue }
            : musician
        )
      );
    }
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
      const token = localStorage.getItem("authToken");

      if (!token) {
        alert("Please log in to update your profile.");
        return;
      }

      console.log("Updated Info:", updatedInfo);

      const formData = new FormData();
      formData.append("name", updatedInfo.name);
      formData.append("bio", updatedInfo.bio);
      formData.append("instruments", updatedInfo.instruments);
      if (updatedInfo.photo) formData.append("photo", updatedInfo.photo);

      for (let pair of formData.entries()) {
        console.log(pair[0], pair[1]);
      }

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
        localStorage.setItem("token", response.data.token);
      }

      setMusicians((prevMusicians) =>
        prevMusicians.map((musician) =>
          musician._id === musicianId
            ? { ...musician, ...response.data.user, isUpdating: false }
            : musician
        )
      );

      alert("Your Mighty Profile has been updated, brave Knight!");
    } catch (error) {
      // Log the entire error for better debugging
      console.error("Error updating profile:", error);

      // Check if error.response exists and log the details
      if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
        console.error("Response headers:", error.response.headers);
      }

      // Handle specific error cases
      if (error.response && error.response.status === 401) {
        alert("Your session has expired. Please log in again.");
        localStorage.removeItem("token");
      } else {
        alert("Failed to update the profile. Please try again.");
      }
    }
  };

  // font-family: "IM Fell DW Pica", serif;

  return (
    <div>
      <div className="jamspotnav-title">
        <Link to="/">
          <h4 style={{fontFamily: "'Pirata One', serif", fontSize: "30px"}} className="jamspotLetters">JamSpot Knights</h4>
        </Link>
      </div>
      <div className="musiciansContainer">
        <h2 style={{ fontFamily: "UnifrakturMaguntia", fontSize: "50px" }}>List of Jam Knights</h2>
        {loading ? (
          <p>Loading musicians...</p>
        ) : (
          <div className="musiciansGrid">
            {musicians.length > 0 ? (
              musicians.map((musician) => (
                <div key={musician._id} className="musicianCard">
                  <h3 style={{color: "black", fontFamily: "Titan One"}}>{musician.username}</h3>
                  {musician.photo && (
                    <img
                      src={`http://localhost:2000${musician.photo}`}
                      alt={`${musician.username}'s photo`}
                      className="musicianPhoto"
                    />
                  )}

                  <div style={{fontFamily: "Pirata One"}} className="musicianInfoContainer">
                    <p>
                      <strong>Email</strong>: {musician.email}
                    </p>
                    <p>
                      <strong>Instruments</strong>:{" "}
                      {Array.isArray(musician.instruments)
                        ? musician.instruments.join(", ")
                        : musician.instruments || "None"}
                    </p>
                    <p>
                      <strong>Current Roles</strong>:{" "}
                      {musician.roles.length
                        ? musician.roles.join(", ")
                        : "None"}
                    </p>
                    <p>
                      <strong>Jam Nights Participated</strong>:{" "}
                      {musician.jamNightsParticipated.length || 0}
                    </p>
                    {musician.bio && (
                      <p className="bio">
                        <strong>Bio:</strong> {musician.bio}
                      </p>
                    )}
                  </div>

                  {/* Update Profile Button */}
                  <div>
                    <button style={{ fontFamily: "Pirata One", fontSize: "19px" }}
                      className="deleteButton"
                      onClick={() =>
                        deleteProfile(musician._id)
                      }
                    >
                      Delete Profile
                    </button>
                    <button style={{ fontFamily: "Pirata One", fontSize: "19px" }}
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
                          onChange={(e) =>
                            handleProfileUpdateChange(e, musician._id, "name")
                          }
                        />
                      </div>
                      <div>
                        <label>Bio</label>
                        <input
                          type="text"
                          value={musician.bio || ""}
                          onChange={(e) =>
                            handleProfileUpdateChange(e, musician._id, "bio")
                          }
                        />
                      </div>
                      <div>
                        <label>Instruments</label>
                        <input
                          type="text"
                          value={
                            musician.instruments
                              ? musician.instruments.join(", ")
                              : ""
                          }
                          onChange={(e) =>
                            handleProfileUpdateChange(
                              e,
                              musician._id,
                              "instruments"
                            )
                          }
                        />
                      </div>
                      <div>
                        <label>Upload New Photo</label>
                        <input
                          type="file"
                          onChange={(e) =>
                            handleProfileUpdateFileChange(e, musician._id)
                          }
                        />
                      </div>
                      <button
                        onClick={() =>
                          handleUpdateProfile(musician._id, musician)
                        }
                      >
                        Save Changes
                      </button>
                      <button
                        onClick={() => handleUpdateButtonClick(musician, true)}
                      >
                        Cancel
                      </button>
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
    </div>
  );
}

export default Musicians;
