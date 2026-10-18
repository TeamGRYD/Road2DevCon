// =================== HISTORY-BASED SPA ROUTER ===================

const routes = {};
let currentRoute = null;

export function registerRoute(path, handler) {
  routes[path] = handler;
}

function normalizePath(rawPath) {
  if (!rawPath) return '/';
  let path = rawPath.startsWith('#') ? rawPath.slice(1) : rawPath;
  if (!path.startsWith('/')) path = '/' + path;
  if (path.length > 1 && path.endsWith('/')) {
    path = path.slice(0, -1);
  }
  return path;
}

export function navigateTo(path, { replace = false } = {}) {
  const target = normalizePath(path);
  if (window.location.pathname !== target || window.location.hash) {
    if (replace) {
      history.replaceState(null, '', target);
    } else {
      history.pushState(null, '', target);
    }
  }
  handleRoute();
}

export function getCurrentRoute() {
  return currentRoute;
}

export function initRouter() {
  window.addEventListener('popstate', handleRoute);

  // Support legacy #/... links if hash changes while page is open
  window.addEventListener('hashchange', () => {
    if (window.location.hash.startsWith('#/')) {
      navigateTo(window.location.hash.slice(1), { replace: true });
    }
  });

  // Intercept internal link clicks for client-side SPA navigation
  document.addEventListener('click', (e) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) {
      return;
    }
    const link = e.target.closest('a');
    if (!link) return;
    if (link.target && link.target !== '_self') return;
    if (link.hasAttribute('download')) return;

    const href = link.getAttribute('href');
    if (!href) return;

    if (href.startsWith('#/')) {
      e.preventDefault();
      navigateTo(href.slice(1));
    } else if (href.startsWith('/') && !href.startsWith('//')) {
      e.preventDefault();
      navigateTo(href);
    }
  });

  handleRoute(); // Handle initial load
}

function handleRoute() {
  // Redirect legacy hash routes (e.g. /#/quizzes -> /quizzes)
  if (window.location.hash.startsWith('#/')) {
    const legacyPath = normalizePath(window.location.hash.slice(1));
    history.replaceState(null, '', legacyPath);
  }

  const path = normalizePath(window.location.pathname || '/');

  // Treat '/' and '/home' as the home route
  const lookupPath = path === '/' ? (routes['/'] ? '/' : '/home') : path;

  // Try exact match first
  let handler = routes[lookupPath];
  let params = {};

  if (handler) {
    currentRoute = lookupPath;
  } else {
    // Try prefix match for parameterized routes (e.g., /leaderboard/vmatm00s)
    for (const [routePath, routeHandler] of Object.entries(routes)) {
      if (routePath !== '/' && lookupPath.startsWith(routePath + '/')) {
        handler = routeHandler;
        params.suffix = lookupPath.slice(routePath.length + 1);
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
    navigateTo('/', { replace: true });
  }
}

function updateActiveNav(path) {
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    link.classList.toggle('active', href === path || href === `#${path}`);
  });
}

