let cart = [];

document.addEventListener("DOMContentLoaded", () => {
  fetch("products.json")
    .then(res => res.json())
    .then(products => {
      renderProducts(products);
    })
    .catch(err => {
      console.error("Veri alınamadı:", err);
      document.getElementById("product-list").innerHTML =
        "<p class='text-center col-span-full'>Ürünler yüklenemedi.</p>";
    });
    document.getElementById("checkout-btn").addEventListener("click", () => {
    if (cart.length === 0) {
      alert("Sepetiniz boş. Önce ürün ekleyin.");
      return;
    }
    document.getElementById("checkout-modal").classList.remove("hidden");
  });

  document.getElementById("close-modal").addEventListener("click", () => {
    document.getElementById("checkout-modal").classList.add("hidden");
    cart = []; // Sepeti boşalt
    updateCartDisplay();
  });

  // Sepet aç/kapa tıklama
  document.getElementById("cart-button").addEventListener("click", () => {
    document.getElementById("cart-items").classList.toggle("hidden");
  });
});

function renderProducts(products) {
  const container = document.getElementById("product-list");
  container.innerHTML = "";

  products.forEach(product => {
    const card = document.createElement("div");
    card.className = "bg-white/10 backdrop-blur-md border border-white/20 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition duration-300";

    card.innerHTML = `
      <img src="${product.image}" alt="${product.title}" class="w-full h-60 object-cover" />
      <div class="p-4">
        <h3 class="text-xl font-bold mb-2 text-white">${product.title}</h3>
        <p class="text-sm text-white/80 mb-3">${product.description}</p>
        <div class="flex justify-between items-center">
          <span class="text-lg text-green-300 font-semibold">
            ${product.price.toLocaleString("tr-TR", {
              style: "currency",
              currency: "TRY",
            })}
          </span>
          <button class="bg-[#d4af37] text-white px-4 py-2 rounded hover:bg-yellow-600 transition" data-id="${product.id}">
            Sepete Ekle
          </button>
        </div>
      </div>
    `;

    container.appendChild(card);
  });

  // Sepete ekle butonlarına event ekle
  document.querySelectorAll("button[data-id]").forEach(btn => {
    btn.addEventListener("click", () => {
      const productId = parseInt(btn.dataset.id);
      const product = products.find(p => p.id === productId);
      addToCart(product);
    });
  });
}

function addToCart(product) {
  cart.push(product);
  updateCartDisplay();
}

function updateCartDisplay() {
  const cartList = document.getElementById("cart-list");
  const cartTotal = document.getElementById("cart-total");
  const cartCount = document.getElementById("cart-count");

  cartList.innerHTML = "";

  let total = 0;
  cart.forEach((item, index) => {
    const li = document.createElement("li");
    li.className = "flex justify-between items-center";
    li.innerHTML = `
      <span>${item.title} - ${item.price}₺</span>
      <button data-index="${index}" class="text-red-600 hover:text-red-800 text-sm">❌</button>
    `;
    cartList.appendChild(li);
    total += item.price;
  });

  cartTotal.textContent = `₺${total}`;
  cartCount.textContent = cart.length;

  // Silme butonları
  document.querySelectorAll("#cart-list button[data-index]").forEach(btn => {
    btn.addEventListener("click", () => {
      const index = parseInt(btn.dataset.index);
      cart.splice(index, 1);
      updateCartDisplay();
    });
  });
}