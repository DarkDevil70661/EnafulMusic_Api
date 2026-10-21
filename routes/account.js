const express = require("express");
const authenticate = require("../middleware/auth");

const router = express.Router();

router.get("/", authenticate, (req, res) => {
    res.json({
        success: true,
        account: {
            status: "active",
            authentication: "API key",
            message: "Your API key has been accepted."
        }
    });
});

module.exports = router;
