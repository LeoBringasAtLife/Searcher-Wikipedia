const form = document.getElementById('form');
const input = document.getElementById('word');
const results = document.getElementById('results');

/* SEARCH HANDLER */
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const word = input.value.trim();
  if (!word) return;

  results.textContent = 'Buscando...';
  results.classList.remove('visible');

  try {
    const url = `https://es.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(
      word
    )}`;
    const res = await fetch(url);

    if (!res.ok) {
      throw new Error(
        `No se encontró información enciclopédica sobre "${word}". Probá con otra palabra.`
      );
    }

    const data = await res.json();

    /* Disambiguation page handling */
    if (data.type === 'disambiguation') {
      const items = data.extract
        ?.split('\n')
        .map((line) => line.trim())
        .filter(
          (line) =>
            line !== '' &&
            !line.toLowerCase().includes('puede referirse a:')
        );

      const listHTML =
        items && items.length
          ? `<ul>${items
              .map((item) => `<li>${item.trim()}</li>`)
              .join('')}</ul>`
          : '<p>Revisá Wikipedia para más detalles.</p>';

      results.innerHTML = `
        <h2>${data.title}</h2>
        ${listHTML}
        <p>
          <a
            href="https://es.wikipedia.org/wiki/${encodeURIComponent(
              data.title
            )}"
            target="_blank"
            rel="noopener noreferrer"
          >
            Ver todos los significados en Wikipedia
          </a>
        </p>
      `;
    }
    /* Regular article handling */
    else if (data.extract) {
      results.innerHTML = `
        <h2>${data.title}</h2>
        <p>${data.extract}</p>
        <p><small>Fuente: Wikipedia</small></p>
      `;
    }
    /* No extract available */
    else {
      results.textContent =
        'No se encontró un extracto enciclopédico correspondiente a este término.';
    }

    results.classList.add('visible');
  } catch (error) {
    /* Error handling */
    results.textContent = error.message;
    results.classList.add('visible');
  }
});

/* SIDE MENU */
const abrirMenu = document.getElementById('abrir-menu');
const cerrarMenu = document.getElementById('cerrar-menu');
const menuLateral = document.getElementById('menu-lateral');

/* Open menu */
abrirMenu.addEventListener('click', () => {
  menuLateral.classList.remove('oculto');
});

/* Close menu */
cerrarMenu.addEventListener('click', () => {
  menuLateral.classList.add('oculto');
});

/* Close menu when clicking outside */
document.addEventListener('click', (event) => {
  // Do nothing if menu is already hidden
  if (menuLateral.classList.contains('oculto')) return;

  // Check if click was inside the menu or on the open button
  const clickDentroMenu = menuLateral.contains(event.target);
  const clickEnAbrirMenu = abrirMenu.contains(event.target);

  // Close menu if click was outside
  if (!clickDentroMenu && !clickEnAbrirMenu) {
    menuLateral.classList.add('oculto');
  }
});