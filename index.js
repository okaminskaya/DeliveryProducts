let productsData;
let cartData =
  localStorage.getItem("cart") !== null && localStorage.getItem("cart") !== ""
    ? JSON.parse(localStorage.getItem("cart"))
    : [];
let isLoaded = false;
let isBlindMode =
  localStorage.getItem("blindMode") !== null &&
  localStorage.getItem("blindMode") !== ""
    ? localStorage.getItem("blindMode")
    : false;

read();

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

async function read() {
  const parseQuery = new Parse.Query("Product");

  try {
    let products = await parseQuery.find();
    productsData = products;
    console.log(products);
    isLoaded = true;
    return true;
  } catch (error) {
    alert(`Error! ${error.message}`);
    return false;
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

let timer = setInterval(function () {
  if (isLoaded) {
    clearInterval(timer);
  }
  load();
}, 1000);

function load() {
  for (let i = productsData.length - 1; i >= 0; i--) {
    if (productsData[i].get("discount") > 0) {
      initCards(productsData[i], "card-content");
    }
  }
}

function initCards(data, content) {
  const mainContent = document.getElementById(content);
  const card = document.createElement("div");
  const cardTitle = document.createElement("div");
  const cardImg = document.createElement("img");
  const cardCategory = document.createElement("b");
  const cardDesc = document.createElement("div");
  const cardPrice = document.createElement("div");
  const cardCart = document.createElement("div");
  const cardDiscount = document.createElement("div");

  card.classList = "cards";
  cardTitle.classList = "cards-title";
  cardImg.classList = "cards-img";
  cardCategory.classList = "cards-category";
  cardDesc.classList = "cards-desc";
  cardPrice.classList = "cards-price";
  cardCart.classList = "cards-cart";
  cardDiscount.classList = "cards-discount";

  cardTitle.innerHTML = data.get("name");
  cardImg.src = data.get("img")._url;
  cardCategory.innerHTML = data.get("category");
  cardDesc.innerHTML = data.get("desc");
  cardPrice.innerHTML =
    data.get("discount") <= 0
      ? `${data.get("price")} руб.`
      : `${(
          data.get("price") -
          (data.get("price") * data.get("discount")) / 100
        ).toFixed(2)} руб. (${data.get("price")} руб.)`;
  cardCart.innerHTML = "Добавить в корзину";

  cardCart.onclick = () => {
    cartData.push(data);
    localStorage.setItem("cart", JSON.stringify(cartData));
  };

  cardDiscount.innerHTML = `-${data.get("discount")}%`;

  card.appendChild(cardTitle);
  card.appendChild(cardImg);
  card.appendChild(cardCategory);
  card.appendChild(cardDesc);
  card.appendChild(cardPrice);
  card.appendChild(cardCart);

  if (data.get("discount") > 0) {
    card.appendChild(cardDiscount);
  }

  mainContent.appendChild(card);
}
