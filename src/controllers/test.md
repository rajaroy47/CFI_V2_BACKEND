Your project is basically:

# “Taxation / CA / CS / Legal Services ERP + CRM + Client Portal”

Similar to platforms like:

* Vakilsearch
* IndiaFilings
* ClearTax

But customized for your own business model.

---

# FIRST IMPORTANT THING

For THIS level project:

❌ Do NOT make random models later
❌ Do NOT directly start coding
❌ Do NOT keep everything in one model

You need:

✅ Proper scalable architecture
✅ Modular design
✅ Role-based system
✅ Task workflow engine
✅ Service workflow
✅ Document management
✅ Notification system
✅ Payment system
✅ Chat system
✅ Audit system
✅ Settings system

---

# BEST TECH STACK FOR YOU

## Frontend

* React
* Vite
* TailwindCSS
* React Router
* Axios
* React Hook Form
* Zod
* TanStack Query
* Socket.io Client

---

## Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT
* Bcrypt
* Socket.io
* Razorpay
* Nodemailer
* Cloudinary / S3
* Redis (later)

---

## Database

* MongoDB Atlas

---

## Deployment

## Frontend

* Vercel / Hostinger

## Backend

* Railway / VPS / Render

(Do NOT use Vercel for large socket-heavy backend later)

---

# NOW THE MOST IMPORTANT PART

# DATABASE DESIGN

THIS is the core of your whole platform.

---

# MAIN ROLES

```bash id="z7af5s"
SUPER_ADMIN
ADMIN
EMPLOYEE
CLIENT
```

---

# MAIN MODULES

Your project will need these modules:

```bash id="tjlwm0"
1. Authentication
2. User Management
3. Role & Permission
4. Service Management
5. Service Plans
6. Orders
7. Payments
8. Client Portal
9. Employee Portal
10. Task Management
11. Document Upload
12. Chat System
13. Notifications
14. Website CMS
15. Invoice System
16. Activity Logs
17. Settings
18. Email System
19. Dashboard Analytics
20. Support Tickets
```

---

# REQUIRED MODELS

Here is the REAL scalable model structure.

---

# 1. User Model

Core authentication model.

```bash id="0g6k0v"
User
```

## Fields

```js id="1o7znj"
{
  fullName,
  email,
  phone,
  password,
  avatar,

  role, // super_admin, admin, employee, client

  isVerified,
  isBlocked,

  googleId,

  lastLogin,

  refreshToken,

  createdBy,

  permissions,

  employeeDetails,
  clientDetails,

  timestamps
}
```

---

# 2. Role Model

Dynamic RBAC.

```bash id="te0j3o"
Role
```

```js id="h8ow8d"
{
  name,
  permissions: [],
  description
}
```

---

# 3. Permission Model

Granular permission control.

```bash id="8s7f5l"
Permission
```

```js id="u8i7j2"
{
  module,
  actions: ["create", "read", "update", "delete"]
}
```

---

# 4. Service Model

Main services.

```bash id="f2n3ji"
Service
```

Examples:

* GST Registration
* ITR Filing
* Pvt Ltd Registration

```js id="jv0u42"
{
  title,
  slug,
  shortDescription,
  description,

  category,

  thumbnail,

  plans: [],

  requiredDocuments: [],

  faqs: [],

  isActive,

  seo,

  createdBy
}
```

---

# 5. Service Plan Model

VERY IMPORTANT.

```bash id="e53vxw"
ServicePlan
```

```js id="8l1z4x"
{
  serviceId,

  name, // Basic, Standard, Premium

  price,

  features: [],

  deliveryTime,

  revisions,

  isPopular
}
```

---

# 6. Order Model

Most important business model.

```bash id="sls0cl"
Order
```

```js id="9ozrbi"
{
  clientId,

  serviceId,
  planId,

  orderNumber,

  status,

  paymentStatus,

  assignedEmployee,

  totalAmount,

  notes,

  documents: [],

  milestones: [],

  timestamps
}
```

---

# ORDER STATUS FLOW

```bash id="v7f0uk"
PENDING
PAID
DOCUMENT_PENDING
IN_PROGRESS
UNDER_REVIEW
COMPLETED
DELIVERED
CANCELLED
```

---

# 7. Payment Model

```bash id="9vllml"
Payment
```

```js id="07px7j"
{
  orderId,
  clientId,

  razorpayOrderId,
  razorpayPaymentId,
  razorpaySignature,

  amount,

  status,

  paymentMethod,

  invoiceNumber,

  paidAt
}
```

---

# 8. Task Model

Employee workflow management.

```bash id="tfqoqr"
Task
```

```js id="7k8uhj"
{
  orderId,

  assignedBy,
  assignedTo,

  title,
  description,

  priority,

  status,

  dueDate,

  comments: []
}
```

---

# 9. Document Model

VERY IMPORTANT.

```bash id="1igx2z"
Document
```

```js id="s4n6es"
{
  orderId,

  uploadedBy,

  fileName,
  originalName,

  fileUrl,

  fileType,

  size,

  category,

  isVerified,

  remarks
}
```

---

# 10. Chat Model

Socket.io system.

```bash id="icv7r9"
Chat
```

```js id="r8m0tm"
{
  participants: [],

  lastMessage,

  lastMessageAt
}
```

---

# 11. Message Model

```bash id="5m1hmu"
Message
```

```js id="i1i6zi"
{
  chatId,

  sender,

  receiver,

  message,

  attachments: [],

  isRead
}
```

---

# 12. Notification Model

```bash id="qzjlwm"
Notification
```

```js id="h5pml0"
{
  userId,

  title,
  message,

  type,

  isRead,

  redirectUrl
}
```

---

# 13. Invoice Model

```bash id="4hqz1h"
Invoice
```

```js id="ocp2dc"
{
  orderId,

  invoiceNumber,

  amount,

  gstAmount,

  totalAmount,

  pdfUrl
}
```

---

# 14. Support Ticket Model

```bash id="lth3cs"
SupportTicket
```

```js id="5vbct8"
{
  clientId,

  subject,

  message,

  status,

  priority,

  assignedTo
}
```

---

# 15. Activity Log Model

VERY IMPORTANT FOR ADMIN.

```bash id="2v8rr0"
ActivityLog
```

