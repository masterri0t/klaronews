// script.js – KlaroNews
console.log("KlaroNews JS läuft ✅");


document.addEventListener("DOMContentLoaded", () => {
  // ===== 1. Jahr & Datum setzen =====
  const yearSpan = document.getElementById("year");
  const todayLabel = document.getElementById("today-label");
  const now = new Date();

  if (yearSpan) yearSpan.textContent = now.getFullYear();

  if (todayLabel) {
    const options = { day: "2-digit", month: "2-digit", year: "numeric" };
    todayLabel.textContent = now.toLocaleDateString("de-DE", options);
  }

  // ===== 2. Smooth Scroll für Nav =====
  const navLinks = document.querySelectorAll('a.nav-link[href^="#"]');

  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      const targetId = link.getAttribute("href");
      if (!targetId || targetId === "#") return;

      const targetEl = document.querySelector(targetId);
      if (!targetEl) return;

      e.preventDefault();

      const rect = targetEl.getBoundingClientRect();
      const offsetTop = rect.top + window.scrollY - 70; // kleiner Offset für Header

      window.scrollTo({
        top: offsetTop,
        behavior: "smooth",
      });
    });
  });

  // ===== 3. Hero-Buttons: Scroll zu Content =====
  const heroPrimary = document.querySelector(".btn-primary");
  const heroSecondary = document.querySelector(".btn-ghost");
  const articlesGrid = document.querySelector(".articles-grid");
  const sidebarCard = document.querySelector(".sidebar-card");

  if (heroPrimary && articlesGrid) {
    heroPrimary.addEventListener("click", () => {
      const rect = articlesGrid.getBoundingClientRect();
      const offsetTop = rect.top + window.scrollY - 60;

      window.scrollTo({
        top: offsetTop,
        behavior: "smooth",
      });
    });
  }

  if (heroSecondary && sidebarCard) {
    heroSecondary.addEventListener("click", () => {
      const rect = sidebarCard.getBoundingClientRect();
      const offsetTop = rect.top + window.scrollY - 60;

      window.scrollTo({
        top: offsetTop,
        behavior: "smooth",
      });
    });
  }

  // ===== 4. Scroll-Reveal Animations =====
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  const revealElements = document.querySelectorAll(
    ".hero-card, .article-card, .sidebar-card, .section-title"
  );

  if (!prefersReducedMotion && "IntersectionObserver" in window) {
    revealElements.forEach((el) => {
      el.style.opacity = "0";
      el.style.transform = "translateY(18px)";
      el.style.transition =
        "opacity 0.6s ease-out, transform 0.6s ease-out";
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target;
            el.style.opacity = "1";
            el.style.transform = "translateY(0)";
            observer.unobserve(el);
          }
        });
      },
      {
        root: null,
        threshold: 0.16,
        rootMargin: "0px 0px -10% 0px",
      }
    );

    revealElements.forEach((el) => observer.observe(el));
  } else {
    // Fallback: direkt sichtbar
    revealElements.forEach((el) => {
      el.style.opacity = "1";
      el.style.transform = "none";
    });
  }

  // ===== 5. Active Nav beim Scrollen =====
  const sections = [
    { id: "#top", element: document.body },
    { id: "#politik", element: document.getElementById("politik") },
    { id: "#welt", element: document.getElementById("welt") },
    { id: "#gesellschaft", element: document.getElementById("gesellschaft") },
  ].filter((s) => s.element);

  function updateActiveNav() {
    let currentId = "#top";

    sections.forEach((s) => {
      const rect = s.element.getBoundingClientRect();
      if (rect.top <= 80 && rect.bottom > 80) {
        currentId = s.id;
      }
    });

    navLinks.forEach((link) => {
      const href = link.getAttribute("href");
      if (href === currentId) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });
  }

  window.addEventListener("scroll", updateActiveNav, { passive: true });
  updateActiveNav();

  // ===== 6. Newsletter Fake-Logic mit Toast =====
  const newsletterForm = document.querySelector(".newsletter-form");
  const emailInput = document.querySelector(".newsletter-input");

  if (newsletterForm && emailInput) {
    newsletterForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const email = emailInput.value.trim();
      if (!email || !email.includes("@")) {
        showToast("Bitte gib eine gültige E-Mail ein.", "error");
        return;
      }

      // hier später echtes Backend einbauen
      emailInput.value = "";
      showToast("Danke! Dein Klaro Briefing ist (bald) aktiviert.", "success");
    });
  }

  // ===== 7. Toast-Funktion =====
  let toastTimeout;

  function showToast(message, type = "success") {
    // ggf. alten Toast löschen
    const existing = document.querySelector(".klaro-toast");
    if (existing) existing.remove();
    if (toastTimeout) clearTimeout(toastTimeout);

    const toast = document.createElement("div");
    toast.className = "klaro-toast";
    toast.textContent = message;

    // Basic Styles via JS, damit du nix extra im CSS ändern musst
    Object.assign(toast.style, {
      position: "fixed",
      left: "50%",
      bottom: "26px",
      transform: "translateX(-50%) translateY(20px)",
      padding: "10px 16px",
      borderRadius: "999px",
      fontSize: "0.82rem",
      fontFamily:
        'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      background:
        type === "error" ? "#ff375f" : "rgba(249,255,0,0.95)",
      color: type === "error" ? "#ffffff" : "#000000",
      boxShadow: "0 14px 30px rgba(0,0,0,0.6)",
      zIndex: "9999",
      opacity: "0",
      transition: "opacity 0.25s ease-out, transform 0.25s ease-out",
      pointerEvents: "none",
      textAlign: "center",
      whiteSpace: "nowrap",
      maxWidth: "90%",
    });

    document.body.appendChild(toast);

    // kleine Animation
    requestAnimationFrame(() => {
      toast.style.opacity = "1";
      toast.style.transform = "translateX(-50%) translateY(0)";
    });

    toastTimeout = setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateX(-50%) translateY(20px)";
      setTimeout(() => toast.remove(), 260);
    }, 2800);
  }
});
