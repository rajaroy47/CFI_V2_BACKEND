import mongoose from "mongoose";

const invoiceSchema = new mongoose.Schema({
  invoiceNumber: {
    type: String,
    required: true,
    unique: true
  },
  applicationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ServiceApplication",
    required: true
  },
  paymentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Payment",
    required: true
  },
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  serviceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Service",
    required: true
  },
  invoiceType: {
    type: String,
    enum: [
      "service",
      "refund",
      "credit-note"
    ],
    default: "service"
  },
  invoiceStatus: {
    type: String,
    enum: [
      "draft",
      "generated",
      "sent",
      "paid",
      "cancelled"
    ],
    default: "generated"
  },
  billingDetails: {
    fullName: String,
    email: String,
    phone: String,
    companyName: String,
    gstNumber: String,
    address: {
      country: String,
      state: String,
      city: String,
      pinCode: String,
      fullAddress: String
    }
  },
  serviceDetails: {
    serviceName: String,
    serviceDescription: String
  },
  pricing: {
    baseAmount: {
      type: Number,
      required: true
    },
    gstPercentage: {
      type: Number,
      default: 18
    },
    gstAmount: {
      type: Number,
      default: 0
    },
    discountAmount: {
      type: Number,
      default: 0
    },
    finalAmount: {
      type: Number,
      required: true
    }
  },
  paymentDetails: {
    paymentMethod: String,
    transactionId: String,
    paymentGateway: String,
    paymentDate: Date
  },
  invoicePdfUrl: {
    type: String
  },
  invoicePdfPublicId: {
    type: String
  },
  dueDate: {
    type: Date
  },
  issuedAt: {
    type: Date,
    default: Date.now
  },
  notes: {
    type: String
  },
  termsAndConditions: {
    type: String
  },
  metadata: {
    type: Object,
    default: {}
  },
  isDownloaded: {
    type: Boolean,
    default: false
  },
  downloadCount: {
    type: Number,
    default: 0
  },
  lastDownloadedAt: {
    type: Date
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
}, { timestamps: true });


invoiceSchema.index({ 
    invoiceNumber: 1 
})
invoiceSchema.index({ 
    applicationId: 1 
})
invoiceSchema.index({ 
    paymentId: 1 
})
invoiceSchema.index({ 
    clientId: 1 
})
invoiceSchema.index({ 
    invoiceStatus: 1 
})
invoiceSchema.index({ 
    issuedAt: -1 
})

const invoiceModel = mongoose.model("Invoice", invoiceSchema);

module.exports = invoiceModel;