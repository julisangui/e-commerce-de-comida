const botonesComprar = document.querySelectorAll(".buy");
const contenedorCarrito = document.querySelector(".empty-buy-box");
const cantidadCarrito = document.querySelector(".quantity");
const mensajeCarbono = document.querySelector(".carbon-neutral-message");
const botonConfirmar = document.querySelector(".confirm-order");

const carrito = {};
let totalProductos = 0;

botonesComprar.forEach((boton) => {
  const tarjeta = boton.closest(".food");
  const imagen = tarjeta.querySelector(".food-img");
  const nombre = tarjeta.querySelector(".description").textContent;
  const precio = parseFloat(
    tarjeta.querySelector(".price").textContent.replace("$", "")
  );

  boton.dataset.transformed = "false";

  boton.addEventListener("click", (e) => {
    if (boton.dataset.transformed === "true") return;

    e.stopPropagation();
    boton.dataset.transformed = "true";
    imagen.classList.add("selected");

    boton.innerHTML = "";
    boton.style.cssText = `
      background-color: rgb(199, 58, 15);
      border: 1px solid rgb(199, 58, 15);
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 0.5rem;`;

    const btnRestar = document.createElement("button");
    btnRestar.textContent = "-";
    btnRestar.classList.add("removeQuantity");

    const contador = document.createElement("p");
    contador.textContent = "1";
    contador.classList.add("counter");
    contador.style.cssText = `
      width: 1.5rem;
      text-align: center;`;

    const btnSumar = document.createElement("button");
    btnSumar.textContent = "+";
    btnSumar.classList.add("addQuantity");

    boton.append(btnRestar, contador, btnSumar);

    let cantidad = 1;
    totalProductos++;
    carrito[nombre] = { name: nombre, price: precio, count: cantidad };

    actualizarCarrito();

    btnSumar.addEventListener("click", (e) => {
      e.stopPropagation();
      cantidad++;
      contador.textContent = cantidad;
      totalProductos++;
      carrito[nombre].count = cantidad;
      actualizarCarrito();
    });

    btnRestar.addEventListener("click", (e) => {
      e.stopPropagation();
      if (cantidad > 1) {
        cantidad--;
        contador.textContent = cantidad;
        totalProductos--;
        carrito[nombre].count = cantidad;
      } else {
        reiniciarBoton(nombre);
        delete carrito[nombre];
        totalProductos--;
      }
      actualizarCarrito();
    });
  });
});

function actualizarCarrito() {
  contenedorCarrito.innerHTML = "";
  mensajeCarbono.style.display = "flex";
  botonConfirmar.style.display = "flex";

  const items = Object.entries(carrito);

  if (items.length === 0) {
    mensajeCarbono.style.display = "none";
    botonConfirmar.style.display = "none";
    contenedorCarrito.innerHTML = `
      <img src="assets/illustration-empty-cart.svg" alt="">
      <p>Your added items will appear here</p>`;
    cantidadCarrito.textContent = "0";
    return;
  }

  let total = 0;

  items.forEach(([nombre, item]) => {
    const subtotal = item.price * item.count;
    total += subtotal;

    const divProducto = document.createElement("div");
    divProducto.classList.add("cart-item");

    const infoProducto = document.createElement("p");
    infoProducto.innerHTML = `
      <p class="item-name">${item.name}</p>
      <div>
        <p class="item-quantity">${item.count}x</p>
        <p class="item-price">@ $${item.price.toFixed(2)}</p>
        <strong>$${subtotal.toFixed(2)}</strong>
      </div>`;

    const botonQuitar = document.createElement("button");
    botonQuitar.innerHTML = "<i class='bi bi-x-lg'></i>";
    botonQuitar.classList.add("remove");

    botonQuitar.addEventListener("click", () => {
      totalProductos -= item.count;
      delete carrito[nombre];
      actualizarCarrito();
      reiniciarBoton(nombre);
    });

    divProducto.append(infoProducto, botonQuitar);
    contenedorCarrito.appendChild(divProducto);
  });

  const totalPrecio = document.createElement("div");
  totalPrecio.classList.add("total-price");
  totalPrecio.innerHTML = `<h4>Order Total</h4> <p>$${total.toFixed(2)}</p>`;
  contenedorCarrito.appendChild(totalPrecio);

  cantidadCarrito.textContent = totalProductos;
}

function reiniciarBoton(nombreProducto) {
  document.querySelectorAll(".food").forEach((card) => {
    const descripcion = card.querySelector(".description").textContent;
    if (descripcion === nombreProducto) {
      const imagen = card.querySelector(".food-img");
      imagen.classList.remove("selected");
      const btn = card.querySelector(".buy");
      btn.innerHTML = `<img src="assets/icon-add-to-cart.svg" alt="">Add to Cart`;
      btn.className = "buy";
      btn.dataset.transformed = "false";
      btn.style.cssText = `
        background-color: rgb(252, 249, 247);
        border: 1px solid rgb(135, 99, 90);
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 0.5rem;`;
    }
  });
}

const confirmOrder = document.querySelector(".confirm-order");
const buyProcessBackground = document.querySelector(".buy-process-background");
const buyProcess = document.querySelector(".buy-process");
const buyForm = document.querySelector(".buy-form");
const buyFormCloseButton = document.querySelector(".form-tittle .remove");
const buyFormSubmitButton = document.querySelector(".submit-button");

confirmOrder.addEventListener("click", () => {
  buyProcess.style.display = "flex";
  buyProcessBackground.style.display = "flex";
});

buyFormCloseButton.addEventListener("click", () => {
  buyProcess.style.display = "none";
  buyProcessBackground.style.display = "none";
});

const imagenesProductos = {};

document.querySelectorAll(".food").forEach((tarjeta) => {
  const nombre = tarjeta.querySelector(".description").textContent.trim();
  const imagen = tarjeta.querySelector(".food-img").src;
  imagenesProductos[nombre] = imagen;
});

function obtenerImagenProducto(nombreProducto) {
  return imagenesProductos[nombreProducto] || "assets/default-image.jpg";
}

buyForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const cartItems = Object.values(carrito).map((item) => ({
    name: item.name,
    price: item.price,
    quantity: item.count,
    image: obtenerImagenProducto(item.name),
  }));

  buyProcess.innerHTML = "";

  setTimeout(() => {
    const total = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

    const itemsHtml = cartItems.map((item) => `
      <div class="order-item">
        <div class="item-product">
          <img src="${item.image}" alt="${item.name}" class="item-img"/>
          <div class="item-info">
            <p>${item.name}</p>
            <div>
              <span class="item-quantity">${item.quantity}x</span>
              <span class="item-price">@ $${item.price.toFixed(2)}</span>
            </div>
          </div>
        </div>
        <div class="item-subtotal">
          <strong>$${(item.price * item.quantity).toFixed(2)}</strong>
        </div>
      </div>
    `).join("");

    buyProcess.innerHTML = `
      <div class="order-confirmation">
        <img src="assets/icon-order-confirmed.svg" class="order-confirmed-img">
        <h2>Order Confirmed</h2>
        <p>We hope you enjoy your food!</p>
        <div class="order-summary">
          ${itemsHtml}
          <div class="total-price">
            <h4>Order Total</h4> <p>$${total.toFixed(2)}</p>
          </div>
        </div>
        <button class="start-new-order">Start New Order</button>
      </div>
    `;

    document.querySelector(".start-new-order").addEventListener("click", () => {
      window.location.reload()
    });
  }, 100);
});