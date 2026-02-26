// CONSTANTES DA APLICAÇÃO 

const API_SEARCH_URL = "https://api.tvmaze.com/search/shows?q=";
const API_DETAILS_URL = "https://api.tvmaze.com/shows/";
const STORAGE_KEY_FAVORITES = "showstore_favorites_v1";

// ESTADO EM MEMÓRIA 

let currentResults = []; 
let favorites = {}; 

// ELEMENTOS DA UI 

const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");

const tabResultsButton = document.getElementById("tab-results");
const tabFavoritesButton = document.getElementById("tab-favorites");

const resultsSection = document.getElementById("results-section");
const favoritesSection = document.getElementById("favorites-section");

const resultsGrid = document.getElementById("results-grid");
const favoritesGrid = document.getElementById("favorites-grid");

const feedbackEl = document.getElementById("feedback");

// INICIALIZAÇÃO 

document.addEventListener("DOMContentLoaded", () => {
  setCurrentYear();
  loadFavoritesFromStorage();
  renderFavoritesGrid();
  attachEventListeners();
});

function setCurrentYear() {
  const yearEl = document.getElementById("current-year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}

function loadFavoritesFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_FAVORITES);
    if (!raw) {
      favorites = {};
      return;
    }
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object") {
      favorites = parsed;
    } else {
      favorites = {};
    }
  } catch (error) {
    console.error("Erro ao carregar favoritos do localStorage:", error);
    favorites = {};
  }
}

function saveFavoritesToStorage() {
  try {
    localStorage.setItem(STORAGE_KEY_FAVORITES, JSON.stringify(favorites));
  } catch (error) {
    console.error("Erro ao salvar favoritos no localStorage:", error);
  }
}

function setFeedback(message, type) {
  feedbackEl.textContent = message || "";
  feedbackEl.className = "feedback"; 

  if (type === "loading") {
    feedbackEl.classList.add("feedback--loading");
  } else if (type === "error") {
    feedbackEl.classList.add("feedback--error");
  } else if (type === "empty") {
    feedbackEl.classList.add("feedback--empty");
  }
}

function attachEventListeners() {
  searchForm.addEventListener("submit", handleSearchSubmit);

  tabResultsButton.addEventListener("click", () => switchTab("results"));
  tabFavoritesButton.addEventListener("click", () => switchTab("favorites"));

  resultsGrid.addEventListener("click", handleCardGridClick);

  favoritesGrid.addEventListener("click", handleCardGridClick);

}

// TABS (RESULTADOS / FAVORITOS) 

function switchTab(tabName) {
  const isResults = tabName === "results";

  tabResultsButton.classList.toggle("tab-button--active", isResults);
  tabFavoritesButton.classList.toggle("tab-button--active", !isResults);

  resultsSection.classList.toggle("section--visible", isResults);
  favoritesSection.classList.toggle("section--visible", !isResults);

  if (isResults && currentResults.length === 0) {
    setFeedback("Busque por uma série para começar.", "empty");
  } else if (!isResults && Object.keys(favorites).length === 0) {
    setFeedback("Você ainda não possui favoritos.", "empty");
  } else {
    setFeedback("");
  }
}

// BUSCA / FETCH 

async function handleSearchSubmit(event) {
  event.preventDefault();

  const query = searchInput.value.trim();
  if (!query) {
    setFeedback("Digite o nome de uma série para buscar.", "empty");
    return;
  }

  switchTab("results"); // garante que estamos na aba de resultados

  setFeedback("Buscando séries...", "loading");
  resultsGrid.innerHTML = "";

  try {
    const response = await fetch(API_SEARCH_URL + encodeURIComponent(query));

    if (!response.ok) {
      throw new Error("Erro");
    }

    const data = await response.json();

    currentResults = data.map((item) => item.show);

    if (currentResults.length === 0) {
      setFeedback("Nenhuma série encontrada para essa busca.", "empty");
      resultsGrid.innerHTML = "";
      return;
    }

    setFeedback(`Encontradas ${currentResults.length} série(s).`);
    renderResultsGrid();
  } catch (error) {
    console.error("Erro ao buscar séries:", error);
    setFeedback(
      "Ocorreu um erro ao buscar séries. Tente novamente mais tarde.",
      "error"
    );
    resultsGrid.innerHTML = "";
  }
}

function renderResultsGrid() {
  resultsGrid.innerHTML = "";

  currentResults.forEach((show) => {
    const card = createShowCard(show);
    resultsGrid.appendChild(card);
  });
}

