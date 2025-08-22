import type { Express, Request } from "express";
import { createServer, type Server } from "http";
import express from "express";
import { storage } from "./storage";
import { insertReportSchema, insertPickupRequestSchema, insertCampaignSchema } from "@shared/schema";
import multer from "multer";
import path from "path";
import fs from "fs";

// Configure multer for file uploads
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const upload = multer({
  dest: uploadDir,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
});

interface AuthenticatedRequest extends Request {
  user?: {
    claims: {
      sub: string;
      email?: string;
      first_name?: string;
      last_name?: string;
      profile_image_url?: string;
    };
  };
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Mock auth middleware for development
  app.use('/api', (req: AuthenticatedRequest, res, next) => {
    // Mock user for development - in production this would be replaced with actual auth
    req.user = {
      claims: {
        sub: 'dev-user-1',
        email: 'dev@cleanghana.com',
        first_name: 'John',
        last_name: 'Doe',
        profile_image_url: 'https://via.placeholder.com/150',
      }
    };
    next();
  });

  // User routes
  app.get('/api/auth/user', async (req: AuthenticatedRequest, res) => {
    try {
      const userId = req.user?.claims.sub;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      let user = await storage.getUser(userId);
      if (!user) {
        // Create user if doesn't exist
        user = await storage.upsertUser({
          id: userId,
          email: req.user.claims.email || null,
          firstName: req.user.claims.first_name || null,
          lastName: req.user.claims.last_name || null,
          profileImageUrl: req.user.claims.profile_image_url || null,
          role: 'citizen',
        });
      }

      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Reports routes
  app.get('/api/reports', async (req, res) => {
    try {
      const reports = await storage.getReports();
      res.json(reports);
    } catch (error) {
      console.error("Error fetching reports:", error);
      res.status(500).json({ message: "Failed to fetch reports" });
    }
  });

  app.get('/api/reports/my', async (req: AuthenticatedRequest, res) => {
    try {
      const userId = req.user?.claims.sub;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const reports = await storage.getReportsByReporter(userId);
      res.json(reports);
    } catch (error) {
      console.error("Error fetching user reports:", error);
      res.status(500).json({ message: "Failed to fetch user reports" });
    }
  });

  app.post('/api/reports', upload.array('images', 5), async (req: AuthenticatedRequest, res) => {
    try {
      const userId = req.user?.claims.sub;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const files = req.files as Express.Multer.File[];
      const imageUrls = files?.map(file => `/uploads/${file.filename}`) || [];

      const reportData = insertReportSchema.parse({
        ...req.body,
        reporterId: userId,
        imageUrls,
        latitude: req.body.latitude ? parseFloat(req.body.latitude) : null,
        longitude: req.body.longitude ? parseFloat(req.body.longitude) : null,
      });

      const report = await storage.createReport(reportData);
      res.status(201).json(report);
    } catch (error) {
      console.error("Error creating report:", error);
      res.status(400).json({ message: "Failed to create report" });
    }
  });

  app.patch('/api/reports/:id/status', async (req, res) => {
    try {
      const { id } = req.params;
      const { status, agencyId } = req.body;

      const report = await storage.updateReportStatus(id, status, agencyId);
      res.json(report);
    } catch (error) {
      console.error("Error updating report status:", error);
      res.status(500).json({ message: "Failed to update report status" });
    }
  });

  // Pickup requests routes
  app.get('/api/pickup-requests', async (req, res) => {
    try {
      const requests = await storage.getPickupRequests();
      res.json(requests);
    } catch (error) {
      console.error("Error fetching pickup requests:", error);
      res.status(500).json({ message: "Failed to fetch pickup requests" });
    }
  });

  app.get('/api/pickup-requests/my', async (req: AuthenticatedRequest, res) => {
    try {
      const userId = req.user?.claims.sub;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const requests = await storage.getPickupRequestsByRequester(userId);
      res.json(requests);
    } catch (error) {
      console.error("Error fetching user pickup requests:", error);
      res.status(500).json({ message: "Failed to fetch user pickup requests" });
    }
  });

  app.post('/api/pickup-requests', async (req: AuthenticatedRequest, res) => {
    try {
      const userId = req.user?.claims.sub;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const requestData = insertPickupRequestSchema.parse({
        ...req.body,
        requesterId: userId,
        latitude: req.body.latitude ? parseFloat(req.body.latitude) : null,
        longitude: req.body.longitude ? parseFloat(req.body.longitude) : null,
      });

      const request = await storage.createPickupRequest(requestData);
      res.status(201).json(request);
    } catch (error) {
      console.error("Error creating pickup request:", error);
      res.status(400).json({ message: "Failed to create pickup request" });
    }
  });

  // Agencies routes
  app.get('/api/agencies', async (req, res) => {
    try {
      const agencies = await storage.getAgencies();
      res.json(agencies);
    } catch (error) {
      console.error("Error fetching agencies:", error);
      res.status(500).json({ message: "Failed to fetch agencies" });
    }
  });

  app.get('/api/agencies/:id/reports', async (req, res) => {
    try {
      const { id } = req.params;
      const reports = await storage.getReportsByAgency(id);
      res.json(reports);
    } catch (error) {
      console.error("Error fetching agency reports:", error);
      res.status(500).json({ message: "Failed to fetch agency reports" });
    }
  });

  app.get('/api/agencies/:id/stats', async (req, res) => {
    try {
      const { id } = req.params;
      const stats = await storage.getAgencyStats(id);
      res.json(stats);
    } catch (error) {
      console.error("Error fetching agency stats:", error);
      res.status(500).json({ message: "Failed to fetch agency stats" });
    }
  });

  // Campaigns routes
  app.get('/api/campaigns', async (req, res) => {
    try {
      const campaigns = await storage.getCampaigns();
      res.json(campaigns);
    } catch (error) {
      console.error("Error fetching campaigns:", error);
      res.status(500).json({ message: "Failed to fetch campaigns" });
    }
  });

  app.post('/api/campaigns', async (req: AuthenticatedRequest, res) => {
    try {
      const userId = req.user?.claims.sub;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const campaignData = insertCampaignSchema.parse({
        ...req.body,
        createdBy: userId,
      });

      const campaign = await storage.createCampaign(campaignData);
      res.status(201).json(campaign);
    } catch (error) {
      console.error("Error creating campaign:", error);
      res.status(400).json({ message: "Failed to create campaign" });
    }
  });

  // Analytics routes
  app.get('/api/analytics/reports', async (req, res) => {
    try {
      const stats = await storage.getReportStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching report stats:", error);
      res.status(500).json({ message: "Failed to fetch report stats" });
    }
  });

  // Serve uploaded files
  app.use('/uploads', (req, res, next) => {
    // Add CORS headers for file serving
    res.header('Access-Control-Allow-Origin', '*');
    next();
  }, express.static(uploadDir));

  const httpServer = createServer(app);
  return httpServer;
}
