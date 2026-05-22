const Document = require("../models/document.model");
const ServiceApplication = require("../models/serviceApplication.model");


// ======================================
// UPLOAD DOCUMENT
// ======================================
exports.uploadDocument = async (req, res) => {

    try {

        const {
            applicationId,
            uploaderRole,
            documentType,
            originalFileName,
            fileUrl,
            publicId,
            mimeType,
            fileExtention,
            fileSize,
            storageProvider,
            category,
            visibility,
            metadata,
            tags,
            isFinalDocument
        } = req.body;

        if (!applicationId) {
            return res.status(400).json({
                success: false,
                message: "Application ID is required"
            });
        }

        if (!documentType) {
            return res.status(400).json({
                success: false,
                message: "Document type is required"
            });
        }

        if (!fileUrl) {
            return res.status(400).json({
                success: false,
                message: "File URL is required"
            });
        }

        const document = await Document.create({
            applicationId,
            uploadedBy: req.user._id,
            uploaderRole,
            documentType,
            fileName: req.file?.filename || originalFileName,
            originalFileName,
            fileUrl,
            publicId,
            mimeType,
            fileExtention,
            fileSize,
            storageProvider,
            category,
            visibility,
            metadata,
            tags,
            isFinalDocument,
            uploadedFromIP: req.ip,
            createdBy: req.user._id
        });

        // update application document count
        await ServiceApplication.findByIdAndUpdate(
            applicationId,
            {
                $inc: {
                    totalDocument: 1
                },
                $push: {
                    documents: document._id
                }
            }
        );

        return res.status(201).json({
            success: true,
            message: "Document uploaded successfully",
            data: document
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Failed to upload document"
        });
    }
};


// ======================================
// GET ALL DOCUMENTS
// ======================================
exports.getAllDocuments = async (req, res) => {

    try {

        const {
            page = 1,
            limit = 10,
            category,
            verificationStatus,
            applicationId,
            search
        } = req.query;

        const query = {};

        if (category) {
            query.category = category;
        }

        if (verificationStatus) {
            query.verificationStatus = verificationStatus;
        }

        if (applicationId) {
            query.applicationId = applicationId;
        }

        if (search) {
            query.originalFileName = {
                $regex: search,
                $options: "i"
            };
        }

        const documents = await Document.find(query)
            .populate("uploadedBy", "name email")
            .populate("applicationId")
            .populate("verifiedBy", "name email")
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(Number(limit));

        const total = await Document.countDocuments(query);

        return res.status(200).json({
            success: true,
            total,
            currentPage: Number(page),
            totalPages: Math.ceil(total / limit),
            data: documents
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch documents"
        });
    }
};


// ======================================
// GET SINGLE DOCUMENT
// ======================================
exports.getSingleDocument = async (req, res) => {

    try {

        const { documentId } = req.params;

        const document = await Document.findById(documentId)
            .populate("uploadedBy", "name email")
            .populate("applicationId")
            .populate("verifiedBy", "name email");

        if (!document) {
            return res.status(404).json({
                success: false,
                message: "Document not found"
            });
        }

        return res.status(200).json({
            success: true,
            data: document
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch document"
        });
    }
};


// ======================================
// UPDATE DOCUMENT
// ======================================
exports.updateDocument = async (req, res) => {

    try {

        const { documentId } = req.params;

        const updatedDocument = await Document.findByIdAndUpdate(
            documentId,
            {
                ...req.body,
                updatedBy: req.user._id
            },
            {
                new: true,
                runValidators: true
            }
        );

        if (!updatedDocument) {
            return res.status(404).json({
                success: false,
                message: "Document not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Document updated successfully",
            data: updatedDocument
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Failed to update document"
        });
    }
};


// ======================================
// VERIFY DOCUMENT
// ======================================
exports.verifyDocument = async (req, res) => {

    try {

        const { documentId } = req.params;

        const {
            verificationStatus,
            verificationRemark
        } = req.body;

        const document = await Document.findById(documentId);

        if (!document) {
            return res.status(404).json({
                success: false,
                message: "Document not found"
            });
        }

        document.verificationStatus = verificationStatus;
        document.verificationRemark = verificationRemark;
        document.verifiedBy = req.user._id;
        document.verifiedAt = new Date();

        await document.save();

        return res.status(200).json({
            success: true,
            message: "Document verified successfully",
            data: document
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Failed to verify document"
        });
    }
};


// ======================================
// ARCHIVE DOCUMENT
// ======================================
exports.archiveDocument = async (req, res) => {

    try {

        const { documentId } = req.params;

        const document = await Document.findByIdAndUpdate(
            documentId,
            {
                isArchived: true
            },
            {
                new: true
            }
        );

        if (!document) {
            return res.status(404).json({
                success: false,
                message: "Document not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Document archived successfully",
            data: document
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Failed to archive document"
        });
    }
};


// ======================================
// DOWNLOAD DOCUMENT
// ======================================
exports.downloadDocument = async (req, res) => {

    try {

        const { documentId } = req.params;

        const document = await Document.findById(documentId);

        if (!document) {
            return res.status(404).json({
                success: false,
                message: "Document not found"
            });
        }

        document.downloadCount += 1;

        await document.save();

        return res.status(200).json({
            success: true,
            fileUrl: document.fileUrl,
            downloadCount: document.downloadCount
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Failed to download document"
        });
    }
};


// ======================================
// DELETE DOCUMENT
// ======================================
exports.deleteDocument = async (req, res) => {

    try {

        const { documentId } = req.params;

        const document = await Document.findByIdAndDelete(documentId);

        if (!document) {
            return res.status(404).json({
                success: false,
                message: "Document not found"
            });
        }

        // decrease document count
        await ServiceApplication.findByIdAndUpdate(
            document.applicationId,
            {
                $inc: {
                    totalDocument: -1
                },
                $pull: {
                    documents: document._id
                }
            }
        );

        return res.status(200).json({
            success: true,
            message: "Document deleted successfully"
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Failed to delete document"
        });
    }
};