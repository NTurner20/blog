require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

// Middleware
app.use(express.json());
app.use(cors());


// ROUTES //
app.use("/auth", require("./routes/auth"));
app.use('/dashboard', require('./routes/dashboard'));

// Run app
app.listen(process.env.PORT || 4000, () => {
    console.log(`Server running on port ${process.env.PORT || 4000}`);
});