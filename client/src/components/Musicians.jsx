import { useState, useEffect } from "react";
import axios from "axios";
import "./Musicians.css"; // Importing a separate CSS file for styling

function Musicians() {
  const [musicians, setMusicians] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const deleteProfile = async (musicianId, musicianUserId) => {
    if (loggedInUserId !== musicianUserId) {
      
      alert(
        "Hold your horses, fellow Knight! Only the true owner of this mighty profile can erase it."
      );
      return;
    }

    // Cool confirmation popup for the profile owner
    const confirmed = window.confirm(
      "Are you sure you want to erase your Mighty Profile, brave Knight?"
    );

    if (confirmed) {
      try {
        // Send DELETE request to the backend
        await axios.delete(
          `http://localhost:2000/users/musicians/${musicianId}`
        );

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

                {/* Display musician's photo */}
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
                    {musician.instruments.length
                      ? musician.instruments.join(", ")
                      : "None"}
                  </p>
                  <p>
                    <strong>Current Roles</strong>:{" "}
                    {musician.roles.length ? musician.roles.join(", ") : "None"}
                  </p>
                  <p>
                    <strong>Jam Nights Participated</strong>:{" "}
                    {musician.jamNightsParticipated.length
                      ? musician.jamNightsParticipated.length
                      : 0}
                  </p>

                  {/* Display musician's bio */}
                  {musician.bio && (
                    <p className="bio">
                      <strong>Bio:</strong> {musician.bio}
                    </p>
                  )}
                </div>
                <div>
                  <button className="deleteButton" onClick={() => deleteProfile(musician._id, musician.userId)}>Delete Profile</button>
                  <button className="updateButton">Update Profile</button>
                </div>
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
