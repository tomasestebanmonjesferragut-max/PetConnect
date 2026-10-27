# Plan de pruebas manuales – PetConnect

Cada punto tiene la **acción** que hay que hacer y el **resultado esperado** (→).
Marca `[x]` cuando se cumpla. Si algo falla, anótalo al final en la tabla de fallas.

**Dispositivos mínimos:** PC (Chrome y Edge o Firefox) y al menos un teléfono real (Android con Chrome o iPhone con Safari).
**Antes de empezar:** abre el sitio en una ventana normal (no incógnito), salvo donde se indique lo contrario.

---

## 0. Preparación

- [ ] Abrir `tests/pruebas.html` y apretar **Ejecutar pruebas** → Termina con "46 cumplen · 0 fallan".
- [ ] Abrir las herramientas de desarrollador (F12) → pestaña **Consola** sin errores rojos al navegar por todas las páginas.
- [ ] F12 → **Aplicación → Almacenamiento local**: borrar todo y recargar → El sitio funciona igual que la primera vez.
- [ ] Anotar navegador, versión y dispositivo en la tabla final.

---

## 1. General (todas las páginas)

### Encabezado y menú
- [ ] En PC, mirar el encabezado → Logo, "PetConnect" y los links Inicio, Mascotas, Galería, Proceso de adopción, Preguntas frecuentes, Contacto.
- [ ] Hacer clic en cada link del menú → Abre la página correcta y ese link queda marcado como activo.
- [ ] Hacer clic en el logo desde cualquier página → Vuelve al Inicio.
- [ ] Bajar con el scroll en una página larga (no el inicio) → El encabezado queda fijo arriba.
- [ ] En el teléfono → Aparece el botón ☰ en lugar de los links.
- [ ] Tocar ☰ → Se abre el menú con todos los links; tocar un link → Abre la página.
- [ ] Tocar ☰ dos veces → Se abre y se cierra.
- [ ] Achicar la ventana del PC a ~900 px de ancho → Aparece ☰ (el menú no se parte en dos líneas).

### Pie de página
- [ ] En cada página bajar hasta el final → Footer con logo, frase, "Contáctanos" y correo, Instagram y WhatsApp.
- [ ] El footer **no** dice "Santo Tomás" ni "Desafío Web".
- [ ] Clic en el correo → Se abre la app de correo con `adopciones@petconnect.cl`.
- [ ] Clic en Instagram → Abre `instagram.com/petconnect.cl` en otra pestaña.
- [ ] Clic en WhatsApp → Abre `wa.me/56955553402` en otra pestaña (número simulado).

### Pestaña del navegador
- [ ] Mirar la pestaña → Ícono del logo (perro y gato) y título "Nombre de página | PetConnect".

### Tamaños de pantalla
Probar cada página en estos anchos (F12 → modo dispositivo, o redimensionar la ventana):
- [ ] 320 px (teléfono pequeño) → Nada se sale por los lados, no hay scroll horizontal.
- [ ] 375 px (teléfono común) → Igual.
- [ ] 768 px (tablet vertical) → Igual, menú ☰.
- [ ] 1024 px (tablet horizontal / notebook) → Menú completo en una línea.
- [ ] 1280 px y 1920 px (PC) → Contenido centrado, sin espacios raros.
- [ ] Girar el teléfono a horizontal → Todo se reacomoda sin cortarse.
- [ ] Zoom del navegador al 200 % (Ctrl +) → Se puede leer y usar todo.

### Teclado y accesibilidad
- [ ] Recorrer cada página solo con **Tab** → Se ve qué elemento está seleccionado y se llega a todos los links, botones y campos.
- [ ] Con **Enter** sobre un link o botón → Funciona igual que con clic.
- [ ] Con **Escape** en una ventana abierta (ficha, visor, novedades) → Se cierra.
- [ ] Revisar que las imágenes tengan texto alternativo (F12 → inspeccionar `<img>` → atributo `alt`).

---

## 2. Inicio (`index.html`)

### Ventana de novedades
- [ ] Abrir el Inicio por primera vez en la pestaña → Aparece la ventana "Novedades PetConnect" con las 2 últimas mascotas y el aviso "la adopción es gratuita".
- [ ] Cerrarla con ✕ → Se cierra.
- [ ] Recargar (F5) → **No** vuelve a aparecer en esta visita.
- [ ] Cerrar la pestaña y abrir el sitio en una pestaña nueva → Vuelve a aparecer una vez.
- [ ] Botón "Conocerlos" → Lleva a Mascotas.

