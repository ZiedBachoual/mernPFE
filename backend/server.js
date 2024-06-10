const express = require('express');
const mongoose = require('mongoose');
const formationRoutes = require('./routes/formations');
const categorieRoutes = require('./routes/categorie');
const seanceRoutes = require('./routes/seance');
const userRoutes = require('./routes/user');
const formateurRoutes = require('./routes/formateur'); 

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(express.json());
app.use((req, res, next) => {
    console.log(req.path, req.method);
    next();
});

// Routes
app.use('/api/formateur', formateurRoutes);
app.use('/api/formation', formationRoutes);
app.use('/api/user', userRoutes);
app.use('/api/categorie', categorieRoutes);
app.use('/api/seance', seanceRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Database Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        // Start the server
        app.listen(PORT, () => {
            console.log(`DB connected & Server is running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error('Failed to connect to database:', error);
        process.exit(1); // Stop the process if unable to connect to the database
    });
