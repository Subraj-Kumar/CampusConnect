const multer = require("multer");

// Store file in memory as a buffer
const storage = multer.memoryStorage();

const upload = multer({ 
  storage,
  limits: { fileSize: 2 * 1024 * 1024 } // Limit: 2MB for performance
});

module.exports = upload;