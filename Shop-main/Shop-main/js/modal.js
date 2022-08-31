const DIV_TO_TARGET = document.getElementById("cart-here-please");
DIV_TO_TARGET.innerHTML = `
<input id="mod" type="button" class="open-modal" value="Modal">
<dialog id="modal1" class="modal">
  <button class="close-modal">Fermer la boite modale</button>
  <div id="cart__items"></div>
  <div>Total quantité :<span class="totalQuantity"></span></div>
<div>Total prix :<span class="totalPrice"></span></div>
</dialog>`;

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
const parent_article = document.getElementById("cart__items");

const allProduct = [];

/**
 * allProduct exemple : { [id: number, price: number, nom: string, quantity : number, size: number] , [id: number, price: number, nom: string, quantity : number, size: number] }
 */

const productExemple1 = {
  id: 918905,
  price: 76,
  nom: "Robe longue rouge",
  quantity: 3,
  size: 5,
};

const productExemple2 = {
  id: 897389,
  price: 46,
  nom: "Pantalon vert",
  quantity: 2,
  size: 4,
};

allProduct.push(productExemple1, productExemple2);

function Main() {
  Displayed();

  function Displayed() {
    const panier = document.createElement("div");
    panier.classList.add("link-to-cart");
    panier.addEventListener("click", function () {
      localStorage.setItem("cart", JSON.stringify(allProduct));
      window.location.href = "cart.html";
    });
    panier.innerHTML = `<a id="cart-link">Panier</a>`;

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


}

function Supprimer(cible) {
  abc = cible.target.classList.value;
  qsd = abc.split(" ");
  allProduct.splice(qsd[1], 1);
  Main()
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
  const totart = document.querySelector(".totalQuantity");
  totart.innerHTML = sumArtc;
  CalcPrix();
}

//Calcul total prix
function CalcPrix() {
  sumPrice = 0;
  for (let i = 0; i < Object.keys(allProduct).length; i++) {
    sumPrice =
      sumPrice + parseInt(allProduct[i].price) * parseInt(allProduct[i].qtt);
  }
  const totprice = document.querySelector(".totalPrice");
  totprice.innerHTML = sumPrice;
}