```js id="8m5m9g"
{
  userId,

  action,

  module,

  metadata,

  ipAddress
}
```

---

# 16. Website CMS Model

For SUPER ADMIN customization.

```bash id="6e1n5j"
CMSPage
```

```js id="pwf8t8"
{
  title,

  slug,

  content,

  seo,

  isPublished
}
```

---

# 17. Website Settings Model

SUPER IMPORTANT.

```bash id="x9xjcl"
WebsiteSetting
```

```js id="17uxv8"
{
  siteName,
  logo,
  favicon,

  contactInfo,

  socialLinks,

  smtpSettings,

  razorpaySettings,

  seoDefaults,

  themeSettings,

  homepageSections
}
```

---

# 18. FAQ Model

```bash id="85fr2g"
FAQ
```

```js id="chzw1n"
{
  serviceId,

  question,

  answer,

  order
}
```

---

# 19. Email Template Model

```bash id="3j7hkp"
EmailTemplate
```

```js id="3aajx5"
{
  name,

  subject,

  body,

  variables
}
```

---

# 20. Audit Model

Track everything.

```bash id="jlwmoc"
AuditTrail
```

```js id="bykkng"
{
  action,

  performedBy,

  targetModel,

  targetId,

  oldData,

  newData
}
```

---

# MOST IMPORTANT ARCHITECTURE DECISION

DO THIS:

# Modular Architecture

NOT:

```bash id="pkwzfe"
controllers/
models/
routes/
```

For large SaaS use:

```bash id="b99sq0"
modules/

  auth/
  users/
  services/
  orders/
  payments/
  documents/
  chat/
  tasks/
  notifications/
  cms/
  settings/
```

Each module contains:

```bash id="4q0yeu"
controller
service
route
model
validation
middleware
utils
```

THIS is production architecture.

---

# CHAT SYSTEM

Use:

```bash id="hzjlwm"
Socket.io
```

Features:

✅ Real-time chat
✅ Seen status
✅ Typing status
✅ File sharing
✅ Admin-client communication
✅ Employee-client communication

---

# FILE STORAGE

Do NOT store files in server locally.

Use:

* [Cloudinary]
  OR
* [Amazon S3]

---

# PAYMENT SYSTEM

Use:

[Razorpay]

Flow:

```bash id="vhjlwm"
Create Order
→ Razorpay Payment
→ Verify Signature
→ Mark Paid
→ Create Task
→ Ask Documents
```

---

# AUTH SYSTEM

Use:

✅ JWT Access Token
✅ Refresh Token
✅ Google Login
✅ Email Verification
✅ Forgot Password
✅ OTP

---

# SECURITY

You MUST add:

```bash id="n9lhga"
helmet
express-rate-limit
xss-clean
hpp
mongo-sanitize
bcrypt
```

---

# FINAL RECOMMENDATION

Your project is NOT a beginner project anymore.

This is:

# Mid-to-Advanced SaaS ERP System

So build it slowly:

---

# PHASE 1

✅ Authentication
✅ Roles
✅ Services
✅ Plans
✅ Orders
✅ Razorpay

---

# PHASE 2

✅ Client Dashboard
✅ Document Upload
✅ Task Assignment
✅ Employee Panel

---

# PHASE 3

✅ Chat
✅ Notifications
✅ Invoice
✅ Email System

---

# PHASE 4

✅ CMS
✅ Analytics
✅ Audit Logs
✅ Full Automation

---

# VERY IMPORTANT

For scalability:

DO NOT tightly couple models.

Use:

```bash id="p40qie"
references
services
modular business logic
queues later
```

This architecture can easily scale to:

* 10 employees
* 100 employees
* thousands of clients

if built correctly from the beginning.









// ── Model Index ───────────────────────────────────────────────────────
// Import from here so you never need to remember individual file paths:
// import { User, Order, Payment } from "../models/index.js"

export { default as User } from "./user.model.js";
export { default as Role } from "./role.model.js";
export { default as Permission } from "./permission.model.js";
export { default as Service } from "./service.model.js";
export { default as ServicePlan } from "./servicePlan.model.js";
export { default as Order } from "./order.model.js";
export { default as Payment } from "./payment.model.js";
export { default as Task } from "./task.model.js";
export { default as Document } from "./document.model.js";
export { default as Chat } from "./chat.model.js";
export { default as Message } from "./message.model.js";
export { default as Notification } from "./notification.model.js";
export { default as Invoice } from "./invoice.model.js";
export { default as SupportTicket } from "./supportTicket.model.js";
export { default as ActivityLog } from "./activityLog.model.js";
export { default as AuditTrail } from "./auditTrail.model.js";
export { default as CMSPage } from "./cmsPage.model.js";
export { default as WebsiteSetting } from "./websiteSetting.model.js";
export { default as FAQ } from "./faq.model.js";
export { default as EmailTemplate } from "./emailTemplate.model.js";

// ── Named constants (re-exported for convenience) ─────────────────────
export { ORDER_STATUS, PAYMENT_STATUS } from "./order.model.js";
export { PAYMENT_METHODS } from "./payment.model.js";
export { ACTIONS } from "./activityLog.model.js";
export { EMAIL_TEMPLATES } from "./emailTemplate.model.js";








<!-- MODELS -->
================

import mongoose from "mongoose";
import bcrypt from "bcrypt";

const employeeDetailsSchema = new mongoose.Schema(
  {
    department: { type: String, default: "" },
    designation: { type: String, default: "" },
    salary: { type: Number, default: 0 },
    joiningDate: { type: Date },
    employeeCode: { type: String, default: "" },
  },
  { _id: false }
);