### Portada
- [ ] En PC → Foto de los animales en la puerta de fondo, ocupando todo el ancho; el menú encima con botones blancos legibles.
- [ ] El texto "Encuentra a tu nuevo mejor amigo" no tapa a ningún animal.
- [ ] En el teléfono → Foto arriba y el texto debajo sobre fondo azul.
- [ ] Botón "Ver mascotas" → Lleva a Mascotas.

### Accesos
- [ ] Clic en cada una de las 4 tarjetas (Conoce las mascotas, Proceso, Preguntas, Contacto) → Abre la página correspondiente.

### Carrusel "Buscan hogar"
- [ ] Mirar el carrusel → Muestra una mascota: texto a la izquierda y foto grande a la derecha (en el teléfono, foto arriba).
- [ ] Esperar 6 segundos sin tocar → Pasa sola a la siguiente mascota.
- [ ] Poner el mouse encima → Deja de avanzar; sacarlo → Vuelve a avanzar.
- [ ] Flecha › → Siguiente mascota. Flecha ‹ → Anterior.
- [ ] Estando en la primera, apretar ‹ → Va a la última (Canela). Estando en la última, › → Vuelve a Luna.
- [ ] Clic en cada punto de abajo → Va a esa mascota y el punto se alarga.
- [ ] En el teléfono, deslizar con el dedo a la izquierda y a la derecha → Cambia de mascota.
- [ ] Botón "Conóceme" → Abre Mascotas con la ficha de esa mascota abierta.
- [ ] Botón "Me interesa adoptar" → Abre Contacto con esa mascota ya elegida.

### Familias que ya adoptaron
- [ ] Bajar hasta "Familias que ya adoptaron" → 4 testimonios con ícono de perro o gato.

---

## 3. Mascotas (`mascotas.html`)

### Listado
- [ ] Entrar sin filtros → "6 mascota(s) encontrada(s)": Luna, Milo, Simba, Nina, Rocky y Canela.
- [ ] Revisar cada tarjeta contra las bases:

| Mascota | Especie / edad | Características |
|---|---|---|
| Luna | Perra – 2 años | Sociable y cariñosa |
| Milo | Gato – 1 año | Adaptado a vida de interior |
| Simba | Perro – 4 años | Tranquilo y obediente |
| Nina | Gata – 3 años | Esterilizada y sociable |
| Rocky | Perro – 8 meses | Activo y juguetón |
| Canela | Gata – 5 meses | Juguetona y curiosa |

- [ ] En cada foto se ve la cara del animal (no cortada).

### Buscador
- [ ] Escribir `ro` letra por letra → Se filtra en cada letra, sin Enter: queda Rocky.
- [ ] Escribir `LUNA` (mayúsculas) → Aparece Luna.
- [ ] Escribir `  luna  ` (con espacios antes y después) → Aparece Luna.
- [ ] Escribir `a` → Todas las que tienen "a" en el nombre.
- [ ] Escribir `xyz` → "No hay mascotas con esos filtros." y ninguna tarjeta.
- [ ] Apretar **Escape** dentro del buscador → Se borra y vuelven las 6.
- [ ] Usar la ✕ del buscador (si el navegador la muestra) → Se borra y vuelven las 6.
- [ ] La página **no** se recarga en ningún momento (la barra de direcciones no cambia).

### Filtros
- [ ] Especie "Perros" → Luna, Simba, Rocky.
- [ ] Especie "Gatos" → Milo, Nina, Canela.
- [ ] Edad "Cachorros" → Rocky y Canela.
- [ ] Edad "Jóvenes (1 a 3 años)" → Luna, Milo, Nina.
- [ ] Edad "Adultos (4 años o más)" → Simba.
- [ ] Combinar "Gatos" + "Cachorros" → Solo Canela.
- [ ] Combinar "Perros" + "Jóvenes" → Solo Luna.
- [ ] Combinar buscador `n` + "Gatos" → Nina y Canela.
- [ ] Combinación sin resultados ("Perros" + buscador `milo`) → Mensaje "No hay mascotas…".

### Limpiar y recordar filtros
- [ ] Sin filtros → El botón "✕ Limpiar filtros" **no** aparece.
- [ ] Poner cualquier filtro → Aparece "✕ Limpiar filtros".
- [ ] Clic en "Limpiar filtros" → Todo vuelve a cero y el botón desaparece.
- [ ] Poner "Gatos", ir a otra página y volver → Sigue el filtro "Gatos".
- [ ] Poner un texto en el buscador y recargar (F5) → El texto sigue ahí y la lista sigue filtrada.

