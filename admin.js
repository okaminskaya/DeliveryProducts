let productsData;
let orderData;
let isLoadedProduct = false;
let isLoadedOrders = false;

async function createParseUser() {
  let user = new Parse.Object("Product");

  let tFile = new Parse.File(
    document.getElementById("admin-product-img").files[0].name,
    document.getElementById("admin-product-img").files[0],
    "image/*"
  );
  user.set("name", document.getElementById("admin-product-name").value);
  user.set("desc", document.getElementById("admin-product-desc").value);
  user.set(
    "price",
    parseFloat(document.getElementById("admin-product-price").value)
  );
  user.set("img", tFile);
  user.set("category", document.getElementById("admin-product-category").value);
  user.set(
    "discount",
    parseFloat(document.getElementById("admin-product-discount").value)
  );

  try {
    user = await user.save();
    if (user !== null) {
      alert("Товар добавлен");
    }
  } catch (error) {
    alert(`Error: ${error.message}`);
  }
}

read();

async function read() {
  const parseQuery = new Parse.Query("Product");

  try {
    let products = await parseQuery.find();
    productsData = products;
    isLoadedProduct = true;
    return true;
  } catch (error) {
    alert(`Error! ${error.message}`);
    return false;
  }
}

readOrders();

async function readOrders() {
  const parseQuery = new Parse.Query("Order");

  try {
    let products = await parseQuery.find();
    orderData = products;
    isLoadedOrders = true;
    return true;
  } catch (error) {
    alert(`Error! ${error.message}`);
    return false;
  }
}

const addProductBtn = document.getElementById("admin-add-product");

addProductBtn.addEventListener("click", async function () {
  createParseUser();
});

let timer = setInterval(function () {
  if (isLoadedProduct) {
    clearInterval(timer);
  }
  load();
}, 1000);

let timer1 = setInterval(function () {
  if (isLoadedOrders) {
    clearInterval(timer1);
  }
  loadOrders();
}, 1000);

function load() {
  for (let i = productsData.length - 1; i >= 0; i--) {
    createCard(productsData[i]);
  }
}
let cards = "";
function loadOrders() {
  for (let i = orderData.length - 1; i >= 0; i--) {
    for (let j = orderData[i].get("cards").length - 1; j >= 0; j--) {
      cards += orderData[i].get("cards")[j].objectId + ", ";
    }
    createOrder(orderData[i], cards);
    cards = "";
  }
}

function createCard(data) {
  const mainContent = document.getElementById("admin-cards");
  const card = document.createElement("div");
  const cardID = document.createElement("div");
  const cardTitle = document.createElement("div");
  const cardImg = document.createElement("img");
  const cardCategory = document.createElement("b");
  const cardDesc = document.createElement("div");
  const cardPrice = document.createElement("div");
  const cardEdit = document.createElement("div");
  const cardDelete = document.createElement("div");

  card.classList = "cards admin";
  cardID.classList = "cards-id";
  cardTitle.classList = "cards-title";
  cardImg.classList = "cards-img admin";
  cardCategory.classList = "cards-category";
  cardDesc.classList = "cards-desc admin";
  cardPrice.classList = "cards-price admin";
  cardEdit.classList = "cards-edit";
  cardDelete.classList = "cards-delete";

  cardID.innerHTML = data.id;
  cardTitle.innerHTML = data.get("name");
  cardImg.src = data.get("img")._url;
  cardCategory.innerHTML = data.get("category");
  cardDesc.innerHTML = data.get("desc");
  cardPrice.innerHTML =
    data.get("discount") <= 0
      ? `${data.get("price")} руб.`
      : `${
          (data.get("price") - (data.get("price") * data.get("discount")) / 100).toFixed(2)
        } руб. (${data.get("price")} руб.)`;
  cardEdit.innerHTML = "Редактировать";
  cardDelete.innerHTML = "Удалить товар";

  cardDelete.onclick = async () => {
    if (confirm(`Удалить карточку ${data.get("name")} ?`)) {
      const cards = new Parse.Object("Product");
      cards.set("objectId", data.id);
      try {
        await cards.destroy();
        alert("Карточка удаленна, обновите страницу");
        return true;
      } catch (error) {
        alert(error.message);
        return false;
      }
    }
  };

  card.appendChild(cardID);
  card.appendChild(cardTitle);
  card.appendChild(cardImg);
  card.appendChild(cardCategory);
  card.appendChild(cardDesc);
  card.appendChild(cardPrice);
  card.appendChild(cardEdit);
  card.appendChild(cardDelete);
  mainContent.appendChild(card);
}

function createOrder(data, cards) {
  const mainContent = document.getElementById("current-orders");
  const card = document.createElement("div");
  const cardAdress = document.createElement("div");
  const cardStreet = document.createElement("div");
  const cardHouse = document.createElement("div");
  const cardEntrance = document.createElement("div");
  const cardHouseNum = document.createElement("div");
  const cardPlace = document.createElement("div");
  const cardPhone = document.createElement("div");
  const cardComment = document.createElement("div");
  const cardPrice = document.createElement("div");
  const cardCart = document.createElement("div");
  const cardDelete = document.createElement("button");

  const className = "admin-product-info";
  card.classList = "admin-product";
  cardAdress.classList = className;
  cardStreet.classList = className;
  cardHouse.classList = className;
  cardEntrance.classList = className;
  cardHouseNum.classList = className;
  cardPlace.classList = className;
  cardPhone.classList = className;
  cardComment.classList = className;
  cardPrice.classList = className;
  cardCart.classList = className;
  cardDelete.classList = "admin-product-btn";

  cardAdress.innerHTML = `<b>Адресс: </b>${data.get("adress")}`;
  cardStreet.innerHTML = `<b>Улица: </b>${data.get("street")}`;
  cardHouse.innerHTML = `<b>Дом: </b>${data.get("house")}`;
  cardEntrance.innerHTML = `<b>Подъезд: </b>${data.get("entrance")}`;
  cardHouseNum.innerHTML = `<b>Квартира: </b>${data.get("houseNum")}`;
  cardPlace.innerHTML = `<b>Название места: </b>${data.get("place")}`;
  cardPhone.innerHTML = `<b>Номер телефона: </b>${data.get("phone")}`;
  cardComment.innerHTML = `<b>Комментарий: </b>${data.get("comment")}`;
  cardPrice.innerHTML = data.get("price");

  cardCart.innerHTML = `<b>ID заказов: </b>${cards}`;
  cardDelete.innerHTML = "Удалить заказ";

  cardDelete.onclick = async () => {
    if (confirm(`Удалить заказ?`)) {
      const cards = new Parse.Object("Order");
      cards.set("objectId", data.id);
      try {
        await cards.destroy();
        alert("Заказ удален, обновите страницу");
        return true;
      } catch (error) {
        alert(error.message);
        return false;
      }
    }
  };

  card.appendChild(cardAdress);
  card.appendChild(cardStreet);
  card.appendChild(cardHouse);
  card.appendChild(cardEntrance);
  card.appendChild(cardHouseNum);
  card.appendChild(cardPlace);
  card.appendChild(cardPhone);
  card.appendChild(cardComment);
  card.appendChild(cardPrice);
  card.appendChild(cardCart);
  card.appendChild(cardDelete);
  mainContent.appendChild(card);
}
