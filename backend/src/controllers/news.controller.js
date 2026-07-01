const mysqlPool = require("../../config/mysql.config");
const File = require("../models/file.model"); // Importamos el modelo de Mongo por si necesitamos expandir datos

const getLatestNews = async (req, res) => {
  try {
    // Obtenemos las 5 noticias más recientes uniendo con la tabla USER para saber quién la publicó
    const [news] = await mysqlPool.execute(`
            SELECT n.id, n.title, n.content, n.post_type, n.publish_date, n.image_url, n.attachment_url,
                   u.role
            FROM NEWS_ACTIVITY n
            JOIN USER u ON n.author_id = u.user_id
            ORDER BY n.publish_date DESC
            LIMIT 5
        `);

    res.json(news);
  } catch (error) {
    console.error("Error obteniendo noticias:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

module.exports = { getLatestNews };
