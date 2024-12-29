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
                <button className="deleteButton">Delete Profile</button>
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
