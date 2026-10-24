export function getCustomerById(customers, customerId) {
  return customers.find((customer) => customer.id === customerId);
}

export function getProductById(products, productId) {
  return products.find((product) => product.id === productId);
}

export function getLineTotal(products, item) {
  const product = getProductById(products, item.productId);
  if (!product) return 0;
  return product.price * item.quantity;
}

export function getOrderTotal(products, order) {
  let total = 0;
  order.items.forEach((item) => {
    total += getLineTotal(products, item);
  });
  return total;
}

export function filterOrders(state) {
  return state.orders.filter((order) => {
    const customer = getCustomerById(state.customers, order.customerId);
    const customerName = customer ? customer.name.toLowerCase() : "";
    const matchSearch =
      state.searchText === "" ||
      customerName.includes(state.searchText.toLowerCase());
    const matchStatus =
      state.selectedStatus === "" || order.status === state.selectedStatus;
    let matchCategory = state.selectedCategory === "";
    if (!matchCategory) {
      order.items.forEach((item) => {
        const product = getProductById(state.products, item.productId);
        if (product && product.category === state.selectedCategory) {
          matchCategory = true;
        }
      });
    }
    return matchSearch && matchStatus && matchCategory;
  });
}

export function enrichOrders(state, orders) {
  return orders.map((order) => {
    const customer = getCustomerById(state.customers, order.customerId);
    const items = order.items.map((item) => {
      const product = getProductById(state.products, item.productId);
      return {
        productName: product ? product.name : "Produit introuvable",
        price: product ? product.price : 0,
        quantity: item.quantity,
        lineTotal: getLineTotal(state.products, item)
      };
    });
    return {
      id: order.id,
      customerName: customer ? customer.name : "Client introuvable",
      customerCity: customer ? customer.city : "-",
      date: order.date,
      status: order.status,
      items: items,
      total: getOrderTotal(state.products, order)
    };
  });
}

export function getIndicators(state) {
  let totalRevenue = 0;
  state.orders.forEach((order) => {
    totalRevenue += getOrderTotal(state.products, order);
  });
  return {
    customersCount: state.customers.length,
    productsCount: state.products.length,
    ordersCount: state.orders.length,
    totalRevenue: totalRevenue
  };
}

export function getCategories(products) {
  const categories = [];
  products.forEach((product) => {
    if (!categories.includes(product.category)) {
      categories.push(product.category);
    }
  });
  return categories;
}