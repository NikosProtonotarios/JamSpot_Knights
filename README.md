   <h1 align="center">🛡️🎶JamSpot Knights🎶🛡️ </h1>

Project Overview
JamSpot Knights is a web app designed to revolutionize the world of jam nights. These impromptu music events, often held in pubs or small venues, have become popular in the UK, offering musicians a chance to perform live and connect with others. However, jam nights are notorious for being chaotic, unorganized, and sometimes unpredictable.

This app provides a solution by giving ShowRunners a well-structured form to create well-organized jam events, where the right musicians are matched with the right roles. ShowRunners can create events, select songs, and specify the roles they need for each performance, while musicians can easily sign up, choose roles, and wait for confirmation from the ShowRunner. By streamlining the process, JamSpot Knights ensures that every jam night is smooth, professional, and memorable for both musicians and the audience.

Whether you're a ShowRunner wanting to host a jam night that runs like clockwork, or a musician looking for your next stage to shine, JamSpot Knights is the place to be. With features like role assignment, musician profiles, and event confirmation, this app creates a community where live music thrives, and jam nights become a harmonious experience!

<h2 align="center">📷Photos📷</h2>
<img src="https://raw.githubusercontent.com/NikosProtonotarios/Web_photos/main/jamspot1.png" alt="JamSpot Screenshot" />
<img src="https://raw.githubusercontent.com/NikosProtonotarios/Web_photos/main/jamspot4.png" alt="JamSpot Screenshot" />
<img src="https://raw.githubusercontent.com/NikosProtonotarios/Web_photos/main/jamspot5.png" alt="JamSpot Screenshot" />
<img src="https://raw.githubusercontent.com/NikosProtonotarios/Web_photos/main/jamspot2.png" alt="JamSpot Screenshot" />
<img src="https://raw.githubusercontent.com/NikosProtonotarios/Web_photos/main/jamspot7.png" alt="JamSpot Screenshot" />
<img src="https://raw.githubusercontent.com/NikosProtonotarios/Web_photos/main/jamspot9.png" alt="JamSpot Screenshot" />
<img src="https://raw.githubusercontent.com/NikosProtonotarios/Web_photos/main/jamspot8.png" alt="JamSpot Screenshot" />
<img src="https://raw.githubusercontent.com/NikosProtonotarios/Web_photos/main/jamspot6.png" alt="JamSpot Screenshot" />


  <h2 align="center">🎥Video🎥</h2>
  JamSpot Knights Demo (https://www.youtube.com/watch?v=jiuxllb-068)

  <h2 align="center">✨Key Features✨</h2>

### Event Creation (ShowRunners)
- ShowRunners can easily create organized jam night events by providing details like:
  - Event type
  - Location
  - Date
  - Number of songs
  - Required roles for each song

### Role Assignment
- Musicians can take specific roles for each song in the event.
- Once a musician selects a role (e.g., guitar for a song), no other musician can take that role until the ShowRunner confirms or rejects the selection.

### Event Confirmation
- Only the ShowRunner can confirm the entire event, ensuring that it will happen.
- Musicians are confirmed for roles only by the ShowRunner.

### Musician Profiles
- Musicians can register, create a profile with their details (photo, instrument, previous jam night participation), and view their participation history.

### Event Management
- ShowRunners can update, delete, or manage musicians’ roles within the event.
- If a musician changes their mind or needs to be removed, only the ShowRunner or the musician themselves can delete their profile from the event.

### Secure Authentication
- Musicians and ShowRunners log in securely with JWT (JSON Web Tokens), ensuring proper access control for different roles.

### Role-Specific Permissions
- Musicians can only participate in jam events, while ShowRunners have full access to create, modify, and manage events.

<h2 align="center">⚙️Technologies Used⚙️</h2>

### Frontend:
- **React** – A JavaScript library for building user interfaces.
- **Vite** – A fast build tool and development server.
- **Axios** – Promise-based HTTP client for making API requests.

### Backend:
- **Node.js** – JavaScript runtime for building the backend.
- **Express** – Web framework for Node.js to handle server-side logic.
- **MongoDB** – NoSQL database for storing event and musician data.
- **Mongoose** – ODM (Object Data Modeling) library for MongoDB and Node.js.
- **CORS** – Middleware for enabling Cross-Origin Request Sharing.
- **Bcrypt** – Library for hashing passwords securely.
- **JWT (JSON Web Token)** – Authentication method for secure user login and authorization.
- **Multer** – Middleware for handling multipart/form-data (used for uploading files like musician photos).

  <h2 align="center">🔧Usage🔧</h2>

### For ShowRunners:
- **Create an Event:** Log in as a ShowRunner and create an event by specifying details like event type, location, date, and the number of songs.
- **Manage Roles:** Assign roles (such as guitar, drums, etc.) to each song, and musicians can claim those roles.
- **Confirm or Reject Musicians:** Once musicians take a role, you can confirm or reject them for each song.
- **Confirm Event:** Once everything is set, confirm the entire event to make sure it’s going forward.
- **Delete Event:** If plans change, you can delete the event at any time.

### For Musicians:
- **Register and Create Profile:** Sign up as a musician and fill out your profile with details like your instrument, photo, and previous jam night experience.
- **Claim Roles in Events:** Browse available events and select a role in a song that interests you.
- **Await Confirmation:** Once you claim a role, wait for the ShowRunner to confirm or reject you.
- **Delete Profile:** If needed, you can delete your profile or update your details at any time.

  <h2 align="center">✉️Contact</h2>

If you have any questions, suggestions, or want to collaborate, feel free to reach out to me:

- **Email:** protonotariosnick@gmail.com
- **GitHub:** [[github.com/NikosProtonotarios](https://github.com/NikosProtonotarios)]
- **LinkedIn:** [linkedin.com/in/nikos-protonotarios-25665a165](https://www.linkedin.com/in/nikos-protonotarios-25665a165/)
