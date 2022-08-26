const load = document.createElement("div");
load.id = "loading";
console.log(localStorage)
// GET REQUEST
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
let pageID = urlParams.get("p");

if (pageID == null) {
  pageID = 1;
}

const DOL_KEY = "";
const DOL_DOMAIN = "";
const TAG = "/products";
const ID = 31;
const DOL_FILTER = "&sortorder=ASC&category=31&limit=1000";


/**
 * Get the size and infos needed to display pictures of each product
 * @returns { Array } AllInfo
 */

function GroupProducts() {
  const stacked_product = [];
  const row_product = [];
  const allInfo = [];

  const dol_option = {
    method: "GET",
    headers: { Accept: "application/json" },
  };

  fetch(DOL_DOMAIN + TAG + DOL_KEY + DOL_FILTER, dol_option)
    .then((response) => {
      return response.json();
    })
    .then((data) => {

      for (let i = 0; i < data.length; i++) {
        let reference = data[i].array_options.options_sku;
        row_product.push(reference);
        if (!stacked_product.includes(reference)) {
          stacked_product.push(reference);
        }
      }
      
      stacked_product.forEach((element) => {
        const taille = [];
        const test = row_product.filter(el => el == element)

        if(test.length == 1){
          taille.push(4)
        } else {
          for (let i = 0; i < test.length; i++) {
            taille.push(5 + i);
          }
        }   

      allInfo.push([element, taille]);
        
      });
    })
    .catch(console.error);

  return allInfo;
}

const result = GroupProducts();
globalThis.result;

/**
 * Pagination
 *
 * @param { Number } current page
 * @param { Number } rows All rows data
 * @param { Number } limit Limit par page
 *
 * @return { Objet } paginations
 */
var Paginations = function (current, rows, limit) {
  this.current = current;
  this.rows = rows;
  this.limit = limit;

  this.allPages = function () {
    return Math.ceil(this.rows / this.limit);
  };

  this.prev = function () {
    // prev page
    if (this.current === 1) {
      return null;
    }
    return this.current - 1;
  };

  this.next = function () {
    //next page
    if (this.current >= this.allPages()) {
      return null;
    }
    return parseInt(this.current) + 1;
  };

  this.data_end = function () {
    return this.current * this.limit;
  };

  this.data_start = function () {
    return this.data_end() + 1 - this.limit;
  };

  return {
    numb: parseInt(this.allPages()),
    prev: this.prev(),
    next: parseInt(this.next()),
    current: parseInt(this.current),
    rowStart: parseInt(this.data_start()),
    rowEnd: parseInt(this.data_end()),
  };
};

// Code to have access to the api (may change)
const PS_KEY = "";
const PS_DOMAIN = "";
const RESOURCE = "/products";
const OUT = "JSON";

/**
 * Product Display from api
 * Edit the const just up this function to select where you want to fetch the id's of your product
 * Then this is gonna put it in an array and launch "GetInfoByID" for each ID function who stores the product name,product name reference,the id and the price
 * Then display all thoose items into a pagination system
 *
 * @param { Number } category_number = Product category where you want to get your items
 */

function get(category_number) {
  const FILTER =
    "?filter[id_category_default]=[" + category_number + "]";
  fetch(
    PS_DOMAIN +
      RESOURCE +
      FILTER +
      "&ws_key=" +
      PS_KEY +
      "&output_format=" +
      OUT
  )
    .then(function (response) {
      return response.json();
    })

    .then(function (response) {
      response.products.forEach((res) => {
        getInfoByID(res.id);
      })
    })

    .finally(function () {
      document.body.appendChild(load);
      setTimeout(function () {
        display(totalRes.sort(function(a,b){return a[4]-b[4]}), pagination.rowStart -1, pagination.rowEnd -1);
        load.parentElement.removeChild(load);
        addButtunSetup()
      }, 3000);
    });
}

var totalRes = [];
globalThis.totalRes;

/**
 * Get the name, image id, price, product id and put it in an array
 * @param { Number } idToSearch
 * @return { Array } TotalRes
 */

function getInfoByID(idToSearch) {
  fetch(
    PS_DOMAIN +
      "/products/" +
      idToSearch +
      "&ws_key=" +
      PS_KEY +
      "&output_format=" +
      OUT
  )
    .then(function (val) {
      if (val.ok) {
        return val.json();
      }
      throw new Error("erreur ici");
    })

    .then(function (val) {
      totalRes.push([
        val.product.meta_title[0].value,
        val.product.id_default_image,
        val.product.link_rewrite[0].value,
        Math.round(val.product.price * 100) / 100,
        val.product.id,
      ]);

      return totalRes;
    })
    .catch((error) => {
      console.log(error);
    });
}

