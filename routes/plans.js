const express = require("express");

const router = express.Router();

const plans = [
    {
        id: "free",
        name: "Free",
        price: 0,
        currency: "INR",
        requestsPerDay: 100,
        features: [
            "Basic API access",
            "Music search metadata",
            "Community support"
        ]
    },
    {
        id: "basic",
        name: "Basic",
        price: 199,
        currency: "INR",
        requestsPerDay: 2000,
        features: [
            "Basic API access",
            "Higher request limit",
            "Usage tracking"
        ]
    },
    {
        id: "pro",
        name: "Pro",
        price: 499,
        currency: "INR",
        requestsPerDay: 10000,
        features: [
            "Higher request limit",
            "Usage tracking",
            "Priority support"
        ]
    }
];

router.get("/", (req, res) => {
    res.json({
        success: true,
        plans
    });
});

router.get("/:id", (req, res) => {
    const plan = plans.find(item => item.id === req.params.id);

    if (!plan) {
        return res.status(404).json({
            success: false,
            error: "Plan not found."
        });
    }

    res.json({
        success: true,
        plan
    });
});

module.exports = router;
