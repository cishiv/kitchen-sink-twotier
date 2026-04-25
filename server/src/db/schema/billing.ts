import {
  boolean,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { user } from "./auth";

// Mirrors the subset of Polar's subscription model we need to render
// access state without round-tripping to Polar on every request. Source
// of truth remains Polar; this table is materialised by the webhook.
export const subscription = pgTable("subscription", {
  id: text("id").primaryKey(),

  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),

  polarCustomerId: varchar("polar_customer_id", { length: 255 }).notNull(),
  polarProductId: varchar("polar_product_id", { length: 255 }).notNull(),

  status: varchar("status", { length: 32 }).notNull(),
  amount: integer("amount").notNull(),
  currency: varchar("currency", { length: 8 }).notNull(),
  recurringInterval: varchar("recurring_interval", { length: 16 }).notNull(),

  currentPeriodStart: timestamp("current_period_start").notNull(),
  currentPeriodEnd: timestamp("current_period_end").notNull(),

  cancelAtPeriodEnd: boolean("cancel_at_period_end").notNull().default(false),
  canceledAt: timestamp("canceled_at"),
  endedAt: timestamp("ended_at"),

  metadata: jsonb("metadata")
    .$type<Record<string, unknown>>()
    .notNull()
    .default({}),

  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type Subscription = typeof subscription.$inferSelect;
export type NewSubscription = typeof subscription.$inferInsert;
