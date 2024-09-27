require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

// Middleware

// ROUTES //

// Run app
app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});