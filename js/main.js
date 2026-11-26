"use strict";

const desktopNav = window.matchMedia("(min-width: 54rem)");

function setupNav() {
  const toggle = document.querySelector(".nav-toggle");
  const panel = document.getElementById("site-nav");
  if (!toggle || !panel) return;

  function closeNav(restoreFocus) {
    const wasOpen = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", "false");
    panel.classList.remove("is-open");
    document.body.style.overflow = "";
    if (wasOpen && restoreFocus) toggle.focus();
  }

  function openNav() {
    toggle.setAttribute("aria-expanded", "true");
    panel.classList.add("is-open");
    if (!desktopNav.matches) document.body.style.overflow = "hidden";
    const firstLink = panel.querySelector("a");
    if (firstLink) firstLink.focus();
  }

  toggle.addEventListener("click", () => {
    const open = toggle.getAttribute("aria-expanded") === "true";
    if (open) closeNav(true);
    else openNav();
  });

  panel.addEventListener("click", (event) => {
    const link = event.target.closest("a");
    if (!link) return;
    closeNav(false);
    const id = (link.getAttribute("href") || "").slice(1);
    const target = document.getElementById(id);
    if (!target) return;
    target.setAttribute("tabindex", "-1");
    target.focus({ preventScroll: true });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeNav(true);
  });

  desktopNav.addEventListener("change", () => {
    if (desktopNav.matches) closeNav(false);
  });
}

function setupFilters() {
  const buttons = [...document.querySelectorAll("[data-filter]")];
  const cards = [...document.querySelectorAll(".project")];
  const count = document.getElementById("project-count");
  const empty = document.getElementById("project-empty");
  if (!buttons.length || !cards.length || !count) return;

  function apply(name, label) {
    let shown = 0;
    cards.forEach((card) => {
      const tags = (card.dataset.tags || "").split(/\s+/);
      const match = name === "all" || tags.includes(name);
      card.hidden = !match;
      if (!match) {
        const details = card.querySelector("details");
        if (details) details.open = false;
      }
      if (match) shown += 1;
    });
    buttons.forEach((button) => {
      button.setAttribute("aria-pressed", String(button.dataset.filter === name));
    });
    const noun = shown === 1 ? "study" : "studies";
    count.textContent = name === "all" ? `Showing ${shown} ${noun}` : `Showing ${shown} ${noun} in ${label}`;
    if (empty) empty.hidden = shown !== 0;
  }

  buttons.forEach((button) => {
    button.addEventListener("click", () => apply(button.dataset.filter, button.textContent.trim()));
  });
}

function setupScrollSpy() {
  const links = [...document.querySelectorAll("#site-nav a")];
  const sections = links
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);
  if (!sections.length || !("IntersectionObserver" in window)) return;

  const spy = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        links.forEach((link) => {
          if (link.getAttribute("href") === `#${entry.target.id}`) {
            link.setAttribute("aria-current", "true");
          } else {
            link.removeAttribute("aria-current");
          }
        });
      });
    },
    { rootMargin: "-40% 0px -50% 0px", threshold: 0.01 }
  );

  sections.forEach((section) => spy.observe(section));
}

function setupForm() {
  const form = document.getElementById("contact-form");
  const status = document.getElementById("form-status");
  const emailLink = document.getElementById("email-link");
  if (!form || !status || !emailLink) return;

  const address = emailLink.textContent.trim();
  form.noValidate = true;

  function setError(input, message) {
    const error = document.getElementById(`${input.id}-error`);
    if (!error) return;
    if (!message) {
      error.hidden = true;
      error.textContent = "";
      input.removeAttribute("aria-invalid");
      return;
    }
    error.hidden = false;
    error.textContent = message;
    input.setAttribute("aria-invalid", "true");
    input.setAttribute("aria-describedby", error.id);
  }

  function showStatus(message, isError) {
    status.hidden = false;
    status.textContent = message;
    status.classList.toggle("is-error", Boolean(isError));
  }

  form.addEventListener("input", (event) => {
    if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
      setError(event.target, "");
    }
    status.hidden = true;
    status.classList.remove("is-error");
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const name = form.elements.name;
    const email = form.elements.email;
    const org = form.elements.org;
    const message = form.elements.message;
    const trap = form.elements.website;
    let firstInvalid = null;

    const checks = [
      [name, name.value.trim().length >= 2 ? "" : "Please enter your name."],
      [email, /^\S+@\S+\.\S+$/.test(email.value.trim()) ? "" : "Enter an email address so I can reply."],
      [message, message.value.trim().length >= 20 ? "" : "Add a few more words — at least 20 characters."]
    ];

    checks.forEach(([input, problem]) => {
      setError(input, problem);
      if (problem && !firstInvalid) firstInvalid = input;
    });

    if (firstInvalid) {
      firstInvalid.focus();
      showStatus("Check the highlighted fields and try again.", true);
      return;
    }

    if (trap && trap.value.trim()) {
      form.reset();
      showStatus("Thanks. Your note is ready to send.", false);
      return;
    }

    const body = [
      `Name: ${name.value.trim()}`,
      `Email: ${email.value.trim()}`,
      `Organisation: ${org.value.trim() || "—"}`,
      "",
      message.value.trim()
    ].join("\n");

    window.location.href = `mailto:${address}?subject=${encodeURIComponent("Portfolio enquiry")}&body=${encodeURIComponent(body)}`;
    form.reset();
    showStatus(`Your email app should open with this message. If it does not, write to ${address}.`, false);
  });
}

function setupYear() {
  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());
}

setupNav();
setupFilters();
setupScrollSpy();
setupForm();
setupYear();
