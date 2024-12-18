const mongoose = require("mongoose");

const URI = "mongodb+srv://Nikos:Nikos1234@cluster0.ck9pj.mongodb.net/JamSpot_Knights?retryWrites=true&w=majority&appName=Cluster0";

// initialize mongo connection
main()
    .then(() => console.log('DB is connected successfully'))
    .catch((err) => console.log(err));

    async function main() {
        await mongoose.connect(URI);
    }

    module.exports = main;