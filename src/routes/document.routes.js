const express = require("express");

const router = express.Router();

const documentController = require("../controllers/document.controller");


// ======================================
// UPLOAD DOCUMENT
// ======================================
router.post(
    "/upload",
    documentController.uploadDocument
);


// ======================================
// GET ALL DOCUMENTS
// ======================================
router.get(
    "/all",
    documentController.getAllDocuments
);


// ======================================
// GET SINGLE DOCUMENT
// ======================================
router.get(
    "/:documentId",
    documentController.getSingleDocument
);


// ======================================
// UPDATE DOCUMENT
// ======================================
router.put(
    "/update/:documentId",
    documentController.updateDocument
);


// ======================================
// VERIFY DOCUMENT
// ======================================
router.patch(
    "/verify/:documentId",
    documentController.verifyDocument
);


// ======================================
// ARCHIVE DOCUMENT
// ======================================
router.patch(
    "/archive/:documentId",
    documentController.archiveDocument
);


// ======================================
// DOWNLOAD DOCUMENT
// ======================================
router.get(
    "/download/:documentId",
    documentController.downloadDocument
);


// ======================================
// DELETE DOCUMENT
// ======================================
router.delete(
    "/delete/:documentId",
    documentController.deleteDocument
);


module.exports = router;