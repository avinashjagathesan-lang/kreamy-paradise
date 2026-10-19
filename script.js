document.addEventListener("DOMContentLoaded", () => {
  // Welcome intro: animate in, then reveal the website.
  const introScreen = document.getElementById("introScreen");
  if (introScreen) {
    document.body.classList.add("intro-active");
    const finishIntro = () => {
      introScreen.classList.add("is-leaving");
      document.body.classList.remove("intro-active");
      window.setTimeout(() => introScreen.remove(), 750);
    };
    window.setTimeout(finishIntro, 1900);
    // Allow visitors to skip the intro with a click or keyboard.
    introScreen.addEventListener("click", finishIntro, { once: true });
    introScreen.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") finishIntro();
    });
    introScreen.tabIndex = 0;
  }

  // Mobile navigation
  const menuToggle = document.getElementById("menuToggle");
  const navLinks = document.getElementById("navLinks");

  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
      const isOpen = navLinks.classList.toggle("open");
      menuToggle.setAttribute("aria-expanded", String(isOpen));
      menuToggle.setAttribute(
        "aria-label",
        isOpen ? "Close navigation" : "Open navigation"
      );
      menuToggle.textContent = isOpen ? "×" : "☰";
    });

    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Open navigation");
        menuToggle.textContent = "☰";
      });
    });

    // If the browser is resized to desktop width, reset the mobile menu.
    window.addEventListener("resize", () => {
      if (window.innerWidth > 650) {
        navLinks.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Open navigation");
        menuToggle.textContent = "☰";
      }
    });
  }

  // Menu category filters
  const filterButtons = document.querySelectorAll(".filter-button");
  const menuSections = document.querySelectorAll(".menu-category");

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const selectedCategory = button.dataset.filter;

      filterButtons.forEach((item) => {
        const isActive = item === button;
        item.classList.toggle("active", isActive);
        item.setAttribute("aria-pressed", String(isActive));
      });

      menuSections.forEach((section) => {
        const matches =
          selectedCategory === "all" ||
          section.dataset.category === selectedCategory;

        section.hidden = !matches;

        if (matches && section.hasAttribute("data-reveal")) {
          section.classList.remove("is-visible");
          requestAnimationFrame(() => section.classList.add("is-visible"));
        }
      });
    });
  });

  // Footer year
  const yearElement = document.getElementById("currentYear");
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // Scroll reveal animations
  const revealElements = document.querySelectorAll("[data-reveal]");
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    revealElements.forEach((element) => element.classList.add("is-visible"));
    return;
  }

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -30px 0px"
    }
  );

  revealElements.forEach((element, index) => {
    const delay = Math.min(index % 4, 3) * 100;
    element.style.setProperty("--reveal-delay", `${delay}ms`);
    revealObserver.observe(element);
  });
});
