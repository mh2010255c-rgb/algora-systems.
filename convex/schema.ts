import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  orders: defineTable({
    orderNumber: v.string(),
    storeName: v.string(),
    ownerName: v.string(),
    phonePrimary: v.string(),
    phoneSecondary: v.optional(v.string()),
    province: v.string(),
    city: v.string(),
    packageType: v.string(), // "pc" | "mobile" | "both" | "trial" etc.
    packagePrice: v.number(),
    whatsappLinked: v.optional(v.boolean()),
    paymentMethod: v.string(),
    paymentStatus: v.string(), // "pending" | "verified" | "rejected"
    orderStatus: v.string(), // "pending" | "contacted" | "demo_sent" | "approved" | "completed" | "canceled"
    notes: v.optional(v.string()),
    assignedAdmin: v.optional(v.string()),
    activationCode: v.optional(v.string()),
    licenseKey: v.optional(v.string()),
    licenseStatus: v.optional(v.string()), // "active" | "inactive" | "expired"
    trialStart: v.optional(v.string()),
    trialEnd: v.optional(v.string()),
    deviceType: v.optional(v.string()),
    createdAt: v.string(),
    updatedAt: v.string(),
    activatedAt: v.optional(v.string()),
    confirmationStatus: v.optional(v.string()), // "pending" | "contacted" | "no_reply_1" | "no_reply_2" | "no_reply_3" | "whatsapp_sent" | "no_whatsapp" | "wrong_number" | "confirmed" | "canceled"
    assignedConfirmerId: v.optional(v.string()),
  }),
  tickets: defineTable({
    storeName: v.string(),
    phone: v.string(),
    subject: v.string(),
    message: v.string(),
    status: v.string(), // "open" | "resolved"
    createdAt: v.string(),
    updatedAt: v.optional(v.string()),
  }),
  confirmers: defineTable({
    name: v.string(),
    username: v.string(),
    password: v.string(),
    permissions: v.array(v.string()), // ["view_orders", "edit_status", "edit_confirmation", "delete_orders", "whatsapp_access"]
    isActive: v.boolean(),
    createdAt: v.string(),
  }),
});
