// Datos de las mascotas del caso.
// Las rutas de imagen son relativas a las páginas en public/html.
// galeria acepta { tipo: "imagen" | "video" | "youtube", src }
const mascotasBase = [
  {
    id: 1, nombre: "Luna", especie: "perro", tipo: "Perra", edad: "2 años",
    caracteristicas: "Sociable y cariñosa",
    historia: "Hola, soy Luna. Me encanta estar cerca de las personas, recibir cariño y saludar a todos los que conozco. Busco una familia que quiera compartir paseos, juegos y muchos abrazos.",
    galeria: [{ tipo: "imagen", src: "../img/luna.webp" }]
  },
  {
    id: 2, nombre: "Milo", especie: "gato", tipo: "Gato", edad: "1 año",
    caracteristicas: "Adaptado a vida de interior",
    historia: "Hola, soy Milo. Soy feliz dentro de casa: una ventana con sol y una manta me bastan. Si vives en departamento, puedo ser tu compañero ideal.",
    galeria: [{ tipo: "imagen", src: "../img/milo.jpeg" }]
  },
  {
    id: 3, nombre: "Simba", especie: "perro", tipo: "Perro", edad: "4 años",
    caracteristicas: "Tranquilo y obediente",
    historia: "Hola, soy Simba. Ya pasé la etapa de las travesuras: soy tranquilo, aprendo rápido y camino a tu lado sin tirar la correa. Solo me falta un hogar donde descansar.",
    galeria: [{ tipo: "imagen", src: "../img/simba.jpg" }]
  },
  {
    id: 4, nombre: "Nina", especie: "gato", tipo: "Gata", edad: "3 años", encuadre: "arriba",
    caracteristicas: "Esterilizada y sociable",
    historia: "Hola, soy Nina. Ya estoy esterilizada y me llevo bien con todos. Me gusta acompañarte en silencio y ronronear cuando me haces cariño.",
    galeria: [{ tipo: "imagen", src: "../img/nina.jpg" }]
  },
  {
    id: 5, nombre: "Rocky", especie: "perro", tipo: "Perro", edad: "8 meses", encuadre: "arriba",
    caracteristicas: "Activo y juguetón",
    historia: "Hola, soy Rocky. Tengo energía para regalar: corro, juego y pido la pelota una y otra vez. Busco una familia activa que me enseñe y me acompañe a crecer.",
    galeria: [{ tipo: "imagen", src: "../img/rocky.jpg" }]
  },
  {
    id: 6, nombre: "Canela", especie: "gato", tipo: "Gata", edad: "5 meses",
    caracteristicas: "Juguetona y curiosa",
    historia: "Hola, soy Canela. Todo me da curiosidad: las cajas, los cordones y lo que hay detrás de cada puerta. Quiero una familia con paciencia para mis travesuras de cachorra.",
    galeria: [{ tipo: "imagen", src: "../img/canela.jpg" }]
  }
];

// Si el administrador hizo cambios en este navegador se usan esos datos
const mascotas = JSON.parse(localStorage.getItem("mascotasAdmin")) || mascotasBase;

// Familias que ya adoptaron (testimonios del caso, sin fotos de personas)
const familias = [
  { familia: "Familia Rojas", mascota: "Toby", especie: "perro", texto: "Llegó asustado y hoy duerme a los pies de nuestro hijo. Es uno más de la familia." },
  { familia: "Camila y Andrés", mascota: "Mora", especie: "gato", texto: "Pensamos que adoptar sería difícil, pero el equipo nos acompañó en cada paso." },
  { familia: "Familia Muñoz", mascota: "Bruno", especie: "perro", texto: "Bruno nos cambió la rutina: ahora salimos a caminar todos los días." },
  { familia: "Valentina", mascota: "Pelusa", especie: "gato", texto: "Vivo sola y Pelusa me recibe cada tarde en la puerta. No me imagino la casa sin ella." }
];

// Fotos de mascotas que ya encontraron familia (galería)
const fotosAdoptados = [
  { src: "../img/galeria/toby.jpg", nombre: "Toby" },
  { src: "../img/galeria/michi.jpg", nombre: "Michi" },
  { src: "../img/galeria/nube.jpg", nombre: "Nube" },
  { src: "../img/galeria/coco.jpg", nombre: "Coco" },
  { src: "../img/galeria/adoptado1.jpeg" },
  { src: "../img/galeria/adoptado2.jpeg" },
  { src: "../img/galeria/adoptado3.jpeg" },
  { src: "../img/galeria/adoptado4.jpeg" },
  { src: "../img/galeria/adoptado5.jpeg" }
];