const clientDetailsSchema = new mongoose.Schema(
  {
    gstNumber: { type: String, default: "" },
    panNumber: { type: String, default: "" },
    aadhaarNumber: { type: String, default: "" },
    companyName: { type: String, default: "" },
    businessType: { type: String, default: "" },
    address: {
      street: { type: String, default: "" },
      city: { type: String, default: "" },
      state: { type: String, default: "" },
      pincode: { type: String, default: "" },
      country: { type: String, default: "India" },
    },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    phone: {
      type: String,
      trim: true,
      default: "",
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      select: false, // never returned in queries by default
    },
    avatar: {
      type: String,
      default: "",
    },

    // ── Access Control ──────────────────────────────────────────────
    role: {
      type: String,
      enum: ["super_admin", "admin", "employee", "client"],
      default: "client",
    },
    permissions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Permission",
      },
    ],
    isVerified: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false },

    // ── OAuth ───────────────────────────────────────────────────────
    googleId: { type: String, default: "" },

    // ── Auth Tokens ─────────────────────────────────────────────────
    refreshToken: { type: String, select: false },
    emailVerificationToken: { type: String, select: false },
    emailVerificationExpiry: { type: Date, select: false },
    passwordResetToken: { type: String, select: false },
    passwordResetExpiry: { type: Date, select: false },

    lastLogin: { type: Date },

    // ── Role-specific Sub-documents ─────────────────────────────────
    employeeDetails: { type: employeeDetailsSchema, default: () => ({}) },
    clientDetails: { type: clientDetailsSchema, default: () => ({}) },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { timestamps: true }
);

// ── Indexes ──────────────────────────────────────────────────────────
userSchema.index({ role: 1 });
userSchema.index({ isBlocked: 1 });

// ── Hash password before save ────────────────────────────────────────
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// ── Instance Methods ─────────────────────────────────────────────────
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.isEmployee = function () {
  return ["employee", "admin", "super_admin"].includes(this.role);
};

userSchema.methods.isAdmin = function () {
  return ["admin", "super_admin"].includes(this.role);
};

const User = mongoose.model("User", userSchema);
export default User;




 

 ===========================================


import mongoose from "mongoose";

// ── Order Status FSM ──────────────────────────────────────────────────
// PENDING → PAID → DOCUMENT_PENDING → IN_PROGRESS
//         → UNDER_REVIEW → COMPLETED → DELIVERED
//         → CANCELLED (from any state by admin)
export const ORDER_STATUS = {
  PENDING: "PENDING",
  PAID: "PAID",
  DOCUMENT_PENDING: "DOCUMENT_PENDING",
  IN_PROGRESS: "IN_PROGRESS",
  UNDER_REVIEW: "UNDER_REVIEW",
  COMPLETED: "COMPLETED",
  DELIVERED: "DELIVERED",
  CANCELLED: "CANCELLED",
};

export const PAYMENT_STATUS = {
  UNPAID: "unpaid",
  PAID: "paid",
  REFUNDED: "refunded",
  FAILED: "failed",
};

const milestoneSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    note: { type: String, default: "" },
    completedAt: { type: Date, default: null },
    completedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { _id: true, timestamps: false }
);

const orderSchema = new mongoose.Schema(
  {
    // ── Core ───────────────────────────────────────────────────────
    orderNumber: {
      type: String,
      unique: true,
      index: true,
      // e.g. ORD-20250001 — generated in pre-save hook
    },
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Client reference is required"],
      index: true,
    },
    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: [true, "Service reference is required"],
    },
    planId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ServicePlan",
      required: [true, "Plan reference is required"],
    },

    // ── Status ─────────────────────────────────────────────────────
    status: {
      type: String,
      enum: Object.values(ORDER_STATUS),
      default: ORDER_STATUS.PENDING,
      index: true,
    },
    paymentStatus: {
      type: String,
      enum: Object.values(PAYMENT_STATUS),
      default: PAYMENT_STATUS.UNPAID,
    },
    assignedEmployee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    // ── Financials (snapshot at time of order) ──────────────────────
    baseAmount: {
      type: Number,
      required: [true, "Base amount is required"],
    },
    gstAmount: {
      type: Number,
      default: 0,
    },
    finalAmount: {
      type: Number,
      required: [true, "Final amount is required"],
    },

    // ── Content ────────────────────────────────────────────────────
    notes: {
      type: String,
      default: "", // client notes at checkout
    },
    adminNotes: {
      type: String,
      default: "", // internal notes (not visible to client)
    },
    documents: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Document",
      },
    ],
    milestones: {
      type: [milestoneSchema],
      default: [],
    },

    // ── Cancellation ───────────────────────────────────────────────
    cancelledAt: { type: Date, default: null },
    cancelReason: { type: String, default: "" },
    cancelledBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    // ── Delivery ───────────────────────────────────────────────────
    deliveredAt: { type: Date, default: null },
    expectedDelivery: { type: Date, default: null },
  },
  { timestamps: true }
);

// ── Auto-generate order number ────────────────────────────────────────
orderSchema.pre("save", async function (next) {
  if (this.isNew) {
    const count = await mongoose.model("Order").countDocuments();
    const year = new Date().getFullYear();
    this.orderNumber = `ORD-${year}${String(count + 1).padStart(4, "0")}`;
  }
  next();
});

orderSchema.index({ clientId: 1, status: 1 });
orderSchema.index({ assignedEmployee: 1, status: 1 });
orderSchema.index({ createdAt: -1 });

const Order = mongoose.model("Order", orderSchema);
export default Order;













===========================


import mongoose from "mongoose";

export const PAYMENT_METHODS = {
  UPI: "upi",
  CARD: "card",
  NETBANKING: "netbanking",
  WALLET: "wallet",
  EMI: "emi",
  CASH: "cash", // offline payments recorded manually
};

const paymentSchema = new mongoose.Schema(
  {
    // ── References ─────────────────────────────────────────────────
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: [true, "Order reference is required"],
      index: true,
    },
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Client reference is required"],
      index: true,
    },

    // ── Razorpay Fields ────────────────────────────────────────────
    razorpayOrderId: {
      type: String,
      default: "", // returned by Razorpay when creating an order
    },
    razorpayPaymentId: {
      type: String,
      default: "", // returned after successful capture
    },
    razorpaySignature: {
      type: String,
      select: false, // sensitive — exclude from default queries
    },

    // ── Amount ─────────────────────────────────────────────────────
    amount: {
      type: Number,
      required: [true, "Amount is required"],
      // stored in PAISE (multiply by 100 before sending to Razorpay)
    },
    currency: {
      type: String,
      default: "INR",
    },

    // ── Status ─────────────────────────────────────────────────────
    status: {
      type: String,
      enum: ["created", "paid", "failed", "refunded"],
      default: "created",
      index: true,
    },
    paymentMethod: {
      type: String,
      enum: Object.values(PAYMENT_METHODS),
      default: null,
    },

    // ── Invoice Link ───────────────────────────────────────────────
    invoiceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Invoice",
      default: null,
    },

    // ── Refund ─────────────────────────────────────────────────────
    refundId: {
      type: String,
      default: "", // Razorpay refund ID
    },
    refundAmount: {
      type: Number,
      default: 0,
    },
    refundReason: {
      type: String,
      default: "",
    },
    refundedAt: { type: Date, default: null },

    paidAt: { type: Date, default: null },

    // ── For manual / offline payments ──────────────────────────────
    isManual: {
      type: Boolean,
      default: false,
    },
    manualNote: {
      type: String,
      default: "",
    },
    recordedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null, // admin who recorded manual payment
    },
  },
  { timestamps: true }
);

