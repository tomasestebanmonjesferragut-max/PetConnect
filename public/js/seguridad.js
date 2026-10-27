// Seguridad: evita XSS y protege los datos guardados en localStorage.
// Se carga antes que los demás scripts en todas las páginas.

// Escapa los caracteres especiales antes de insertar texto con innerHTML
function escaparHTML(str) {
  if (typeof str !== "string") return str;
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Lee un JSON de localStorage; si está dañado o no existe devuelve el valor por defecto
function leerJSON(clave, porDefecto) {
  try {
    const guardado = localStorage.getItem(clave);
    return guardado === null ? porDefecto : JSON.parse(guardado);
  } catch {
    return porDefecto;
  }
}

// Guarda en localStorage sin romper la página si está lleno o bloqueado
function guardarJSON(clave, valor) {
  try {
    localStorage.setItem(clave, JSON.stringify(valor));
    return true;
  } catch {
    return false;
  }
}

function borrarJSON(clave) {
  try {
    localStorage.removeItem(clave);
  } catch {
    // Si el navegador bloquea localStorage no hay nada que borrar
  }
}

// Deja solo los campos y tipos que la página espera de una mascota guardada
function limpiarMascota(m) {
  if (!m || !Number.isFinite(m.id)) return null;
  const texto = v => (typeof v === "string" ? v : "");
  return {
    id: m.id,
    nombre: texto(m.nombre),
    especie: m.especie === "gato" ? "gato" : "perro",
    tipo: texto(m.tipo),
    edad: texto(m.edad),
    caracteristicas: texto(m.caracteristicas),
    historia: texto(m.historia),
    encuadre: ["arriba", "centro", "abajo"].includes(m.encuadre) || /^\d{1,3}% \d{1,3}%$/.test(m.encuadre) ? m.encuadre : "centro",
    galeria: (Array.isArray(m.galeria) ? m.galeria : []).filter(g =>
      g && ["imagen", "video", "youtube"].includes(g.tipo) &&
      typeof g.src === "string" && !/^\s*javascript:/i.test(g.src))
  };
}