function renderFavoritesGrid() {
  favoritesGrid.innerHTML = "";

  const favoriteShows = Object.values(favorites);
  if (favoriteShows.length === 0) {
    if (favoritesSection.classList.contains("section--visible")) {
      setFeedback("Você ainda não possui favoritos.", "empty");
    }
    return;
  }

  favoriteShows.forEach((show) => {
    const card = createShowCard(show);
    favoritesGrid.appendChild(card);
  });
}

// CARDS 

function createShowCard(show) {
  const {
    id,
    name,
    image,
    genres = [],
    rating = {},
  } = show;

  const isFavorite = Boolean(favorites[id]);

  const card = document.createElement("article");
  card.className = "card";
  card.dataset.showId = String(id);

  const imageWrapper = document.createElement("div");
  imageWrapper.className = "card-image-wrapper";

  const img = document.createElement("img");
  img.className = "card-image";
  img.alt = name || "Série sem nome";

  if (image && image.medium) {
    img.src = image.medium;
  } else {
    img.src =
      "https://via.placeholder.com/210x295/eff2ff/9ca3af?text=Sem+Imagem";
  }

  imageWrapper.appendChild(img);

  const body = document.createElement("div");
  body.className = "card-body";

  const headerRow = document.createElement("div");
  headerRow.className = "card-header-row";

  const titleEl = document.createElement("h3");
  titleEl.className = "card-title";
  titleEl.textContent = name || "Título indisponível";

  const favButton = document.createElement("button");
  favButton.type = "button";
  favButton.className = "favorite-button";
  if (isFavorite) {
    favButton.classList.add("favorite-button--active");
  }
  favButton.setAttribute("data-favorite-btn", "true");
  favButton.setAttribute("aria-label", isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos");

  const emojiSpan = document.createElement("span");
  emojiSpan.className = "emoji";
  emojiSpan.textContent = isFavorite ? "★" : "☆";

  const textSpan = document.createElement("span");
  textSpan.textContent = isFavorite ? "Favorito" : "Favoritar";

  favButton.appendChild(emojiSpan);
  favButton.appendChild(textSpan);

  headerRow.appendChild(titleEl);
  headerRow.appendChild(favButton);

  const genresEl = document.createElement("p");
  genresEl.className = "card-genres";
  genresEl.textContent =
    genres && genres.length > 0
      ? genres.join(" · ")
      : "Gênero não informado";

  const ratingValue = rating && rating.average;
  const ratingEl = document.createElement("div");
  ratingEl.className = "card-rating";

  if (ratingValue) {
    const badge = document.createElement("span");
    badge.className = "card-rating-badge";
    badge.innerHTML = `<span>★</span><span>${ratingValue.toFixed(1)}</span>`;
    ratingEl.appendChild(badge);
  } else {
    ratingEl.textContent = "Sem avaliação";
  }

  body.appendChild(headerRow);
  body.appendChild(genresEl);
  body.appendChild(ratingEl);

  card.appendChild(imageWrapper);
  card.appendChild(body);

  return card;
}

function handleCardGridClick(event) {
  const target = event.target;

  const favoriteBtn = target.closest("[data-favorite-btn='true']");
  const card = target.closest(".card");

  if (!card) return;

  const showId = card.dataset.showId;
  if (!showId) return;

  if (favoriteBtn) {
    event.stopPropagation();
    toggleFavorite(showId, card);
    return;
  }

// FAVORITOS 

function toggleFavorite(showId, cardEl) {
  const numericId = Number(showId);

  if (favorites[numericId]) {
    delete favorites[numericId];
  } else {
    const sourceList = [...currentResults, ...Object.values(favorites)];
    const show = sourceList.find((s) => s.id === numericId);
    if (!show) return;
    favorites[numericId] = show;
  }

  saveFavoritesToStorage();
  updateFavoriteButtonUI(cardEl, Boolean(favorites[numericId]));
  renderFavoritesGrid();
}

function updateFavoriteButtonUI(cardEl, isFavorite) {
  const btn = cardEl.querySelector("[data-favorite-btn='true']");
  if (!btn) return;

  btn.classList.toggle("favorite-button--active", isFavorite);
  btn.setAttribute("aria-label", isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos");

  const emojiSpan = btn.querySelector(".emoji");
  const textSpan = btn.querySelector("span:last-child");

  if (emojiSpan) {
    emojiSpan.textContent = isFavorite ? "★" : "☆";
  }
  if (textSpan) {
    textSpan.textContent = isFavorite ? "Favorito" : "Favoritar";
  }
}
}
