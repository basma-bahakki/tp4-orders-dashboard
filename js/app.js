import { state } from "./state.js";
import { loadAllData } from "./dataService.js";
import { render, renderCategories, renderOrderDetail, showError } from "./view.js";

async function initApp() {
  try {
    const data = await loadAllData();
    state.customers = data.customers;
    state.products = data.products;
    state.orders = data.orders;
    renderCategories(state);
    render(state);
    console.log("Application initialisée avec succès");
  } catch (error) {
    console.error("Erreur d'initialisation :", error);
    showError("Impossible de charger les données. Vérifiez que les fichiers JSON existent dans le dossier data/ (voir la console et l'onglet Network).");
  }
}

function bindEvents() {
  document.getElementById("searchInput").addEventListener("input", (event) => {
    state.searchText = event.target.value;
    render(state);
  });

  document.getElementById("filterStatus").addEventListener("change", (event) => {
    state.selectedStatus = event.target.value;
    render(state);
  });

  document.getElementById("filterCategory").addEventListener("change", (event) => {
    state.selectedCategory = event.target.value;
    render(state);
  });

  document.getElementById("ordersTableBody").addEventListener("click", (event) => {
    const button = event.target.closest("button[data-order-id]");
    if (button) {
      const orderId = Number(button.dataset.orderId);
      renderOrderDetail(state, orderId);
      const modal = new bootstrap.Modal(document.getElementById("orderModal"));
      modal.show();
    }
  });
}

initApp();
bindEvents();