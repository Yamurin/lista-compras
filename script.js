let arrProducts = JSON.parse(localStorage.getItem("products")) || [];    // Vetor de objetos 

const ulProductsList = document.querySelector(".product-list");
const btnAddProduct = document.querySelector(".home__add-product-btn");
const formNewProduct = document.querySelector(".product-form");
const productTemplate = document.querySelector("#li-card-template");
const btnIncrement = document.querySelectorAll(".btn-quantity");

const spnTotalValue = document.querySelector(".total-value");
let totalValue = 0;

// Template pra criar o card de cada produto
class listItem {
    constructor (product) {
        this.cardElement = productTemplate.content.cloneNode(true),
        this.product = product;

        this.nameEl = this.cardElement.querySelector(".product-name");
        this.nameEl.textContent = `${product.name}`;

        this.quantityEl = this.cardElement.querySelector(".product-quantity");
        this.quantityEl.textContent = `${product.quantity}`;

        this.unPriceEl = this.cardElement.querySelector(".product-un-price");
        this.unPriceEl.textContent = `${product.unPrice}`;

        this.subtotalEl = this.cardElement.querySelector(".product-subtotal");
        this.calculateSubtotal();

        this.btnsQuantity =  this.cardElement.querySelectorAll(".btn-quantity");
        this.btnEdit = this.cardElement.querySelector(".btn-item-edit");
        this.btnRemove = this.cardElement.querySelector(".btn-item-remove");

        changeQuantity(this);
        editProduct(this);
        removeProduct(this);

        return this.cardElement;
    }

    calculateSubtotal() {
        let newSubtotal = Number(this.product.unPrice * this.product.quantity).toFixed(2);
        this.subtotalEl.textContent = `${newSubtotal}`;
        return this.subTotal = newSubtotal;
    }
}

//Renderizar todos os produtos da lista
arrProducts.forEach((product) => {
    let productCard = new listItem(product)
    ulProductsList.append(productCard);
});

function editProduct(product) {
    product.btnEdit.addEventListener('click', () => {
        product.nameEl.toggleAttribute("contentEditable");
        product.unPriceEl.toggleAttribute("contentEditable");

        product.nameEl.addEventListener("keydown", (key) => {
            if (key.key == "Enter")//space
            {
                product.nameEl.removeAttribute("contentEditable");
                product.product.name = product.nameEl.textContent;
                updateLocalStorage();
            }
        });

        product.unPriceEl.addEventListener("keydown", (key) => {
            if (key.key == "Enter")//space
            {
                product.unPriceEl.removeAttribute("contentEditable");
                product.product.unPrice = Number(product.unPriceEl.textContent);
                product.calculateSubtotal(product)
                updateLocalStorage();
            }
        });
    })
}

function removeProduct(listItem) {
    listItem.btnRemove.addEventListener('click', () => {
        const index = arrProducts.findIndex(element => element.name == listItem.product.name)
        arrProducts = arrProducts.splice(1, index);
    });
}

function changeQuantity(listItem) {
    let newQuantity = Number(listItem.quantityEl.textContent);

    listItem.btnsQuantity.forEach((btn) => {
        btn.addEventListener('click', () => {
            if(btn.name == "-"  && listItem.product.quantity > 1) {
                newQuantity--;
                listItem.product.quantity--;
            } else if (btn.name == "+") {
                newQuantity++;
                listItem.product.quantity++;
            } 
            else {
                // TODO: Adicionar alerta mais user-friendly
                alert("Você não pode ter menos de um item.");
            }
            listItem.product.subTotal = listItem.calculateSubtotal();

            listItem.quantityEl.textContent = (`${newQuantity}`); 
            updateLocalStorage();
        });
    });
}

// Atualizar o localStorage
function updateLocalStorage() {

    arrProducts.forEach((product) => {
        totalValue += product.subTotal;
        console.log(`subtotal do produto: ${product.subTotal}`);
        console.log(typeof(product.subTotal));
    })

    localStorage.setItem("totalValue", totalValue)
    localStorage.setItem("products", JSON.stringify(arrProducts));

};

// Alternar visibilidade do formulário 
function toggleForm () {
    formNewProduct.classList.toggle("hidden");
    document.querySelector(".dark-overlay").classList.toggle("hidden");
};

// Cria e adiciona um novo objeto de produto ao vetor com todos os produtos.
function createNewProduct ( ) {
    const inputName = document.querySelector("#input-name");
    const inputUnPrice = document.querySelector("#input-un-price");
    const inputQuantity = document.querySelector("#input-quantity");

    const newProduct = {
        name: inputName.value,
        unPrice: parseFloat([inputUnPrice.value]),
        quantity: parseInt([inputQuantity.value]),
        subTotal: parseFloat(inputUnPrice.value * inputQuantity.value),
    };

    let newListItem = new listItem(newProduct);
    ulProductsList.append(newListItem);
    arrProducts.push(newProduct);
    updateLocalStorage();
};

// Mostra o formulário ao clicar em "Adicionar produto"
btnAddProduct.addEventListener('click', () => {
    toggleForm();
});

// Submissão de um novo produto pelo formulário
formNewProduct.addEventListener('submit', (event) => {
    event.preventDefault();
    createNewProduct();
    toggleForm();
});

document.querySelector("#btn-cancel").addEventListener('click', () => toggleForm());