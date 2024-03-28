document.addEventListener("DOMContentLoaded", () => {
  // Toggle .menu show class on .burger click
  const burger = document.querySelector(".burger");
  const menu = document.querySelector(".menu");
  if (burger && menu) {
    burger.addEventListener("click", () => {
      menu.classList.toggle("show");
    });
  }

  // Close menu when .close-menu is clicked
  const closeMenu = document.querySelector(".close-menu");
  if (closeMenu && menu) {
    closeMenu.addEventListener("click", () => {
      menu.classList.remove("show");
    });
  }

  // Toggle #userDD active class on #userDDToggle click
  const userDDToggle = document.querySelector("#userDDToggle");
  const userDD = document.querySelector("#userDD");
  if (userDDToggle && userDD) {
    userDDToggle.addEventListener("click", (event) => {
      userDD.classList.toggle("active");
      event.stopPropagation(); // Prevent click from being detected as outside click
    });
  }

  // Remove .active from #userDD if clicked outside
  document.addEventListener("click", (event) => {
    const isClickInsideUserDD = userDD && userDD.contains(event.target);
    const isClickOnToggle = userDDToggle && userDDToggle.contains(event.target);

    if (!isClickInsideUserDD && !isClickOnToggle && userDD) {
      userDD.classList.remove("active");
    }
  });

  // redirect to add product page
  const toAddProduct = document.getElementById("toAddProduct");
  if (toAddProduct) {
    toAddProduct.addEventListener("click", () => {
      window.open("/add-product", "_blank");
    });
  }
});
