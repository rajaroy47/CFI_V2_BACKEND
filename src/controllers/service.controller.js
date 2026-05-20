const slugify  = require("slugify");     // npm i slugify
const Service  = require("../models/service.model.js");


// ─── HELPERS ──────────────────────────────────────────────────────────────────

/**
 * Auto-generate a unique slug from serviceName.
 * If the base slug exists, appends -1, -2, ... until unique.
 */
const generateUniqueSlug = async (serviceName, excludeId = null) => {
    const base = slugify(serviceName, { lower: true, strict: true, trim: true });
    let slug    = base;
    let counter = 1;

    while (true) {
        const query = { slug };
        if (excludeId) query._id = { $ne: excludeId };

        const exists = await Service.findOne(query);
        if (!exists) break;

        slug = `${base}-${counter}`;
        counter++;
    }

    return slug;
};

/**
 * Calculate the final price after discount and GST.
 */
const computePricing = (pricing = {}) => {
    const base     = pricing.basePrice     || 0;
    const discount = pricing.discountPrice || 0;
    const gst      = pricing.gstPercentage ?? 18;

    const afterDiscount = Math.max(base - discount, 0);
    const gstAmount     = +(afterDiscount * (gst / 100)).toFixed(2);
    const finalPrice    = +(afterDiscount + gstAmount).toFixed(2);

    return { afterDiscount, gstAmount, finalPrice };
};


// ─── CREATE SERVICE ───────────────────────────────────────────────────────────

/**
 * POST /services
 * Admin only.
 * Body: serviceName, category, pricing.basePrice, + any other fields.
 */
const createService = async (req, res) => {
    try {
        const {
            serviceName,
            shortDescription,
            description,
            category,
            thumbnail,
            bannerImage,
            requiredDocuments,
            pricing,
        } = req.body;

        // ── Required field check ──
        if (!serviceName || !category || !pricing?.basePrice) {
            return res.status(400).json({
                success : false,
                message : "serviceName, category and pricing.basePrice are required",
            });
        }

        if (pricing.basePrice < 0) {
            return res.status(400).json({ success: false, message: "basePrice cannot be negative" });
        }

        if (pricing.discountPrice && pricing.discountPrice >= pricing.basePrice) {
            return res.status(400).json({
                success : false,
                message : "discountPrice must be less than basePrice",
            });
        }

        // ── Auto-generate slug ──
        const slug = await generateUniqueSlug(serviceName);

        const service = await Service.create({
            serviceName,
            slug,
            shortDescription,
            description,
            category      : category.trim().toLowerCase(),
            thumbnail,
            bannerImage,
            requiredDocuments : requiredDocuments || [],
            pricing       : {
                basePrice            : pricing.basePrice,
                gstPercentage        : pricing.gstPercentage ?? 18,
                discountPrice        : pricing.discountPrice || 0,
                estimatedDeliveryDays: pricing.estimatedDeliveryDays || 7,
                features             : pricing.features || [],
                faqs                 : pricing.faqs     || [],
                tags                 : pricing.tags     || [],
                isFeatured           : pricing.isFeatured || false,
                isPopular            : pricing.isPopular  || false,
                status               : pricing.status     || "active",
                seo                  : pricing.seo        || {},
            },
        });

        return res.status(201).json({
            success : true,
            message : "Service created successfully",
            service,
        });

    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({ success: false, message: "Slug already exists" });
        }
        if (error.name === "ValidationError") {
            const messages = Object.values(error.errors).map((e) => e.message);
            return res.status(400).json({ success: false, message: messages.join(", ") });
        }
        return res.status(500).json({ success: false, message: error.message });
    }
};


// ─── GET ALL SERVICES (public) ────────────────────────────────────────────────

/**
 * GET /services
 * Public — clients browse the service catalogue.
 *
 * Query params:
 *   ?category=gst
 *   ?status=active|inactive
 *   ?featured=true
 *   ?popular=true
 *   ?search=keyword         (searches serviceName + shortDescription)
 *   ?minPrice=500
 *   ?maxPrice=5000
 *   ?sortBy=basePrice|createdAt|totalApplication   (default: createdAt)
 *   ?order=asc|desc         (default: desc)
 *   ?page=1  ?limit=10
 */
