server/
│
├── src/
│   │
│   ├── app.js
│   ├── server.js
│   │
│   ├── config/
│   │   ├── db.js
│   │   ├── env.js
│   │   ├── cloudinary.js
│   │   ├── razorpay.js
│   │   ├── socket.js
│   │   ├── mail.js
│   │   └── logger.js
│   │
│   ├── modules/
│   │   │
│   │   ├── auth/
│   │   │   ├── auth.controller.js
│   │   │   ├── auth.service.js
│   │   │   ├── auth.repository.js
│   │   │   ├── auth.routes.js
│   │   │   ├── auth.validation.js
│   │   │   ├── auth.middleware.js
│   │   │   └── auth.utils.js
│   │   │
│   │   ├── users/
│   │   │   ├── user.model.js
│   │   │   ├── user.controller.js
│   │   │   ├── user.service.js
│   │   │   ├── user.repository.js
│   │   │   ├── user.routes.js
│   │   │   ├── user.validation.js
│   │   │   └── user.constants.js
│   │   │
│   │   ├── services/
│   │   │   ├── service.model.js
│   │   │   ├── service.controller.js
│   │   │   ├── service.service.js
│   │   │   ├── service.repository.js
│   │   │   ├── service.routes.js
│   │   │   └── service.validation.js
│   │   │
│   │   ├── applications/
│   │   │   ├── application.model.js
│   │   │   ├── application.controller.js
│   │   │   ├── application.service.js
│   │   │   ├── application.repository.js
│   │   │   ├── application.routes.js
│   │   │   ├── application.validation.js
│   │   │   ├── application.pipeline.js
│   │   │   └── application.constants.js
│   │   │
│   │   ├── documents/
│   │   │   ├── document.model.js
│   │   │   ├── document.controller.js
│   │   │   ├── document.service.js
│   │   │   ├── document.repository.js
│   │   │   ├── document.routes.js
│   │   │   ├── upload.middleware.js
│   │   │   └── document.validation.js
│   │   │
│   │   ├── payments/
│   │   │   ├── payment.model.js
│   │   │   ├── payment.controller.js
│   │   │   ├── payment.service.js
│   │   │   ├── payment.repository.js
│   │   │   ├── payment.routes.js
│   │   │   ├── payment.webhook.js
│   │   │   └── payment.validation.js
│   │   │
│   │   ├── notifications/
│   │   │   ├── notification.model.js
│   │   │   ├── notification.controller.js
│   │   │   ├── notification.service.js
│   │   │   ├── notification.repository.js
│   │   │   ├── notification.routes.js
│   │   │   └── notification.socket.js
│   │   │
│   │   ├── chats/
│   │   │   ├── chat.model.js
│   │   │   ├── chat.controller.js
│   │   │   ├── chat.service.js
│   │   │   ├── chat.repository.js
│   │   │   ├── chat.routes.js
│   │   │   └── chat.socket.js
│   │   │
│   │   ├── invoices/
│   │   │   ├── invoice.model.js
│   │   │   ├── invoice.controller.js
│   │   │   ├── invoice.service.js
│   │   │   ├── invoice.repository.js
│   │   │   ├── invoice.routes.js
│   │   │   └── pdf.service.js
│   │   │
│   │   ├── dashboard/
│   │   │   ├── dashboard.controller.js
│   │   │   ├── dashboard.service.js
│   │   │   ├── dashboard.routes.js
│   │   │   └── dashboard.pipeline.js
│   │   │
│   │   ├── admin/
│   │   │   ├── admin.controller.js
│   │   │   ├── admin.service.js
│   │   │   ├── admin.routes.js
│   │   │   ├── admin.validation.js
│   │   │   └── admin.pipeline.js
│   │   │
│   │   └── activityLogs/
│   │       ├── activityLog.model.js
│   │       ├── activityLog.service.js
│   │       └── activityLog.pipeline.js
│   │
│   ├── middleware/
│   │   ├── auth.middleware.js
│   │   ├── role.middleware.js
│   │   ├── error.middleware.js
│   │   ├── rateLimit.middleware.js
│   │   ├── validate.middleware.js
│   │   ├── multer.middleware.js
│   │   ├── sanitize.middleware.js
│   │   ├── audit.middleware.js
│   │   └── csrf.middleware.js
│   │
│   ├── utils/
│   │   ├── apiResponse.js
│   │   ├── asyncHandler.js
│   │   ├── generateToken.js
│   │   ├── generateApplicationId.js
│   │   ├── generateInvoiceNumber.js
│   │   ├── password.js
│   │   ├── logger.js
│   │   ├── pagination.js
│   │   ├── sendEmail.js
│   │   ├── date.js
│   │   ├── cloudinary.js
│   │   └── constants.js
│   │
│   ├── validators/
│   │   ├── auth.validator.js
│   │   ├── user.validator.js
│   │   ├── service.validator.js
│   │   └── payment.validator.js
│   │
│   ├── cron/
│   │   ├── reminder.cron.js
│   │   ├── cleanup.cron.js
│   │   ├── analytics.cron.js
│   │   └── invoice.cron.js
│   │
│   ├── queues/
│   │   ├── email.queue.js
│   │   ├── notification.queue.js
│   │   └── payment.queue.js
│   │
│   ├── sockets/
│   │   ├── index.js
│   │   ├── chat.socket.js
│   │   └── notification.socket.js
│   │
│   ├── storage/
│   │   ├── temp/
│   │   ├── documents/
│   │   └── invoices/
│   │
│   ├── templates/
│   │   ├── emails/
│   │   ├── invoices/
│   │   └── pdf/
│   │
│   ├── docs/
│   │   ├── swagger.json
│   │   └── postman_collection.json
│   │
│   ├── tests/
│   │   ├── auth.test.js
│   │   ├── user.test.js
│   │   └── payment.test.js
│   │
│   └── routes/
│       └── index.js
│
├── .env
├── .gitignore
├── package.json
├── README.md
└── ecosystem.config.js