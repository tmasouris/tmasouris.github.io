(() => {
  const root = document.documentElement;

  document.getElementById("theme-toggle").addEventListener("click", () => {
    const next = root.dataset.theme === "dark" ? "light" : "dark";
    root.dataset.theme = next;
    try {
      localStorage.setItem("theme", next);
    } catch (_) {}
  });

  const header = document.querySelector(".site-header");
  const menuBtn = document.getElementById("menu-toggle");
  const closeMenu = () => {
    header.classList.remove("menu-open");
    menuBtn.setAttribute("aria-expanded", "false");
  };
  menuBtn.addEventListener("click", () => {
    const open = header.classList.toggle("menu-open");
    menuBtn.setAttribute("aria-expanded", String(open));
  });
  document.addEventListener("keydown", (e) => e.key === "Escape" && closeMenu());

  const navLinks = new Map(
    [...document.querySelectorAll(".nav-links a")].map((a) => {
      a.addEventListener("click", closeMenu);
      return [a.getAttribute("href").slice(1), a];
    })
  );
  const spy = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        navLinks.forEach((a) => a.classList.remove("active"));
        navLinks.get(e.target.id)?.classList.add("active");
      }
    },
    { rootMargin: "-40% 0px -55% 0px" }
  );
  navLinks.forEach((_, id) => {
    const section = document.getElementById(id);
    if (section) spy.observe(section);
  });

  // The last section is too short to reach the spy band, so mark it when the page bottom is reached.
  window.addEventListener(
    "scroll",
    () => {
      if (window.innerHeight + window.scrollY < document.documentElement.scrollHeight - 2) return;
      navLinks.forEach((a) => a.classList.remove("active"));
      [...navLinks.values()].at(-1).classList.add("active");
    },
    { passive: true }
  );

  document.getElementById("year").textContent = new Date().getFullYear();
})();
