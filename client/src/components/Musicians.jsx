import { useState, useEffect } from "react";
import axios from "axios";
import "./Musicians.css";
import { Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

function Musicians() {
  const [musicians, setMusicians] = useState([]);
  const [loading, setLoading] = useState(true);
  const [originalMusicianData, setOriginalMusicianData] = useState(null);
  const navigate = useNavigate();
  
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

  useEffect(() => {
    const fetchMusicians = async () => {
      try {
        const response = await axios.get(
          "https://jamspot-knights-2.onrender.com/users/musicians"
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
          `https://jamspot-knights-2.onrender.com/users/musician/${musicianId}`,
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
        localStorage.removeItem("authToken");
          navigate("/login");
      } catch (error) {
        console.error("Error deleting profile:", error);
        alert(
          "Hold your horses, fellow Knight🛡️! Only the true owner of this mighty profile can erase it."
        );
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

  const handleUpdateProfile = async (musicianId, updatedInfo, index) => {
    try {
      console.log(musicians);
      console.log(musicians[index].username);
      const token = localStorage.getItem("authToken");

      if (!token) {
        alert("Please log in to update your profile.");
        return;
      }

      console.log("Updated Info:", updatedInfo);

      // const formData = new FormData();
      // formData.append("name", updatedInfo.name);
      // formData.append("bio", updatedInfo.bio);
      // formData.append("instruments", updatedInfo.instruments);
      // if (updatedInfo.photo) formData.append("photo", updatedInfo.photo);

      // const formData = new FormData();
      // if (musicians[index].username)
      //   formData.append("username", musicians[index].username);
      // if (musicians[index].bio) formData.append("bio", musicians[index].bio);
      // if (musicians[index].instruments)
      //   // formData.append("instruments", musicians[index].instruments);
      //   formData.append(
      //     "instruments",
      //     JSON.stringify(musicians[index].instruments)
      //   );

      // if (musicians[index].photo)
      // formData.append("photo", musicians[index].photo);
      // console.log(formData);

      // for (let pair of formData.entries()) {
      //   console.log(pair[0], pair[1]);
      // }

      const response = await axios.put(
        `https://jamspot-knights-2.onrender.com/users/profile/musician/${musicianId}`,
        {
          username: musicians[index].username,
          bio: musicians[index].bio,
          instruments: musicians[index].instruments,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            // "Content-Type": "multipart/form-data",
          },
        }
      );

      // if (response.data.token) {
      //   localStorage.setItem("token", response.data.token);
      // }
      console.log(response.data);
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
      <div className="musiciansContainer">
        <h2 className="musiciansTitleContainer" style={{ fontFamily: "UnifrakturMaguntia", fontSize: "50px" }}>
          List of Jam Knights
        </h2>
        {loading ? (
          <p>Loading musicians...</p>
        ) : (
          <div className="musiciansGrid">
            {musicians.length > 0 ? (
              musicians.map((musician, index) => (
                <div key={musician._id} className="musicianCard">
                  <h3
                    style={{
                      color: "black",
                      fontFamily: "'Pirata One', serif",
                      fontSize: "40px",
                    }}
                  >
                    {musician.username}
                  </h3>
                  {musician.photo && (
                    <img
                      src={`https://jamspot-knights-2.onrender.com${musician.photo}`}
                      alt={`${musician.username}'s photo`}
                      className="musicianPhoto"
                    />
                  )}

                  <div
                    style={{ fontFamily: "Cinzel Decorative" }}
                    className="musicianInfoContainer"
                  >
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
                  {token && musician._id === decoded.userId ? <div>
                    <button
                      style={{ fontFamily: "Pirata One", fontSize: "19px" }}
                      className="deleteButton"
                      onClick={() => deleteProfile(musician._id)}
                    >
                      Delete Profile
                    </button>
                    <button
                      style={{ fontFamily: "Pirata One", fontSize: "19px" }}
                      className="updateButton"
                      onClick={() => handleUpdateButtonClick(musician)}
                    >
                      Update Profile
                    </button>
                  </div> : null}
                  

                  {/* Display input fields to update name, bio, and instruments in the same card */}
                  {musician.isUpdating && (
                    <div className="updateFieldsContainer">
                      <div className="updateFields">
                        <div>
                          <label>Name:</label>
                          <input
                            className="inputUpdate"
                            type="text"
                            value={musician.username || ""}
                            onChange={(e) =>
                              handleProfileUpdateChange(
                                e,
                                musician._id,
                                "username"
                              )
                            }
                          />
                        </div>
                        <div>
                          <label>Bio:</label>
                          <input
                            className="inputUpdate"
                            type="text"
                            value={musician.bio || ""}
                            onChange={(e) =>
                              handleProfileUpdateChange(e, musician._id, "bio")
                            }
                          />
                        </div>
                        <div>
                          <label>Instruments:</label>
                          <input
                            className="inputUpdate"
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
                            className="inputUpdate"
                            type="file"
                            onChange={(e) =>
                              handleProfileUpdateFileChange(e, musician._id)
                            }
                          />
                        </div>
                      </div>

                      <div className="updatedButtons">
                        <button
                          className="saveButton"
                          style={{
                            fontFamily: "Pirata One",
                            color: "white",
                            fontSize: "18px",
                            backgroundColor: "#45027c",
                          }}
                          onClick={() =>
                            handleUpdateProfile(musician._id, musician, index)
                          }
                        >
                          Save Changes
                        </button>
                        <button
                          className="cancelButton"
                          style={{
                            fontFamily: "Pirata One",
                            color: "white",
                            fontSize: "18px",
                            backgroundColor: "#45027c",
                          }}
                          onClick={() =>
                            handleUpdateButtonClick(musician, true)
                          }
                        >
                          Cancel
                        </button>
                      </div>
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

export default Musicians;