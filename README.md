# Junto Technologies Website

A modern, component-based website using HTMX and Three.js.

## Structure

- `components/` - Reusable HTML components
  - `header.html` - Site header
  - `footer.html` - Site footer
  - `nav.html` - Navigation menu
  - `home-content.html` - Home page content
  - `generic-content.html` - Generic page content
- `assets/` - CSS, JavaScript, and other assets
- `images/` - Image files

## Local Development

To test the site locally, you can use any static file server:

```bash
# Using Python (if installed)
python -m http.server

# OR using npx (if Node.js is installed)
npx http-server

# OR using VS Code Live Server extension
# Click "Go Live" in the VS Code status bar
```

Then visit: http://localhost:8000 (or the port shown in your terminal)

## GitHub Pages Deployment

This site is configured to automatically deploy to GitHub Pages when changes are pushed to the main branch.

### How It Works

- The GitHub Actions workflow in `.github/workflows/deploy.yml` handles deployment
- HTMX loads components dynamically using client-side requests
- No server-side code is needed - everything is static HTML/CSS/JS

## Customizing

### Adding or Editing Components

1. Edit files in the `components/` directory
2. Reference them using HTMX attributes:
   ```html
   <div hx-get="components/your-component.html" hx-trigger="load"></div>
   ```

## Three.js Integration

Three.js is included for 3D graphics. To add a 3D scene:

1. Create a new component for your scene:
   ```html
   <!-- components/scene.html -->
   <div id="three-scene"></div>
   ```

2. Add JavaScript to initialize Three.js:
   ```javascript
   // assets/js/scene.js
   import * as THREE from 'three';
   
   const scene = new THREE.Scene();
   // Your 3D code here
   ```

3. Link to your scene script:
   ```html
   <script type="module" src="assets/js/scene.js"></script>
   ```