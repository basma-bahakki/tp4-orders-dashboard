import { getIndicators, getCategories, filterOrders, enrichOrders } from "./selectors.js";

function renderIndicators(state) {
  const indicators = getIndicators(state);
  const container = document.getElementById("indicators");
  container.innerHTML = `
    <div class="col-6 col-md-3">
      <div class="card indicator-card h-100">
        <div class="card-body text-center">
          <h3 class="mb-0">${indicators.customersCount}</h3>
          <small class="text-muted">Clients</small>
        </div>
      </div>
    </div>
    <div class="col-6 col-md-3">
      <div class="card indicator-card h-100">
        <div class="card-body text-center">
          <h3 class="mb-0">${indicators.productsCount}</h3>
          <small class="text-muted">Produits</small>
        </div>
      </div>
    </div>
    <div class="col-6 col-md-3">
      <div class="card indicator-card h-100">
        <div class="card-body text-center">
          <h3 class="mb-0">${indicators.ordersCount}</h3>
          <small class="text-muted">Commandes</small>
        </div>
      </div>
    </div>
    <div class="col-6 col-md-3">
      <div class="card indicator-card h-100">
        <div class="card-body text-center">
          <h3 class="mb-0">${indicators.totalRevenue} MAD</h3>
          <small class="text-muted">Chiffre d'affaires</small>
        </div>
      </div>
    </div>`;
}

export function renderCategories(state) {
  const select = document.getElementById("filterCategory");
  const categories = getCategories(state.products);
  select.innerHTML = `<option value="">Toutes les catégories</option>` +
    categories
      .map((category) => `<option value="${category}">${category}</option>`)
      .join("");
}

function renderOrdersTable(state) {
  const filtered = filterOrders(state);
  const enriched = enrichOrders(state, filtered);
  const tbody = document.getElementById("ordersTableBody");

  if (enriched.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" class="text-center text-muted py-4">
      Aucune commande ne correspond aux critères sélectionnés.</td></tr>`;
    return;
  }

  let html = "";
  enriched.forEach((order) => {
    const badgeClass =
      order.status === "Livree" ? "bg-success" :
      order.status === "En attente" ? "bg-warning text-dark" : "bg-danger";

    html += `
      <tr>
        <td>#${order.id}</td>
        <td>${order.customerName}</td>
        <td>${order.customerCity}</td>
        <td>${order.date}</td>
        <td><span class="badge ${badgeClass}">${order.status}</span></td>
        <td><strong>${order.total} MAD</strong></td>
        <td>
          <button class="btn btn-sm btn-outline-primary"
                  data-order-id="${order.id}">
            Détail
          </button>
        </td>
      </tr>`;
  });

  tbody.innerHTML = html;
}

export function renderOrderDetail(state, orderId) {
  const order = state.orders.find((o) => o.id === orderId);
  if (!order) return;

  const [enriched] = enrichOrders(state, [order]);

  let itemsRows = "";
  enriched.items.forEach((item) => {
    itemsRows += `
      <tr>
        <td>${item.productName}</td>
        <td>${item.price} MAD</td>
        <td>× ${item.quantity}</td>
        <td><strong>${item.lineTotal} MAD</strong></td>
      </tr>`;
  });

  document.getElementById("orderDetailContent").innerHTML = `
    <p><strong>Commande #${enriched.id}</strong> — ${enriched.date}</p>
    <p>Client : <strong>${enriched.customerName}</strong>
       &nbsp;|&nbsp; Ville : ${enriched.customerCity}
       &nbsp;|&nbsp; Statut : <span class="badge bg-secondary">${enriched.status}</span></p>
    <table class="table table-sm">
      <thead><tr><th>Produit</th><th>Prix</th><th>Quantité</th><th>Montant</th></tr></thead>
      <tbody>${itemsRows}</tbody>
      <tfoot>
        <tr class="table-active">
          <th colspan="3">Montant total</th>
          <th>${enriched.total} MAD</th>
        </tr>
      </tfoot>
    </table>`;
}

export function showError(message) {
  const alertBox = document.getElementById("errorBox");
  alertBox.textContent = message;
  alertBox.classList.remove("d-none");
}

export function render(state) {
  renderIndicators(state);
  renderOrdersTable(state);
}