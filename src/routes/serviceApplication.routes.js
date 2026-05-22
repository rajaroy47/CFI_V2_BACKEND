const express = require("express");

const router = express.Router();

const serviceApplicationController = require("../controllers/serviceApplication.controller");


// ==============================
// CREATE APPLICATION
// ==============================
router.post(
    "/create",
    serviceApplicationController.createApplication
);


// ==============================
// GET ALL APPLICATIONS
// ==============================
router.get(
    "/all",
    serviceApplicationController.getAllApplications
);


// ==============================
// GET SINGLE APPLICATION
// ==============================
router.get(
    "/:applicationId",
    serviceApplicationController.getSingleApplication
);


// ==============================
// UPDATE APPLICATION
// ==============================
router.put(
    "/update/:applicationId",
    serviceApplicationController.updateApplication
);


// ==============================
// UPDATE APPLICATION STATUS
// ==============================
router.patch(
    "/status/:applicationId",
    serviceApplicationController.updateApplicationStatus
);


// ==============================
// ASSIGN EMPLOYEE
// ==============================
router.patch(
    "/assign-employee/:applicationId",
    serviceApplicationController.assignEmployee
);


// ==============================
// UPDATE PAYMENT STATUS
// ==============================
router.patch(
    "/payment/:applicationId",
    serviceApplicationController.updatePaymentStatus
);


// ==============================
// ARCHIVE APPLICATION
// ==============================
router.patch(
    "/archive/:applicationId",
    serviceApplicationController.archiveApplication
);


// ==============================
// DELETE APPLICATION
// ==============================
router.delete(
    "/delete/:applicationId",
    serviceApplicationController.deleteApplication
);


module.exports = router;