let cartData =
  localStorage.getItem("cart") !== null && localStorage.getItem("cart") !== ""
    ? JSON.parse(localStorage.getItem("cart"))
    : [];
let totalPrice;
let isBlindMode =
  localStorage.getItem("blindMode") !== null &&
  localStorage.getItem("blindMode") !== ""
    ? localStorage.getItem("blindMode")
    : false;

load();

function BlindModeEnable() {
  isBlindMode = true;
  localStorage.setItem("blindMode", isBlindMode);
  document.body.classList = "blind-mode";
}

function BlindModeDisable() {
  isBlindMode = false;
  localStorage.setItem("blindMode", isBlindMode);
  document.body.classList = "";
}

window.addEventListener("load", function () {
  if (isBlindMode == "true") {
    BlindModeEnable();
  } else {
    BlindModeDisable();
  }
});

function load() {
  for (let i = cartData.length - 1; i >= 0; i--) {
    initCards(cartData[i]);
  }
}

document.onmouseup =
  document.onkeyup =
  document.onselectionchange =
    function () {
      if (isBlindMode) speakText(window.getSelection().toString());
    };

function speakText(textS) {
  window.speechSynthesis.cancel();

  const text = textS;
  const utterance = new SpeechSynthesisUtterance(text);
  window.speechSynthesis.speak(utterance);
}

function initCards(data) {
  const mainContent = document.getElementById("cart-content");
  const card = document.createElement("div");
  const cardTitle = document.createElement("div");
  const cardImg = document.createElement("img");
  const cardCategory = document.createElement("b");
  const cardDesc = document.createElement("div");
  const cardPrice = document.createElement("div");
  const cardCart = document.createElement("div");
  const cardDiscount = document.createElement("div");

  card.classList = "cards cart";
  cardTitle.classList = "cards-title admin";
  cardImg.classList = "cards-img admin";
  cardCategory.classList = "cards-category admin";
  cardDesc.classList = "cards-desc admin";
  cardPrice.classList = "cards-price admin";
  cardCart.classList = "cards-delete";
  cardDiscount.classList = "cards-discount";

  cardTitle.innerHTML = data.name;
  cardImg.src = data.img.url;
  cardCategory.innerHTML = data.category;
  cardDesc.innerHTML = data.desc;
  cardPrice.innerHTML =
    data.discount <= 0
      ? `${data.price} руб.`
      : `${(data.price - (data.price * data.discount) / 100).toFixed(
          2
        )} руб. (${data.price} руб.)`;
  cardCart.innerHTML = "Убрать из корзины";

  cardCart.onclick = () => {
    cartData.splice(cartData.indexOf(data), 1);
    card.style.display = "none";
    localStorage.setItem("cart", JSON.stringify(cartData));
    getTotalPrice();
  };

  cardDiscount.innerHTML = `-${data.discount}%`;

  card.appendChild(cardTitle);
  card.appendChild(cardImg);
  card.appendChild(cardCategory);
  card.appendChild(cardDesc);
  card.appendChild(cardPrice);
  card.appendChild(cardCart);

  if (data.discount > 0) {
    card.appendChild(cardDiscount);
  }

  mainContent.appendChild(card);
}

const getTotalPrice = () => {
  totalPrice = Object.keys(cartData).reduce((previous, key) => {
    return cartData[key].discount === 0
      ? previous + cartData[key].price
      : previous +
          cartData[key].price -
          (cartData[key].price * cartData[key].discount) / 100;
  }, 0);

  document.getElementById(
    "cart-total-price"
  ).innerHTML = `Cумма заказа: <b>${totalPrice}</b> руб.`;
};

getTotalPrice();

async function createOrder() {
  let order = new Parse.Object("Order");

  order.set("adress", document.getElementById("cart-adress").value);
  order.set("street", document.getElementById("cart-street").value);
  order.set("house", document.getElementById("cart-house").value);
  order.set("entrance", document.getElementById("cart-entrance").value);
  order.set("houseNum", document.getElementById("cart-house-num").value);
  order.set("place", document.getElementById("cart-place").value);
  order.set("phone", document.getElementById("cart-phone").value);
  order.set("comment", document.getElementById("cart-comment").value);
  order.set("cards", cartData);
  order.set("price", document.getElementById("cart-total-price").innerHTML);

  try {
    order = await order.save();
    if (order !== null) {
      alert(
        `Заказ получен, вам позвонят на номер ${
          document.getElementById("cart-phone").value
        }, для подтверждения`
      );
    }
  } catch (error) {
    alert(`Error: ${error.message}`);
  }
}

document.getElementById("order-accept").addEventListener("click", () => {
  createOrder();
});
