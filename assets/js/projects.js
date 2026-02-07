(() => {
  const filterRow = document.querySelector(".filter-row");
  const cards = Array.from(document.querySelectorAll(".project-layer-card"));

  if (!filterRow || !cards.length) {
    return;
  }

  filterRow.addEventListener("click", (event) => {
    const chip = event.target.closest(".filter-chip");
    if (!chip) {
      return;
    }

    filterRow.querySelectorAll(".filter-chip").forEach((node) => {
      node.classList.remove("active");
    });
    chip.classList.add("active");

    const selected = chip.dataset.filter || "all";

    cards.forEach((card, index) => {
      const categories = (card.dataset.category || "").split(" ").filter(Boolean);
      const visible = selected === "all" || categories.includes(selected);
      card.classList.toggle("is-hidden", !visible);
      card.hidden = !visible;
      if (visible) {
        card.style.transitionDelay = `${Math.min(index, 5) * 45}ms`;
      }
    });
  });

  const hash = window.location.hash.replace("#", "");
  if (!hash) {
    return;
  }

  const targetCard = document.getElementById(hash);
  if (!targetCard) {
    return;
  }

  requestAnimationFrame(() => {
    targetCard.scrollIntoView({ behavior: "smooth", block: "center" });
    targetCard.classList.add("spotlight");
    window.setTimeout(() => targetCard.classList.remove("spotlight"), 1700);
  });
})();
