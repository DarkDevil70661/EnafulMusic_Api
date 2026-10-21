const express = require("express");
const authenticate = require("../middleware/auth");
const { getUsage } = require("../services/usage");

const router = express.Router();

router.get("/", authenticate, (req, res) => {
    const usage = getUsage("authenticated-user");

    const totalRequests = usage.reduce(
        (total, item) => total + item.requests,
        0
    );

    res.json({
        success: true,
        usage: {
            totalRequests,
            endpoints: usage
        },
        note: "Usage is stored in memory and resets when the server restarts."
    });
});

module.exports = router;