paymentSchema.index({ razorpayOrderId: 1 });
paymentSchema.index({ status: 1, createdAt: -1 });

const Payment = mongoose.model("Payment", paymentSchema);
export default Payment;









======================================================


import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      required: true,
      trim: true,
    },
    attachments: {
      type: [String],
      default: [], // file URLs
    },
  },
  { timestamps: true }
);

const taskSchema = new mongoose.Schema(
  {
    // ── References ─────────────────────────────────────────────────
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: [true, "Order reference is required"],
      index: true,
    },
    assignedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Assigned by is required"],
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Assigned to is required"],
      index: true,
    },

    // ── Task Details ───────────────────────────────────────────────
    title: {
      type: String,
      required: [true, "Task title is required"],
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },

    // ── Tracking ───────────────────────────────────────────────────
    priority: {
      type: String,
      enum: ["low", "medium", "high", "urgent"],
      default: "medium",
    },
    status: {
      type: String,
      enum: ["todo", "in_progress", "review", "done", "cancelled"],
      default: "todo",
      index: true,
    },
    dueDate: {
      type: Date,
      default: null,
    },
    completedAt: {
      type: Date,
      default: null,
    },

    // ── Comments / Thread ──────────────────────────────────────────
    comments: {
      type: [commentSchema],
      default: [],
    },

    // ── Internal ───────────────────────────────────────────────────
    tags: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

// Auto-set completedAt when status → done
taskSchema.pre("save", function (next) {
  if (this.isModified("status") && this.status === "done" && !this.completedAt) {
    this.completedAt = new Date();
  }
  next();
});

taskSchema.index({ assignedTo: 1, status: 1 });
taskSchema.index({ orderId: 1, status: 1 });
taskSchema.index({ dueDate: 1 });

const Task = mongoose.model("Task", taskSchema);
export default Task;





===========================================


import mongoose from "mongoose";

const documentSchema = new mongoose.Schema(
  {
    // ── References ─────────────────────────────────────────────────
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: [true, "Order reference is required"],
      index: true,
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Uploader reference is required"],
    },

    // ── File Info ──────────────────────────────────────────────────
    fileName: {
      type: String,
      required: [true, "File name is required"],
      // sanitized name stored on cloud
    },
    originalName: {
      type: String,
      required: [true, "Original file name is required"],
      // as received from client
    },
    fileUrl: {
      type: String,
      required: [true, "File URL is required"],
      // Cloudinary secure URL
    },
    publicId: {
      type: String,
      default: "",
      // Cloudinary public_id — needed for deletion
    },
    fileType: {
      type: String,
      required: [true, "File type is required"],
      enum: ["pdf", "jpg", "jpeg", "png", "docx", "xlsx", "zip", "other"],
    },
    mimeType: {
      type: String,
      default: "",
    },
    size: {
      type: Number,
      required: [true, "File size is required"],
      // in bytes
    },

    // ── Categorisation ─────────────────────────────────────────────
    category: {
      type: String,
      enum: [
        "identity",      // Aadhaar, PAN, Passport
        "address",       // Utility bill, rental agreement
        "financial",     // Bank statement, ITR, balance sheet
        "business",      // MOA, AOA, partnership deed
        "government",    // GST cert, CIN, FSSAI
        "output",        // Documents produced by employee (final deliverables)
        "other",
      ],
      default: "other",
    },

    // ── Verification ───────────────────────────────────────────────
    isVerified: {
      type: Boolean,
      default: false,
    },
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    verifiedAt: {
      type: Date,
      default: null,
    },
    remarks: {
      type: String,
      default: "", // rejection reason or request note
    },

    // ── Visibility ─────────────────────────────────────────────────
    uploadedByRole: {
      type: String,
      enum: ["client", "employee", "admin"],
      required: true,
    },
    isVisibleToClient: {
      type: Boolean,
      default: true,
      // output docs from employees are visible; internal docs may not be
    },
  },
  { timestamps: true }
);

documentSchema.index({ orderId: 1, category: 1 });
documentSchema.index({ uploadedBy: 1 });

const Document = mongoose.model("Document", documentSchema);
export default Document;






========================================

import mongoose from "mongoose";

const roleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Role name is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    permissions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Permission",
      },
    ],
    description: {
      type: String,
      default: "",
    },
    isDefault: {
      type: Boolean,
      default: false, // true = system role, cannot be deleted
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { timestamps: true }
);

const Role = mongoose.model("Role", roleSchema);
export default Role;





======================================================



import mongoose from "mongoose";

const MODULES = [
  "users",
  "roles",
  "services",
  "orders",
  "payments",
  "tasks",
  "documents",
  "chat",
  "notifications",
  "invoices",
  "support_tickets",
  "activity_logs",
  "audit_trails",
  "cms",
  "settings",
  "faqs",
  "email_templates",
  "dashboard",
];

