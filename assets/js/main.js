// Toggle the Bulma navbar burger menu on mobile.
document.addEventListener('DOMContentLoaded', () => {
  const burgers = Array.from(document.querySelectorAll('.navbar-burger'));

  burgers.forEach((burger) => {
    burger.addEventListener('click', () => {
      const target = document.getElementById(burger.dataset.target);
      const isActive = burger.classList.toggle('is-active');
      burger.setAttribute('aria-expanded', String(isActive));
      if (target) {
        target.classList.toggle('is-active');
      }
    });
  });

  // "Download as PDF" buttons open the browser's print dialog (the print stylesheet
  // in main.css strips the chrome so the page prints / saves to PDF cleanly).
  document.querySelectorAll('[data-print]').forEach((button) => {
    button.addEventListener('click', () => window.print());
  });
});
