import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import { initializeApp } from "firebase/app";
import { 
  getFirestore, 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  doc, 
  getDoc, 
  runTransaction, 
  setDoc,
  updateDoc, 
  deleteDoc, 
  orderBy,
  serverTimestamp
} from "firebase/firestore";

import qrcode from "qrcode";

// Load environment variables
dotenv.config();

// Initialize Firebase
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY || "placeholder-api-key",
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN || "algora-systems.firebaseapp.com",
  projectId: process.env.VITE_FIREBASE_PROJECT_ID || "algora-systems",
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET || "algora-systems.appspot.com",
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: process.env.VITE_FIREBASE_APP_ID || "1:123456789:web:abcdef123456"
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

// Helper to wrap Firestore calls with a timeout fallback
const withTimeout = <T>(promise: Promise<T>, timeoutMs: number = 1500): Promise<T> => {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) => setTimeout(() => reject(new Error("Firestore connection timed out (offline)")), timeoutMs))
  ]);
};

// In-memory databases for fallback/tickets
interface SupportTicket {
  id: string;
  storeName: string;
  phone: string;
  subject: string;
  message: string;
  timestamp: string;
  status: "open" | "resolved";
}

const supportTickets: SupportTicket[] = [
  {
    id: "ticket_dz1",
    storeName: "حمزة فون - Hamza Phone",
    phone: "0551482930",
    subject: "مشكلة في ربط طابعة الكود بار الحرارية",
    message: "قمت بتحميل النسخة التجريبية على كمبيوتري ولكن لم أستطع ربط طابعة باركود من نوع Xprinter 350B، الرجاء المساعدة عبر أني ديسك.",
    timestamp: new Date(Date.now() - 3600000 * 1.5).toISOString(),
    status: "open"
  },
  {
    id: "ticket_dz2",
    storeName: "نور الصيانة - Nour Réparation",
    phone: "0770451298",
    subject: "استفسار حول جرد الـ IMEI للهواتف",
    message: "هل يمكنني إدخال نفس الرقم التسلسلي لعدة هواتف مستعملة دفعة واحدة أم يجب كتابة كل واحد على حدة؟",
    timestamp: new Date(Date.now() - 3600000 * 10).toISOString(),
    status: "resolved"
  }
];

import fs from "fs";

// Initialize Gemini Client
let ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Serve static files from "public" directory (downloads, videos, etc.)
  app.use(express.static(path.join(process.cwd(), "public")));

  const DATA_DIR = path.join(process.cwd(), "data");
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR);
  }

const ORDERS_FILE = path.join(DATA_DIR, "orders.json");
const TICKETS_FILE = path.join(DATA_DIR, "tickets.json");

function readJSONFile(filePath: string, defaultVal: any) {
  try {
    if (fs.existsSync(filePath)) {
      return JSON.parse(fs.readFileSync(filePath, "utf-8"));
    }
  } catch (e) {
    console.error(`Error reading file ${filePath}:`, e);
  }
  return defaultVal;
}

function writeJSONFile(filePath: string, data: any) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
  } catch (e) {
    console.error(`Error writing file ${filePath}:`, e);
  }
}

// --- UNIFIED DATABASE WRAPPERS (FIRESTORE WITH LOCAL JSON FALLBACK) ---
function getLocalCollectionPath(collectionName: string): string {
  const mapping: { [key: string]: string } = {
    orders: ORDERS_FILE,
    support_tickets: TICKETS_FILE,
    whatsapp_settings: path.join(DATA_DIR, "whatsapp_settings.json"),
    whatsapp_templates: path.join(DATA_DIR, "whatsapp_templates.json"),
    whatsapp_logs: path.join(DATA_DIR, "whatsapp_logs.json"),
    message_queue: path.join(DATA_DIR, "message_queue.json")
  };
  return mapping[collectionName] || path.join(DATA_DIR, `${collectionName}.json`);
}

async function dbGetDoc(collectionName: string, docId: string): Promise<{ exists: boolean; data: () => any }> {
  try {
    const docRef = doc(db, collectionName, docId);
    const snap = await withTimeout(getDoc(docRef));
    if (snap.exists()) {
      return { exists: true, data: () => snap.data() };
    }
  } catch (err: any) {
    console.warn(`Firestore getDoc failed for ${collectionName}/${docId}, falling back to local JSON:`, err.message);
  }
  
  const filePath = getLocalCollectionPath(collectionName);
  const content = readJSONFile(filePath, collectionName === "whatsapp_settings" ? {} : []);
  if (collectionName === "whatsapp_settings") {
    const data = content[docId] || (docId === "global" ? content : null);
    if (data && Object.keys(data).length > 0) {
      return { exists: true, data: () => data };
    }
  } else {
    const list = Array.isArray(content) ? content : [];
    const item = list.find((x: any) => x.id === docId);
    if (item) {
      return { exists: true, data: () => item };
    }
  }
  return { exists: false, data: () => null };
}

async function dbSetDoc(collectionName: string, docId: string, data: any, options: { merge?: boolean } = {}): Promise<void> {
  try {
    const docRef = doc(db, collectionName, docId);
    await withTimeout(setDoc(docRef, data, options));
    return;
  } catch (err: any) {
    console.warn(`Firestore setDoc failed for ${collectionName}/${docId}, falling back to local JSON:`, err.message);
  }

  const filePath = getLocalCollectionPath(collectionName);
  const content = readJSONFile(filePath, collectionName === "whatsapp_settings" ? {} : []);
  if (collectionName === "whatsapp_settings") {
    if (docId === "global") {
      const merged = options.merge ? { ...content, ...data } : data;
      writeJSONFile(filePath, merged);
    } else {
      const current = content[docId] || {};
      const merged = options.merge ? { ...current, ...data } : data;
      content[docId] = merged;
      writeJSONFile(filePath, content);
    }
  } else {
    const list = Array.isArray(content) ? content : [];
    const index = list.findIndex((x: any) => x.id === docId);
    const item = { id: docId, ...data };
    if (index !== -1) {
      list[index] = options.merge ? { ...list[index], ...data } : item;
    } else {
      list.push(item);
    }
    writeJSONFile(filePath, list);
  }
}

async function dbUpdateDoc(collectionName: string, docId: string, data: any): Promise<void> {
  try {
    const docRef = doc(db, collectionName, docId);
    await withTimeout(updateDoc(docRef, data));
    return;
  } catch (err: any) {
    console.warn(`Firestore updateDoc failed for ${collectionName}/${docId}, falling back to local JSON:`, err.message);
  }

  const filePath = getLocalCollectionPath(collectionName);
  const content = readJSONFile(filePath, collectionName === "whatsapp_settings" ? {} : []);
  if (collectionName === "whatsapp_settings") {
    if (docId === "global") {
      const merged = { ...content, ...data };
      writeJSONFile(filePath, merged);
    } else {
      const current = content[docId] || {};
      const merged = { ...current, ...data };
      content[docId] = merged;
      writeJSONFile(filePath, content);
    }
  } else {
    const list = Array.isArray(content) ? content : [];
    const index = list.findIndex((x: any) => x.id === docId);
    if (index !== -1) {
      list[index] = { ...list[index], ...data };
      writeJSONFile(filePath, list);
    } else {
      throw new Error(`Document with ID ${docId} not found for update in collection ${collectionName}`);
    }
  }
}