### Favoritos ("Me interesan")
- [ ] Clic en 🤍 de Luna → Cambia a ❤️ y el contador sube a 1.
- [ ] Clic otra vez → Vuelve a 🤍 y el contador baja.
- [ ] Marcar 2 mascotas y apretar "❤ Me interesan (2)" → Solo se ven esas 2 y el botón se pinta.
- [ ] Apretarlo otra vez → Vuelven todas.
- [ ] Marcar favoritos y recargar → Siguen marcados.
- [ ] **Dos pestañas:** abrir Mascotas en dos pestañas, marcar un ❤️ en una y mirar la otra → Se actualiza sola, sin recargar.

### Ficha de la mascota
- [ ] Clic en "Conóceme" → Se abre la ficha con foto, nombre, historia ("Hola, soy…"), especie, edad y características.
- [ ] En PC → Texto a la izquierda y foto a la derecha. En el teléfono → Foto arriba y texto abajo.
- [ ] El nombre se lee bien (fondo blanco detrás del texto).
- [ ] Aparece el aviso "Enviar tu interés no aprueba la adopción…".
- [ ] Botón "🤍 Marcar" → Cambia a "❤️ Marcada" y la tarjeta de atrás también cambia.
- [ ] Botón "Me interesa adoptar" → Abre Contacto con esa mascota elegida.
- [ ] Cerrar con ✕ → Se cierra.
- [ ] Cerrar con **Escape** → Se cierra.
- [ ] En el teléfono, si la ficha es más alta que la pantalla → Se puede hacer scroll dentro de ella.

### Links directos
- [ ] Abrir `mascotas.html?ver=3` → Se abre directo la ficha de Simba.
- [ ] Abrir `mascotas.html?ver=999` → No se abre ninguna ficha y la página funciona normal.
- [ ] Abrir `mascotas.html?ver=abc` → Igual, sin errores.

---

## 4. Galería (`galeria.html`)

- [ ] Entrar → "18 foto(s)": las 6 en adopción (sello verde) y 12 adoptadas (sello naranja).
- [ ] Botón "En adopción" → 6 fotos, todas con sello "En adopción".
- [ ] Botón "Adoptados" → 12 fotos, todas con sello "Adoptado".
- [ ] Botón "Todas" → Vuelven las 18.
- [ ] El botón elegido queda pintado y los otros con borde.
- [ ] Elegir "Adoptados", ir a otra página y volver → Sigue en "Adoptados".
- [ ] Buscador: escribir `toby` → 1 foto.
- [ ] Buscador `luna` con "Todas" → Aparece Luna (en adopción).
- [ ] Buscador `zzz` → "No hay fotos con ese nombre."
- [ ] Escape en el buscador → Se borra.
- [ ] Buscador + botón a la vez (`n` + "En adopción") → Solo las en adopción que tienen "n".
- [ ] Clic en una foto → Se abre el visor en grande con el texto abajo.
- [ ] Flechas ‹ › del visor → Pasa entre las fotos visibles (respeta el filtro elegido).
- [ ] Flechas ← → del teclado con el visor abierto → También cambian de foto.
- [ ] En una foto "en adopción" → El visor muestra el link "Conóceme" y lleva a su ficha.
- [ ] Cerrar el visor con ✕ y con Escape → Se cierra.
- [ ] En el teléfono → Las flechas y la ✕ quedan dentro de la pantalla.
- [ ] La foto de portada **no** aparece en la galería.

---

## 5. Proceso de adopción (`proceso.html`)

- [ ] Entrar → 5 pasos, "Pasos revisados: 0 de 5" y barra vacía.
- [ ] Clic en un paso → Se tacha, la barra avanza 20 % y el texto dice "1 de 5".
- [ ] Clic otra vez en el mismo paso → Se destacha y la barra retrocede.
- [ ] Marcar los 5 → "¡Revisaste todos los pasos! Ya puedes elegir una mascota." y barra llena.
- [ ] Marcar 2 pasos, recargar → Siguen marcados los mismos 2.
- [ ] El paso 4 dice que la adopción **nunca es automática**.
- [ ] Botón "Ver mascotas" → Lleva a Mascotas.

---

## 6. Preguntas frecuentes (`preguntas.html`)

