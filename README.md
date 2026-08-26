# Raíz Noble — Sitio web

Sitio corporativo/informativo con reservas para el restaurante **Raíz Noble** (Córdoba, Argentina).

## Estructura

```
raiz-noble/
├── index.html                 ← única página HTML en la raíz
├── pages/
│   ├── menu.html
│   ├── reservaciones.html
│   ├── sobre-nosotros.html
│   └── ayuda.html
└── assets/
    ├── scss/                  ← fuente SASS (editar acá)
    │   ├── base/               variables, mixins, reset, tipografía, utilidades
    │   ├── components/         header, botones, hero, tarjetas, footer,
    │   │                       formularios, menú, acordeón, animaciones
    │   ├── pages/               ajustes puntuales por página
    │   └── main.scss           punto de entrada (importa todo)
    ├── css/
    │   └── main.css            CSS compilado — no editar a mano, ver abajo
    ├── js/
    │   └── main.js             nav, scroll reveal, tabs, acordeón, formularios
    └── img/                    imágenes optimizadas en .webp
```

## Cómo recompilar el SASS

Este entorno de generación no tuvo acceso a un compilador SASS (sin red),
así que `assets/css/main.css` fue **traducido a mano** desde los partials
`.scss`, manteniendo exactamente la misma estructura de selectores. Son
equivalentes, pero si vas a seguir desarrollando el sitio, instalá Dart Sass
y compilá desde la fuente para evitar que los dos árboles se desincronicen:

```bash
npm install -g sass
sass assets/scss/main.scss assets/css/main.css --style=expanded --source-map
# para producción:
sass assets/scss/main.scss assets/css/main.css --style=compressed --no-source-map
```

## Identidad visual

- **Color principal:** negro raíz `#0a0908` (según lo pedido), con tierra
  oscura `#1c1712` como superficie secundaria.
- **Acento noble:** bronce `#b08d57` (CTAs, bordes, detalles).
- **Acento cálido:** vino profundo `#6e1423` (usado en tarjetas de
  especiales y botón secundario).
- **Tipografía:** Fraunces (display, con cursiva) + Work Sans (texto).
- **Firma visual:** una línea de "raíz" (SVG) que se dibuja al hacer scroll,
  usada como divisor de sección — referencia directa al nombre del
  restaurante. Clase `.divisor-raiz` en `components/_animaciones.scss`.

## Funcionalidad JS (assets/js/main.js)

- Header sticky con cambio de estilo al scrollear.
- Nav responsive a pantalla completa en mobile/tablet.
- Scroll reveal con IntersectionObserver (con fallback `<noscript>` para
  que el contenido nunca quede invisible si JS falla).
- Menú: tabs de categorías con scroll-spy automático.
- Acordeón de preguntas frecuentes (Ayuda).
- Validación y envío simulado de los formularios de Reservaciones y Ayuda
  (no hay backend — para conectar un envío real hace falta un endpoint,
  por ejemplo con Formspree, Netlify Forms o una función serverless).

## Pendiente antes de publicar

- Reemplazar los teléfonos `351 XXX XXXX` y el email de ejemplo por los
  datos reales.
- Actualizar la dirección exacta y, si querés, sumar un mapa embebido.
- Conectar el formulario de reservas a un servicio real de envío/backend.
- Revisar/canjear las URLs de `og:url` y `canonical` por el dominio final.
- Comprimir imágenes adicionales si se suman más fotos (mantener .webp).
