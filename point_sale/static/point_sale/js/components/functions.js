var urls = {
  barcode: "/barcode/",
  query: "/query/",
  registerSale: "/addSale/",
};

function requestAJAX(url, data, successCall, errorCall) {
  $.ajax({
    url: url,
    method: "GET",
    data: { value: data },
    success: successCall,
    error: function (jqXHR, xhr, status, error) {
      msgError(status, jqXHR);
    },
  });
}

function msgError(error, jqXHR) {
  let msg = "";
  switch (jqXHR.status) {
    case 500:
      msg = " returned more than one product";
      break;

    case 404:
      msg = " product";
      break;

    default:
      break;
  }
  modalError.find(".modal-body").text(error + " " +jqXHR.status +" " +msg);
  modalError.modal("show");
}

function sendAJAX(url, data, successCall, errorCall) {
  var csrftoken = getCookie("csrftoken");
  $.ajax({
    url: url,
    method: "POST",
    contentType: "application/json",
    data: data,
    beforeSend: function (xhr, settings) {
      xhr.setRequestHeader("X-CSRFToken", csrftoken);
    },
    success: successCall,
    error: function (xhr, status, error) {
      if (errorCall) {
        errorCall(error);
      } else {
        console.error("Error en solicitud AJAX: ", error);
      }
    },
  });
}

function getCookie(name) {
  var cookieValue = null;
  if (document.cookie && document.cookie !== "") {
    var cookies = document.cookie.split(";");
    for (var i = 0; i < cookies.length; i++) {
      var cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === name + "=") {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

function sendDataProducts(data) {
  sendAJAX(urls.registerSale, data, function (success) {
    console.log(success);
  });
}

function getProductByBarcode(barcode, callback) {
  requestAJAX(urls.barcode, barcode, function (response) {
    callback(response);
  });
}

function getProductbyQuery(name, callback) {
  requestAJAX(urls.query, name, function (response) {
    callback(response);
  });
}

function getDataFromModal(product, type) {
  return new Promise((resolve, reject) => {
    modalGetData.find("h5").empty();
    modalGetData.find("h6").empty();
    let text = "";
    let description = "";

    switch (type) {
      case operation.edit:
        text = product.granel
          ? `Editar importe para <p class="fw-light">${product.name} </p>`
          : `Editar cantidad para <p class="fw-light">${product.name} </p>`;
        description = product.granel
          ? `El importe anterior para <p class="fw-light">${product.name} </p> fue de <p class="fw-light">${product.importe} </p>`
          : `La cantidad anterior de <p class="fw-light">${product.name} </p> fue de <p class="fw-light">${product.quantity} </p>`;

        modalGetData
          .find("input")
          .attr(
            "placeholder",
            "Ingresa una nueva cantidad/monto para este producto"
          );
        break;
      case operation.get:
        text = `Ingresar importe para  <p class="fw-light">${product.name}</p>`;
        description = `<h5>Precio <span class="badge bg-info text-dark">$ ${product.price}</span></h5>  `;
        modalGetData
          .find("input")
          .attr("placeholder", "Ingresa una cantidad/monto para este producto");
        break;
      default:
        break;
    }

    modalGetData.find("h5").append(text);
    modalGetData.find("h6").append(description);
    modalGetData.modal("show");

    $("#modalAceptar-btn").off("click");
    modalGetData.off("hidden.bs.modal");

    $("#modalAceptar-btn").on("click", function () {
      const inputValue = modalGetData.find("input").val().trim();
      if (/^\d*\.?\d+$/.test(inputValue)) {
        importe = parseFloat(inputValue, 10);
        modalGetData.modal("hide");
        modalGetData.find("input").val("");
        modalGetData.find("h5").empty();
        modalGetData.find("h6").empty();
        resolve(importe);
      } else {
        alert("Por favor, ingrese un número válido.", "danger");
      }
    });

    modalGetData.on("hidden.bs.modal", function (e) {
      reject("El usuario canceló la operación.");
      inputBarcode.focus();
    });
  });
}

function alert(message, type) {
  // Selecciona todos los contenedores con la clase especificada
  var containers = $(".alertPlaceholder");

  // Itera sobre cada contenedor
  containers.each(function () {
    var container = $(this);

    // Verifica si el contenedor no tiene alertas ya
    if (container.children().length === 0) {
      var wrapper = $("<div>");
      wrapper.html(
        '<div class="alert alert-' +
          type +
          ' alert-dismissible" role="alert">' +
          message +
          '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>'
      );
      container.append(wrapper);

      setTimeout(function () {
        wrapper.remove();
      }, 1500);
    }
  });
}

function resultLookUp(obj) {
  listProductsLookUp.empty();
  obj.products.forEach((product, index) => {
    if (index < recodsLookUp) {
      let _product_ = new Product(
        product.id,
        product.name,
        product.price,
        product.granel
      );
      let dataProduct = JSON.stringify(_product_);
      let item = `
      <li class="item" style="cursor:pointer; display: flex; align-items: center;" data-product='${dataProduct}' class="d-flex p-2 bd-highlight justify-content-between">
      <a class="dropdown-item text-wrap" style="display: inline-block; margin-right: 10px;">${_product_.name}</a>
      <div class="badge bg-primary text-center" style="display: inline-block;">${_product_.price}</div> 
      </li>`;
      listProductsLookUp.append(item);
    }
  });
}

function registerSale(data) {
  return new Promise((resolve, reject) => {
    pago.val("");
    cambioAdevolver.text("Ingresa una cantidad para calcular el cambio");
    modalRegisterSale.find("#registerPago").off("click");
    modalRegisterSale.off("hidden.bs.modal");
    _ProductManager_.setTotal();
    modalRegisterSale.modal("show");

    pago.on("keyup keypress", function () {
      let input = pago.val().trim();
      let p = parseFloat(input);

      if (!isNaN(p)) {
        if (p >= _ProductManager_.total) {
          cambioAdevolver.text(
            "Por devolver: $ " + (p - _ProductManager_.total).toFixed(2)
          );
          modalRegisterSale.find("#registerPago").removeAttr("disabled");
        } else {
          modalRegisterSale.find("#registerPago").attr("disabled", "");
          cambioAdevolver.text("Ingresa una cantidad para calcular el cambio");
        }
      }
    });

    confpago.on("click", function () {
      resolve(sendDataProducts(data));
      pago.val("");
      cambioAdevolver.text("Ingresa una cantidad para calcular el cambio");
      confpago.attr("disabled", "");
      modalRegisterSale.modal("hide");
    });

    modalRegisterSale.on("hidden.bs.modal", function (e) {
      reject("El usuario canceló la operación.");
    });
  });
}
