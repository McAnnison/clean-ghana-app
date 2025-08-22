import { sql, relations } from 'drizzle-orm';
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  text,
  decimal,
  integer,
  boolean,
  pgEnum,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// Enums
export const userRoleEnum = pgEnum('user_role', ['citizen', 'agency', 'admin']);
export const reportStatusEnum = pgEnum('report_status', ['reported', 'assigned', 'in-progress', 'completed', 'rejected']);
export const reportCategoryEnum = pgEnum('report_category', ['illegal_dumping', 'overflowing_bin', 'littering', 'blocked_drainage', 'other']);
export const priorityEnum = pgEnum('priority', ['low', 'medium', 'high', 'urgent']);

// Users table
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  role: userRoleEnum("role").notNull().default('citizen'),
  phone: varchar("phone"),
  address: text("address"),
  rewardPoints: integer("reward_points").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Agencies table
export const agencies = pgTable("agencies", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name").notNull(),
  description: text("description"),
  contactEmail: varchar("contact_email"),
  contactPhone: varchar("contact_phone"),
  serviceAreas: text("service_areas").array(),
  isApproved: boolean("is_approved").default(false),
  rating: decimal("rating", { precision: 3, scale: 2 }).default('0.00'),
  completedJobs: integer("completed_jobs").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Agency members table
export const agencyMembers = pgTable("agency_members", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  agencyId: varchar("agency_id").notNull().references(() => agencies.id),
  isAdmin: boolean("is_admin").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Reports table
export const reports = pgTable("reports", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  reporterId: varchar("reporter_id").notNull().references(() => users.id),
  title: varchar("title").notNull(),
  description: text("description").notNull(),
  category: reportCategoryEnum("category").notNull(),
  status: reportStatusEnum("status").notNull().default('reported'),
  priority: priorityEnum("priority").notNull().default('medium'),
  latitude: decimal("latitude", { precision: 10, scale: 8 }),
  longitude: decimal("longitude", { precision: 11, scale: 8 }),
  address: text("address"),
  imageUrls: text("image_urls").array(),
  assignedAgencyId: varchar("assigned_agency_id").references(() => agencies.id),
  assignedAt: timestamp("assigned_at"),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Pickup requests table
export const pickupRequests = pgTable("pickup_requests", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  requesterId: varchar("requester_id").notNull().references(() => users.id),
  type: varchar("type").notNull(), // 'on-demand' or 'scheduled'
  scheduledDate: timestamp("scheduled_date"),
  latitude: decimal("latitude", { precision: 10, scale: 8 }),
  longitude: decimal("longitude", { precision: 11, scale: 8 }),
  address: text("address"),
  notes: text("notes"),
  status: reportStatusEnum("status").notNull().default('reported'),
  assignedAgencyId: varchar("assigned_agency_id").references(() => agencies.id),
  assignedAt: timestamp("assigned_at"),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Campaigns table
export const campaigns = pgTable("campaigns", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: varchar("title").notNull(),
  description: text("description").notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date"),
  isActive: boolean("is_active").default(true),
  participantCount: integer("participant_count").default(0),
  createdBy: varchar("created_by").notNull().references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many, one }) => ({
  reports: many(reports),
  pickupRequests: many(pickupRequests),
  agencyMemberships: many(agencyMembers),
  campaigns: many(campaigns),
}));

export const agenciesRelations = relations(agencies, ({ many }) => ({
  members: many(agencyMembers),
  assignedReports: many(reports),
  assignedPickups: many(pickupRequests),
}));

export const agencyMembersRelations = relations(agencyMembers, ({ one }) => ({
  user: one(users, {
    fields: [agencyMembers.userId],
    references: [users.id],
  }),
  agency: one(agencies, {
    fields: [agencyMembers.agencyId],
    references: [agencies.id],
  }),
}));

export const reportsRelations = relations(reports, ({ one }) => ({
  reporter: one(users, {
    fields: [reports.reporterId],
    references: [users.id],
  }),
  assignedAgency: one(agencies, {
    fields: [reports.assignedAgencyId],
    references: [agencies.id],
  }),
}));

export const pickupRequestsRelations = relations(pickupRequests, ({ one }) => ({
  requester: one(users, {
    fields: [pickupRequests.requesterId],
    references: [users.id],
  }),
  assignedAgency: one(agencies, {
    fields: [pickupRequests.assignedAgencyId],
    references: [agencies.id],
  }),
}));

export const campaignsRelations = relations(campaigns, ({ one }) => ({
  creator: one(users, {
    fields: [campaigns.createdBy],
    references: [users.id],
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertAgencySchema = createInsertSchema(agencies).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertReportSchema = createInsertSchema(reports).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  assignedAt: true,
  completedAt: true,
});

export const insertPickupRequestSchema = createInsertSchema(pickupRequests).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  assignedAt: true,
  completedAt: true,
});

export const insertCampaignSchema = createInsertSchema(campaigns).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type UpsertUser = typeof users.$inferInsert;

export type Agency = typeof agencies.$inferSelect;
export type InsertAgency = z.infer<typeof insertAgencySchema>;

export type Report = typeof reports.$inferSelect;
export type InsertReport = z.infer<typeof insertReportSchema>;

export type PickupRequest = typeof pickupRequests.$inferSelect;
export type InsertPickupRequest = z.infer<typeof insertPickupRequestSchema>;

export type Campaign = typeof campaigns.$inferSelect;
export type InsertCampaign = z.infer<typeof insertCampaignSchema>;

export type AgencyMember = typeof agencyMembers.$inferSelect;