const getAllServices = async (req, res) => {
    try {
        const {
            category,
            status    = "active",
            featured,
            popular,
            search,
            minPrice,
            maxPrice,
            sortBy  = "createdAt",
            order   = "desc",
            page    = 1,
            limit   = 10,
        } = req.query;

        const filter = {};

        // Non-admin users can only see active services
        if (req.user?.role === "admin") {
            if (status) filter["pricing.status"] = status;
        } else {
            filter["pricing.status"] = "active";
        }

        if (category)         filter.category          = category.toLowerCase();
        if (featured === "true") filter["pricing.isFeatured"] = true;
        if (popular  === "true") filter["pricing.isPopular"]  = true;

        if (search) {
            filter.$or = [
                { serviceName      : { $regex: search, $options: "i" } },
                { shortDescription : { $regex: search, $options: "i" } },
                { "pricing.tags"   : { $regex: search, $options: "i" } },
            ];
        }

        if (minPrice || maxPrice) {
            filter["pricing.basePrice"] = {};
            if (minPrice) filter["pricing.basePrice"].$gte = Number(minPrice);
            if (maxPrice) filter["pricing.basePrice"].$lte = Number(maxPrice);
        }

        // ── Sorting ──
        const ALLOWED_SORTS = ["basePrice", "createdAt", "totalApplication", "serviceName"];
        const sortField     = ALLOWED_SORTS.includes(sortBy) ? sortBy : "createdAt";
        const sortKey       = sortField === "basePrice" || sortField === "totalApplication"
            ? `pricing.${sortField}`
            : sortField;
        const sortDir = order === "asc" ? 1 : -1;

        const skip  = (Number(page) - 1) * Number(limit);
        const total = await Service.countDocuments(filter);

        const services = await Service.find(filter)
            .sort({ [sortKey]: sortDir })
            .skip(skip)
            .limit(Number(limit))
            .select("-pricing.totalRevenue -pricing.seo"); // hide internal fields from public

        return res.status(200).json({
            success    : true,
            total,
            page       : Number(page),
            totalPages : Math.ceil(total / Number(limit)),
            services,
        });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};


// ─── GET SERVICE BY SLUG (public) ─────────────────────────────────────────────

/**
 * GET /services/:slug
 * Public — full service detail page.
 */
const getServiceBySlug = async (req, res) => {
    try {
        const service = await Service.findOne({ slug: req.params.slug });

        if (!service) {
            return res.status(404).json({ success: false, message: "Service not found" });
        }

        // Non-admin cannot view inactive services
        if (service.pricing.status === "inactive" && req.user?.role !== "admin") {
            return res.status(404).json({ success: false, message: "Service not found" });
        }

        // Attach computed pricing for frontend convenience
        const computed = computePricing(service.pricing);

        return res.status(200).json({
            success : true,
            service,
            computed,
        });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};


// ─── GET SERVICE BY ID (admin / internal) ────────────────────────────────────

/**
 * GET /services/id/:id
 * Admin only — includes revenue, SEO, all internal fields.
 */
const getServiceById = async (req, res) => {
    try {
        const service = await Service.findById(req.params.id);

        if (!service) {
            return res.status(404).json({ success: false, message: "Service not found" });
        }

        const computed = computePricing(service.pricing);

        return res.status(200).json({ success: true, service, computed });

    } catch (error) {
        if (error.name === "CastError") {
            return res.status(400).json({ success: false, message: "Invalid service ID" });
        }
        return res.status(500).json({ success: false, message: error.message });
    }
};


// ─── UPDATE SERVICE ───────────────────────────────────────────────────────────

/**
 * PATCH /services/:id
 * Admin only.
 * Partial update — only pass the fields you want to change.
 */
const updateService = async (req, res) => {
    try {
        const service = await Service.findById(req.params.id);

        if (!service) {
            return res.status(404).json({ success: false, message: "Service not found" });
        }

        const {
            serviceName,
            shortDescription,
            description,
            category,
            thumbnail,
            bannerImage,
            requiredDocuments,
            pricing,
        } = req.body;

        // ── Re-generate slug only if serviceName changed ──
        if (serviceName && serviceName !== service.serviceName) {
            service.slug        = await generateUniqueSlug(serviceName, service._id);
            service.serviceName = serviceName;
        }

        if (shortDescription  !== undefined) service.shortDescription  = shortDescription;
        if (description       !== undefined) service.description       = description;
        if (category          !== undefined) service.category          = category.trim().toLowerCase();
        if (thumbnail         !== undefined) service.thumbnail         = thumbnail;
        if (bannerImage       !== undefined) service.bannerImage       = bannerImage;
        if (requiredDocuments !== undefined) service.requiredDocuments = requiredDocuments;

        // ── Nested pricing update (merge, not replace) ──
        if (pricing) {
            if (pricing.basePrice !== undefined) {
                if (pricing.basePrice < 0) {
                    return res.status(400).json({ success: false, message: "basePrice cannot be negative" });
                }
                service.pricing.basePrice = pricing.basePrice;
            }
            if (pricing.discountPrice !== undefined) {
                const base = pricing.basePrice ?? service.pricing.basePrice;
                if (pricing.discountPrice >= base) {
                    return res.status(400).json({
                        success : false,
                        message : "discountPrice must be less than basePrice",
                    });
                }
                service.pricing.discountPrice = pricing.discountPrice;
            }
            if (pricing.gstPercentage        !== undefined) service.pricing.gstPercentage         = pricing.gstPercentage;
            if (pricing.estimatedDeliveryDays!== undefined) service.pricing.estimatedDeliveryDays = pricing.estimatedDeliveryDays;
            if (pricing.features             !== undefined) service.pricing.features              = pricing.features;
            if (pricing.faqs                 !== undefined) service.pricing.faqs                  = pricing.faqs;
            if (pricing.tags                 !== undefined) service.pricing.tags                  = pricing.tags;
            if (pricing.isFeatured           !== undefined) service.pricing.isFeatured            = pricing.isFeatured;
            if (pricing.isPopular            !== undefined) service.pricing.isPopular             = pricing.isPopular;
            if (pricing.status               !== undefined) service.pricing.status                = pricing.status;
            if (pricing.seo                  !== undefined) service.pricing.seo                   = pricing.seo;
        }

        await service.save();

        return res.status(200).json({
            success : true,
            message : "Service updated successfully",
            service,
        });

    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({ success: false, message: "Slug already exists" });
        }
        if (error.name === "CastError") {
            return res.status(400).json({ success: false, message: "Invalid service ID" });
        }
        if (error.name === "ValidationError") {
            const messages = Object.values(error.errors).map((e) => e.message);
            return res.status(400).json({ success: false, message: messages.join(", ") });
        }
        return res.status(500).json({ success: false, message: error.message });
    }
};


// ─── TOGGLE STATUS (active / inactive) ───────────────────────────────────────

/**
 * PATCH /services/:id/toggle-status
 * Admin only — quickly flip active ↔ inactive.
 */
const toggleServiceStatus = async (req, res) => {
    try {
        const service = await Service.findById(req.params.id);

        if (!service) {
            return res.status(404).json({ success: false, message: "Service not found" });
        }

        service.pricing.status = service.pricing.status === "active" ? "inactive" : "active";
        await service.save();

        return res.status(200).json({
            success : true,
            message : `Service is now ${service.pricing.status}`,
            status  : service.pricing.status,
        });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};


// ─── TOGGLE FEATURED ──────────────────────────────────────────────────────────

/**
 * PATCH /services/:id/toggle-featured
 * Admin only.
 */
const toggleFeatured = async (req, res) => {
    try {
        const service = await Service.findById(req.params.id);

        if (!service) {
            return res.status(404).json({ success: false, message: "Service not found" });
        }

        service.pricing.isFeatured = !service.pricing.isFeatured;
        await service.save();

        return res.status(200).json({
            success    : true,
            message    : `Service is now ${service.pricing.isFeatured ? "featured" : "not featured"}`,
            isFeatured : service.pricing.isFeatured,
        });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};


// ─── TOGGLE POPULAR ───────────────────────────────────────────────────────────

/**
 * PATCH /services/:id/toggle-popular
 * Admin only.
 */
const togglePopular = async (req, res) => {
    try {
        const service = await Service.findById(req.params.id);

        if (!service) {
            return res.status(404).json({ success: false, message: "Service not found" });
        }

        service.pricing.isPopular = !service.pricing.isPopular;
        await service.save();

        return res.status(200).json({
            success   : true,
            message   : `Service is now ${service.pricing.isPopular ? "popular" : "not popular"}`,
            isPopular : service.pricing.isPopular,
        });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};


// ─── DELETE SERVICE ───────────────────────────────────────────────────────────

/**
 * DELETE /services/:id
 * Admin only — hard delete.
 */
const deleteService = async (req, res) => {
    try {
        const service = await Service.findByIdAndDelete(req.params.id);

        if (!service) {
            return res.status(404).json({ success: false, message: "Service not found" });
        }

        return res.status(200).json({
            success : true,
            message : "Service deleted successfully",
        });

    } catch (error) {
        if (error.name === "CastError") {
            return res.status(400).json({ success: false, message: "Invalid service ID" });
        }
        return res.status(500).json({ success: false, message: error.message });
    }
};


// ─── GET ALL CATEGORIES ───────────────────────────────────────────────────────

/**
 * GET /services/categories
 * Public — returns distinct active categories with service count.
 */
const getAllCategories = async (req, res) => {
    try {
        const categories = await Service.aggregate([
            { $match: { "pricing.status": "active" } },
            {
                $group: {
                    _id   : "$category",
                    count : { $sum: 1 },
                },
            },
            { $sort: { count: -1 } },
            {
                $project: {
                    _id      : 0,
                    category : "$_id",
                    count    : 1,
                },
            },
        ]);

        return res.status(200).json({ success: true, categories });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};


// ─── GET FEATURED SERVICES ────────────────────────────────────────────────────

/**
 * GET /services/featured
 * Public — homepage featured section.
 */
const getFeaturedServices = async (req, res) => {
    try {
        const { limit = 6 } = req.query;

        const services = await Service.find({
            "pricing.isFeatured" : true,
            "pricing.status"     : "active",
        })
            .sort({ createdAt: -1 })
            .limit(Number(limit))
            .select("serviceName slug shortDescription thumbnail pricing.basePrice pricing.discountPrice pricing.gstPercentage pricing.estimatedDeliveryDays pricing.isFeatured pricing.isPopular");

        return res.status(200).json({ success: true, services });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};


// ─── GET POPULAR SERVICES ─────────────────────────────────────────────────────

/**
 * GET /services/popular
 * Public — homepage popular section.
 */
const getPopularServices = async (req, res) => {
    try {
        const { limit = 6 } = req.query;

        const services = await Service.find({
            "pricing.isPopular" : true,
            "pricing.status"    : "active",
        })
            .sort({ "pricing.totalApplication": -1 })
            .limit(Number(limit))
            .select("serviceName slug shortDescription thumbnail pricing.basePrice pricing.discountPrice pricing.gstPercentage pricing.estimatedDeliveryDays pricing.isFeatured pricing.isPopular");

        return res.status(200).json({ success: true, services });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};


// ─── INCREMENT APPLICATION COUNT (internal — call from order controller) ──────

/**
 * Called internally when an order/application is placed for a service.
 * Not exposed as an HTTP route.
 *
 * @param {String} serviceId
 * @param {Number} amount - revenue to add
 */
const incrementServiceStats = async (serviceId, amount = 0) => {
    await Service.findByIdAndUpdate(serviceId, {
        $inc: {
            "pricing.totalApplication" : 1,
            "pricing.totalRevenue"     : amount,
        },
    });
};


// ─── ADMIN STATS ──────────────────────────────────────────────────────────────

/**
 * GET /services/admin/stats
 * Admin only — aggregated stats across all services.
 */
const getServiceStats = async (req, res) => {
    try {
        const [overview] = await Service.aggregate([
            {
                $group: {
                    _id              : null,
                    total            : { $sum: 1 },
                    active           : { $sum: { $cond: [{ $eq: ["$pricing.status", "active"] }, 1, 0] } },
                    inactive         : { $sum: { $cond: [{ $eq: ["$pricing.status", "inactive"] }, 1, 0] } },
                    featured         : { $sum: { $cond: ["$pricing.isFeatured", 1, 0] } },
                    popular          : { $sum: { $cond: ["$pricing.isPopular", 1, 0] } },
                    totalApplications: { $sum: "$pricing.totalApplication" },
                    totalRevenue     : { $sum: "$pricing.totalRevenue" },
                    avgBasePrice     : { $avg: "$pricing.basePrice" },
                },
            },
            { $project: { _id: 0 } },
        ]);

        const topServices = await Service.find()
            .sort({ "pricing.totalApplication": -1 })
            .limit(5)
            .select("serviceName slug pricing.totalApplication pricing.totalRevenue pricing.basePrice");

        const categoryBreakdown = await Service.aggregate([
            { $group: { _id: "$category", count: { $sum: 1 }, revenue: { $sum: "$pricing.totalRevenue" } } },
            { $sort: { count: -1 } },
        ]);

        return res.status(200).json({
            success          : true,
            overview         : overview || {},
            topServices,
            categoryBreakdown,
        });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};


// ─── BULK STATUS UPDATE (admin) ───────────────────────────────────────────────

/**
 * PATCH /services/admin/bulk-status
 * Admin only — change status of multiple services at once.
 * Body: { ids: ["id1","id2"], status: "active" | "inactive" }
 */
const bulkUpdateStatus = async (req, res) => {
    try {
        const { ids, status } = req.body;

        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({ success: false, message: "ids array is required" });
        }

        if (!["active", "inactive"].includes(status)) {
            return res.status(400).json({ success: false, message: "status must be 'active' or 'inactive'" });
        }

        const result = await Service.updateMany(
            { _id: { $in: ids } },
            { $set: { "pricing.status": status } }
        );

        return res.status(200).json({
            success  : true,
            message  : `${result.modifiedCount} service(s) updated to ${status}`,
            modified : result.modifiedCount,
        });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};


// ─── EXPORTS ──────────────────────────────────────────────────────────────────

module.exports = {
    createService,
    getAllServices,
    getServiceBySlug,
    getServiceById,
    updateService,
    toggleServiceStatus,
    toggleFeatured,
    togglePopular,
    deleteService,
    getAllCategories,
    getFeaturedServices,
    getPopularServices,
    getServiceStats,
    bulkUpdateStatus,
    incrementServiceStats,   // internal helper — used by order controller
};