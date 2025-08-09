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

// Configure CORS
app.use(
    cors({
        origin: [
            "http://localhost:5173",
            "https://project-crypto-pink.vercel.app",
        ], // <-- Your React frontend URL here
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization", "X-CG-API-Key"],
        credentials: true,
    })
);

// Handle preflight OPTIONS requests
app.options("*", cors());

// Rate limiter
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
});
app.use(limiter);

// Cache middleware
const cacheMiddleware = (duration) => {
    return (req, res, next) => {
        const key = "__express__" + (req.originalUrl || req.url);
        const cachedBody = cache.get(key);
        if (cachedBody) {
            res.send(cachedBody);
            return;
        }
        res.sendResponse = res.send;
        res.send = (body) => {
            cache.put(key, body, duration * 1000);
            res.sendResponse(body);
        };
        next();
    };
};

// Basic request validation middleware
const validateRequest = (req, res, next) => {
    const apiPath = req.path.replace("/api/coingecko/", "");
    if (apiPath.startsWith("coins/markets") && !req.query.vs_currency) {
        return res.status(400).json({ error: "Missing parameter vs_currency" });
    }
    if (
        req.query.vs_currency &&
        !["usd", "eur", "btc", "eth"].includes(
            req.query.vs_currency.toLowerCase()
        )
    ) {
        return res.status(400).json({ error: "Invalid vs_currency value" });
    }
    next();
};

// Health check endpoint
app.get("/health", (req, res) => {
    res.status(200).json({ status: "OK", timestamp: new Date().toISOString() });
});

// Proxy endpoint for CoinGecko API
app.get(
    "/api/coingecko/*",
    cacheMiddleware(15 * 60),
    validateRequest,
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const apiPath = req.path.replace("/api/coingecko/", "");
            const clientKey =
                req.headers["x-cg-api-key"] ||
                req.query.api_key ||
                req.query.key;
            const apiKey = clientKey || process.env.VITE_API_KEY;

            if (!apiKey) {
                return res.status(500).json({
                    error: "CoinGecko API key missing. Provide 'x-cg-api-key' header or set VITE_API_KEY.",
                });
            }

            const apiUrl = `https://api.coingecko.com/api/v3/${apiPath}`;

            // Remove our keys from query params before forwarding
            const params = { ...req.query };
            delete params.api_key;
            delete params.key;

            const response = await axios.get(apiUrl, {
                params,
                headers: {
                    "X-CG-Demo-API-Key": apiKey,
                    Accept: "application/json",
                    "User-Agent": "crypto-proxy/1.0.0",
                },
            });

            res.setHeader("X-RateLimit-Limit", "100");
            res.setHeader("X-RateLimit-Remaining", "100");
            res.setHeader("X-RateLimit-Reset", Date.now() + 15 * 60 * 1000);

            res.json(response.data);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response) {
                    return res.status(error.response.status).json({
                        error:
                            error.response.data?.error ||
                            error.response.data?.message ||
                            "API Error",
                        details: error.response.data,
                    });
                } else if (error.request) {
                    return res.status(504).json({
                        error: "Gateway Timeout - No response from API",
                    });
                }
            }
            res.status(500).json({
                error: "Internal Server Error",
                message: error.message,
            });
        }
    }
);

// General error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: "Internal Server Error" });
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