async function dbDeleteDoc(collectionName: string, docId: string): Promise<void> {
  try {
    const docRef = doc(db, collectionName, docId);
    await withTimeout(deleteDoc(docRef));
    return;
  } catch (err: any) {
    console.warn(`Firestore deleteDoc failed for ${collectionName}/${docId}, falling back to local JSON:`, err.message);
  }

  const filePath = getLocalCollectionPath(collectionName);
  const content = readJSONFile(filePath, collectionName === "whatsapp_settings" ? {} : []);
  if (collectionName === "whatsapp_settings") {
    if (docId === "global") {
      writeJSONFile(filePath, {});
    } else {
      delete content[docId];
      writeJSONFile(filePath, content);
    }
  } else {
    const list = Array.isArray(content) ? content : [];
    const filtered = list.filter((x: any) => x.id !== docId);
    writeJSONFile(filePath, filtered);
  }
}

async function dbGetDocs(collectionName: string): Promise<{ docs: Array<{ id: string; data: () => any }> }> {
  try {
    const colRef = collection(db, collectionName);
    const snap = await withTimeout(getDocs(colRef));
    return {
      docs: snap.docs.map(docSnap => ({
        id: docSnap.id,
        data: () => docSnap.data()
      }))
    };
  } catch (err: any) {
    console.warn(`Firestore getDocs failed for collection ${collectionName}, falling back to local JSON:`, err.message);
  }

  const filePath = getLocalCollectionPath(collectionName);
  const content = readJSONFile(filePath, collectionName === "whatsapp_settings" ? {} : []);
  if (collectionName === "whatsapp_settings") {
    const list = [];
    for (const [key, val] of Object.entries(content)) {
      list.push({ id: key, data: () => val });
    }
    return { docs: list };
  } else {
    const list = Array.isArray(content) ? content : [];
    return {
      docs: list.map((item: any) => ({
        id: item.id || "",
        data: () => item
      }))
    };
  }
}

// --- DATABASE SEEDING ---
const seedFirestoreCollections = async () => {
  try {
    const settingsSnap = await dbGetDoc("whatsapp_settings", "global");
    if (!settingsSnap.exists) {
      await dbSetDoc("whatsapp_settings", "global", {
        enabled: false,
        provider: "ultramsg",
        apiUrl: "https://api.ultramsg.com/instance12345/messages/chat",
        accessToken: "",
        phoneNumberId: "",
        businessAccountId: "",
        webhookSecret: "",
        templateName: "hello_world",
        retryAttempts: 3,
        retryDelay: 60,
        queueSize: 100,
        businessNumber: ""
      });
      console.log("Database Seeded: Default whatsapp_settings initialized.");
    }

    // Seed default event-triggered templates
    const defaultTemplates = [
      {
        id: "new_order",
        name: "طلب جديد",
        description: "ترسل تلقائياً عند تسجيل طلب تجريبي جديد",
        language: "ar",
        message: `السلام عليكم أستاذ {{customerName}} 👋\nمعك فريق الدعم الفني والتقني لـ *Algora Systems* 🇩🇿💻\n\nيسعدنا جداً اختيارك لنا لتنظيم وتسيير نشاطك التجاري! لقد استلمنا طلبك لتجربة البرنامج لصالح متجركم المميز:\n🏪 *{{storeName}}*\n\nلقد قمنا بتجهيز حسابك وفترة التفعيل الخاصة بـ:\n📦 *{{package}}*\n\nهل أنت متاح حالياً لنقوم بمساعدتك عن بُعد في عملية التثبيت السريع للبرنامج وتفعيله لتبدأ العمل؟ 🚀😊`,
        enabled: true
      },
      {
        id: "contacted",
        name: "تم الاتصال",
        description: "ترسل عند الاتصال بالزبون وتحديث حالته",
        language: "ar",
        message: `مرحباً {{customerName}} 👋\n\nيسعدنا تواصلنا معك بخصوص متجر {{storeName}}.\nلقد قمنا بتحديث حالة طلبك إلى "تم الاتصال".\nسنقوم بإرشادك لخطوات التشغيل والتفعيل خلال لحظات.`,
        enabled: true
      },
      {
        id: "pending_payment",
        name: "بانتظار الدفع",
        description: "ترسل عند تأكيد الطلب بانتظار سداد الفاتورة",
        language: "ar",
        message: `مرحباً {{customerName}} 👋\n\nطلبك لمتجر {{storeName}} بانتظار إتمام الدفع بقيمة {{price}}.\n\nيرجى إرسال إثبات الدفع (بريدي موب أو CCP) لتنشيط الحساب فوراً.`,
        enabled: true
      },
      {
        id: "completed_payment",
        name: "تم الدفع",
        description: "ترسل عند تأكيد استلام الدفعة المالية",
        language: "ar",
        message: `مرحباً {{customerName}} 👋\n\nشكراً لك! تم استلام دفعتك المالية لمتجر {{storeName}} بنجاح.\nجاري إعداد رخصة التشغيل وإرسالها لك الآن.`,
        enabled: true
      },
      {
        id: "activated",
        name: "تم التفعيل",
        description: "ترسل عند تفعيل الحساب وتوليد الرخصة",
        language: "ar",
        message: `مرحباً {{customerName}} 🎉\n\nتم تفعيل نظامك لمتجر {{storeName}} بنجاح!\n\nرخصة التشغيل:\n{{licenseKey}}\n\nشكراً لثقتك بنا! ❤️`,
        enabled: true
      },
      {
        id: "expiring_soon",
        name: "قرب انتهاء الاشتراك",
        description: "ترسل قبل انتهاء الرخصة بـ 7 أيام",
        language: "ar",
        message: `مرحباً {{customerName}} ⚠️\n\nنود تذكيرك بأن اشتراك متجر {{storeName}} سينتهي خلال 7 أيام.\nيرجى تجديد الاشتراك لضمان استمرار عمل الكاشير والصيانة دون انقطاع.`,
        enabled: true
      },
      {
        id: "expired",
        name: "انتهاء الاشتراك",
        description: "ترسل عند انتهاء صلاحية الرخصة",
        language: "ar",
        message: `مرحباً {{customerName}} 🚫\n\nلقد انتهى اشتراك متجر {{storeName}} الخاص بك.\nتوقف النظام مؤقتاً. يرجى التواصل معنا للتجديد الفوري وإعادة الخدمة.`,
        enabled: true
      }
    ];

    for (const t of defaultTemplates) {
      const tSnap = await dbGetDoc("whatsapp_templates", t.id);
      if (!tSnap.exists) {
        await dbSetDoc("whatsapp_templates", t.id, t);
        console.log(`Database Seeded: Template "${t.name}" initialized.`);
      }
    }

    // Migrate/Update new_order template to the new professional format in Firestore
    try {
      const newOrderTemplateRef = doc(db, "whatsapp_templates", "new_order");
      const newOrderSnap = await getDoc(newOrderTemplateRef);
      if (newOrderSnap.exists()) {
        const currentMsg = newOrderSnap.data().message || "";
        if (currentMsg.includes("مرحباً أستاذ") || currentMsg.includes("تم استلام طلبك بنجاح") || currentMsg.includes("Fon Zon")) {
          await updateDoc(newOrderTemplateRef, {
            message: `السلام عليكم أستاذ {{customerName}} 👋\nمعك فريق الدعم الفني والتقني لـ *Algora Systems* 🇩🇿💻\n\nيسعدنا جداً اختيارك لنا لتنظيم وتسيير نشاطك التجاري! لقد استلمنا طلبك لتجربة البرنامج لصالح متجركم المميز:\n🏪 *{{storeName}}*\n\nلقد قمنا بتجهيز حسابك وفترة التفعيل الخاصة بـ:\n📦 *{{package}}*\n\nهل أنت متاح حالياً لنقوم بمساعدتك عن بُعد في عملية التثبيت السريع للبرنامج وتفعيله لتبدأ العمل؟ 🚀😊`
          });
          console.log("Migrated new_order template in Firestore to the new professional marketing version.");
        }
      }
    } catch (migErr: any) {
      console.warn("Migration of new_order template in Firestore failed:", migErr.message);
    }
  } catch (err) {
    console.error("Database Seeding failed:", err);
  }
};

