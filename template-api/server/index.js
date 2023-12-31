import "dotenv/config";
import express from "express";
import logger from "morgan";
import helmet from "helmet";
import compression from "compression";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import routes from "./routes/index.js";
import cors from "cors";

// Get environment defined by cross-env in package.json
// const environment = process.env.NODE_ENV
// if (!environment) {
//   throw new Error('Environment is not defined.')
// }

// Create Express application object
const app = express();

// Morgan request logger middleware
app.use(logger("dev"));


app.use(cors({
  origin: "http://localhost:8080",  // Replace with your frontend's URL
}));


// Helmet security middleware, configured with Content-Security-Policy response header
// in order to enable client-side scripts to call API at origin specified in .env

// app.use(helmet({ contentSecurityPolicy: { directives: { 'default-src': ["'self'", process.env.API_ORIGIN] } } }))
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      ...helmet.contentSecurityPolicy.getDefaultDirectives(),
      "script-src": ["'self'", "https://www.gstatic.com", "'unsafe-eval'"],
    },
  })
);
app.use(cors({
    origin: "http://localhost:8080",  // allow only your frontend to access
    methods: ["GET", "POST", "PUT", "DELETE"], // or whichever methods you want to allow
    allowedHeaders: ["Content-Type", "Authorization"]
}));

// Compression middleware for compressing response bodies
app.use(compression());

// Express static file middleware that serves files from Vue single-page application build path
const clientBuildPath = join(dirname(fileURLToPath(import.meta.url)), "../client/dist");
app.use(express.static(clientBuildPath));

// Express middleware that parses JSON request body
app.use(express.json());

// GET request handler for /api/health URL
app.get("/api/health", (req, res) => res.json({ status: "UP" }));

app.use('/api', routes)

// Error handler middleware
app.use((err, req, res, next) => {
  const status = err.status ?? 500; // Get error status or use default status 500
  const isServerError = status >= 500;

  console.error(isServerError ? err : `${status}: ${err.message}`); // Log error in server console
  const message = isServerError ? "Something went wrong." : err.message; // Create client-friendly message

  res.status(status).send(message); // Send client-friendly error message
});

// Start listening for client requests
const port = 8081; //process.env.PORT
app.listen(port, () => console.log(`Server running at http://localhost:${port}/`));