const permissionSchema = new mongoose.Schema(
  {
    module: {
      type: String,
      required: [true, "Module is required"],
      enum: MODULES,
    },
    actions: {
      type: [String],
      enum: ["create", "read", "update", "delete"],
      default: ["read"],
    },
    description: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

// Prevent duplicate module entries
permissionSchema.index({ module: 1 }, { unique: true });

const Permission = mongoose.model("Permission", permissionSchema);
export default Permission;




=============================================




import mongoose from "mongoose";
import slugify from "slugify";

const seoSchema = new mongoose.Schema(
  {
    metaTitle: { type: String, default: "" },
    metaDescription: { type: String, default: "" },
    keywords: { type: [String], default: [] },
  },
  { _id: false }
);

const serviceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Service title is required"],
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      index: true,
    },
    shortDescription: {
      type: String,
      default: "",
      maxlength: [300, "Short description cannot exceed 300 characters"],
    },
    description: {
      type: String,
      default: "", // rich text / markdown
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: [
        "gst",
        "income_tax",
        "company_registration",
        "trademark",
        "legal",
        "compliance",
        "accounting",
        "other",
      ],
    },
    thumbnail: {
      type: String,
      default: "", // Cloudinary URL
    },

    // ── Relations ────────────────────────────────────────────────────
    plans: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ServicePlan",
      },
    ],
    faqs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "FAQ",
      },
    ],

    // ── Document Checklist (shown to client on order) ────────────────
    requiredDocuments: {
      type: [String],
      default: [],
    },

    // ── Meta ─────────────────────────────────────────────────────────
    isActive: {
      type: Boolean,
      default: true,
    },
    seo: {
      type: seoSchema,
      default: () => ({}),
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

// ── Auto-generate slug from title ─────────────────────────────────────
serviceSchema.pre("save", function (next) {
  if (this.isModified("title") && !this.slug) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  next();
});

serviceSchema.index({ category: 1, isActive: 1 });

const Service = mongoose.model("Service", serviceSchema);
export default Service;



==================================





import mongoose from "mongoose";

const servicePlanSchema = new mongoose.Schema(
  {
    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: [true, "Service reference is required"],
      index: true,
    },
    name: {
      type: String,
      required: [true, "Plan name is required"],
      enum: ["Basic", "Standard", "Premium"],
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    features: {
      type: [String],
      default: [], // bullet points shown on pricing card
    },
    deliveryTime: {
      type: Number,
      required: [true, "Delivery time is required"],
      min: [1, "Delivery time must be at least 1 day"],
      // in business days
    },
    revisions: {
      type: Number,
      default: 0,
    },
    isPopular: {
      type: Boolean,
      default: false, // shows "Most Popular" badge
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Only one plan of each tier per service
servicePlanSchema.index({ serviceId: 1, name: 1 }, { unique: true });

const ServicePlan = mongoose.model("ServicePlan", servicePlanSchema);
export default ServicePlan;





=====================================



import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    // ── Participants ────────────────────────────────────────────────
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],

    // ── Context (optional) ─────────────────────────────────────────
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      default: null,
      // links conversation to a specific order
    },

    // ── Last Message Preview ───────────────────────────────────────
    lastMessage: {
      type: String,
      default: "",
    },
    lastMessageAt: {
      type: Date,
      default: null,
      index: true,
    },
    lastMessageBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    // ── Status ─────────────────────────────────────────────────────
    isActive: {
      type: Boolean,
      default: true,
    },

    // ── Unread Counts Per Participant ──────────────────────────────
    unreadCounts: {
      type: Map,
      of: Number,
      default: {},
      // { "userId_string": count }
    },
  },
  { timestamps: true }
);

// Compound index to find existing chat between two participants efficiently
chatSchema.index({ participants: 1 });
chatSchema.index({ orderId: 1 });
chatSchema.index({ lastMessageAt: -1 });

const Chat = mongoose.model("Chat", chatSchema);
export default Chat;




===============================



import mongoose from "mongoose";

const attachmentSchema = new mongoose.Schema(
  {
    fileUrl: { type: String, required: true },
    fileName: { type: String, required: true },
    fileType: { type: String, default: "other" },
    size: { type: Number, default: 0 },
  },
  { _id: false }
);

const messageSchema = new mongoose.Schema(
  {
    // ── Thread ─────────────────────────────────────────────────────
    chatId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
      required: [true, "Chat reference is required"],
      index: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Sender is required"],
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Receiver is required"],
    },

    // ── Content ────────────────────────────────────────────────────
    message: {
      type: String,
      default: "",
      trim: true,
    },
    type: {
      type: String,
      enum: ["text", "file", "image", "system"],
      default: "text",
    },
    attachments: {
      type: [attachmentSchema],
      default: [],
    },

    // ── Read Status ────────────────────────────────────────────────
    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },
    readAt: {
      type: Date,
      default: null,
    },

    // ── Soft Delete ────────────────────────────────────────────────
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

messageSchema.index({ chatId: 1, createdAt: -1 });
messageSchema.index({ sender: 1 });

const Message = mongoose.model("Message", messageSchema);
export default Message;




========================


import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    // ── Recipient ──────────────────────────────────────────────────
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Recipient user is required"],
      index: true,
    },

    // ── Content ────────────────────────────────────────────────────
    title: {
      type: String,
      required: [true, "Title is required"],
    },
    message: {
      type: String,
      required: [true, "Message is required"],
    },

    // ── Type ───────────────────────────────────────────────────────
    type: {
      type: String,
      enum: [
        "order",        // order placed, status changed
        "payment",      // payment received, failed
        "task",         // task assigned, due
        "document",     // doc uploaded, verified, rejected
        "chat",         // new message
        "ticket",       // support ticket update
        "system",       // announcements, maintenance
      ],
      required: true,
    },

    // ── Read Status ────────────────────────────────────────────────
    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },
    readAt: {
      type: Date,
      default: null,
    },

    // ── Navigation ─────────────────────────────────────────────────
    redirectUrl: {
      type: String,
      default: "",
      // e.g. /client/orders/123  or  /admin/tasks/456
    },

    // ── Actor (who triggered this notification) ────────────────────
    triggeredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    // ── Related Entity ─────────────────────────────────────────────
    relatedModel: {
      type: String,
      enum: ["Order", "Payment", "Task", "Document", "Chat", "SupportTicket"],
      default: null,
    },
    relatedId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },
  },
  { timestamps: true }
);

notificationSchema.index({ userId: 1, isRead: 1 });
notificationSchema.index({ userId: 1, createdAt: -1 });

const Notification = mongoose.model("Notification", notificationSchema);
export default Notification;





==================================



import mongoose from "mongoose";

const lineItemSchema = new mongoose.Schema(
  {
    description: { type: String, required: true },
    quantity: { type: Number, default: 1 },
    unitPrice: { type: Number, required: true },
    amount: { type: Number, required: true },
  },
  { _id: false }
);

