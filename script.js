const loader = document.getElementById("loader");
const progress = document.getElementById("scrollProgress");
const navbar = document.getElementById("navbar");
const backTop = document.getElementById("backTop");
const menuBtn = document.getElementById("menuBtn");
const mobileMenu = document.getElementById("mobileMenu");
const billingToggle = document.getElementById("billingToggle");
const cursor = document.getElementById("cursor");

setTimeout(() => loader.classList.add("hide"), 1500);

window.addEventListener("scroll", () => {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.width = `${(scrollTop / docHeight) * 100}%`;
  navbar.classList.toggle("scrolled", scrollTop > 20);
  backTop.classList.toggle("show", scrollTop > 700);
});

backTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

menuBtn.addEventListener("click", () => {
  mobileMenu.classList.toggle("open");
});

mobileMenu.querySelectorAll("a, button").forEach((el) => {
  el.addEventListener("click", () => mobileMenu.classList.remove("open"));
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        entry.target.style.transitionDelay = `${(index % 6) * 0.1}s`;
        entry.target.classList.add("show");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

const stats = document.querySelectorAll("[data-count]");
const countObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = Number(el.dataset.count);
      let value = 0;
      const isDecimal = target % 1 !== 0;
      const step = target / 90;

      const timer = setInterval(() => {
        value += step;
        if (value >= target) {
          value = target;
          clearInterval(timer);
        }

        if (target >= 1000) {
          el.textContent = `${Math.floor(value).toLocaleString()}+`;
        } else if (target === 98) {
          el.textContent = `${Math.floor(value)}%`;
        } else if (isDecimal) {
          el.textContent = `${value.toFixed(1)}/5`;
        }
      }, 18);

      countObserver.unobserve(el);
    });
  },
  { threshold: 0.4 }
);
stats.forEach((stat) => countObserver.observe(stat));

billingToggle.addEventListener("change", () => {
  document.querySelectorAll(".price-card strong").forEach((price) => {
    const monthly = price.dataset.month;
    const yearly = price.dataset.year;
    price.textContent = billingToggle.checked ? `$${yearly}/mo` : `$${monthly}/mo`;
  });
});

if (window.matchMedia("(min-width: 961px)").matches) {
  window.addEventListener("mousemove", (event) => {
    cursor.style.left = `${event.clientX}px`;
    cursor.style.top = `${event.clientY}px`;
  });

  document.querySelectorAll("a, button, .card, .price-card, .step").forEach((el) => {
    el.addEventListener("mouseenter", () => {
      cursor.style.transform = "translate(-50%, -50%) scale(1.5)";
    });
    el.addEventListener("mouseleave", () => {
      cursor.style.transform = "translate(-50%, -50%) scale(1)";
    });
  });
}
