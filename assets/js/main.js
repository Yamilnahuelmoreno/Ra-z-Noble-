/* ============================================================
   Raíz Noble — JS principal
   Módulos: header sticky, nav móvil, scroll reveal, divisores de
   raíz animados, tabs de menú, acordeón de ayuda, formularios.
   ============================================================ */
(function () {
  'use strict';

  /* ---------- Header sticky ---------- */
  const header = document.querySelector('[data-header]');
  if (header) {
    const alternarHeader = () => {
      header.classList.toggle('is-scrolled', window.scrollY > 40);
    };
    alternarHeader();
    window.addEventListener('scroll', alternarHeader, { passive: true });
  }

  /* ---------- Navegación móvil ---------- */
  const navToggle = document.querySelector('[data-nav-toggle]');
  const nav = document.querySelector('[data-nav]');

  if (navToggle && nav) {
    const cerrarNav = () => {
      nav.classList.remove('is-abierto');
      navToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    };

    navToggle.addEventListener('click', () => {
      const abierto = nav.classList.toggle('is-abierto');
      navToggle.setAttribute('aria-expanded', String(abierto));
      document.body.style.overflow = abierto ? 'hidden' : '';
    });

    nav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', cerrarNav);
    });

    window.addEventListener('keydown', (evento) => {
      if (evento.key === 'Escape') cerrarNav();
    });
  }

  /* ---------- Revelado progresivo al hacer scroll ---------- */
  const elementosRevelados = document.querySelectorAll('.reveal, .divisor-raiz');

  if ('IntersectionObserver' in window && elementosRevelados.length) {
    const observador = new IntersectionObserver(
      (entradas) => {
        entradas.forEach((entrada) => {
          if (entrada.isIntersecting) {
            entrada.target.classList.add('is-visible');
            observador.unobserve(entrada.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
    );

    elementosRevelados.forEach((el) => observador.observe(el));
  } else {
    elementosRevelados.forEach((el) => el.classList.add('is-visible'));
  }

  /* ---------- Tabs de categorías del menú ---------- */
  const tabsBotones = document.querySelectorAll('[data-menu-tab]');
  const categorias = document.querySelectorAll('[data-menu-categoria]');
  const tabsScroll = document.querySelector('.menu-tabs__scroll');

  // Desvanecido en los bordes según haya o no más contenido para scrollear,
  // en reemplazo de la barra de scroll nativa del navegador.
  const flechaPrev = document.querySelector('[data-menu-tabs-prev]');
  const flechaNext = document.querySelector('[data-menu-tabs-next]');

  if (tabsScroll) {
    const actualizarDesvanecido = () => {
      const { scrollLeft, scrollWidth, clientWidth } = tabsScroll;
      const alInicio = scrollLeft <= 4;
      const alFinal = scrollLeft + clientWidth >= scrollWidth - 4;
      const hayOverflow = scrollWidth > clientWidth + 4;

      tabsScroll.classList.toggle('is-inicio', alInicio);
      tabsScroll.classList.toggle('is-final', alFinal);

      if (flechaPrev) flechaPrev.disabled = !hayOverflow || alInicio;
      if (flechaNext) flechaNext.disabled = !hayOverflow || alFinal;
    };

    actualizarDesvanecido();
    tabsScroll.addEventListener('scroll', actualizarDesvanecido, { passive: true });
    window.addEventListener('resize', actualizarDesvanecido);

    const desplazar = (direccion) => {
      const distancia = tabsScroll.clientWidth * 0.7 * direccion;
      tabsScroll.scrollBy({ left: distancia, behavior: 'smooth' });
    };

    flechaPrev?.addEventListener('click', () => desplazar(-1));
    flechaNext?.addEventListener('click', () => desplazar(1));
  }

  if (tabsBotones.length && categorias.length) {
    const activarCategoria = (id, moverScroll) => {
      tabsBotones.forEach((boton) => {
        boton.classList.toggle('is-activo', boton.dataset.menuTab === id);
      });

      if (moverScroll) {
        const destino = document.getElementById(id);
        if (destino) {
          const offset = 130;
          const y = destino.getBoundingClientRect().top + window.pageYOffset - offset;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      }
    };

    tabsBotones.forEach((boton) => {
      boton.addEventListener('click', () => activarCategoria(boton.dataset.menuTab, true));
    });

    if ('IntersectionObserver' in window) {
      const observadorCategorias = new IntersectionObserver(
        (entradas) => {
          entradas.forEach((entrada) => {
            if (entrada.isIntersecting) {
              activarCategoria(entrada.target.id, false);
            }
          });
        },
        { rootMargin: '-140px 0px -70% 0px', threshold: 0 }
      );

      categorias.forEach((cat) => observadorCategorias.observe(cat));
    }
  }

  /* ---------- Acordeón de preguntas frecuentes ---------- */
  document.querySelectorAll('[data-acordeon-item]').forEach((item) => {
    const pregunta = item.querySelector('[data-acordeon-pregunta]');
    if (!pregunta) return;

    pregunta.addEventListener('click', () => {
      const yaAbierto = item.classList.contains('is-abierto');

      item.parentElement.querySelectorAll('[data-acordeon-item]').forEach((otro) => {
        otro.classList.remove('is-abierto');
        otro.querySelector('[data-acordeon-pregunta]')?.setAttribute('aria-expanded', 'false');
      });

      if (!yaAbierto) {
        item.classList.add('is-abierto');
        pregunta.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* ---------- Validación y envío simulado de formularios ---------- */
  const validadores = {
    nombre: (v) => v.trim().length >= 2 || 'Ingresá tu nombre completo.',
    email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || 'Ingresá un email válido.',
    telefono: (v) => /^[0-9+\s()-]{6,}$/.test(v) || 'Ingresá un teléfono válido.',
    fecha: (v) => v.trim().length > 0 || 'Elegí una fecha.',
    hora: (v) => v.trim().length > 0 || 'Elegí un horario.',
    personas: (v) => (Number(v) > 0 || 'Indicá la cantidad de personas.'),
    mensaje: (v) => v.trim().length >= 5 || 'Contanos un poco más.',
  };

  document.querySelectorAll('[data-formulario]').forEach((formulario) => {
    const mensajeEstado = formulario.querySelector('[data-mensaje-estado]');

    formulario.addEventListener('submit', (evento) => {
      evento.preventDefault();
      let esValido = true;

      formulario.querySelectorAll('[data-campo]').forEach((campo) => {
        const control = campo.querySelector('.campo__control');
        const error = campo.querySelector('[data-campo-error]');
        const regla = validadores[campo.dataset.campo];
        if (!control || !regla) return;

        if (control.hasAttribute('required') || control.value.trim() !== '') {
          const resultado = regla(control.value);
          if (resultado !== true) {
            esValido = false;
            if (error) error.textContent = resultado;
            control.style.borderColor = '#8a1c2d';
            return;
          }
        }

        if (error) error.textContent = '';
        control.style.borderColor = '';
      });

      if (!mensajeEstado) return;

      mensajeEstado.classList.remove('formulario__mensaje-estado--exito', 'formulario__mensaje-estado--error');

      if (esValido) {
        mensajeEstado.classList.add('is-visible', 'formulario__mensaje-estado--exito');
        mensajeEstado.textContent = '¡Listo! Recibimos tu consulta y te vamos a contactar a la brevedad para confirmar.';
        formulario.reset();
      } else {
        mensajeEstado.classList.add('is-visible', 'formulario__mensaje-estado--error');
        mensajeEstado.textContent = 'Revisá los campos marcados antes de enviar tu consulta.';
      }

      mensajeEstado.setAttribute('tabindex', '-1');
      mensajeEstado.focus({ preventScroll: false });
    });
  });

  /* ---------- Año actual en el footer ---------- */
  document.querySelectorAll('[data-anio]').forEach((el) => {
    el.textContent = new Date().getFullYear();
  });
})();
