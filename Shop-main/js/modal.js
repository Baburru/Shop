const POP_DOL_KEY = "";
const POP_DOL_DOMAIN = "";
const POP_TAG = "/products/";
const POP_ID = 31;
const POP_DOL_FILTER = "&sortorder=ASC&category=31&limit=1000";

const but_mod = document.getElementById("mod");
but_mod.addEventListener("click", Main);

const modal = document.getElementById("modal1");
const openModal = document.querySelector(".open-modal");
const closeModal = document.querySelector(".close-modal");

openModal.addEventListener("click", () => {
  modal.showModal();
});

closeModal.addEventListener("click", () => {
  modal.close();
});

const allProduct = new Array();
const parent_article = document.getElementById("cart__items");
function Main() {
  const PARSED = JSON.parse(localStorage.cart);

  async function dataStorage() {
    for (let i = 0; i < Object.keys(PARSED).length; i++) {
      let rep = await fetch(
        POP_DOL_DOMAIN + POP_TAG + PARSED[i].id + POP_DOL_KEY
      );
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
    Displayed();
  }, 300);



  function Displayed() {
    const panier = document.createElement("div");
    panier.classList.add("link-to-cart");
    panier.innerHTML = `<a id="cart-link" href="cart.html">Panier</a>`;

    parent_article.innerHTML = "";
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
        <p> Quantité :</p>
        <input type="number" class="itemQuantity" value="${
          allProduct[i].quantity
        }">
        </div></div>
        <input type="button" value="Supprimer" class="deleteItem ${i}">
        </div>`;

      parent_article.appendChild(child);

      parent_article.appendChild(panier);
    }

    CalcArt();
    const toDell = document.getElementsByClassName("deleteItem");

    
    for (var i = 0; i < toDell.length; i++) {
      toDell[i].addEventListener("click", Supprimer);
    }


  }

  function Supprimer(cible) {
    abc = cible.target.classList.value;
    qsd = abc.split(" ");
    PARSED.splice(qsd[1], 1);
    localStorage.removeItem("cart");
    localStorage.setItem("cart", JSON.stringify(PARSED));
    location.reload();
  }
}

//Calucul total articles

const val_input = document.getElementsByClassName("itemQuantity");
const total = document.createElement("div");

function CalcArt() {
  
  articleTotal = [];
  sumArtc = 0;
  for (let i = 0; i < Object.keys(allProduct).length; i++) {
    val_input[i].addEventListener("change", CalcArt);
    articleTotal.push(parseInt(val_input[i].value));
    allProduct[i].qtt = articleTotal[i];
    sumArtc = parseInt(articleTotal[i]) + sumArtc;
  }
  const totart = document.querySelector('.totalQuantity');
  totart.innerHTML = sumArtc;
  CalcPrix()
}

//Calcul total prix
function CalcPrix() {
  sumPrice = 0;
  for (let i = 0; i < Object.keys(allProduct).length; i++) {
    sumPrice =
      sumPrice + parseInt(allProduct[i].price) * parseInt(allProduct[i].qtt);
  }
  const totprice = document.querySelector('.totalPrice');
  totprice.innerHTML = sumPrice;
}