const invoiceSchema = new mongoose.Schema(
  {
    // ── References ─────────────────────────────────────────────────
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: [true, "Order reference is required"],
      index: true,
    },
    paymentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Payment",
      default: null,
    },
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Client reference is required"],
      index: true,
    },

    // ── Invoice Number ─────────────────────────────────────────────
    invoiceNumber: {
      type: String,
      unique: true,
      index: true,
      // e.g. INV-2025-0001 — generated in pre-save hook
    },

    // ── Amounts ────────────────────────────────────────────────────
    lineItems: {
      type: [lineItemSchema],
      default: [],
    },
    baseAmount: {
      type: Number,
      required: [true, "Base amount is required"],
    },
    discountAmount: {
      type: Number,
      default: 0,
    },
    gstRate: {
      type: Number,
      default: 18, // percentage
    },
    gstAmount: {
      type: Number,
      default: 0,
    },
    totalAmount: {
      type: Number,
      required: [true, "Total amount is required"],
    },

    // ── PDF ────────────────────────────────────────────────────────
    pdfUrl: {
      type: String,
      default: "", // Cloudinary URL after generation
    },

    // ── Dates ──────────────────────────────────────────────────────
    issuedAt: {
      type: Date,
      default: Date.now,
    },
    dueDate: {
      type: Date,
      default: null,
    },

    // ── Status ─────────────────────────────────────────────────────
    status: {
      type: String,
      enum: ["draft", "issued", "paid", "cancelled"],
      default: "draft",
    },

    // ── Business Info snapshot (so it survives setting changes) ────
    businessInfo: {
      name: { type: String, default: "" },
      gstin: { type: String, default: "" },
      address: { type: String, default: "" },
      email: { type: String, default: "" },
      phone: { type: String, default: "" },
    },
  },
  { timestamps: true }
);

// ── Auto-generate invoice number ──────────────────────────────────────
invoiceSchema.pre("save", async function (next) {
  if (this.isNew && !this.invoiceNumber) {
    const count = await mongoose.model("Invoice").countDocuments();
    const year = new Date().getFullYear();
    this.invoiceNumber = `INV-${year}-${String(count + 1).padStart(4, "0")}`;
  }
  next();
});

const Invoice = mongoose.model("Invoice", invoiceSchema);
export default Invoice;




==========================================


import mongoose from "mongoose";

const replySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    attachments: {
      type: [String],
      default: [],
    },
    isStaff: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const supportTicketSchema = new mongoose.Schema(
  {
    // ── References ─────────────────────────────────────────────────
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Client reference is required"],
      index: true,
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    // ── Ticket Info ────────────────────────────────────────────────
    ticketNumber: {
      type: String,
      unique: true,
      index: true,
      // e.g. TKT-0001 — generated in pre-save hook
    },
    subject: {
      type: String,
      required: [true, "Subject is required"],
      trim: true,
      maxlength: [200, "Subject too long"],
    },
    message: {
      type: String,
      required: [true, "Message is required"],
    },

    // ── Status & Priority ──────────────────────────────────────────
    status: {
      type: String,
      enum: ["open", "in_progress", "waiting_on_client", "resolved", "closed"],
      default: "open",
      index: true,
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "critical"],
      default: "medium",
    },

    // ── Category ───────────────────────────────────────────────────
    category: {
      type: String,
      enum: ["payment", "order", "document", "technical", "general"],
      default: "general",
    },

    // ── Linked Order (optional) ────────────────────────────────────
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      default: null,
    },

    // ── Replies ────────────────────────────────────────────────────
    replies: {
      type: [replySchema],
      default: [],
    },

    // ── Resolution ─────────────────────────────────────────────────
    resolvedAt: { type: Date, default: null },
    resolvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    resolution: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

// ── Auto-generate ticket number ───────────────────────────────────────
supportTicketSchema.pre("save", async function (next) {
  if (this.isNew && !this.ticketNumber) {
    const count = await mongoose.model("SupportTicket").countDocuments();
    this.ticketNumber = `TKT-${String(count + 1).padStart(4, "0")}`;
  }
  next();
});

supportTicketSchema.index({ clientId: 1, status: 1 });
supportTicketSchema.index({ assignedTo: 1, status: 1 });

const SupportTicket = mongoose.model("SupportTicket", supportTicketSchema);
export default SupportTicket;




=========================


import mongoose from "mongoose";

// Predefined action constants — use these in your services, never raw strings
export const ACTIONS = {
  // Auth
  LOGIN: "LOGIN",
  LOGOUT: "LOGOUT",
  REGISTER: "REGISTER",
  PASSWORD_RESET: "PASSWORD_RESET",
  EMAIL_VERIFIED: "EMAIL_VERIFIED",

  // Orders
  ORDER_CREATED: "ORDER_CREATED",
  ORDER_STATUS_CHANGED: "ORDER_STATUS_CHANGED",
  ORDER_ASSIGNED: "ORDER_ASSIGNED",
  ORDER_CANCELLED: "ORDER_CANCELLED",
  ORDER_DELIVERED: "ORDER_DELIVERED",

  // Payments
  PAYMENT_INITIATED: "PAYMENT_INITIATED",
  PAYMENT_SUCCESS: "PAYMENT_SUCCESS",
  PAYMENT_FAILED: "PAYMENT_FAILED",
  REFUND_INITIATED: "REFUND_INITIATED",

  // Documents
  DOCUMENT_UPLOADED: "DOCUMENT_UPLOADED",
  DOCUMENT_VERIFIED: "DOCUMENT_VERIFIED",
  DOCUMENT_REJECTED: "DOCUMENT_REJECTED",
  DOCUMENT_DELETED: "DOCUMENT_DELETED",

  // Tasks
  TASK_CREATED: "TASK_CREATED",
  TASK_ASSIGNED: "TASK_ASSIGNED",
  TASK_STATUS_CHANGED: "TASK_STATUS_CHANGED",
  TASK_COMPLETED: "TASK_COMPLETED",

  // Users
  USER_CREATED: "USER_CREATED",
  USER_BLOCKED: "USER_BLOCKED",
  USER_UNBLOCKED: "USER_UNBLOCKED",
  USER_ROLE_CHANGED: "USER_ROLE_CHANGED",

  // Services
  SERVICE_CREATED: "SERVICE_CREATED",
  SERVICE_UPDATED: "SERVICE_UPDATED",
  SERVICE_DEACTIVATED: "SERVICE_DEACTIVATED",

  // Support
  TICKET_CREATED: "TICKET_CREATED",
  TICKET_RESOLVED: "TICKET_RESOLVED",
};

const activityLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Actor user is required"],
      index: true,
    },
    action: {
      type: String,
      required: [true, "Action is required"],
      enum: Object.values(ACTIONS),
    },
    module: {
      type: String,
      required: [true, "Module is required"],
      enum: [
        "auth",
        "users",
        "orders",
        "payments",
        "documents",
        "tasks",
        "services",
        "support",
        "settings",
        "cms",
      ],
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
      // Any relevant data: { orderId, oldStatus, newStatus, ... }
    },
    ipAddress: {
      type: String,
      default: "",
    },
    userAgent: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
    // Logs are append-only — never update a log entry
  }
);

activityLogSchema.index({ userId: 1, createdAt: -1 });
activityLogSchema.index({ action: 1 });
activityLogSchema.index({ module: 1, createdAt: -1 });
// TTL: auto-delete logs older than 1 year (optional)
// activityLogSchema.index({ createdAt: 1 }, { expireAfterSeconds: 31536000 });

const ActivityLog = mongoose.model("ActivityLog", activityLogSchema);
export default ActivityLog;




===============================



import mongoose from "mongoose";

const auditTrailSchema = new mongoose.Schema(
  {
    // ── Who ────────────────────────────────────────────────────────
    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Performer is required"],
      index: true,
    },

    // ── What ───────────────────────────────────────────────────────
    action: {
      type: String,
      enum: ["CREATE", "UPDATE", "DELETE", "RESTORE"],
      required: [true, "Action is required"],
    },

    // ── Which Model / Document ─────────────────────────────────────
    targetModel: {
      type: String,
      required: [true, "Target model name is required"],
      enum: [
        "User",
        "Role",
        "Permission",
        "Service",
        "ServicePlan",
        "Order",
        "Payment",
        "Task",
        "Document",
        "Invoice",
        "SupportTicket",
        "CMSPage",
        "WebsiteSetting",
        "FAQ",
        "EmailTemplate",
      ],
    },
    targetId: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "Target document ID is required"],
      index: true,
    },

    // ── Change Snapshot ────────────────────────────────────────────
    oldData: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
      // null for CREATE actions
    },
    newData: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
      // null for DELETE actions
    },

    // ── Changed Fields List ────────────────────────────────────────
    changedFields: {
      type: [String],
      default: [],
      // ["status", "assignedEmployee"] — quick filter
    },

    // ── Context ────────────────────────────────────────────────────
    ip: {
      type: String,
      default: "",
    },
    userAgent: {
      type: String,
      default: "",
    },
    reason: {
      type: String,
      default: "",
      // optional human-readable reason for the change
    },
  },
  {
    timestamps: true,
    // Audit trails are immutable — never update
  }
);

auditTrailSchema.index({ targetModel: 1, targetId: 1, createdAt: -1 });
auditTrailSchema.index({ performedBy: 1, createdAt: -1 });
auditTrailSchema.index({ action: 1 });

const AuditTrail = mongoose.model("AuditTrail", auditTrailSchema);
export default AuditTrail;




========================================



import mongoose from "mongoose";
import slugify from "slugify";

const seoSchema = new mongoose.Schema(
  {
    metaTitle: { type: String, default: "" },
    metaDescription: { type: String, default: "" },
    keywords: { type: [String], default: [] },
    ogImage: { type: String, default: "" },
  },
  { _id: false }
);

const cmsPageSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Page title is required"],
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      index: true,
      // e.g. "about-us", "privacy-policy"
    },
    content: {
      type: String,
      default: "",
      // rich text HTML or markdown — rendered by frontend
    },
    excerpt: {
      type: String,
      default: "",
      maxlength: [500, "Excerpt too long"],
    },
    seo: {
      type: seoSchema,
      default: () => ({}),
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    publishedAt: {
      type: Date,
      default: null,
    },

    // ── System pages cannot be deleted ────────────────────────────
    isSystem: {
      type: Boolean,
      default: false,
      // true = built-in page (About, Privacy, Terms) — cannot be deleted by admin
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { timestamps: true }
);

// ── Auto-generate slug from title ─────────────────────────────────────
cmsPageSchema.pre("save", function (next) {
  if (this.isModified("title") && !this.slug) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  if (this.isModified("isPublished") && this.isPublished && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  next();
});

const CMSPage = mongoose.model("CMSPage", cmsPageSchema);
export default CMSPage;




===========================



import mongoose from "mongoose";

// ── SINGLETON MODEL ───────────────────────────────────────────────────
// Only ONE document should ever exist in this collection.
// Always query with WebsiteSetting.findOne() or use the static getSetting().

const smtpSchema = new mongoose.Schema(
  {
    host: { type: String, default: "" },
    port: { type: Number, default: 587 },
    user: { type: String, default: "" },
    pass: { type: String, default: "", select: false },
    from: { type: String, default: "" }, // "Company Name <noreply@example.com>"
    secure: { type: Boolean, default: false },
  },
  { _id: false }
);

const razorpaySchema = new mongoose.Schema(
  {
    keyId: { type: String, default: "", select: false },
    keySecret: { type: String, default: "", select: false },
    webhookSecret: { type: String, default: "", select: false },
    isLive: { type: Boolean, default: false }, // false = test mode
  },
  { _id: false }
);

const cloudinarySchema = new mongoose.Schema(
  {
    cloudName: { type: String, default: "", select: false },
    apiKey: { type: String, default: "", select: false },
    apiSecret: { type: String, default: "", select: false },
    folder: { type: String, default: "erp_uploads" },
  },
  { _id: false }
);

const seoDefaultsSchema = new mongoose.Schema(
  {
    metaTitle: { type: String, default: "" },
    metaDescription: { type: String, default: "" },
    ogImage: { type: String, default: "" },
    keywords: { type: [String], default: [] },
  },
  { _id: false }
);

const homepageSectionSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["hero", "services", "about", "testimonials", "faq", "cta", "stats"],
      required: true,
    },
    isVisible: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
    customData: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { _id: false }
);

