const type = {
  granel: "granel",
};

const operation = {
  edit: "edit",
  get: "get",
  send: "send"
};
const recodsLookUp = 10;
const indexPrefix = "idx_";
// elements dom
const fieldLookUp = $("#lookUp");
const inputBarcode = $("#inputBarcode");
const tableData = $("#tableData tbody");
const listProductsLookUp = $("#listProductsLookUp");
const buttonClean = $("#clean");
const total = $(".total");
const buttonEdit = $(".edit-btn");
const buttonDelete = $(".delete-btn");
const modalGetData = $("#modalGetData");
const modalRegisterSale = $("#modalRegisterSale");
const register = $('#register');
const toast = $('#liveToast');
const modalError = $('#modalError');

const pago = $('#ingresoUsuario');
const cambioAdevolver = $('#cambioDevuelto');
const confpago = $('#registerPago');

class Product {
  constructor(id, name, price, granel = false) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.quantity = granel ? "---" : 1;
    this.granel = granel;
    this.importe = granel ? null : this.calcAmount().toFixed(2);
  }

  calcAmount() {
    this.importe = this.granel? this.importe : (this.price * this.quantity);
    return this.importe;
  }
}

class ProductManager {
  constructor() {
    this.products = [];
    this.total = 0.00;
    this.articles = 0;
  }

   addProduct(productInstance) {
    if (productInstance.granel) {
      getDataFromModal(productInstance, operation.get)
        .then((importe) => {
          if(importe !== 0){
          productInstance.importe = importe;
          this.products.push(productInstance);
          }
          this.render();
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      if (this.exist(productInstance)) {
        this.products[this.getIndex(productInstance)].quantity++;
      } else {
        this.products.push(productInstance);
      }
    }

    this.render();
  }

  exist(productInstance) {
    const indexProduct = this.products.findIndex(
      (product) => product.id === productInstance.id
    );
    return indexProduct !== -1 ? true : false;
  }

  getIndex(productInstance) {
    const indexProduct = this.products.findIndex(
      (product) => product.id === productInstance.id
    );

    return indexProduct;
  }

  clear() {
    this.products = [];
    this.total = 0;
    this.render();
  }

  render() {
    tableData.empty();
    this.total = 0;

    this.products.forEach((product, index) => {
      const indexPrefix = "idx_";
      let dataProduct = product.granel
        ? indexPrefix + index
        : JSON.stringify(product);
      const row = `<tr>
      <td class="table-light">${product.name}</td>
      <td class="table-light">${product.quantity}</td>
      <td class="table-light"> $ ${product.price}</td>
      <td class="table-light"> $ ${product.calcAmount().toFixed(2)}</td>
      <td class="table-light" >
       <button class="edit-btn btn btn-primary btn-sm" data-product='${dataProduct}'> Editar </button>
       <button class="delete-btn btn btn-danger btn-sm me-1" data-product='${dataProduct}'> Eliminar</button>    
       </td>
      </tr>`;
      this.total += product.importe;
      tableData.append(row);
    });
    this.setTotal();
  }

  setTotal(){
    total.text("$ " + this.total.toFixed(2));
  }

  remove(p) {
    this.products = this.products.filter((product) => product.id !== p.id);
    this.render();
  }

  edit(product) {
    getDataFromModal(product, operation.edit).then((quantity) => {
      if(quantity !== 0){
        this.products[this.getIndex(product)].quantity = quantity;
      }else{
        this.remove(product);
      }
      this.render();
    })
    .catch((error) => {
      console.log(error);
    });
  }

  editByIndex(index) {
    const product = this.products[index];
    getDataFromModal(product, operation.edit)
    .then( (importe) => {
      if(importe !== 0){
      this.products[index].importe = importe;
      }else{
        this.removebyIndex(index)
      }
      this.render();
    })
    .catch((error) => {
      console.log(error);
    })
  }

  removebyIndex(index){
    this.products.splice(index, 1);
    this.render();
  }
}

const _ProductManager_ = new ProductManager();
tableData.off("click");
listProductsLookUp.off('click');


inputBarcode.on("change keyup", async function (e) {
  if (e.type == "keyup") {
    listProductsLookUp.hide();
    let input = $(this).val();
    if (input.charAt(0) == "@") {
      let lookFor = input.substring(1).trim();
      listProductsLookUp.empty();
      // Do a search
      if(lookFor.length > 2){
        getProductbyQuery(lookFor, function (response){
          resultLookUp(response);
        });
      }
      listProductsLookUp.show();
    }
  } else if (e.type == "change") {
    let input = $(this).val();
    if(input.charAt(0) !== "@" && input !== '')
    {
      // Search by barcode
    getProductByBarcode(input, function (response) {
      let product = new Product(
        response.id,
        response.name,
        response.price,
        response.granel
      );
      _ProductManager_.addProduct(product);
    });
  
    $(this).val("");
    }else{
    }
  }
});

buttonClean.on("click", function () {
  _ProductManager_.clear();
});

tableData.on("click", ".delete-btn", function () {
  const product = $(this).data("product");
  if(typeof product === 'string' && product.startsWith(indexPrefix)){
    const index = parseInt(product.slice(indexPrefix.length));
    _ProductManager_.removebyIndex(index);
  }else{
    _ProductManager_.remove(product);
  }
});

tableData.on("click", ".edit-btn", function () {
  const product = $(this).data("product");
  if(typeof product === 'string' && product.startsWith(indexPrefix)){
    const index = parseInt(product.slice(indexPrefix.length));
    _ProductManager_.editByIndex(index);
  }else{
    _ProductManager_.edit(product);
  }
});

listProductsLookUp.on('click', '.item', function(){
  const productData = $(this).data('product');
  const product = new Product(productData.id, productData.name, productData.price, productData.granel);
  _ProductManager_.addProduct(product);
  listProductsLookUp.hide();
  inputBarcode.val('');
});

register.on('click', function (){
  if(_ProductManager_.products.length !== 0){
    registerSale(JSON.stringify(_ProductManager_.products))
    .then( (result) => {
      _ProductManager_.clear();
    })
    .catch((error) =>{
      console.log(error)
    })
    ;
  }
});


modalError.on('hidden.bs.modal', function() {
  inputBarcode.focus();
});