- [ ] Entrar → 5 preguntas cerradas y un buscador arriba.
- [ ] Abrir una pregunta → Se abre; abrir otra → La primera se cierra sola.
- [ ] Buscar `costo` → Queda "¿La adopción tiene costo?" abierta.
- [ ] Buscar `adopcion` (sin tilde) → Encuentra las que dicen "adopción".
- [ ] Buscar `REQUISITOS` (mayúsculas) → Encuentra "¿Qué requisitos debo cumplir?".
- [ ] Buscar una palabra que está solo en la respuesta (ej. `vacunas`) → Encuentra la pregunta del costo.
- [ ] Buscar `dinosaurio` → "No encontramos esa pregunta. Escríbenos…" con link a Contacto.
- [ ] Borrar el buscador o apretar Escape → Vuelven las 5, todas cerradas.
- [ ] Revisar que la pregunta "¿Enviar el formulario significa que ya adopté?" responde que **no**.

---

## 7. Contacto (`contacto.html`)

### Datos y tarjetas
- [ ] Entrar → 3 tarjetas con ícono: Correo, Instagram, WhatsApp.
- [ ] Clic en cada tarjeta → Abre correo / Instagram / WhatsApp.

### Al entrar
- [ ] El formulario **no** muestra errores en rojo al entrar.
- [ ] El botón "Enviar" está desactivado (gris).
- [ ] El select de mascotas tiene "Selecciona..." y las 6 mascotas.

### Nombre
- [ ] Escribir `An` y salir del campo → "Ingresa tu nombre (mínimo 3 letras)."
- [ ] Completar a `Ana` → El error desaparece al instante y el borde se pone verde.
- [ ] Escribir solo espacios → Sigue el error (no cuenta los espacios).

### Correo
- [ ] `ana` → Error de correo.
- [ ] `ana@` → Error.
- [ ] `ana@mail` → Error.
- [ ] `ana@mail.cl` → Sin error, borde verde.
- [ ] ` ana@mail.cl ` (con espacios) → Sin error.
- [ ] `ana @mail.cl` (espacio en medio) → Error.

### Teléfono
- [ ] `1234` → "Escribe un teléfono válido, como +56 9 1234 5678."
- [ ] `+56 9 1234 5678` → Sin error, borde verde.
- [ ] `912345678` (sin +56) → Sin error.
- [ ] `+56 9 1234-5678` (con guion) → Sin error.
- [ ] `(+56) 9 1234 5678` (con paréntesis) → Sin error.
- [ ] `abc12345` (con letras) → Error.
- [ ] `1234567890123` (13 dígitos) → Error.
- [ ] En el teléfono tocar el campo → Se abre el teclado numérico.

### Mascota
- [ ] Elegir una mascota → Aparece al lado una mini tarjeta con su foto, especie, edad y características.
- [ ] Cambiar de mascota → La mini tarjeta cambia al instante.
- [ ] Volver a "Selecciona..." → La mini tarjeta desaparece y aparece el error.

### Mensaje
- [ ] Escribir → El contador cambia en cada letra: "4 / 10 caracteres mínimo".
- [ ] Con 9 caracteres → Error. Con 10 → El contador se pone verde y el error se va.
- [ ] Solo espacios → No cuentan.

### Compromiso y botón
- [ ] Todo bien pero sin marcar el check → Botón desactivado y "Te falta completar 1 campo(s)".
- [ ] Marcar el check → El botón se activa.
- [ ] Desmarcarlo → Se desactiva otra vez y aparece el error del compromiso.
- [ ] Con algo incompleto, apretar **Enter** dentro de un campo → No se envía.

### Borrador
- [ ] Escribir nombre, teléfono y mensaje, recargar (F5) → Lo escrito sigue ahí.
- [ ] Escribir, ir a otra página y volver → Sigue ahí.
- [ ] El check del compromiso **no** se guarda (hay que marcarlo de nuevo, a propósito).

### Envío
- [ ] Completar todo y Enviar → El formulario desaparece y queda "¡Gracias [nombre]! Recibimos tu interés por [mascota]… la adopción no queda aprobada automáticamente."
- [ ] F12 → pestaña **Red** antes de enviar → Al enviar **no** aparece ninguna petición nueva (no se manda nada a un servidor).
- [ ] La página no se recarga al enviar.
- [ ] Después de enviar, recargar → El formulario aparece vacío (el borrador se borró).

