const divFilters = document.querySelector(".task-filter");
const showFiltersBtn = document.querySelector(".show-filters-btn");

showFiltersBtn.addEventListener("click", (event) => {
  divFilters.classList.toggle("show-filters");
});
