import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Get all orders
export const list = query({
  handler: async (ctx) => {
    return await ctx.db.query("orders").order("desc").collect();
  },
});

// Create a new order
export const create = mutation({
  args: {
    storeName: v.string(),
    ownerName: v.string(),
    phonePrimary: v.string(),
    phoneSecondary: v.optional(v.string()),
    province: v.string(),
    city: v.string(),
    packageType: v.string(),
    packagePrice: v.number(),
    paymentMethod: v.string(),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Generate a random order number
    const count = (await ctx.db.query("orders").collect()).length;
    const orderNumber = `FZ-${100000 + count + 1}`;

    const newOrder = {
      orderNumber,
      storeName: args.storeName,
      ownerName: args.ownerName,
      phonePrimary: args.phonePrimary,
      phoneSecondary: args.phoneSecondary || "",
      province: args.province,
      city: args.city,
      packageType: args.packageType,
      packagePrice: args.packagePrice,
      whatsappLinked: true,
      paymentMethod: args.paymentMethod,
      paymentStatus: "pending",
      orderStatus: "pending",
      notes: args.notes || "",
      assignedAdmin: "",
      activationCode: "",
      licenseKey: "",
      licenseStatus: "inactive",
      trialStart: new Date().toISOString(),
      trialEnd: new Date(Date.now() + 5 * 24 * 3600 * 1000).toISOString(), // 5 days trial
      deviceType: args.packageType,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      confirmationStatus: "pending",
      assignedConfirmerId: "",
    };

    const id = await ctx.db.insert("orders", newOrder);
    return { id, orderNumber };
  },
});

// Update order status/fields
export const update = mutation({
  args: {
    id: v.id("orders"),
    updates: v.any(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.get(args.id);
    if (!existing) {
      throw new Error("Order not found");
    }
    
    const updatedData = {
      ...args.updates,
      updatedAt: new Date().toISOString(),
    };

    await ctx.db.patch(args.id, updatedData);
    return { success: true };
  },
});

// Delete an order
export const remove = mutation({
  args: {
    id: v.id("orders"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
    return { success: true };
  },
});