await seedFirestoreCollections();

  // Helper: Format message templates dynamically
  const getPackageLabel = (type: string): string => {
    if (type === "pc" || type === "computer" || type === "p_pc_only") return "باقة لوجيسيال حاسوب فقط";
    if (type === "mobile" || type === "phone" || type === "p_mobile_only") return "باقة تطبيق هاتف فقط";
    if (type === "both" || type === "combo" || type === "p_both") return "باقة تطبيق هاتف مع حاسوب";
    if (type === "annual") return "الباقة السنوية";
    if (type === "monthly") return "الباقة الشهرية";
    if (type === "enterprise") return "باقة الموزعين الكبرى";
    return "فترة تجريبية أساسية";
  };

  const formatTemplateMessage = (templateText: string, order: any): string => {
    const vars = {
      "{{customerName}}": order.ownerName || "",
      "{{storeName}}": order.storeName || "",
      "{{orderNumber}}": order.orderNumber || "",
      "{{package}}": getPackageLabel(order.packageType || order.programType || ""),
      "{{price}}": `${(order.packagePrice || 0).toLocaleString("ar-DZ")} دج`,
      "{{licenseKey}}": order.licenseKey || "قيد التوليد",
      "{{activationCode}}": order.activationCode || "قيد التوليد",
      "{{phone}}": order.phonePrimary || order.phone || "",
      "{{today}}": new Date().toLocaleDateString("ar-DZ")
    };
    let text = templateText;
    for (const [key, value] of Object.entries(vars)) {
      text = text.replace(new RegExp(key, "g"), value);
    }
    return text;
  };

  // Helper: WhatsApp core sender driver supporting all providers
  const sendWhatsAppRequest = async (settings: any, toPhone: string, bodyText: string): Promise<{ success: boolean; messageId?: string; error?: string }> => {
    let cleanPhone = toPhone.replace(/[\s\+\-]/g, "");
    if (cleanPhone.startsWith("0")) {
      cleanPhone = "213" + cleanPhone.substring(1);
    }
    if (!cleanPhone.startsWith("213") && cleanPhone.length === 9) {
      cleanPhone = "213" + cleanPhone;
    }

    const provider = settings.provider || "ultramsg";
    console.log(`sendWhatsAppRequest: Sending message to ${cleanPhone} via provider: ${provider}`);

    // 1. UltraMsg API Driver
    if (provider === "ultramsg") {
      try {
        const url = settings.apiUrl || `https://api.ultramsg.com/${settings.phoneNumberId || "instance12345"}/messages/chat`;
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            token: settings.accessToken,
            to: cleanPhone,
            body: bodyText
          })
        });

        const resData = await response.json() as any;
        if (response.ok && (resData.sent === "true" || resData.sent === true || resData.id)) {
          return { success: true, messageId: resData.id || `ultramsg_${Date.now()}` };
        } else {
          return { success: false, error: resData.error || resData.message || `API error code ${response.status}` };
        }
      } catch (e: any) {
        console.error("UltraMsg API Send Error:", e);
        return { success: false, error: e.message || "Failed to contact UltraMsg API." };
      }
    }

    // 2. Meta WhatsApp Cloud API Driver
    if (provider === "meta") {
      try {
        const phoneId = settings.phoneNumberId || "";
        const token = settings.accessToken || "";
        const url = settings.apiUrl || `https://graph.facebook.com/v20.0/${phoneId}/messages`;
        
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            messaging_product: "whatsapp",
            recipient_type: "individual",
            to: cleanPhone,
            type: "text",
            text: {
              preview_url: false,
              body: bodyText
            }
          })
        });

        const resData = await response.json() as any;
        if (response.ok && resData.messages && resData.messages[0]) {
          return { success: true, messageId: resData.messages[0].id };
        } else {
          const errDetail = resData.error?.message || `API error code ${response.status}`;
          return { success: false, error: errDetail };
        }
      } catch (e: any) {
        console.error("Meta WhatsApp Cloud API Send Error:", e);
        return { success: false, error: e.message || "Failed to contact Meta API." };
      }
    }

    // 3. Twilio WhatsApp API Driver
    if (provider === "twilio") {
      try {
        const accountSid = settings.businessAccountId || "";
        const authToken = settings.accessToken || "";
        const fromNumber = settings.businessNumber || "";
        const formattedFrom = fromNumber.startsWith("whatsapp:") ? fromNumber : `whatsapp:${fromNumber}`;
        const formattedTo = `whatsapp:${cleanPhone.startsWith("+") ? cleanPhone : "+" + cleanPhone}`;
        
        const url = settings.apiUrl || `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;

        const bodyParams = new URLSearchParams();
        bodyParams.append("From", formattedFrom);
        bodyParams.append("To", formattedTo);
        bodyParams.append("Body", bodyText);

        const authHeader = `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString("base64")}`;

        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Authorization": authHeader,
            "Content-Type": "application/x-www-form-urlencoded"
          },
          body: bodyParams.toString()
        });

        const resData = await response.json() as any;
        if (response.ok && resData.sid) {
          return { success: true, messageId: resData.sid };
        } else {
          return { success: false, error: resData.message || `Twilio error code ${resData.code || response.status}` };
        }
      } catch (e: any) {
        console.error("Twilio API Send Error:", e);
        return { success: false, error: e.message || "Failed to contact Twilio API." };
      }
    }

    // 4. Custom API / Webhook Driver
    if (provider === "custom") {
      try {
        const url = settings.apiUrl;
        if (!url) {
          return { success: false, error: "Custom Provider API URL is missing." };
        }

        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(settings.webhookSecret ? { "X-Webhook-Secret": settings.webhookSecret } : {})
          },
          body: JSON.stringify({
            to: cleanPhone,
            message: bodyText
          })
        });

        const resData = await response.json().catch(() => ({})) as any;
        if (response.ok) {
          return { success: true, messageId: resData.messageId || resData.id || `custom_${Date.now()}` };
        } else {
          return { success: false, error: resData.error || resData.message || `Custom webhook returned code ${response.status}` };
        }
      } catch (e: any) {
        console.error("Custom Webhook Send Error:", e);
        return { success: false, error: e.message || "Failed to contact Custom Webhook URL." };
      }
    }

    return { success: false, error: `المزود المختار غير مدعوم أو غير مهيأ: ${provider}` };
  };

  // Helper: Enqueue message to message_queue collection
  const enqueueWhatsAppMessage = async (order: any, eventType: string) => {
    try {
      const settingsSnap = await dbGetDoc("whatsapp_settings", "global");
      if (!settingsSnap.exists || !settingsSnap.data()?.enabled) {
        console.log("WhatsApp Automation is disabled globally. Skipping queue insertion.");
        return;
      }

      const tSnap = await dbGetDoc("whatsapp_templates", eventType);
      if (!tSnap.exists || !tSnap.data()?.enabled) {
        console.log(`Template for event "${eventType}" is disabled/not found. Skipping.`);
        return;
      }

      const template = tSnap.data();
      const messageBody = formatTemplateMessage(template.message, order);
      const queueId = "queue_" + Math.random().toString(36).substr(2, 9);

      const queueDoc = {
        id: queueId,
        orderId: order.id,
        phone: order.phonePrimary || order.phone,
        customerName: order.ownerName,
        storeName: order.storeName,
        packageName: getPackageLabel(order.packageType || order.programType || ""),
        messageBody: messageBody,
        status: "pending",
        retryCount: 0,
        nextAttemptAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        eventType: eventType,
        templateName: template.name
      };

      await dbSetDoc("message_queue", queueId, queueDoc);
      console.log(`Enqueued WhatsApp message successfully: Queue ID: ${queueId}`);
    } catch (err) {
      console.error("Failed to enqueue WhatsApp message:", err);
    }
  };

  // BACKGROUND QUEUE WORKER INTERVAL (Runs every 15 seconds to process queue)
  setInterval(async () => {
    try {
      const settingsSnap = await dbGetDoc("whatsapp_settings", "global");
      if (!settingsSnap.exists || !settingsSnap.data()?.enabled) {
        return;
      }
      const settings = settingsSnap.data();

      // Fetch pending messages ready for retry
      const snap = await dbGetDocs("message_queue");
      const now = new Date();

      const pendingMessages = snap.docs
        .map(doc => doc.data())
        .filter(m => m.status === "pending" && new Date(m.nextAttemptAt) <= now);

      for (const msg of pendingMessages) {
        // Mark as sending to prevent overlapping executions
        await dbUpdateDoc("message_queue", msg.id, { status: "sending" });

        console.log(`Background Worker: Processing message ${msg.id} for ${msg.customerName}...`);
        const result = await sendWhatsAppRequest(settings, msg.phone, msg.messageBody);

        const logId = "log_" + Math.random().toString(36).substr(2, 9);
        const logDoc = {
          id: logId,
          messageId: result.messageId || "",
          orderId: msg.orderId,
          customerName: msg.customerName,
          phone: msg.phone,
          provider: settings.provider,
          template: msg.templateName,
          status: result.success ? "Sent" : "Failed",
          createdAt: msg.createdAt,
          sentAt: result.success ? new Date().toISOString() : "",
          deliveredAt: "",
          readAt: "",
          retryCount: msg.retryCount,
          errorMessage: result.error || ""
        };

        // Write log to whatsapp_logs collection
        await dbSetDoc("whatsapp_logs", logId, logDoc);

        if (result.success) {
          // Success: delete from queue
          await dbDeleteDoc("message_queue", msg.id);
          console.log(`Background Worker: Message ${msg.id} sent successfully.`);
        } else {
          // Failure: calculate next retry or mark failed
          const nextCount = msg.retryCount + 1;
          const maxRetries = settings.retryAttempts || 3;

          if (nextCount < maxRetries) {
            // Determine retry delay: 1st = 1m, 2nd = 5m, 3rd = 30m
            let delayMinutes = 1;
            if (nextCount === 2) delayMinutes = 5;
            if (nextCount >= 3) delayMinutes = 30;

            const nextAttempt = new Date();
            nextAttempt.setMinutes(nextAttempt.getMinutes() + delayMinutes);

            await dbUpdateDoc("message_queue", msg.id, {
              status: "pending",
              retryCount: nextCount,
              nextAttemptAt: nextAttempt.toISOString()
            });
            console.log(`Background Worker: Send failed for ${msg.id}. Retrying attempt ${nextCount} in ${delayMinutes} minutes.`);
          } else {
            // Exceeded retries: remove from queue and keep in logs as Failed
            await dbDeleteDoc("message_queue", msg.id);
            console.log(`Background Worker: Message ${msg.id} exceeded maximum retries. Marked as failed.`);
          }
        }
      }
    } catch (err) {
      console.error("WhatsApp Queue background worker encountered an error:", err);
    }
  }, 15000);

  // 1. Save Free Trial Request (MIGRATED TO FIRESTORE)
  app.post("/api/register-trial", async (req, res) => {
    const { 
      storeName, 
      ownerName, 
      phone, 
      phone2, 
      city, 
      hasWhatsapp, 
      paymentMethod, 
      programType,
      province,
      notes
    } = req.body;

    if (!storeName || !ownerName || !phone || !city) {
      return res.status(400).json({ error: "جميع الحقول المطلوبة (اسم المحل، اسم المالك، رقم الهاتف والمدينة) يجب ملؤها" });
    }

    try {
      const snap = await dbGetDocs("orders");
      const ordersCount = snap.docs.length;

      // Prevent duplication if primary phone number already has a pending order
      const isDuplicate = snap.docs.some(doc => {
        const d = doc.data();
        return d.phonePrimary === phone && d.orderStatus === "pending";
      });

      if (isDuplicate) {
        return res.status(400).json({ error: "يوجد طلب نشط بالفعل قيد المراجعة لهذا الرقم. الرجاء انتظار الدعم الفني." });
      }

      // Generate order number atomically
      const nextCount = ordersCount + 100001;
      const orderNumber = `FZ-${nextCount}`;

      // Package Price Calculation (dynamic fallback mapping)
      let packagePrice = 0;
      if (programType === "p_pc_only") packagePrice = 12000;
      else if (programType === "p_mobile_only") packagePrice = 12000;
      else if (programType === "p_both" || programType === "both") packagePrice = 22000;

      // Trial Dates
      const trialStart = new Date();
      const trialEnd = new Date();
      trialEnd.setDate(trialEnd.getDate() + 5);

      const orderId = "order_" + Math.random().toString(36).substr(2, 9);
      const orderDoc = {
        id: orderId,
        orderNumber,
        storeName,
        ownerName,
        phonePrimary: phone,
        phoneSecondary: phone2 || "",
        province: province || city || "",
        city,
        packageType: programType || "both",
        packagePrice,
        whatsappLinked: hasWhatsapp === "yes",
        paymentMethod: paymentMethod || "electronic",
        paymentStatus: "pending",
        orderStatus: "pending", // pending = جديد
        notes: notes || "",
        assignedAdmin: "",
        activationCode: "",
        licenseKey: "",
        licenseStatus: "inactive",
        trialStart: trialStart.toISOString(),
        trialEnd: trialEnd.toISOString(),
        deviceType: programType === "p_pc_only" ? "pc" : programType === "p_mobile_only" ? "mobile" : "both",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await dbSetDoc("orders", orderId, orderDoc);
      console.log("New Trial Request Registered & Saved successfully:", orderDoc);



      // Trigger automatic WhatsApp greeting queue fallback
      await enqueueWhatsAppMessage(orderDoc, "new_order");

      res.json({
        success: true,
        message: "تم تسجيل طلبك للنسخة التجريبية بنجاح! سيتصل بك فريق الدعم الفني خلال ساعات لتفعيل حسابك وإرسال بيانات الدخول.",
        data: orderDoc,
      });

    } catch (err: any) {
      console.error("Trial Registration Save Error:", err);
      res.status(500).json({ error: "حدث خطأ أثناء حفظ الطلب. الرجاء المحاولة لاحقاً." });
    }
  });

  // Save Gemini API Key
  app.post("/api/admin/save-gemini-key", (req, res) => {
    const { apiKey } = req.body;
    if (!apiKey) {
      return res.status(400).json({ error: "مفتاح API مطلوب لتفعيل المساعد الذكي." });
    }

    try {
      process.env.GEMINI_API_KEY = apiKey;
      
      // Update global AI client
      ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });

      // Write to .env file
      const envPath = path.join(process.cwd(), ".env");
      let envContent = "";
      if (fs.existsSync(envPath)) {
        envContent = fs.readFileSync(envPath, "utf-8");
        if (envContent.includes("GEMINI_API_KEY=")) {
          envContent = envContent.replace(/GEMINI_API_KEY=.*/, `GEMINI_API_KEY="${apiKey}"`);
        } else {
          envContent += `\nGEMINI_API_KEY="${apiKey}"`;
        }
      } else {
        envContent = `GEMINI_API_KEY="${apiKey}"\n`;
      }
      fs.writeFileSync(envPath, envContent, "utf-8");

      res.json({ success: true, message: "تم تحديث مفتاح Gemini API وتنشيط المساعد الذكي بنجاح!" });
    } catch (err: any) {
      res.status(500).json({ error: "فشل حفظ المفتاح: " + err.message });
    }
  });

  // Check Gemini API Key status
  app.get("/api/admin/gemini-status", (req, res) => {
    res.json({
      configured: !!process.env.GEMINI_API_KEY,
      keyLength: process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.length : 0
    });
  });

  // 2. Submit Support Ticket
  app.post("/api/support/ticket", async (req, res) => {
    const { storeName, phone, subject, message } = req.body;

    if (!storeName || !phone || !subject || !message) {
      return res.status(400).json({ error: "جميع الحقول مطلوبة لإرسال تذكرة الدعم الفني" });
    }

    const ticketId = "ticket_" + Math.random().toString(36).substr(2, 9);
    const newTicket = {
      id: ticketId,
      storeName,
      phone,
      subject,
      message,
      timestamp: new Date().toISOString(),
      status: "open",
    };

    try {
      await dbSetDoc("support_tickets", ticketId, newTicket);
      console.log("New Support Ticket Submitted & Saved successfully:", newTicket);

      res.json({
        success: true,
        message: "تم إرسال طلب الدعم الفني بنجاح! سيقوم مهندسونا بالتواصل معك هاتفياً أو عبر واتساب فوراً.",
        data: newTicket,
      });
    } catch (err: any) {
      console.error("Save Ticket Error:", err);
      res.status(500).json({ error: "حدث خطأ أثناء حفظ التذكرة بقاعدة البيانات. الرجاء المحاولة لاحقاً." });
    }
  });

  // 3. Smart Support Chatbot with Gemini
  app.post("/api/support/chat", async (req, res) => {
    const { message, chatHistory } = req.body;

    if (!message) {
      return res.status(400).json({ error: "الرجاء كتابة رسالة" });
    }

    const getLocalReply = (msgText: string) => {
      const q = msgText.toLowerCase().trim();
      if (q.includes("دفع") || q.includes("بريدي") || q.includes("ccp") || q.includes("سداد")) {
        return "نعم، يدعم نظامنا الدفع بالكامل عبر طرق الدفع المحلية المريحة بالجزائر: تطبيق بريدي موب (Baridimob) عبر الـ RIP، الحساب البريدي الجاري CCP، أو بطاقات RedotPay الدولية لتسهيل تفعيل اشتراكك فوراً.";
      } else if (q.includes("طابعة") || q.includes("حرارية") || q.includes("ربط") || q.includes("فاتورة") || q.includes("فواتير")) {
        return "البرنامج متوافق تماماً مع جميع أنواع طابعات الفواتير والملصقات الحرارية (قياس 58 مم و80 مم)، بالإضافة لطابعات A4 وA5 لإصدار وصولات الضمان. فريق الدعم الفني يتكفل بتركيبها وإعدادها لك مجاناً عن بعد عبر AnyDesk.";
      } else if (q.includes("هاتف") || q.includes("تابلت") || q.includes("موبايل") || q.includes("تطبيق")) {
        return "بالتأكيد! يتوفر تطبيق هاتف مخصص (للأندرويد وآيفون) متزامن في الوقت الفعلي مع نسخة الكمبيوتر لتتبع المبيعات، حالة المخزون، وحساب الأرباح من أي مكان خارج المحل.";
      } else if (q.includes("صيانة") || q.includes("سرقة") || q.includes("قطع") || q.includes("غيار")) {
        return "يتميز قسم الصيانة بحصر دقيق لحركة قطع الغيار المستعملة (شاشات، بطاريات، فلاتات) وربطها آلياً بالأجهزة المستلمة، مع تسجيل التقني المسؤول لضمان الشفافية التامة ومنع أي تلاعب أو تداخل بالقطع.";
      } else {
        return `مرحباً بك! أنا المساعد الذكي لـ Algora Systems. حالياً يتم تشغيل النظام في وضع المعاينة دون ربط بمفتاح API سحابي، ولكن يسعدني إجابتك: نظامنا يوفر فترة تجريبية مجانية 5 أيام، ويدعم طابعات الفواتير، ماسحات الباركود، الدفع عبر بريدي موب/CCP، مع دعم فني جزائري محلي متوفر على الرقم 0553361047 أو عبر واتساب لمساعدتك فوراً!`;
      }
    };

    // Check if API key is present
    if (!process.env.GEMINI_API_KEY) {
      return res.json({ reply: getLocalReply(message) });
    }

    try {
      // Setup detailed system instruction containing all business knowledge
      const systemInstruction = `
أنت المساعد الذكي الرسمي لشركة "Algora Systems" (ألجورا سيستمز) المتخصصة في تقديم برمجيات ولوجيسيال إدارة محلات الهواتف والصيانة في الجزائر.
مهمتك هي الترحيب بالعملاء وأصحاب المحلات والإجابة على استفساراتهم التقنية والتجارية بمهنية عالية، وبأسلوب مشوق باللغة العربية الفصحى المبسطة الممزوجة ببعض الكلمات الجزائرية المحببة (الدارجة المهذبة) لتعزيز الثقة والدعم المحلي المباشر.

معلومات هامة وحقائق عن برنامج Algora Systems لإدارة محلات الهواتف:
1. مميزات البرنامج الفريدة:
   - إدارة المبيعات والأرباح: كاشير سريع وسهل (POS)، حساب فوري للأرباح الصافية لكل عملية، تتبع مبيعات الموظفين.
   - إدارة المخزون بدقة تامة: تتبع الهواتف بالرقم التسلسلي (IMEI)، تتبع قطع الغيار (شاشات، بطاريات، فلاتات) بدقة، وتنبيهات تلقائية عند اقتراب نفاد المخزون.
   - قسم الصيانة الاحترافي: تسجيل الأجهزة المعطلة، تتبع حالة الإصلاح (انتظار القطع، قيد التصليح، تم التصليح، تم التسليم)، حساب تكلفة قطع الغيار وتكلفة يد العمل بدقة، وإشعار الزبون فوراً تلقائياً.
   - إدارة الزبائن والموردين: تسجيل ديون الزبائن (الكريدي) وتنبيهات السداد، وتتبع فواتير الموردين.
   - تقارير تفصيلية شاملة: رسوم بيانية تفاعلية يومية، أسبوعية، وشهرية للمبيعات والأرباح والمصاريف.

2. التوافق والاتصال مع العتاد والمعدات:
   - متوافق تماماً مع جميع أنواع طابعات الفواتير الحرارية بمختلف القياسات (58mm و80mm).
   - متوافق مع طابعات الفواتير العادية (A4 وA5) لإصدار وصولات ضمان احترافية للأجهزة المبيعة أو المصلحة.
   - يدعم التوصيل والعمل المباشر مع جميع ماسحات الباركود (Barcode Readers) اللاسلكية والسلكية (USB).
   - يدعم شاشات العرض المزدوجة للزبائن (Customer Display).

3. طرق الدفع والاشتراك المتوفرة في الجزائر:
   - يدعم البرنامج الدفع بكافة الطرق المحلية المريحة للجزائريين لتسهيل الاشتراك:
     - بريدي موب (Baridimob) - الدفع فوري عبر الـ RIP.
     - الحساب البريدي الجاري CCP (بريد الجزائر).
     - بطاقات ريدوت باي (RedotPay) للتسهيلات الإلكترونية الدولية.
     - التحويل البنكي أو الدفع نقداً عند التقاء أحد وكلائنا المعتمدين في الولايات.

4. خطط وأسعار الاشتراكات (الباقات المتوفرة):
   - الفترة التجريبية (تجربة مجانية): 5 أيام كاملة بكامل الميزات دون الحاجة لبطاقة دفع أو التزام، للتأكد من جودة النظام قبل الاشتراك.
   - الباقة الشهرية: 2,500 دج (دينار جزائري) شهرياً. تشمل: كاشير سريع، تتبع المخزون والمبيعات، مستخدم واحد، دعم فني عبر البريد.
   - الباقة السنوية (الأكثر طلباً وتوفيراً): 20,000 دج شهرياً (مع خصم 20% متضمن مقارنة بالدفع الشهري). تشمل: مستخدمين غير محدودين، تتبع كامل لقطع الغيار والصيانة الاحترافية، إشعارات الزبائن، نسخ احتياطي سحابي تلقائي لقاعدة البيانات يومياً، دعم فني هاتفي مباشر 24/7، وتحديثات مجانية مدى الحياة.
   - باقة الموزعين والمحلات الكبرى (Enterprise): 35,000 دج سنوياً أو تدفع لمرة واحدة مخصصة. ربط عدة فروع متزامنة في الوقت الفعلي، وتخصيص كامل للهوية البصرية للمحل، ومسؤول دعم فني خاص.

5. الدعم الفني المحلي المباشر والتدريب:
   - فريق الدعم الفني متواجد بالكامل في الجزائر (فريق محلي يتحدث لغتك ويفهم تفاصيل السوق الجزائري).
   - تقديم حصص تدريبية مجانية بالفيديو أو اتصال مباشر (عبر زووم أو أني ديسك AnyDesk) لأصحاب المحلات وعمالهم لتعلم كيفية تشغيل البرنامج في 10 دقائق فقط.
   - رقم الدعم الفني الهاتفي والواتساب: 0553361047 (+213 553 36 10 47).
   - البريد الإلكتروني: contact@algora.dz.

أجب باختصار وبطريقة ودودة ومنظمة مستخدماً علامات الترقيم والنقاط الجذابة، وشجع العميل على ملء نموذج طلب التجربة المجانية المتاح في الموقع أو الاتصال بنا مباشرة. لا تذكر تفاصيل تقنية معقدة عن الخوادم أو الكود الداخلي. أظهر كرم الضيافة والروح الجزائرية الترحيبية المهنية!
`;

      const formattedHistory = (chatHistory || []).map((msg: any) => ({
        role: msg.role === "user" ? "user" : "model",
        parts: [{ text: msg.content }],
      }));

      // Initialize a new chat session using the guidelines and gemini-3.5-flash
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: [
          ...formattedHistory,
          { role: "user", parts: [{ text: message }] }
        ],
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      const replyText = response.text || getLocalReply(message);
      res.json({ reply: replyText });
    } catch (error: any) {
      console.error("Gemini API Error (falling back to smart local reply):", error);
      res.json({ reply: getLocalReply(message) });
    }
  });

  // 4. Admin API - Get all trial requests (MIGRATED TO FIRESTORE)
  app.get("/api/admin/trial-requests", async (req, res) => {
    try {
      const snap = await dbGetDocs("orders");
      const list = snap.docs.map(doc => {
        const order = doc.data();
        return {
          id: order.id,
          storeName: order.storeName,
          ownerName: order.ownerName,
          phone: order.phonePrimary,
          phone2: order.phoneSecondary,
          hasWhatsapp: order.whatsappLinked ? "yes" : "no",
          paymentMethod: order.paymentMethod,
          programType: order.packageType,
          city: order.city,
          province: order.province,
          timestamp: order.createdAt,
          status: order.orderStatus,
          orderNumber: order.orderNumber,
          packagePrice: order.packagePrice,
          paymentStatus: order.paymentStatus,
          notes: order.notes,
          licenseKey: order.licenseKey || "",
          activatedAt: order.activatedAt || ""
        };
      });
      const sorted = list.sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      res.json(sorted);
    } catch (err: any) {
      console.warn("Fetch trial requests failed, returning empty list:", err.message);
      res.json([]);
    }
  });

  // 5. Admin API - Update trial request status (MIGRATED TO FIRESTORE)
  app.put("/api/admin/trial-requests/:id", async (req, res) => {
    const { id } = req.params;
    const { status, storeName, ownerName, phone, phone2, city, hasWhatsapp, paymentMethod, programType, province, notes } = req.body;
    try {
      const orderSnap = await dbGetDoc("orders", id);
      if (!orderSnap.exists) {
        return res.status(404).json({ error: "الطلب غير موجود" });
      }

      const orderData = orderSnap.data();
      const updates: any = { updatedAt: new Date().toISOString() };
      
      if (status !== undefined) updates.orderStatus = status;
      if (storeName !== undefined) updates.storeName = storeName;
      if (ownerName !== undefined) updates.ownerName = ownerName;
      if (phone !== undefined) updates.phonePrimary = phone;
      if (phone2 !== undefined) updates.phoneSecondary = phone2;
      if (city !== undefined) updates.city = city;
      if (province !== undefined) updates.province = province;
      if (hasWhatsapp !== undefined) updates.whatsappLinked = hasWhatsapp === "yes";
      if (paymentMethod !== undefined) updates.paymentMethod = paymentMethod;
      if (programType !== undefined) updates.packageType = programType;
      if (notes !== undefined) updates.notes = notes;

      const currentStatus = orderData.orderStatus;

      // Trigger events for automation messages
      let targetTriggerEvent = "";

      if (status !== undefined && status !== currentStatus) {
        if (status === "contacted") targetTriggerEvent = "contacted";
        else if (status === "pending_payment") targetTriggerEvent = "pending_payment";
        else if (status === "completed") {
          targetTriggerEvent = "completed_payment";
          updates.paymentStatus = "paid";
        } else if (status === "approved") {
          targetTriggerEvent = "activated";
          updates.licenseStatus = "active";
          updates.activatedAt = new Date().toISOString();
          
          const cleanStore = (storeName || orderData.storeName || "ALG").trim().substring(0, 3).toUpperCase().replace(/[^A-Z0-9]/g, "X");
          const randSfx = Math.floor(1000 + Math.random() * 9000);
          const randSfx2 = Math.floor(1000 + Math.random() * 9000);
          updates.licenseKey = `ALG-${cleanStore}-${(programType || orderData.packageType) === "p_both" ? "ANNUAL" : "MONTH"}-${randSfx}-${randSfx2}`;
        }
      }

      const updatedOrder = { ...orderData, ...updates };
      await dbUpdateDoc("orders", id, updates);

      // Trigger automatic event message enqueueing
      if (targetTriggerEvent) {
        await enqueueWhatsAppMessage(updatedOrder, targetTriggerEvent);
      }

      res.json({ success: true, data: updatedOrder });
    } catch (err: any) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  });

  // 6. Admin API - Delete trial request (MIGRATED TO FIRESTORE)
  app.delete("/api/admin/trial-requests/:id", async (req, res) => {
    const { id } = req.params;
    try {
      const orderRef = doc(db, "orders", id);
      const orderSnap = await getDoc(orderRef);
      if (!orderSnap.exists()) {
        return res.status(404).json({ error: "الطلب غير موجود" });
      }
      
      await deleteDoc(orderRef);
      res.json({ success: true, message: "تم حذف الطلب بنجاح" });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // --- WHATSAPP SETTINGS ENDPOINTS ---
  app.get("/api/admin/whatsapp/settings", async (req, res) => {
    try {
      const settingsRef = doc(db, "whatsapp_settings", "global");
      const settingsSnap = await withTimeout(getDoc(settingsRef));
      if (settingsSnap.exists()) {
        res.json(settingsSnap.data());
      } else {
        res.json({ enabled: false, provider: "whatsapp_web" });
      }
    } catch (err: any) {
      console.warn("Firestore fetch settings failed, returning default config:", err.message);
      res.json({ enabled: false, provider: "whatsapp_web" });
    }
  });

  app.post("/api/admin/whatsapp/settings", async (req, res) => {
    try {
      const settingsRef = doc(db, "whatsapp_settings", "global");
      await withTimeout(setDoc(settingsRef, req.body, { merge: true }));
      res.json({ success: true, message: "تم حفظ إعدادات الواتساب بنجاح!" });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // --- WHATSAPP TEMPLATES ENDPOINTS ---
  app.get("/api/admin/whatsapp/templates", async (req, res) => {
    try {
      const tRef = collection(db, "whatsapp_templates");
      const snap = await withTimeout(getDocs(tRef));
      const list = snap.docs.map(doc => doc.data());
      res.json(list);
    } catch (err: any) {
      console.warn("Firestore fetch templates failed, returning empty list:", err.message);
      res.json([]);
    }
  });

  app.put("/api/admin/whatsapp/templates/:id", async (req, res) => {
    const { id } = req.params;
    try {
      const tRef = doc(db, "whatsapp_templates", id);
      await withTimeout(updateDoc(tRef, req.body));
      res.json({ success: true, message: "تم تحديث القالب بنجاح!" });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // --- WHATSAPP LOGS & QUEUE ENDPOINTS ---
  app.get("/api/admin/whatsapp/logs", async (req, res) => {
    try {
      const lRef = collection(db, "whatsapp_logs");
      const snap = await withTimeout(getDocs(lRef));
      const list = snap.docs.map(doc => doc.data());
      const sorted = list.sort((a: any, b: any) => new Date(b.sentAt || b.createdAt).getTime() - new Date(a.sentAt || a.createdAt).getTime());
      res.json(sorted);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Trigger immediate direct message send or retry from dashboard
  app.post("/api/admin/whatsapp/resend/:id", async (req, res) => {
    const { id } = req.params;
    try {
      const logRef = doc(db, "whatsapp_logs", id);
      const logSnap = await getDoc(logRef);
      let phone = "";
      let bodyText = "";
      let orderId = "";
      let customerName = "";
      let storeName = "";
      let templateName = "";

      if (logSnap.exists()) {
        const logData = logSnap.data();
        phone = logData.phone;
        orderId = logData.orderId;
        customerName = logData.customerName;
        storeName = logData.storeName || "";
        templateName = logData.template;

        // Fetch corresponding order to re-format message with latest credentials
        const orderRef = doc(db, "orders", orderId);
        const orderSnap = await getDoc(orderRef);
        if (orderSnap.exists()) {
          const order = orderSnap.data();
          const tSnap = await getDoc(doc(db, "whatsapp_templates", logData.template || "new_order"));
          if (tSnap.exists()) {
            bodyText = formatTemplateMessage(tSnap.data().message, order);
          }
        }
      }

      if (!phone || !bodyText) {
        return res.status(400).json({ error: "فشل استرجاع بيانات الرسالة لإعادة إرسالها." });
      }

      const settingsSnap = await dbGetDoc("whatsapp_settings", "global");
      if (!settingsSnap.exists) {
        return res.status(400).json({ error: "إعدادات الواتساب غير مهيأة بعد." });
      }

      const result = await sendWhatsAppRequest(settingsSnap.data(), phone, bodyText);

      const updates = {
        status: result.success ? "Sent" : "Failed",
        sentAt: result.success ? new Date().toISOString() : "",
        errorMessage: result.error || "",
        messageId: result.messageId || ""
      };

      await dbUpdateDoc("whatsapp_logs", id, updates);

      if (result.success) {
        res.json({ success: true, message: "تم إعادة إرسال الرسالة بنجاح!" });
      } else {
        res.status(400).json({ error: "فشل الإرسال: " + result.error });
      }
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Manual Trigger to Send Custom WhatsApp from Order Drawer
  app.post("/api/admin/whatsapp/send-manual", async (req, res) => {
    const { orderId, templateId } = req.body;
    try {
      const orderSnap = await dbGetDoc("orders", orderId);
      if (!orderSnap.exists) {
        return res.status(404).json({ error: "الطلب غير موجود" });
      }
      const order = orderSnap.data();

      const tSnap = await dbGetDoc("whatsapp_templates", templateId);
      if (!tSnap.exists) {
        return res.status(404).json({ error: "القالب المختار غير موجود" });
      }
      const template = tSnap.data();

      const settingsSnap = await dbGetDoc("whatsapp_settings", "global");
      if (!settingsSnap.exists) {
        return res.status(400).json({ error: "إعدادات الواتساب غير مهيأة" });
      }

      const bodyText = formatTemplateMessage(template.message, order);
      const result = await sendWhatsAppRequest(settingsSnap.data(), order.phonePrimary || order.phone, bodyText);

      const logId = "log_" + Math.random().toString(36).substr(2, 9);
      const logDoc = {
        id: logId,
        messageId: result.messageId || "",
        orderId: order.id,
        customerName: order.ownerName,
        phone: order.phonePrimary || order.phone,
        provider: settingsSnap.data().provider,
        template: template.name,
        status: result.success ? "Sent" : "Failed",
        createdAt: new Date().toISOString(),
        sentAt: result.success ? new Date().toISOString() : "",
        deliveredAt: "",
        readAt: "",
        retryCount: 0,
        errorMessage: result.error || ""
      };

      await dbSetDoc("whatsapp_logs", logId, logDoc);

      if (result.success) {
        res.json({ success: true, message: "تم إرسال الرسالة بنجاح!" });
      } else {
        res.status(400).json({ error: "فشل الإرسال: " + result.error });
      }
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // WhatsApp Web Session connection routes (Dummy handlers as whatsapp-web.js is removed)
  app.get("/api/admin/whatsapp/connection-status", (req, res) => {
    res.json({
      status: "Disconnected",
      qr: "",
      error: "تم تعطيل اتصال WhatsApp Web المحلي. يرجى استخدام UltraMsg أو Meta API أو Twilio.",
      name: "",
      phone: "",
      lastConnected: ""
    });
  });

  app.post("/api/admin/whatsapp/connect-session", (req, res) => {
    res.status(400).json({ error: "اتصال WhatsApp Web المحلي غير متوفر. يرجى تهيئة مزودي الخدمة السحابية (API)." });
  });

  app.post("/api/admin/whatsapp/disconnect-session", (req, res) => {
    try {
      const sessionPath = path.join(process.cwd(), ".wwebjs_auth");
      if (fs.existsSync(sessionPath)) {
        fs.rmSync(sessionPath, { recursive: true, force: true });
      }
      res.json({ success: true, message: "تم تسجيل الخروج وتطهير الجلسة بنجاح." });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // Test connection trigger
  app.post("/api/admin/whatsapp/test-connection", async (req, res) => {
    const { provider, apiUrl, accessToken, phoneNumberId, businessAccountId, businessNumber, testPhone } = req.body;
    if (!testPhone) {
      return res.status(400).json({ error: "يرجى تحديد رقم الهاتف لإرسال الرسالة التجريبية إليه." });
    }

    const testSettings = { provider, apiUrl, accessToken, phoneNumberId, businessAccountId, businessNumber };
    const testMessage = `Fon Zon Systems - WhatsApp Automation Test 🟢\n\nتم التحقق من ربط الإعدادات وقابلية إرسال الرسائل البرمجية بنجاح!`;

    const result = await sendWhatsAppRequest(testSettings, testPhone, testMessage);
    if (result.success) {
      res.json({ success: true, message: "تم إرسال رسالة الاختبار بنجاح إلى الرقم المحدد!" });
    } else {
      res.status(400).json({ error: result.error || "فشل الاتصال بالمزود." });
    }
  });

  // Webhook Receiver for status updates
  app.post("/api/whatsapp/webhook", async (req, res) => {
    try {
      console.log("WhatsApp Webhook received:", JSON.stringify(req.body));
      // Twilio Callback
      if (req.body.MessageSid && req.body.MessageStatus) {
        const msgSid = req.body.MessageSid;
        const twilioStatus = req.body.MessageStatus; // sent, delivered, read, failed
        
        let targetStatus = "Sent";
        if (twilioStatus === "delivered") targetStatus = "Delivered";
        if (twilioStatus === "read") targetStatus = "Read";
        if (twilioStatus === "failed") targetStatus = "Failed";

        const snap = await dbGetDocs("whatsapp_logs");
        const matchDoc = snap.docs.find(doc => doc.data().messageId === msgSid);
        if (matchDoc) {
          const updateData: any = { status: targetStatus };
          if (targetStatus === "Delivered") updateData.deliveredAt = new Date().toISOString();
          if (targetStatus === "Read") updateData.readAt = new Date().toISOString();
          await dbUpdateDoc("whatsapp_logs", matchDoc.id, updateData);
        }
      }

      // UltraMsg Callback
      if (req.body.event_type && req.body.data) {
        const msgId = req.body.data.id;
        const uStatus = req.body.event_type; // message_ack, message_delivered, message_read
        
        let targetStatus = "Sent";
        if (uStatus.includes("delivered")) targetStatus = "Delivered";
        if (uStatus.includes("read")) targetStatus = "Read";

        const snap = await dbGetDocs("whatsapp_logs");
        const matchDoc = snap.docs.find(doc => doc.data().messageId === msgId);
        if (matchDoc) {
          const updateData: any = { status: targetStatus };
          if (targetStatus === "Delivered") updateData.deliveredAt = new Date().toISOString();
          if (targetStatus === "Read") updateData.readAt = new Date().toISOString();
          await dbUpdateDoc("whatsapp_logs", matchDoc.id, updateData);
        }
      }

      res.status(200).send("OK");
    } catch (e) {
      console.error("Webhook processing failed:", e);
      res.status(500).send("Error");
    }
  });

  // 7. Admin API - Get all support tickets
  app.get("/api/admin/support-tickets", async (req, res) => {
    try {
      const snap = await dbGetDocs("support_tickets");
      const list = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const sorted = list.sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      res.json(sorted);
    } catch (err: any) {
      console.warn("Fetch support-tickets failed, returning fallback tickets list:", err.message);
      res.json(supportTickets);
    }
  });

  // 8. Admin API - Update support ticket status
  app.put("/api/admin/support-tickets/:id", async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    try {
      const ticketSnap = await dbGetDoc("support_tickets", id);
      if (!ticketSnap.exists) {
        return res.status(404).json({ error: "التذكرة غير موجودة" });
      }

      const updates: any = { updatedAt: new Date().toISOString() };
      if (status !== undefined) updates.status = status;

      await dbUpdateDoc("support_tickets", id, updates);
      res.json({ success: true, data: { id, ...ticketSnap.data(), ...updates } });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // 9. Admin API - Delete support ticket
  app.delete("/api/admin/support-tickets/:id", async (req, res) => {
    const { id } = req.params;
    try {
      const ticketSnap = await dbGetDoc("support_tickets", id);
      if (!ticketSnap.exists) {
        return res.status(404).json({ error: "التذكرة غير موجودة" });
      }

      await dbDeleteDoc("support_tickets", id);
      res.json({ success: true, message: "تم حذف تذكرة الدعم بنجاح" });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Handle Vite asset serving
  const isProduction = process.env.NODE_ENV === "production" || import.meta.url.includes("server.cjs");
  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