/**
 * Product displayer
 * Browse in an object a number of product between an interval  and display them
 *
 * @param { Object } prod
 * @param { String } prod[i][0] = Name of the product
 * @param { String } prod[i][1] = ID of the picture
 * @param { String } prod[i][2] = Reference name (used to get the picture with the link in the api)
 * @param { String } prod[i][3] = Price
 * @param { Number } start = Place in the Object for the first product to be displayed
 * @param { Number} end = Place in the Object for the last product to be displayed
 * @return { Void }
 */

function display(prod, start, end) {
  for (let i = start; i < end; i++) {
    // Change this to select the div you want your elements to display inside
    const target = document.getElementById("MyDIV");
    const item_name = document.createElement("p");
    const item_price = document.createElement("p");
    const item_qtt = document.createElement("input");
    const item_button = document.createElement("i");
    item_button.classList.add("fa-solid", "fa-cart-arrow-down", "cart");
    item_button.id = i
    const item_input_zone = document.createElement("div");
    item_input_zone.classList.add("input-zone");
    item_qtt.type = "number";
    item_qtt.value = 1;
    item_qtt.classList.add('qtt-selector')
    item_price.innerHTML = prod[i][3] + " €";
    item_name.classList.add("item_name");
    item_name.innerHTML = prod[i][0];
    const item_div = document.createElement("div");
    item_div.classList.add("item");
    const item_img = document.createElement("img");
    const optTab = result[i][1];

    function createOption(option_array, selectID) {
      const select = document.createElement("select");
      select.id = selectID;
      item_input_zone.appendChild(select);
      option_array.forEach((opt) => {
        const option = document.createElement("option");
        option.innerHTML = opt;
        select.classList.add('size-selector')
        select.appendChild(option);
      });
    }

    item_img.classList.add("item_img");
    item_img.src =
      "" +
      parseInt(prod[i][1]) +
      "-home_default/" +
      prod[i][2] +
      ".jpg";

    target.appendChild(item_div);
    item_div.appendChild(item_img);
    item_div.appendChild(item_name);
    item_div.appendChild(item_price);
    item_div.appendChild(item_input_zone);
    item_input_zone.appendChild(item_qtt);
    createOption(optTab, "test-select");
    item_div.appendChild(item_button);
  }
}

/**
 * Links pagination générator
 * Generate page links and arrows from a selector
 *
 * @param {string} id = css id selector
 * @param {string} uri ex: index.html
 * @param {string} request ex: (index.html?[request]=)
 */

const LinksPagination = function (id, uri, request) {
  this.id = id;
  this.uri = uri;
  this.req = request;

  this.prev = function (page) {
    // body prev link
    let li = document.createElement("li");
    let link = document.createElement("a");
    li.appendChild(link);
    link.innerHTML = "<";
    link.classList.add("but");
    link.title = "page " + page;
    link.href = this.uri + "?" + this.req + "=" + page;

    return li;
  };

  this.next = function (page) {
    // body next link
    let li = document.createElement("li");
    let link = document.createElement("a");
    li.appendChild(link);
    link.innerHTML = ">";
    link.classList.add("but");
    link.title = "page " + page;
    link.href = this.uri + "?" + this.req + "=" + page;

    return li;
  };

  this.bodyLink = function (page, current) {
    let li = document.createElement("li");
    let link = document.createElement("a");
    li.appendChild(link);
    link.innerHTML = page;
    link.classList.add("but");
    link.title = "page " + page;
    if (current != page) {
      link.href = this.uri + "?" + this.req + "=" + page;
    }

    return li;
  };

  this.createLinks = function (paginations) {
    let parent = document.querySelector(this.id);

    if (paginations.prev) {
      parent.appendChild(this.prev());
    }

    for (let i = 1; i <= paginations.numb; i++) {
      parent.appendChild(this.bodyLink(i, paginations.current));
    }

    if (paginations.next) {
      parent.appendChild(this.next(paginations.next));
    }
  };
};

 function addButtunSetup() {
  const button_cart = document.querySelectorAll('.cart')
  for(let i = 0; i < button_cart.length; i++){
    button_cart[i].addEventListener('click', function(){GetInfo(button_cart[i].id)})
  }
}


const ARR_CART = JSON.parse(localStorage.getItem('cart'))



/**
 * Make and object with all the infos needed (product ID, quantity, size of the product, image link) to push them in array to go local storage
 * @param { Number } idInArray Position in the array of displayed products
 * @returns { Array } ARR_CART Array of all product added to the cart
 */
 
function GetInfo (idInArray){
  console.log(idInArray)
  const QTT_INPUT = document.querySelectorAll('.qtt-selector')
  const SIZE_INPUT = document.querySelectorAll('.size-selector')
  const TO_SEND = {
    id: totalRes[idInArray][4],
    qtt: parseInt(QTT_INPUT[idInArray].value),
    size: parseInt(SIZE_INPUT[idInArray].value),
    image : [totalRes[idInArray][1],totalRes[idInArray][2]]
  } 
  ARR_CART.push(TO_SEND)
  localStorage.setItem("cart", JSON.stringify(ARR_CART))
  return ARR_CART
}

