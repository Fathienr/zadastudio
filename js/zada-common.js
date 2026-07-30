/* Common UI behavior for ZADA STUDIO styling */

// Immediate Theme Setup to prevent FOUC (Flash of Unstyled Content)
(function applyInitialTheme() {
  try {
    const savedTheme = localStorage.getItem("zada_theme");
    // Default is 'light' (tema biasa) as requested by user
    if (savedTheme === "dark") {
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.setAttribute("data-theme", "light");
    }
  } catch (e) {
    document.documentElement.setAttribute("data-theme", "light");
  }
})();

function createThemeToggleBtn(idSuffix) {
  const btn = document.createElement("button");
  btn.id = idSuffix ? `themeToggle_${idSuffix}` : "themeToggle";
  btn.className = "theme-toggle";
  btn.setAttribute("type", "button");
  btn.setAttribute("aria-label", "Ganti Tema Biasa / Dark Mode");
  btn.innerHTML = `
    <span class="theme-toggle__icon theme-toggle__icon--sun" aria-hidden="true">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
    </span>
    <span class="theme-toggle__icon theme-toggle__icon--moon" aria-hidden="true">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
    </span>
    <span class="theme-toggle__label">Tema</span>
  `;
  return btn;
}

function updateToggleButtonsState(currentTheme) {
  const isDark = currentTheme === "dark";
  document.querySelectorAll(".theme-toggle").forEach((btn) => {
    const label = btn.querySelector(".theme-toggle__label");
    if (label) {
      label.textContent = isDark ? "Mode Gelap" : "Tema Biasa";
    }
    btn.setAttribute("title", isDark ? "Beralih ke Tema Biasa (Terang)" : "Beralih ke Mode Gelap");
  });
}

function initThemeToggle() {
  const currentTheme = document.documentElement.getAttribute("data-theme") || "light";

  // Desktop Nav Inject
  const navContainers = document.querySelectorAll(".navbar__links, .nav-links");
  navContainers.forEach((container, idx) => {
    if (!container.querySelector(".theme-toggle")) {
      const btn = createThemeToggleBtn(`desktop_${idx}`);
      container.appendChild(btn);
    }
  });

  // Mobile Nav Inject
  const mobileNavs = document.querySelectorAll(".navbar__mobile");
  mobileNavs.forEach((mNav, idx) => {
    if (!mNav.querySelector(".theme-toggle")) {
      const btn = createThemeToggleBtn(`mobile_${idx}`);
      mNav.appendChild(btn);
    }
  });

  // Also standalone container if header has no links
  const siteNavs = document.querySelectorAll(".site-nav .container, .navbar__inner");
  siteNavs.forEach((inner, idx) => {
    if (!inner.querySelector(".theme-toggle") && !inner.querySelector(".navbar__links") && !inner.querySelector(".nav-links")) {
      const btn = createThemeToggleBtn(`standalone_${idx}`);
      inner.appendChild(btn);
    }
  });

  updateToggleButtonsState(currentTheme);

  // Bind click handlers
  document.addEventListener("click", (e) => {
    const toggleBtn = e.target.closest(".theme-toggle");
    if (toggleBtn) {
      e.preventDefault();
      const activeTheme = document.documentElement.getAttribute("data-theme") || "light";
      const nextTheme = activeTheme === "dark" ? "light" : "dark";

      document.documentElement.setAttribute("data-theme", nextTheme);
      try {
        localStorage.setItem("zada_theme", nextTheme);
      } catch (err) {}
      
      updateToggleButtonsState(nextTheme);
      triggerTypewriterThemeTransition();
    }
  });
}

function triggerTypewriterThemeTransition() {
  const targetBody = document.body || document.documentElement;
  targetBody.classList.remove("theme-typewriter-active");
  // Force reflow
  void targetBody.offsetWidth;
  targetBody.classList.add("theme-typewriter-active");

  if (window._typewriterTimer) {
    clearTimeout(window._typewriterTimer);
  }
  window._typewriterTimer = setTimeout(() => {
    targetBody.classList.remove("theme-typewriter-active");
  }, 3000);
}

