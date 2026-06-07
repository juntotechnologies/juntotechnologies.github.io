(function () {
  const metadataUrl = 'metadata.json';

  const byId = (id) => document.getElementById(id);

  function hexToRgb(hex) {
    const value = hex.replace('#', '');
    const normalized = value.length === 3
      ? value.split('').map((char) => char + char).join('')
      : value;
    const number = Number.parseInt(normalized, 16);

    return {
      r: (number >> 16) & 255,
      g: (number >> 8) & 255,
      b: number & 255
    };
  }

  function rgba(hex, alpha) {
    const { r, g, b } = hexToRgb(hex);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  function setPalette(palette) {
    const root = document.documentElement;

    root.style.setProperty('--palette-brown', palette.brown);
    root.style.setProperty('--palette-teal', palette.teal);
    root.style.setProperty('--palette-gold', palette.gold);
    root.style.setProperty('--palette-red', palette.red);
    root.style.setProperty('--border-soft', rgba(palette.brown, 0.22));
    root.style.setProperty('--muted-text', rgba(palette.brown, 0.72));
    root.style.setProperty('--teal-wash', rgba(palette.teal, 0.12));
    root.style.setProperty('--teal-dot', rgba(palette.teal, 0.22));
    root.style.setProperty('--gold-wash', rgba(palette.gold, 0.12));
  }

  function el(tag, attributes = {}, children = []) {
    const element = document.createElement(tag);

    Object.entries(attributes).forEach(([key, value]) => {
      if (value === undefined || value === null) return;
      if (key === 'className') {
        element.className = value;
      } else if (key === 'text') {
        element.textContent = value;
      } else if (key === 'html') {
        element.innerHTML = value;
      } else {
        element.setAttribute(key, value);
      }
    });

    children.forEach((child) => element.append(child));
    return element;
  }

  function setDocumentMetadata({ site }) {
    document.title = site.title;

    const favicon = document.querySelector('link[rel="icon"]');
    if (favicon) {
      favicon.href = site.favicon;
    }
  }

  function resolveHref(item, contact) {
    if (item.action === 'contact') {
      return `mailto:${contact.email}`;
    }

    return item.href;
  }

  function renderHeader({ site, nav, contact }) {
    const header = byId('header');
    const listItems = nav.map((item) => {
      const className = item.primary ? 'nav-link nav-link--primary' : 'nav-link';
      return el('li', {}, [
        el('a', { className, href: resolveHref(item, contact), text: item.label })
      ]);
    });

    header.replaceChildren(
      el('div', { className: 'inner' }, [
        el('a', { className: 'logo', href: 'index.html' }, [
          el('span', { className: 'symbol' }, [
            el('img', { src: site.logo, alt: site.name })
          ]),
          el('span', { className: 'title', text: site.name })
        ]),
        el('nav', {}, [
          el('ul', {}, listItems)
        ])
      ])
    );
  }

  function renderHero(hero) {
    return el('header', {}, [
      el('h1', { html: `${hero.heading}<br />` }),
      el('p', { text: hero.body })
    ]);
  }

  function renderWork(work, contact) {
    const mailto = `mailto:${contact.email}`;
    const cards = work.items.map((item) => (
      el('article', { className: item.style }, [
        el('span', { className: 'image' }, [
          el('img', { src: item.image, alt: '' })
        ]),
        el('a', { href: mailto }, [
          el('h2', { text: item.title }),
          el('div', { className: 'content' }, [
            el('p', { text: item.body })
          ])
        ])
      ])
    ));

    return el('section', { id: work.id, className: 'tiles' }, cards);
  }

  function renderTeam(team) {
    const cards = team.members.map((member) => (
      el('article', { className: 'team-card' }, [
        el('div', { className: 'team-photo' }, [
          el('img', { src: member.image, alt: member.alt })
        ]),
        el('div', { className: 'team-copy' }, [
          el('h3', { className: 'team-name', text: member.name }),
          el('p', { className: 'team-role', text: member.role }),
          el('p', { className: 'team-bio', html: member.bioHtml })
        ])
      ])
    ));

    return el('section', { id: team.id }, [
      el('div', { className: 'team-section' }, [
        el('div', { className: 'team-intro' }, [
          el('span', { className: 'section-chip', text: team.eyebrow }),
          el('h2', { className: 'section-heading', text: team.heading }),
          el('p', { className: 'section-lede', text: team.body })
        ]),
        el('div', { className: 'team-grid' }, cards)
      ])
    ]);
  }

  function renderMain(metadata) {
    const main = byId('site-content');
    main.replaceChildren(
      renderHero(metadata.hero),
      renderWork(metadata.work, metadata.contact),
      renderTeam(metadata.team)
    );
  }

  function renderFooter({ site, footer }) {
    const footerElement = byId('footer');
    footerElement.replaceChildren(
      el('div', { className: 'inner' }, [
        el('ul', { className: 'copyright' }, [
          el('li', { text: `© ${site.name}. ${footer.copyright}` }),
          el('li', {}, [
            el('a', {
              href: footer.attribution.href,
              text: footer.attribution.label
            })
          ])
        ])
      ])
    );
  }

  async function loadSite() {
    const response = await fetch(metadataUrl);
    if (!response.ok) {
      throw new Error(`Unable to load ${metadataUrl}`);
    }

    const metadata = await response.json();
    setDocumentMetadata(metadata);
    setPalette(metadata.palette);
    renderHeader(metadata);
    renderMain(metadata);
    renderFooter(metadata);
    document.body.classList.remove('is-preload');
  }

  if (/Mobi|Android/i.test(navigator.userAgent)) {
    document.body.classList.add('is-touch');
  }

  loadSite().catch((error) => {
    console.error(error);
    document.body.classList.remove('is-preload');
  });
})();
