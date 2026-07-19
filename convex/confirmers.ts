import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// List all confirmers
export const list = query({
  handler: async (ctx) => {
    return await ctx.db.query("confirmers").collect();
  },
});

// Create a new confirmer
export const create = mutation({
  args: {
    name: v.string(),
    username: v.string(),
    password: v.string(),
    permissions: v.array(v.string()),
    isActive: v.boolean(),
  },
  handler: async (ctx, args) => {
    // Check if username already exists
    const existing = await ctx.db
      .query("confirmers")
      .filter((q) => q.eq(q.field("username"), args.username))
      .first();
    
    if (existing) {
      throw new Error("اسم المستخدم موجود بالفعل. اختر اسم مستخدم آخر.");
    }

    const confirmer = {
      name: args.name,
      username: args.username.trim().toLowerCase(),
      password: args.password,
      permissions: args.permissions,
      isActive: args.isActive,
      createdAt: new Date().toISOString(),
    };

    return await ctx.db.insert("confirmers", confirmer);
  },
});

// Update a confirmer
export const update = mutation({
  args: {
    id: v.id("confirmers"),
    updates: v.object({
      name: v.optional(v.string()),
      username: v.optional(v.string()),
      password: v.optional(v.string()),
      permissions: v.optional(v.array(v.string())),
      isActive: v.optional(v.boolean()),
    }),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.get(args.id);
    if (!existing) {
      throw new Error("لم يتم العثور على المؤكدة.");
    }

    // Check username conflict if changing
    if (args.updates.username && args.updates.username !== existing.username) {
      const conflict = await ctx.db
        .query("confirmers")
        .filter((q) => q.eq(q.field("username"), args.updates.username))
        .first();
      if (conflict) {
        throw new Error("اسم المستخدم موجود بالفعل.");
      }
    }

    await ctx.db.patch(args.id, args.updates);
    return { success: true };
  },
});

// Remove a confirmer
export const remove = mutation({
  args: {
    id: v.id("confirmers"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
    return { success: true };
  },
});

// Verify login for confirmer
export const verifyLogin = query({
  args: {
    username: v.string(),
    password: v.string(),
  },
  handler: async (ctx, args) => {
    const usernameClean = args.username.trim().toLowerCase();
    const confirmer = await ctx.db
      .query("confirmers")
      .filter((q) => q.eq(q.field("username"), usernameClean))
      .first();
    
    if (!confirmer) {
      return null;
    }

    if (confirmer.password !== args.password) {
      return null;
    }

    if (!confirmer.isActive) {
      throw new Error("هذا الحساب معطل حالياً. يرجى مراجعة المسؤول.");
    }

    return {
      id: confirmer._id,
      name: confirmer.name,
      username: confirmer.username,
      permissions: confirmer.permissions,
      isActive: confirmer.isActive,
    };
  },
});