### Links directos
- [ ] `contacto.html?mascota=3` → Simba ya elegido y su mini tarjeta visible.
- [ ] `contacto.html?mascota=999` → Ninguna elegida, sin errores.
- [ ] Desde la ficha de una mascota, "Me interesa adoptar" → Esa mascota elegida.

---

## 8. Seguridad

> Estas pruebas buscan que nada de lo que escriba una persona se ejecute como código.

- [ ] En el buscador de Mascotas escribir `<b>hola</b>` → Se busca como texto; no aparece nada en negrita.
- [ ] En el nombre del formulario escribir `<script>alert(1)</script>` y enviar → El mensaje de gracias lo muestra como texto, **no** salta ninguna alerta.
- [ ] En el mensaje escribir `<img src=x onerror=alert(1)>` y recargar (se guarda como borrador) → No salta ninguna alerta.
- [ ] F12 → Consola, pegar:
  `localStorage.setItem("favoritos", "{roto")` y recargar Mascotas → La página funciona normal.
- [ ] F12 → Consola, pegar:
  `localStorage.setItem("mascotasAdmin", '[{"id":1,"nombre":"<img src=x onerror=alert(1)>","galeria":[]}]')` y recargar Mascotas → Se ve el texto raro como nombre, **no** salta alerta. Después ejecutar `localStorage.removeItem("mascotasAdmin")` y recargar.
- [ ] F12 → Consola: `localStorage.setItem("pasosRevisados", "[99, \"x\"]")` y recargar Proceso → "0 de 5", sin errores.
- [ ] Ventana **incógnito** → Todo funciona; al cerrarla no queda nada guardado.
- [ ] Navegador con almacenamiento bloqueado (Configuración → bloquear cookies y datos de sitios) → El sitio igual se puede navegar y filtrar (solo no recuerda nada).

---

## 9. GitHub Pages y teléfono real

- [ ] Abrir `https://tomasestebanmonjesferragut-max.github.io/PetConnect/` → Redirige solo al Inicio.
- [ ] En el teléfono, recorrer todas las páginas → Todas las fotos cargan (si alguna no carga, revisar mayúsculas en el nombre del archivo).
- [ ] En el teléfono, abrir `…/PetConnect/tests/pruebas.html` y ejecutar → 46 cumplen.
- [ ] Tocar los campos del formulario en el teléfono → Se abre el teclado correcto (el correo muestra "@").
- [ ] Deslizar el carrusel con el dedo → Cambia de mascota.
- [ ] Tocar WhatsApp en el teléfono → Abre la app de WhatsApp.
- [ ] Con datos móviles lentos (o F12 → Red → "3G lento") → El sitio carga y se puede usar, aunque las fotos tarden.

---

## 10. Cumplimiento de las bases (revisión final)

- [ ] Hecho con HTML, CSS y JavaScript, sin librerías externas.
- [ ] Responsivo para móvil y escritorio.
- [ ] Están las 6 mascotas con nombre, especie/edad y características.
- [ ] Navegación funcional entre secciones: Inicio, Mascotas, Proceso de adopción, Preguntas frecuentes, Contacto.
- [ ] Hay al menos una interacción JavaScript útil (filtros, buscador, favoritos, ficha).
- [ ] Filtros por especie y edad y buscador por nombre, sin recargar la página.
- [ ] Formulario con nombre, correo, teléfono, mascota de interés y mensaje, que no envía datos a un servidor.
- [ ] El sitio nunca dice que la adopción queda aprobada automáticamente.
- [ ] Datos de contacto simulados visibles.
- [ ] Sin backend, base de datos, login ni pagos.
- [ ] Colores cálidos y buen contraste; tarjetas claras por mascota.
- [ ] Logo propio relacionado con mascotas y adopción.
- [ ] Las fotos usadas son propias o con permiso de uso (revisar marcas de agua de bancos de imágenes).
- [ ] Código ordenado: `public/html`, `public/css`, `public/js`, `public/img/fotos` e `public/img/imagenes`.
- [ ] Preparados para la **misión sorpresa**: cada uno sabe dónde está cada cosa (datos en `datos.js`, estilos en `styles.css`, un JS por página).

---

## Registro de pruebas

| Fecha | Quién probó | Dispositivo | Navegador | Resultado |
|---|---|---|---|---|
| | | | | |
| | | | | |

## Fallas encontradas

| # | Página | Acción que hice | Qué pasó | Qué debía pasar | PC / Móvil | Corregido |
|---|---|---|---|---|---|---|
| 1 | | | | | | |
| 2 | | | | | | |
