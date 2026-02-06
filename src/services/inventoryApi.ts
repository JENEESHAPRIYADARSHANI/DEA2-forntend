const BASE_URL = "http://localhost:8882/inventory";

export async function fetchInventory() {
  const res = await fetch(BASE_URL);
  if (!res.ok) throw new Error("Failed to fetch inventory");
  return res.json();
}

export async function createInventory(data: {
  productId: number;
  quantityInStock: number;
  reorderLevel: number;
}) {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create inventory");
  return res.json();
}

export async function updateInventory(
  id: number,
  data: { quantityInStock?: number; reorderLevel?: number }
) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update inventory");
  return res.json();
}

export async function deleteInventory(id: number) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete inventory");
}
