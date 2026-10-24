async function loadJson(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Erreur HTTP ${response.status} lors du chargement de ${url}`);
  }
  const data = await response.json();
  return data;
}

export async function loadAllData() {
  try {
    const [customers, products, orders] = await Promise.all([
      loadJson("data/customers.json"),
      loadJson("data/products.json"),
      loadJson("data/orders.json")
    ]);
    return { customers, products, orders };
  } catch (error) {
    console.error("Échec du chargement des données :", error);
    throw error;
  }
}