require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const path = require("path");
const rateLimit = require("express-rate-limit");

const app = express();

const PORT = process.env.PORT || 3000;

app.set("trust proxy", 1);

app.use(helmet({
    contentSecurityPolicy: false
}));

const allowedOrigin = process.env.ALLOWED_ORIGIN || "*";

app.use(cors({
    origin: allowedOrigin === "*"
        ? "*"
        : allowedOrigin.split(",").map(origin => origin.trim())
}));

app.use(express.json({ limit: "100kb" }));
app.use(express.urlencoded({
    extended: false,
    limit: "100kb"
}));

app.use(rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 200,
    standardHeaders: "draft-7",
    legacyHeaders: false,
    message: {
        success: false,
        error: "Too many requests. Please try again later."
    }
}));

// Website folder
const websitePath = path.join(__dirname, "website");

// Serve website files
app.use(express.static(websitePath));

// Home page
app.get("/", (req, res) => {
    res.sendFile(path.join(websitePath, "index.html"));
});

// API routes
app.use("/api/health", require("./routes/health"));
app.use("/api/plans", require("./routes/plans"));
app.use("/api/music", require("./routes/music"));
app.use("/api/account", require("./routes/account"));
app.use("/api/usage", require("./routes/usage"));

// API not found
app.use("/api", (req, res) => {
    res.status(404).json({
        success: false,
        error: "API endpoint not found."
    });
});

// General error handler
app.use((err, req, res, next) => {
    console.error("Server error:", err.message);

    res.status(500).json({
        success: false,
        error: "Internal server error."
    });
});

// Start server
app.listen(PORT, "0.0.0.0", () => {
    console.log(`ENAFUL MUSIC API running on port ${PORT}`);
});