const websiteSettingSchema = new mongoose.Schema(
  {
    // ── Branding ───────────────────────────────────────────────────
    siteName: { type: String, default: "My CA Firm" },
    tagline: { type: String, default: "" },
    logo: { type: String, default: "" },           // Cloudinary URL
    logoDark: { type: String, default: "" },        // dark mode variant
    favicon: { type: String, default: "" },

    // ── Contact ────────────────────────────────────────────────────
    contactInfo: {
      email: { type: String, default: "" },
      phone: { type: String, default: "" },
      whatsapp: { type: String, default: "" },
      address: { type: String, default: "" },
      city: { type: String, default: "" },
      state: { type: String, default: "" },
      pincode: { type: String, default: "" },
      mapEmbedUrl: { type: String, default: "" },
    },

    // ── Social Links ───────────────────────────────────────────────
    socialLinks: {
      facebook: { type: String, default: "" },
      twitter: { type: String, default: "" },
      instagram: { type: String, default: "" },
      linkedin: { type: String, default: "" },
      youtube: { type: String, default: "" },
    },

    // ── Business Info (for invoices) ───────────────────────────────
    businessInfo: {
      gstin: { type: String, default: "" },
      pan: { type: String, default: "" },
      registrationNumber: { type: String, default: "" },
    },

    // ── Integrations ───────────────────────────────────────────────
    smtpSettings: { type: smtpSchema, default: () => ({}) },
    razorpaySettings: { type: razorpaySchema, default: () => ({}) },
    cloudinarySettings: { type: cloudinarySchema, default: () => ({}) },

    // ── SEO ────────────────────────────────────────────────────────
    seoDefaults: { type: seoDefaultsSchema, default: () => ({}) },

    // ── Theme ──────────────────────────────────────────────────────
    themeSettings: {
      primaryColor: { type: String, default: "#0F6E56" },
      secondaryColor: { type: String, default: "#1D9E75" },
      fontFamily: { type: String, default: "Inter" },
    },

    // ── Homepage Sections Order & Visibility ───────────────────────
    homepageSections: {
      type: [homepageSectionSchema],
      default: () => [
        { type: "hero", isVisible: true, order: 1 },
        { type: "services", isVisible: true, order: 2 },
        { type: "stats", isVisible: true, order: 3 },
        { type: "about", isVisible: true, order: 4 },
        { type: "testimonials", isVisible: true, order: 5 },
        { type: "faq", isVisible: true, order: 6 },
        { type: "cta", isVisible: true, order: 7 },
      ],
    },

    // ── Maintenance ────────────────────────────────────────────────
    isMaintenanceMode: { type: Boolean, default: false },
    maintenanceMessage: { type: String, default: "" },
  },
  { timestamps: true }
);

// ── Static helper — always use this to get the singleton ─────────────
websiteSettingSchema.statics.getSetting = async function () {
  let setting = await this.findOne();
  if (!setting) {
    setting = await this.create({});
  }
  return setting;
};

const WebsiteSetting = mongoose.model("WebsiteSetting", websiteSettingSchema);
export default WebsiteSetting;









================================



import mongoose from "mongoose";

const faqSchema = new mongoose.Schema(
  {
    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      default: null,
      index: true,
      // null = global FAQ (shown on FAQ page)
      // set = service-specific FAQ (shown on service page)
    },
    question: {
      type: String,
      required: [true, "Question is required"],
      trim: true,
    },
    answer: {
      type: String,
      required: [true, "Answer is required"],
    },
    order: {
      type: Number,
      default: 0,
      // lower number = shown first
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { timestamps: true }
);

faqSchema.index({ serviceId: 1, order: 1, isActive: 1 });

const FAQ = mongoose.model("FAQ", faqSchema);
export default FAQ;



===================================


import mongoose from "mongoose";

// ── Built-in template name constants ─────────────────────────────────
// Use these keys in your mailer service — never raw strings
export const EMAIL_TEMPLATES = {
  WELCOME: "WELCOME",
  EMAIL_VERIFICATION: "EMAIL_VERIFICATION",
  FORGOT_PASSWORD: "FORGOT_PASSWORD",
  PASSWORD_CHANGED: "PASSWORD_CHANGED",

  ORDER_PLACED: "ORDER_PLACED",
  ORDER_ASSIGNED: "ORDER_ASSIGNED",
  ORDER_STATUS_CHANGED: "ORDER_STATUS_CHANGED",
  ORDER_COMPLETED: "ORDER_COMPLETED",
  ORDER_DELIVERED: "ORDER_DELIVERED",
  ORDER_CANCELLED: "ORDER_CANCELLED",

  PAYMENT_SUCCESS: "PAYMENT_SUCCESS",
  PAYMENT_FAILED: "PAYMENT_FAILED",
  INVOICE_GENERATED: "INVOICE_GENERATED",

  DOCUMENT_REQUEST: "DOCUMENT_REQUEST",
  DOCUMENT_VERIFIED: "DOCUMENT_VERIFIED",
  DOCUMENT_REJECTED: "DOCUMENT_REJECTED",

  TASK_ASSIGNED: "TASK_ASSIGNED",
  TASK_DUE_REMINDER: "TASK_DUE_REMINDER",

  TICKET_CREATED: "TICKET_CREATED",
  TICKET_REPLY: "TICKET_REPLY",
  TICKET_RESOLVED: "TICKET_RESOLVED",
};

const emailTemplateSchema = new mongoose.Schema(
  {
    // ── Identity ───────────────────────────────────────────────────
    name: {
      type: String,
      required: [true, "Template name is required"],
      unique: true,
      uppercase: true,
      trim: true,
      enum: Object.values(EMAIL_TEMPLATES),
    },
    subject: {
      type: String,
      required: [true, "Subject is required"],
      // Supports: {{variables}} e.g. "Your order {{orderNumber}} is confirmed"
    },
    body: {
      type: String,
      required: [true, "Body is required"],
      // Full HTML template with {{variable}} placeholders
    },

    // ── Variable Reference ─────────────────────────────────────────
    variables: {
      type: [String],
      default: [],
      // List of expected variables, e.g. ["clientName", "orderNumber"]
      // Used for documentation / validation in the admin UI
    },

    // ── Status ─────────────────────────────────────────────────────
    isActive: {
      type: Boolean,
      default: true,
    },

    // ── Audit ──────────────────────────────────────────────────────
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { timestamps: true }
);

const EmailTemplate = mongoose.model("EmailTemplate", emailTemplateSchema);
export default EmailTemplate;