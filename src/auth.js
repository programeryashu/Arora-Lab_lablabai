// ═══════════════════════════════════════════════
// ARORA LAB — Authentication Controller
// ═══════════════════════════════════════════════

export function initAuth(onAuthenticated) {
  const authScreen = document.getElementById('auth-screen');
  const loginForm = document.getElementById('login-form');
  const signupForm = document.getElementById('signup-form');
  const authTabs = document.querySelectorAll('.auth-tab');
  const authViews = document.querySelectorAll('.auth-view');
  const togglePasswords = document.querySelectorAll('.toggle-password');

  if (!authScreen) return;

  // Check if already authenticated
  const isAuth = localStorage.getItem('arora-auth') === 'true';
  if (isAuth) {
    authScreen.remove();
    onAuthenticated();
    return;
  }

  // Show Auth Screen
  authScreen.classList.remove('hidden');

  // Tab Switching
  authTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;
      
      authTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      authViews.forEach(view => {
        if (view.id === `${target}-view`) {
          view.classList.add('active');
        } else {
          view.classList.remove('active');
        }
      });
    });
  });

  // Password Toggle
  togglePasswords.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.dataset.target;
      const input = document.getElementById(targetId);
      if (input) {
        const isPassword = input.type === 'password';
        input.type = isPassword ? 'text' : 'password';
        btn.textContent = isPassword ? 'visibility_off' : 'visibility';
      }
    });
  });

  // Handle Login
  loginForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = loginForm.querySelector('button[type="submit"]');
    
    btn.classList.add('loading');
    btn.innerHTML = '<div class="spinner"></div><span>Authenticating...</span>';

    // Mock authentication
    setTimeout(() => {
      localStorage.setItem('arora-auth', 'true');
      transitionToApp();
    }, 1500);
  });

  // Handle Signup
  signupForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = signupForm.querySelector('button[type="submit"]');
    
    btn.classList.add('loading');
    btn.innerHTML = '<div class="spinner"></div><span>Creating Account...</span>';

    // Mock registration
    setTimeout(() => {
      localStorage.setItem('arora-auth', 'true');
      transitionToApp();
    }, 1500);
  });

  function transitionToApp() {
    authScreen.style.opacity = '0';
    authScreen.style.transition = 'opacity 0.5s ease-out';
    
    setTimeout(() => {
      authScreen.remove();
      onAuthenticated();
      if (window.showToast) {
        window.showToast('Welcome to Arora Lab!', 'success');
      }
    }, 500);
  }
}

export function logout() {
  localStorage.removeItem('arora-auth');
  window.location.reload();
}
