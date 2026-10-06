'use strict';

const money = new Intl.NumberFormat('nl-BE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 });

const header = document.querySelector('.site-header');
const toggle = document.querySelector('.mobile-toggle');
const mobileMenu = document.querySelector('.mobile-menu');

toggle?.addEventListener('click', () => {
  const isOpen = toggle.getAttribute('aria-expanded') === 'true';
  toggle.setAttribute('aria-expanded', String(!isOpen));
  toggle.setAttribute('aria-label', isOpen ? 'Menu openen' : 'Menu sluiten');
  mobileMenu.hidden = isOpen;
  document.body.classList.toggle('menu-open', !isOpen);
});

mobileMenu?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
  toggle.setAttribute('aria-expanded', 'false');
  toggle.setAttribute('aria-label', 'Menu openen');
  mobileMenu.hidden = true;
  document.body.classList.remove('menu-open');
}));

window.addEventListener('scroll', () => header?.classList.toggle('scrolled', window.scrollY > 16), { passive: true });

const projectInputs = [...document.querySelectorAll('input[name="project"]')];
const optionInputs = [...document.querySelectorAll('.option-choices input')];
const estimatePrice = document.querySelector('#estimate-price');
const estimateCare = document.querySelector('#estimate-care');

function updateEstimate() {
  const selected = projectInputs.find((input) => input.checked);
  const additions = optionInputs.filter((input) => input.checked).reduce((sum, input) => sum + Number(input.value), 0);
  const total = Number(selected?.value || 0) + additions;
  if (estimatePrice) estimatePrice.textContent = `vanaf ${money.format(total)}`;
  if (estimateCare) estimateCare.textContent = `Nari ${selected?.dataset.care || 'Start'}`;
  document.querySelectorAll('.choice').forEach((choice) => {
    const input = choice.querySelector('input');
    choice.classList.toggle('selected', Boolean(input?.checked));
  });
}

[...projectInputs, ...optionInputs].forEach((input) => input.addEventListener('change', updateEstimate));

document.querySelectorAll('.faq-item button').forEach((button) => {
  button.addEventListener('click', () => {
    const open = button.getAttribute('aria-expanded') === 'true';
    const answer = button.closest('.faq-item')?.querySelector('.faq-answer');
    button.setAttribute('aria-expanded', String(!open));
    if (answer) answer.hidden = open;
  });
});

const form = document.querySelector('#contact-form');
const formStatus = document.querySelector('#form-status');

form?.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }
  const data = new FormData(form);
  const subject = encodeURIComponent(`Websiteaanvraag van ${data.get('name')}`);
  const body = encodeURIComponent([
    `Naam: ${data.get('name')}`,
    `Bedrijf: ${data.get('company') || '-'}`,
    `E-mail: ${data.get('email')}`,
    `Interesse: ${data.get('interest')}`,
    '',
    String(data.get('message'))
  ].join('\n'));
  if (formStatus) formStatus.textContent = 'Je e-mailprogramma wordt geopend. Lukt dat niet, mail dan rechtstreeks naar contact@nari.be.';
  window.location.href = `mailto:contact@nari.be?subject=${subject}&body=${body}`;
});

const revealObserver = 'IntersectionObserver' in window
  ? new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 })
  : null;

document.querySelectorAll('.reveal').forEach((element) => revealObserver ? revealObserver.observe(element) : element.classList.add('is-visible'));
document.querySelector('#year').textContent = new Date().getFullYear();
