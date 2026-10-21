const crypto = require("crypto");

function authenticate(req, res, next) {
    const expectedKey = process.env.API_KEY;

    if (!expectedKey) {
        return res.status(503).json({
            success: false,
            error: "API authentication is not configured."
        });
    }

    const authorization = req.headers.authorization || "";

    const suppliedKey = authorization.startsWith("Bearer ")
        ? authorization.slice(7).trim()
        : "";

    if (!suppliedKey) {
        return res.status(401).json({
            success: false,
            error: "API key required."
        });
    }

    const expectedBuffer = Buffer.from(expectedKey);
    const suppliedBuffer = Buffer.from(suppliedKey);

    if (
        expectedBuffer.length !== suppliedBuffer.length ||
        !crypto.timingSafeEqual(expectedBuffer, suppliedBuffer)
    ) {
        return res.status(403).json({
            success: false,
            error: "Invalid API key."
        });
    }

    next();
}

module.exports = authenticate;
