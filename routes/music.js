const express = require("express");
const authenticate = require("../middleware/auth");
const { recordUsage } = require("../services/usage");

const router = express.Router();

router.get("/search", authenticate, async (req, res) => {
    try {
        const query = String(req.query.query || "").trim();

        if (!query) {
            return res.status(400).json({
                success: false,
                error: "Please provide a search query.",
                example: "/api/music/search?query=music"
            });
        }

        if (query.length > 200) {
            return res.status(400).json({
                success: false,
                error: "Search query is too long."
            });
        }

        const apiKey = process.env.YOUTUBE_API_KEY;

        if (!apiKey) {
            return res.status(503).json({
                success: false,
                error: "Music search is not configured. Set YOUTUBE_API_KEY."
            });
        }

        const url = new URL(
            "https://www.googleapis.com/youtube/v3/search"
        );

        url.searchParams.set("part", "snippet");
        url.searchParams.set("type", "video");
        url.searchParams.set("maxResults", "10");
        url.searchParams.set("q", query);
        url.searchParams.set("key", apiKey);

        const response = await fetch(url);

        if (!response.ok) {
            console.error(
                "YouTube API returned status:",
                response.status
            );

            return res.status(502).json({
                success: false,
                error: "Music search provider returned an error."
            });
        }

        const data = await response.json();

        const results = (data.items || []).map(item => ({
            videoId: item.id.videoId,
            title: item.snippet.title,
            channelTitle: item.snippet.channelTitle,
            description: item.snippet.description,
            thumbnail:
                item.snippet.thumbnails?.high?.url ||
                item.snippet.thumbnails?.default?.url ||
                null,
            url: `https://www.youtube.com/watch?v=${item.id.videoId}`
        }));

        recordUsage("authenticated-user", "music-search");

        res.json({
            success: true,
            query,
            count: results.length,
            results
        });

    } catch (error) {
        console.error("Music search error:", error.message);

        res.status(500).json({
            success: false,
            error: "Unable to process music search."
        });
    }
});

// Streaming is not configured yet.
router.get("/stream", authenticate, (req, res) => {
    res.status(501).json({
        success: false,
        error: "Streaming provider is not configured.",
        message: "Connect a legally authorized streaming provider first."
    });
});

module.exports = router;
