import {
  users,
  agencies,
  agencyMembers,
  reports,
  pickupRequests,
  campaigns,
  type User,
  type UpsertUser,
  type Agency,
  type InsertAgency,
  type Report,
  type InsertReport,
  type PickupRequest,
  type InsertPickupRequest,
  type Campaign,
  type InsertCampaign,
  type AgencyMember,
} from "../shared/schema.ts";
import { db } from "./db.ts";
import { eq, desc, and, count, sql, avg } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Agency operations
  getAgencies(): Promise<Agency[]>;
  getAgency(id: string): Promise<Agency | undefined>;
  createAgency(agency: InsertAgency): Promise<Agency>;
  updateAgencyApproval(id: string, isApproved: boolean): Promise<Agency>;
  
  // Agency member operations
  getAgencyMember(userId: string): Promise<AgencyMember | undefined>;
  addAgencyMember(userId: string, agencyId: string, isAdmin: boolean): Promise<AgencyMember>;
  
  // Report operations
  getReports(limit?: number): Promise<Report[]>;
  getReportsByReporter(reporterId: string): Promise<Report[]>;
  getReportsByAgency(agencyId: string): Promise<Report[]>;
  createReport(report: InsertReport): Promise<Report>;
  updateReportStatus(id: string, status: string, agencyId?: string): Promise<Report>;
  
  // Pickup request operations
  getPickupRequests(limit?: number): Promise<PickupRequest[]>;
  getPickupRequestsByRequester(requesterId: string): Promise<PickupRequest[]>;
  getPickupRequestsByAgency(agencyId: string): Promise<PickupRequest[]>;
  createPickupRequest(request: InsertPickupRequest): Promise<PickupRequest>;
  updatePickupRequestStatus(id: string, status: string, agencyId?: string): Promise<PickupRequest>;
  
  // Campaign operations
  getCampaigns(): Promise<Campaign[]>;
  createCampaign(campaign: InsertCampaign): Promise<Campaign>;
  
  // Analytics operations
  getReportStats(): Promise<{
    total: number;
    resolved: number;
    pending: number;
    inProgress: number;
  }>;
  getAgencyStats(agencyId: string): Promise<{
    activeRequests: number;
    completedToday: number;
    avgResponseTime: number;
    rating: number;
  }>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async getAgencies(): Promise<Agency[]> {
    return await db.select().from(agencies).where(eq(agencies.isApproved, true));
  }

  async getAgency(id: string): Promise<Agency | undefined> {
    const [agency] = await db.select().from(agencies).where(eq(agencies.id, id));
    return agency;
  }

  async createAgency(agencyData: InsertAgency): Promise<Agency> {
    const [agency] = await db.insert(agencies).values(agencyData).returning();
    return agency;
  }

  async updateAgencyApproval(id: string, isApproved: boolean): Promise<Agency> {
    const [agency] = await db
      .update(agencies)
      .set({ isApproved, updatedAt: new Date() })
      .where(eq(agencies.id, id))
      .returning();
    return agency;
  }

  async getAgencyMember(userId: string): Promise<AgencyMember | undefined> {
    const [member] = await db
      .select()
      .from(agencyMembers)
      .where(eq(agencyMembers.userId, userId));
    return member;
  }

  async addAgencyMember(userId: string, agencyId: string, isAdmin: boolean): Promise<AgencyMember> {
    const [member] = await db
      .insert(agencyMembers)
      .values({ userId, agencyId, isAdmin })
      .returning();
    return member;
  }

  async getReports(limit: number = 50): Promise<Report[]> {
    return await db
      .select()
      .from(reports)
      .orderBy(desc(reports.createdAt))
      .limit(limit);
  }

  async getReportsByReporter(reporterId: string): Promise<Report[]> {
    return await db
      .select()
      .from(reports)
      .where(eq(reports.reporterId, reporterId))
      .orderBy(desc(reports.createdAt));
  }

  async getReportsByAgency(agencyId: string): Promise<Report[]> {
    return await db
      .select()
      .from(reports)
      .where(eq(reports.assignedAgencyId, agencyId))
      .orderBy(desc(reports.createdAt));
  }

  async createReport(reportData: InsertReport): Promise<Report> {
    const [report] = await db.insert(reports).values(reportData).returning();
    return report;
  }

  async updateReportStatus(id: string, status: string, agencyId?: string): Promise<Report> {
    const updateData: any = { status, updatedAt: new Date() };
    
    if (agencyId && status === 'assigned') {
      updateData.assignedAgencyId = agencyId;
      updateData.assignedAt = new Date();
    }
    
    if (status === 'completed') {
      updateData.completedAt = new Date();
    }

    const [report] = await db
      .update(reports)
      .set(updateData)
      .where(eq(reports.id, id))
      .returning();
    return report;
  }

  async getPickupRequests(limit: number = 50): Promise<PickupRequest[]> {
    return await db
      .select()
      .from(pickupRequests)
      .orderBy(desc(pickupRequests.createdAt))
      .limit(limit);
  }

  async getPickupRequestsByRequester(requesterId: string): Promise<PickupRequest[]> {
    return await db
      .select()
      .from(pickupRequests)
      .where(eq(pickupRequests.requesterId, requesterId))
      .orderBy(desc(pickupRequests.createdAt));
  }

  async getPickupRequestsByAgency(agencyId: string): Promise<PickupRequest[]> {
    return await db
      .select()
      .from(pickupRequests)
      .where(eq(pickupRequests.assignedAgencyId, agencyId))
      .orderBy(desc(pickupRequests.createdAt));
  }

  async createPickupRequest(requestData: InsertPickupRequest): Promise<PickupRequest> {
    const [request] = await db.insert(pickupRequests).values(requestData).returning();
    return request;
  }

  async updatePickupRequestStatus(id: string, status: string, agencyId?: string): Promise<PickupRequest> {
    const updateData: any = { status, updatedAt: new Date() };
    
    if (agencyId && status === 'assigned') {
      updateData.assignedAgencyId = agencyId;
      updateData.assignedAt = new Date();
    }
    
    if (status === 'completed') {
      updateData.completedAt = new Date();
    }

    const [request] = await db
      .update(pickupRequests)
      .set(updateData)
      .where(eq(pickupRequests.id, id))
      .returning();
    return request;
  }

  async getCampaigns(): Promise<Campaign[]> {
    return await db
      .select()
      .from(campaigns)
      .where(eq(campaigns.isActive, true))
      .orderBy(desc(campaigns.createdAt));
  }

  async createCampaign(campaignData: InsertCampaign): Promise<Campaign> {
    const [campaign] = await db.insert(campaigns).values(campaignData).returning();
    return campaign;
  }

  async getReportStats(): Promise<{
    total: number;
    resolved: number;
    pending: number;
    inProgress: number;
  }> {
    const [stats] = await db
      .select({
        total: count(),
        resolved: count(sql`CASE WHEN status = 'completed' THEN 1 END`),
        pending: count(sql`CASE WHEN status = 'reported' THEN 1 END`),
        inProgress: count(sql`CASE WHEN status = 'in-progress' THEN 1 END`),
      })
      .from(reports);

    return {
      total: stats.total,
      resolved: stats.resolved,
      pending: stats.pending,
      inProgress: stats.inProgress,
    };
  }

  async getAgencyStats(agencyId: string): Promise<{
    activeRequests: number;
    completedToday: number;
    avgResponseTime: number;
    rating: number;
  }> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [activeCount] = await db
      .select({ count: count() })
      .from(reports)
      .where(
        and(
          eq(reports.assignedAgencyId, agencyId),
          sql`status IN ('assigned', 'in-progress')`
        )
      );

    const [completedToday] = await db
      .select({ count: count() })
      .from(reports)
      .where(
        and(
          eq(reports.assignedAgencyId, agencyId),
          eq(reports.status, 'completed'),
          sql`completed_at >= ${today}`
        )
      );

    const [agency] = await db
      .select({ rating: agencies.rating })
      .from(agencies)
      .where(eq(agencies.id, agencyId));

    return {
      activeRequests: activeCount.count,
      completedToday: completedToday.count,
      avgResponseTime: 2.5, // Mock for now - would calculate from actual data
      rating: parseFloat(agency?.rating || '0'),
    };
  }
}

export const storage = new DatabaseStorage();
