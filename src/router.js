// =================== HASH-BASED SPA ROUTER ===================

const routes = {};
let currentRoute = null;

export function registerRoute(path, handler) {
  routes[path] = handler;
}

export function navigateTo(path) {
  window.location.hash = path;
}

export function getCurrentRoute() {
  return currentRoute;
}

export function initRouter() {
  window.addEventListener('hashchange', handleRoute);
  handleRoute(); // Handle initial load
}

function handleRoute() {
  const hash = window.location.hash.slice(1) || '/home';
  const path = hash.startsWith('/') ? hash : '/' + hash;

  // Find matching route
  const handler = routes[path];
  if (handler) {
    currentRoute = path;
    const app = document.getElementById('app');
    if (app) {
      app.innerHTML = '';
      handler(app);
      window.scrollTo(0, 0);
    }
    updateActiveNav(path);
  } else {
    // Default to home
    navigateTo('/home');
  }
}

function updateActiveNav(path) {
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    link.classList.toggle('active', href === `#${path}`);
  });
}
