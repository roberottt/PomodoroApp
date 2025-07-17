import type { Express } from "express";
import { createServer, type Server } from "http";

export async function registerRoutes(app: Express): Promise<Server> {
  // Since we're using Firebase for the backend, we don't need traditional API routes
  // All data operations are handled directly in the frontend using Firebase SDK
  
  // Add any additional server-side functionality here if needed
  // For example, webhook endpoints, server-side validation, etc.
  
  app.get("/health", (req, res) => {
    res.json({ status: "ok", message: "StudyBuddy server is running" });
  });

  const httpServer = createServer(app);
  return httpServer;
}
