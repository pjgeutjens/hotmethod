const menuButton = document.querySelector(".menu-toggle");
const mobileNav = document.querySelector("#mobileNav");

if (menuButton && mobileNav) {
  const closeMenu = () => {
    mobileNav.hidden = true;
    menuButton.setAttribute("aria-expanded", "false");
  };

  menuButton.addEventListener("click", () => {
    const open = menuButton.getAttribute("aria-expanded") === "true";
    mobileNav.hidden = open;
    menuButton.setAttribute("aria-expanded", String(!open));
  });

  mobileNav.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
}
