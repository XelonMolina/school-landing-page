const File = require("../models/file.model");

const getLibraryItems = async (req, res) => {
  const { category, search } = req.query;

  try {
    const filter = {};
    if (category) filter.category = category;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { originalName: { $regex: search, $options: "i" } },
      ];
    }

    const files = await File.find(filter)
      .select("title category originalName mimeType size uploadDate")
      .sort({ uploadDate: -1 })
      .limit(50);

    res.json(files);
  } catch (error) {
    console.error("Error obteniendo biblioteca:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

const getCategories = async (req, res) => {
  try {
    const categories = await File.distinct("category");
    res.json(categories.filter(Boolean));
  } catch (error) {
    console.error("Error obteniendo categorías:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

const seedLibraryIfEmpty = async () => {
  try {
    const count = await File.countDocuments();
    if (count > 0) return;

    const sampleBooks = [
      { title: "Cien años de soledad", category: "Literatura", originalName: "cien-anos.pdf", mimeType: "application/pdf", size: 1024000, base64Data: "", uploadedBy: 1 },
      { title: "El arte de la guerra", category: "Arte", originalName: "arte-guerra.pdf", mimeType: "application/pdf", size: 512000, base64Data: "", uploadedBy: 1 },
      { title: "Historia de Chile", category: "Historia", originalName: "historia-chile.pdf", mimeType: "application/pdf", size: 2048000, base64Data: "", uploadedBy: 1 },
      { title: "Álgebra básica", category: "Matemáticas", originalName: "algebra.pdf", mimeType: "application/pdf", size: 768000, base64Data: "", uploadedBy: 1 },
      { title: "Introducción a Python", category: "Programación", originalName: "python-intro.pdf", mimeType: "application/pdf", size: 1536000, base64Data: "", uploadedBy: 1 },
      { title: "Don Quijote de la Mancha", category: "Literatura", originalName: "quijote.pdf", mimeType: "application/pdf", size: 1280000, base64Data: "", uploadedBy: 1 },
      { title: "Pintura renacentista", category: "Arte", originalName: "renacimiento.pdf", mimeType: "application/pdf", size: 896000, base64Data: "", uploadedBy: 1 },
      { title: "Geometría euclidiana", category: "Matemáticas", originalName: "geometria.pdf", mimeType: "application/pdf", size: 640000, base64Data: "", uploadedBy: 1 },
    ];

    await File.insertMany(sampleBooks);
    console.log("📚 Biblioteca inicializada con datos de ejemplo");
  } catch (error) {
    console.error("Error inicializando biblioteca:", error.message);
  }
};

module.exports = { getLibraryItems, getCategories, seedLibraryIfEmpty };
