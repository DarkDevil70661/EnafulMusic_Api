const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {
    res.json({
        success: true,
        name: "ENAFUL MUSIC API",
        status: "online",
        timestamp: new Date().toISOString()
    });
});

module.exports = router;