document.addEventListener("DOMContentLoaded", () => {
  // Initialize Theme Toggle
  initThemeToggle();

  // Trigger Typewriter effect on initial page load
  triggerTypewriterThemeTransition();

  // 1. Hide Loader
  const loader = document.getElementById("loader");
  if (loader) {
    setTimeout(() => {
      loader.classList.add("is-hidden");
    }, 500);
  }

  // 2. Scroll Progress
  const scrollProgress = document.getElementById("scrollProgress");
  if (scrollProgress) {
    window.addEventListener("scroll", () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = totalHeight > 0 ? (window.scrollY / totalHeight) * 100 : 0;
      scrollProgress.style.width = `${progress}%`;
    }, { passive: true });
  }

  // 3. Navbar scroll state & mobile drawer
  const navbar = document.getElementById("navbar");
  if (navbar) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 20) {
        navbar.classList.add("is-scrolled");
      } else {
        navbar.classList.remove("is-scrolled");
      }
    }, { passive: true });
  }

  const navToggle = document.getElementById("navToggle");
  const navMobile = document.getElementById("navMobile");
  const navMobileClose = document.getElementById("navMobileClose");

  if (navToggle && navMobile) {
    navToggle.addEventListener("click", () => {
      navMobile.classList.add("is-open");
    });
    navMobileClose?.addEventListener("click", () => {
      navMobile.classList.remove("is-open");
    });
    navMobile.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", () => navMobile.classList.remove("is-open"));
    });
  }

  // 4. Custom cursor
  const dot = document.getElementById("cursorDot");
  const ring = document.getElementById("cursorRing");
  if (dot && ring && window.matchMedia("(hover: hover)").matches) {
    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;

    window.addEventListener("mousemove", (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
    });

    function animateRing() {
      ringX += (mouseX - ringX) * 0.2;
      ringY += (mouseY - ringY) * 0.2;
      ring.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
      requestAnimationFrame(animateRing);
    }
    animateRing();

    document.querySelectorAll("a, button, input, select").forEach((el) => {
      el.addEventListener("mouseenter", () => ring.classList.add("is-active"));
      el.addEventListener("mouseleave", () => ring.classList.remove("is-active"));
    });
  }

  // 5. Back to top button
  const backToTop = document.getElementById("backToTop");
  if (backToTop) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 400) {
        backToTop.classList.add("is-visible");
      } else {
        backToTop.classList.remove("is-visible");
      }
    }, { passive: true });

    backToTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // 6. Page transition loader when clicking internal page links (.html)
  document.querySelectorAll('a[href$=".html"], a[href*="studio.html"], a[href*="photobooth.html"], a[href*="yearbook.html"]').forEach((link) => {
    link.addEventListener("click", (e) => {
      const targetUrl = link.getAttribute("href");
      // Only apply transition if link is not on current page anchor
      if (loader && targetUrl && !targetUrl.startsWith("#") && !e.ctrlKey && !e.metaKey && link.target !== "_blank") {
        const currentPath = window.location.pathname.split("/").pop() || "index.html";
        if (targetUrl !== currentPath) {
          e.preventDefault();
          loader.classList.remove("is-hidden");
          setTimeout(() => {
            window.location.href = targetUrl;
          }, 400);
        }
      }
    });
  });

  // 7. Scroll Reveal Animations (Eye-pleasing IntersectionObserver with staggered delays)
  function initScrollReveal() {
    const autoTargets = [
      ".section-head",
      ".service-card",
      ".feature-card",
      ".pricing-card",
      ".stat-card",
      ".stage-step",
      ".faq-item",
      ".card",
      ".sewa-card",
      ".price-card",
      ".pkg-card",
      ".about-card",
      ".gallery-item",
      ".footer__col",
      ".footer-grid > div"
    ];

    autoTargets.forEach((selector) => {
      document.querySelectorAll(selector).forEach((el) => {
        if (!el.classList.contains("reveal") && !el.hasAttribute("data-reveal")) {
          el.classList.add("reveal");
        }
      });
    });

    const containers = document.querySelectorAll(
      ".services__grid, #portfolio-grid, .grid, .feature-grid, .pricing-grid, .stat-cards, .stage-options, .footer-grid"
    );
    containers.forEach((container) => {
      const children = Array.from(container.children).filter(
        (c) => c.classList.contains("reveal") || c.hasAttribute("data-reveal")
      );
      children.forEach((child, index) => {
        const delay = (index % 6) * 110;
        child.style.transitionDelay = `${delay}ms`;
      });
    });

    const elementsToReveal = document.querySelectorAll(".reveal, [data-reveal]");
    if (!elementsToReveal.length) return;

    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-revealed");
              observer.unobserve(entry.target);
            }
          });
        },
        {
          root: null,
          rootMargin: "0px 0px -40px 0px",
          threshold: 0.08
        }
      );

      elementsToReveal.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top <= window.innerHeight * 0.95 && rect.bottom >= 0) {
          el.classList.add("is-revealed");
        } else {
          observer.observe(el);
        }
      });
    } else {
      elementsToReveal.forEach((el) => el.classList.add("is-revealed"));
    }
  }

  window.ZadaReveal = {
    scan: initScrollReveal
  };

  initScrollReveal();

  if ("MutationObserver" in window) {
    let timer = null;
    const observer = new MutationObserver(() => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        initScrollReveal();
      }, 80);
    });
    const target = document.body;
    if (target) {
      observer.observe(target, { childList: true, subtree: true });
    }
  }
});

