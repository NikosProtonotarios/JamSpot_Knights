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
                <p>Email: {musician.email}</p>
                <p>
                  Instruments:{" "}
                  {musician.instruments.length
                    ? musician.instruments.join(", ")
                    : "None"}
                </p>
                <p>
                  Roles:{" "}
                  {musician.roles.length ? musician.roles.join(", ") : "None"}
                </p>
                <p>
                  Jam Nights Participated:{" "}
                  {musician.jamNightsParticipated.length
                    ? musician.jamNightsParticipated.length
                    : 0}
                </p>

                {/* Display musician's bio */}
                {musician.bio && (
                  <p>
                    <strong>Bio:</strong> {musician.bio}
                  </p>
                )}

                {/* Display musician's photo */}
                {musician.photo && (
                  <img
                    src={`http://localhost:2000/uploads/${musician.photo}`}
                    alt={`${musician.username}'s photo`}
                    className="musicianPhoto"
                  />
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
