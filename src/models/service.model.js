const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema({
    serviceName: {
        type: String,
        required: true,
        trim: true
    }, 
    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    shortDescription: {
        type: String,
        trim: true
    },
    description: {
        type: String,
    },
    category: {
        type: String,
        required: true
    },
    thumbnail: {
        type: String
    },
    bannerImage: {
        type: String
    },
    requiredDocuments: [
        {
            type: String
        }
    ],
    pricing: {
        basePrice: {
            type: Number,
            required: true
        },
        gstPercentage: {
            type: Number,
            default: 18
        },
        discountPrice: {
            type: Number,
            default: 0
        },
        estimatedDeliveryDays: {
            type: Number,
            default: 7
        },
        features: [
            {
                type: String
            }
        ],
        faqs: [
            {
                question: String,
                answer: String
            }
        ],
        tags: [
            {
                type: String
            }
        ],
        isFeatured: {
            type: Boolean,
            default: false
        },
        isPopular: {
            type: Boolean,
            default: false
        },
        status: {
            type: String,
            enum: ["active", "inactive"],
            default: "active"
        },
        totalApplication: {
            type: Number,
            default: 0
        },
        totalRevenue: {
            type: Number,
            default: 0
        },
        seo: {
            metaTitle: String,
            metaDescription: String,
            keywords: [String]
        },
    }
}, { timestamps: true })


serviceSchema.index({
    slug: 1
})
serviceSchema.index({
    category: 1
})
serviceSchema.index({
    status: 1
})
serviceSchema.index({
    isFeatured: 1
})
serviceSchema.index({
    isPopular: 1
})

const serviceModel = mongoose.model("Service", serviceSchema);
 
module.exports = serviceModel