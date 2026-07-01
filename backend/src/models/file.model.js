const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, default: "General" },
  originalName: { type: String, required: true },
  mimeType: { type: String, required: true },
  size: { type: Number, required: true },
  base64Data: { type: String, default: "" },
  uploadedBy: { type: Number, required: true },
  uploadDate: { type: Date, default: Date.now },
});

module.exports = mongoose.model("File", fileSchema);
