const normalizeRut = (rut) => {
  if (!rut) return "";
  return rut.replace(/[.\-\s]/g, "").toUpperCase();
};

module.exports = { normalizeRut };
