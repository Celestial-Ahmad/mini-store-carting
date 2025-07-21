const allItems = [
  { name: "Laptop", price: 50000 },
  { name: "Phone", price: 30000 },
  { name: "Shirt", price: 1500 },
  { name: "Mouse", price: 1200 },
  { name: "Shoes", price: 2000 }
];

let cart = JSON.parse(localStorage.getItem('cart')) || [];

const renderAllItems = () => {
  const tbody = document.querySelector("#allItemsTable tbody");
  tbody.innerHTML = "";
  allItems.forEach(item => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${item.name}</td>
      <td>$${item.price}</td>
      <td><button class="add-btn" onclick='addToCart("${item.name}")'>Add 🛒</button></td>
    `;
    tbody.appendChild(row);
  });
};

const addToCart = (name) => {
  const foundItem = allItems.find(i => i.name === name);
  const existing = cart.find(i => i.name === name);
  if (existing) {
    existing.quantity++;
  } else {
    cart.push({ ...foundItem, quantity: 1 });
  }
  saveCart();
  renderCart();
};

const renderCart = () => {
  const tbody = document.querySelector("#cartTable tbody");
  tbody.innerHTML = "";
  let total = 0;
  cart.forEach((item, index) => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${item.name}</td>
      <td>$${item.price}</td>
      <td>
        <button onclick='adjustQuantity(${index}, -1)'>➖</button>
        ${item.quantity}
        <button onclick='adjustQuantity(${index}, 1)'>➕</button>
      </td>
      <td>$${itemTotal}</td>
      <td><button class="btn-remove" onclick='removeItem(${index})'>❌</button></td>
    `;
    tbody.appendChild(row);
  });
  document.getElementById("total").textContent = `Total: $${total}`;
};

const adjustQuantity = (index, delta) => {
  cart[index].quantity += delta;
  if (cart[index].quantity <= 0) cart.splice(index, 1);
  saveCart();
  renderCart();
};

const removeItem = (index) => {
  cart.splice(index, 1);
  saveCart();
  renderCart();
};

const saveCart = () => {
  localStorage.setItem("cart", JSON.stringify(cart));
};

const checkoutCart = () => {
  const modal = document.getElementById("receiptModal");
  const receipt = document.getElementById("receiptDetails");
  receipt.innerHTML = cart.map(i => `<p>${i.name} x${i.quantity} = $${i.price * i.quantity}</p>`).join("");
  const total = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
  receipt.innerHTML += `<hr><p><strong>Total: $${total}</strong></p>`;
  modal.style.display = "block";
};

const closeModal = () => {
  document.getElementById("receiptModal").style.display = "none";
};

const printReceipt = () => {
  const receiptContent = document.getElementById("receiptDetails").innerHTML;
  const printWindow = window.open('', '', 'width=600,height=600');
  printWindow.document.write('<html><head><title>Receipt</title></head><body>' + receiptContent + '</body></html>');
  printWindow.document.close();
  printWindow.print();
};

window.onload = () => {
  renderAllItems();
  renderCart();
};
