const PARSED = JSON.parse(localStorage.cart);
const DOL_KEY = "";
const DOL_DOMAIN = "";
const TAG = "/products/";
const ID = 31;
const DOL_FILTER = "&sortorder=ASC&category=31&limit=1000";

console.log(PARSED);

const allProduct = new Array();

/**
 * Take all the product in the cart to make an object witch contain infos sended before in localStorage and fetch the other we need then push it into array
 * @returns { Object } AllProduct
 */

async function dataStorage() {
  for (let i = 0; i < Object.keys(PARSED).length; i++) {
    let rep = await fetch(DOL_DOMAIN + TAG + PARSED[i].id + DOL_KEY);
    let response = await rep.json();
    const productInfo = {
      id: PARSED[i].id,
      price: response.price,
      nom: response.label,
      quantity: PARSED[i].qtt,
      size: PARSED[i].size,
      image: PARSED[i].image,
    };
    allProduct.push(productInfo);
  }
  return allProduct;
}

dataStorage();

setTimeout(function () {
  Display();
}, 1000);


/**
 * Display all the products in allProduct
 */

function Display() {
  for (let i = 0; i < Object.keys(allProduct).length; i++) {
    const name = allProduct[i].nom;
    function removeLastWord(str) {
      const lastIndexOfSpace = str.lastIndexOf(" ");
      if (lastIndexOfSpace === -1) {
        return str;
      }
      return str.substring(0, lastIndexOfSpace);
    }
    console.log(allProduct[i].quantity)
    const cutted = removeLastWord(name);
    const parent_article = document.getElementById("cart__items");
    const child = document.createElement("article")
    child.innerHTML = `<div>
    <div >
    <h2>${cutted}</h2>
    <img src ="https://cdn3.rhumraisin.com/${parseInt(allProduct[i].image[0])}-home_default/${allProduct[i].image[1]}.jpg">
    <p>Taille : ${allProduct[i].size}</p>
    <p class="itemPrice">${Math.round(allProduct[i].price * 100) / 100}</p>
    <div>
    <p> Quantité : </p>
    <input type="number" value="${allProduct[i].quantity}" class="itemQuantity">
    </div></div>
    <p class="deleteItem ${i}">Supprimer</p>
    </div>`

    parent_article.appendChild(child)
  }
  CalcArt();
}

const val_input = document.getElementsByClassName("itemQuantity");
const totalArtc = document.getElementById("totalQuantity");
const order_button = document.getElementById("order");
order_button.addEventListener("click", function () {
  localStorage.setItem("cart");
  location.reload();
});

/**
 * Calculate and display the amount of product and launch the CalcPrix and testInput function
 */

function CalcArt() {
  articleTotal = [];
  sumArtc = 0;

  for (let i = 0; i < Object.keys(allProduct).length; i++) {
    val_input[i].addEventListener("change", CalcArt);
    articleTotal.push(val_input[i].value);
    allProduct[i].qtt = articleTotal[i];
    sumArtc = parseInt(articleTotal[i]) + sumArtc;
  }
  totalArtc.innerHTML = sumArtc;
  CalcPrix();
  testInput(val_input);

  const toDell = document.getElementsByClassName("deleteItem");
  for (var i = 0; i < toDell.length; i++) {
    toDell[i].addEventListener("click", Supprimer);
  }
}

const one_price = document.getElementsByClassName("itemPrice");

/**
 * Calculate and display the price of the items
 */
function CalcPrix() {
  let sumPrice = 0;
  for (let i = 0; i < Object.keys(allProduct).length; i++) {
    sumPrice += parseInt(one_price[i].innerHTML * val_input[i].value);
  }

  document.getElementById("totalPrice").innerHTML = sumPrice;
}

/**
 * Cut the element in the cart array, delement cart in local storage then replace with the new one
 * @param { DOM Element} cible 
 */

function Supprimer(cible) {
  console.log(cible)
  abc = cible.target.classList.value;
  qsd = abc.split(" ");
  PARSED.splice(qsd[1], 1);
  localStorage.removeItem("cart");
  localStorage.setItem("cart", JSON.stringify(PARSED));
  location.reload();
}

/**
 * Take the value of an input to test if he is equal to 0, if its the case launch delete function
 * @param { DOM Element} input input type Number element
 */

function testInput(input) {
  console.log(input)
  for (let i = 0; i < Object.keys(input).length; i++) {
    if (input[i].value == 0) {
      PARSED.splice(i, 1);
      localStorage.removeItem("cart");
      localStorage.setItem("cart", JSON.stringify(PARSED));
      location.reload();
    }
  }
}
