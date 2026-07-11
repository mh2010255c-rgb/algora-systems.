import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Get all support tickets
export const list = query({
  handler: async (ctx) => {
    return await ctx.db.query("tickets").order("desc").collect();
  },
});

// Create a new support ticket
export const create = mutation({
  args: {
    storeName: v.string(),
    phone: v.string(),
    subject: v.string(),
    message: v.string(),
  },
  handler: async (ctx, args) => {
    const newTicket = {
      storeName: args.storeName,
      phone: args.phone,
      subject: args.subject,
      message: args.message,
      status: "open",
      createdAt: new Date().toISOString(),
    };

    const id = await ctx.db.insert("tickets", newTicket);
    return { id };
  },
});

// Update ticket status
export const updateStatus = mutation({
  args: {
    id: v.id("tickets"),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      status: args.status,
      updatedAt: new Date().toISOString(),
    });
    return { success: true };
  },
});

// Delete a ticket
export const remove = mutation({
  args: {
    id: v.id("tickets"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
    return { success: true };
  },
});
