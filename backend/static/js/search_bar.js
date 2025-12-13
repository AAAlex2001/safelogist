(function () {
  function initSearch({ inputId, buttonId, basePath = "/ru/reviews", emptyText = "Ничего не найдено", minLength = 2 }) {
    const searchInput = document.getElementById(inputId);
    const searchButton = document.getElementById(buttonId);
    if (!searchInput || !searchButton) {
      console.warn(`Search init skipped: missing elements input=${inputId}, button=${buttonId}`);
      return;
    }

    const searchBox = searchInput.closest(".search-box");
    if (!searchBox) {
      console.warn(`Search init skipped: .search-box not found for input=${inputId}`);
      return;
    }

    let searchTimeout = null;
    let clearResultsTimeout = null;
    let currentResults = [];

    const autocompleteContainer = document.createElement("div");
    autocompleteContainer.className = "autocomplete-results";
    searchBox.appendChild(autocompleteContainer);

    searchInput.addEventListener("input", function () {
      const query = this.value.trim();

      if (searchTimeout) clearTimeout(searchTimeout);
      if (clearResultsTimeout) clearTimeout(clearResultsTimeout);

      if (query.length < minLength) {
        autocompleteContainer.classList.remove("show");
        searchBox.classList.remove("expanded");
        clearResultsTimeout = setTimeout(() => (autocompleteContainer.innerHTML = ""), 300);
        return;
      }

      // Показываем лоадер сразу, чтобы контейнер не схлопывался при быстром вводе
      autocompleteContainer.innerHTML = `<div class="autocomplete-item" style="display: flex; align-items: center; justify-content: center; gap: 8px;"><span style="width: 16px; height: 16px; border: 2px solid #012AF9; border-top-color: transparent; border-radius: 50%; animation: spin 0.6s linear infinite; display: inline-block;"></span></div>`;
      searchBox.classList.add("expanded");
      autocompleteContainer.classList.add("show");

      searchTimeout = setTimeout(async function () {
        try {
          const response = await fetch(`/api/reviews/search?q=${encodeURIComponent(query)}&limit=10`);
          const data = await response.json();
          currentResults = data.companies || [];
          displayAutocompleteResults(currentResults, query);
        } catch (error) {
          console.error("Ошибка поиска:", error);
          autocompleteContainer.innerHTML = `<div class="autocomplete-item">${emptyText}</div>`;
        }
      }, 500);
    });

    function displayAutocompleteResults(companies, query) {
      if (companies.length === 0) {
        autocompleteContainer.innerHTML = `<div class="autocomplete-item">${emptyText}</div>`;
        searchBox.classList.add("expanded");
        autocompleteContainer.classList.add("show");
        return;
      }

      autocompleteContainer.innerHTML = companies
        .map((company) => {
          const highlightedName = company.name.replace(new RegExp(`(${query})`, "gi"), "<strong>$1</strong>");
          return `<div class="autocomplete-item" data-id="${company.id}"><span class="autocomplete-name">${highlightedName}</span><span class="autocomplete-loader" style="display: none; width: 16px; height: 16px; border: 2px solid #012AF9; border-top-color: transparent; border-radius: 50%; animation: spin 0.6s linear infinite; margin-left: 8px; flex-shrink: 0;"></span></div>`;
        })
        .join("");

      searchBox.classList.add("expanded");
      autocompleteContainer.classList.add("show");

      autocompleteContainer.querySelectorAll(".autocomplete-item").forEach((item) => {
        const loader = item.querySelector(".autocomplete-loader");
        item.addEventListener("click", function () {
          const id = this.getAttribute("data-id");
          if (id) {
            if (loader) loader.style.display = "inline-block";
            setTimeout(() => {
              window.location.href = `${basePath}/item/${id}`;
            }, 50);
          }
        });
      });
    }

    document.addEventListener("click", function (e) {
      if (!searchBox?.contains(e.target)) {
        if (clearResultsTimeout) clearTimeout(clearResultsTimeout);
        autocompleteContainer.classList.remove("show");
        searchBox.classList.remove("expanded");
        clearResultsTimeout = setTimeout(() => (autocompleteContainer.innerHTML = ""), 300);
      }
    });

    searchButton.addEventListener("click", function () {
      const query = searchInput.value.trim();
      if (query) {
        window.location.href = `${basePath}/search?q=${encodeURIComponent(query)}`;
      }
    });

    searchInput.addEventListener("keypress", function (e) {
      if (e.key === "Enter") {
        e.preventDefault();
        const query = this.value.trim();
        if (query) {
          window.location.href = `${basePath}/search?q=${encodeURIComponent(query)}`;
        }
      }

      if (e.key === "ArrowDown" && currentResults.length > 0) {
        e.preventDefault();
        const items = autocompleteContainer.querySelectorAll(".autocomplete-item");
        if (items.length > 0) items[0].focus();
      }
    });
  }

  window.initSearchBar = initSearch;
})();

