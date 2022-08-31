const DIV_TO_TARGET = document.getElementById("cart-here-please");
DIV_TO_TARGET.innerHTML = `

<div id="cart__items"></div>
  <div>Total quantité :<span id="totalQuantity"></span></div>
<div>Total prix :<span id="totalPrice"></span></div>`;

/**
 * allProduct exemple : { [id: number, price: number, nom: string, quantity : number, size: number] , [id: number, price: number, nom: string, quantity : number, size: number] }
 */

const allProduct = JSON.parse(localStorage.cart);
const val_input = document.getElementsByClassName("itemQuantity");
const order_button = document.getElementById("order");
order_button.addEventListener("click", function () {
  localStorage.setItem("cart", "");
  location.reload();
});

Display();

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
    const cutted = removeLastWord(name);
    const parent_article = document.getElementById("cart__items");
    const child = document.createElement("article");
    child.innerHTML = `<div>
     <div >
     <h2>${cutted}</h2>
     <p>Taille : ${allProduct[i].size}</p>
     <p class="itemPrice">${Math.round(allProduct[i].price * 100) / 100}</p>
     <div>
     <p> Quantité : </p>
     <input type="number" value="${allProduct[i].quantity}" class="itemQuantity">
     </div></div>
     <p class="deleteItem ${i}">Supprimer</p>
     </div>`;

    parent_article.appendChild(child);
  }
  CalcArt();
}

/**
 * Calculate and display the amount of product and launch the CalcPrix and testInput function
 */

function CalcArt() {
  const totalArtc = document.getElementById("totalQuantity");
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

/**
 * Calculate and display the price of the items
 */
function CalcPrix() {
  const one_price = document.getElementsByClassName("itemPrice");
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
  console.log(cible);
  abc = cible.target.classList.value;
  qsd = abc.split(" ");
  allProduct.splice(qsd[1], 1);
  localStorage.removeItem("cart");
  localStorage.setItem("cart", JSON.stringify(allProduct));
  location.reload();
}

/**
 * Take the value of an input to test if he is equal to 0, if its the case launch delete function
 * @param { DOM Element} input input type Number element
 */

function testInput(input) {
  for (let i = 0; i < Object.keys(input).length; i++) {
    if (input[i].value == 0) {
      allProduct.splice(i, 1);
      localStorage.removeItem("cart");
      localStorage.setItem("cart", JSON.stringify(allProduct));
      location.reload();
    }
  }
}