import {
  serial,
  text,
  pgTable,
  uniqueIndex,
  integer,
  timestamp,
} from "drizzle-orm/pg-core";
import { InferInsertModel } from "drizzle-orm";

// Users table
export const users = pgTable(
  "users",
  {
    id: serial("id").primaryKey(), // Auto-incrementing ID
    name: text("name").notNull(),
    email: text("email").unique().notNull(),
    password: text("password").notNull(),
  },
  (users) => {
    return {
      uniqueIdx: uniqueIndex("unique_idx").on(users.email),
    };
  }
);

// Sessions table
export const sessions = pgTable("sessions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .references(() => users.id)
    .notNull(),
  expiresAt: timestamp("expires_at").notNull(),
});

// Polls table
export const polls = pgTable("polls", {
  id: serial("id").primaryKey(),
  creatorId: integer("creator_id")
    .references(() => users.id)
    .notNull(),
  question: text("question").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Poll options table
export const pollOptions = pgTable("poll_options", {
  id: serial("id").primaryKey(),
  pollId: integer("poll_id")
    .references(() => polls.id)
    .notNull(),
  optionText: text("option_text").notNull(),
});

// Votes table
export const votes = pgTable(
  "votes",
  {
    id: serial("id").primaryKey(),
    pollId: integer("poll_id")
      .references(() => polls.id)
      .notNull(),
    optionId: integer("option_id")
      .references(() => pollOptions.id)
      .notNull(),
    userId: integer("user_id").references(() => users.id), // Nullable for unauthenticated users
    ipAddress: text("ip_address"), // Nullable for authenticated users
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (votes) => {
    return {
      uniqueVoteIdx: uniqueIndex("unique_vote_idx").on(
        votes.pollId,
        votes.optionId,
        votes.userId,
        votes.ipAddress
      ),
    };
  }
);

// Type inference for inserting data
export type NewUser = InferInsertModel<typeof users>;
export type NewSession = InferInsertModel<typeof sessions>;
export type NewPoll = InferInsertModel<typeof polls>;
export type NewPollOption = InferInsertModel<typeof pollOptions>;
export type NewVote = InferInsertModel<typeof votes>;
