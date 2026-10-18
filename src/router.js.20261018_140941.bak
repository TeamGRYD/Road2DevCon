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

  // Try exact match first
  let handler = routes[path];
  let params = {};

  if (handler) {
    currentRoute = path;
  } else {
    // Try prefix match for parameterized routes (e.g., /leaderboard/vmatm00s)
    for (const [routePath, routeHandler] of Object.entries(routes)) {
      if (path.startsWith(routePath + '/')) {
        handler = routeHandler;
        params.suffix = path.slice(routePath.length + 1);
        currentRoute = routePath;
        break;
      }
    }
  }

  if (handler) {
    const app = document.getElementById('app');
    if (app) {
      app.innerHTML = '';
      handler(app, params);
      window.scrollTo(0, 0);
    }
    updateActiveNav(currentRoute);
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
