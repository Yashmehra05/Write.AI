const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const cors = require('cors');

const userModel = require('./models/user');

const app = express();
const PORT = process.env.PORT || 4100;

app.use(cors({
    origin: 'http://localhost:5173', // Allow requests from this origin
    credentials: true // Allow cookies to be sent along with requests
}));

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/Multiverse', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Middleware
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());

// Authentication middleware
const ensureAuthenticated = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.redirect('/login');
    }

    jwt.verify(token, process.env.JWT_SECRET || "secret", (err, decoded) => {
        if (err) {
            res.cookie("token", "", { maxAge: 0 });
            return res.redirect('/login');
        }
        req.user = decoded;
        next();
    });
};

// Routes
app.get('/', (req, res) => {
    res.render("index");
});

app.post('/create', async (req, res) => {
    let { username, email, password, age } = req.body;
    try {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
        let createdUser = await userModel.create({
            username, email, password: hash, age,
        });
        let token = jwt.sign({ email }, process.env.JWT_SECRET || "secret");
        res.cookie("token", token);
        res.redirect('/login');
    } catch (error) {
        res.status(500).send(error);
    }
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(400).send('Invalid email or password');
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).send('Invalid email or password');
        }
        let token = jwt.sign({ email }, process.env.JWT_SECRET || "secret");
        res.cookie("token", token, { httpOnly: true });
        res.json({ success: true });// Redirect to React app after login
    } catch (error) {
        res.status(500).send(error);
    }
});

app.get('/logout', (req, res) => {
    res.cookie("token", "", { maxAge: 0 });
    res.redirect("/");
});

// Ensure this route is before static file serving middleware
app.get('/check-auth', (req, res) => {
    const token = req.cookies.token;
    if (!token) {
        return res.json({ isAuthenticated: false });
    }

    jwt.verify(token, process.env.JWT_SECRET || "secret", (err, decoded) => {
        if (err) {
            res.cookie("token", "", { maxAge: 0 });
            return res.json({ isAuthenticated: false });
        }
        res.json({ isAuthenticated: true });
    });
});

// Serve React app for authenticated users
app.use('/app', ensureAuthenticated, express.static(path.join(__dirname, 'Authenticate', 'dist')));

// Catch-all route to serve React app
// app.get('*', (req, res) => {
//     res.sendFile(path.join(__dirname, 'dist', 'index.html'));
// });

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
