# Junto Technologies Website

A static one-page website for Junto Technologies.

## Structure

- `index.html` - Static shell for the landing page
- `metadata.json` - Editable site content, contact details, palette, nav, cards, team info, and footer metadata
- `assets/` - CSS, JavaScript, and assets
- `assets/css/site.css` - Site-specific styling layered on top of the HTML5 UP base
- `assets/js/site.js` - Renders the page from `metadata.json`
- `images/` - Image files
- `public/` - Logo, favicon, and team images
- `server.js` - Local static file server

## Running Locally

```bash
npm run dev
```

Visit: http://localhost:3000 (or alternate port if shown in console)

## Deployment

GitHub Pages deployment is configured via GitHub Actions workflow.
