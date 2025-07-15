require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");
const rateLimit = require("express-rate-limit");
const cache = require("memory-cache");
const { check, validationResult } = require("express-validator");
const compression = require("compression");
const helmet = require("helmet");

const app = express();
const port = process.env.PORT || 4000;

// Security middleware
app.use(helmet());
app.use(compression());

// Rate limiting middleware
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
});

app.use(cors());
app.use(limiter);

// Cache middleware
const cacheMiddleware = (duration) => {
    return (req, res, next) => {
        const key = "__express__" + req.originalUrl || req.url;
        const cachedBody = cache.get(key);
        if (cachedBody) {
            res.send(cachedBody);
            return;
        } else {
            res.sendResponse = res.send;
            res.send = (body) => {
                cache.put(key, body, duration * 1000);
                res.sendResponse(body);
            };
            next();
        }
    };
};

// Request validation middleware
const validateRequest = [
    check("vs_currency").optional().isIn(["usd", "eur", "btc", "eth"]),
    check("days").optional().isInt({ min: 1, max: 365 }),
    check("page").optional().isInt({ min: 1 }),
    check("per_page").optional().isInt({ min: 1, max: 100 }),
];

// Proxy endpoint for Coingecko API - handle all paths after /api/coingecko/
app.get(
    "/api/coingecko/*",
    cacheMiddleware(15 * 60),
    validateRequest,
    async (req, res) => {
        try {
            // Validate request
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            // Extract the path after /api/coingecko/
            const apiPath = req.path.replace("/api/coingecko/", "");
            console.log(`API Request: ${apiPath} with params:`, req.query);

            // First check if we have the API key
            if (!process.env.VITE_API_KEY) {
                console.error("API key not configured");
                return res.status(500).json({
                    error: "API key not configured",
                });
            }

            const apiUrl = `https://api.coingecko.com/api/v3/${apiPath}`;
            console.log(`Making request to: ${apiUrl}`);

            const response = await axios.get(apiUrl, {
                params: req.query,
                headers: {
                    "X-CG-Demo-API-Key": process.env.VITE_API_KEY,
                    Accept: "application/json",
                    "User-Agent": "crypto-proxy/1.0.0",
                },
            });

            // Add rate limit headers
            res.setHeader("X-RateLimit-Limit", "100");
            res.setHeader("X-RateLimit-Remaining", "100");
            res.setHeader("X-RateLimit-Reset", Date.now() + 15 * 60 * 1000);

            console.log(`API Response status: ${response.status}`);
            res.json(response.data);
        } catch (error) {
            console.error("API Error:", error.message);

            // Handle different error types
            if (axios.isAxiosError(error)) {
                if (error.response) {
                    console.error(
                        "API Response Error:",
                        error.response.status,
                        error.response.data
                    );
                    return res.status(error.response.status).json({
                        error:
                            error.response.data?.error ||
                            error.response.data?.message ||
                            "API Error",
                        details: error.response.data,
                    });
                } else if (error.request) {
                    console.error("API Request Error: No response received");
                    return res.status(504).json({
                        error: "Gateway Timeout - No response from API",
                    });
                }
            }

            console.error("Unexpected error:", error);
            res.status(500).json({
                error: "Internal Server Error",
                message: error.message,
            });
        }
    }
);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        error: "Internal Server Error",
    });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
    console.log("Security features enabled:");
    console.log("- Rate limiting (100 requests per 15 minutes)");
    console.log("- Response caching (15 minutes)");
    console.log("- Request validation");
    console.log("- Security headers via Helmet");
    console.log("- Compression enabled");
});
