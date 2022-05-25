import { select,settings, classNames, templates} from './settings.js';
import utils from './utils.js';
import CartProduct from './components/CartProduct.js';
class Cart{
  constructor(element){
    const thisCart = this;
      
    thisCart.products = [];

    thisCart.getElements(element);

    //console.log('new Cart', thisCart);
      
    thisCart.initActions(element);
  }

  getElements(element){
    const thisCart = this;

    thisCart.dom = {
      wrapper: element,

      toggleTrigger: element.querySelector(select.cart.toggleTrigger),
  
      productList: element.querySelector(select.cart.productList),
      
      deliveryFee: element.querySelector(select.cart.deliveryFee),
        
      subtotalPrice: element.querySelector(select.cart.subtotalPrice),
        
      totalPrice: element.querySelectorAll(select.cart.totalPrice),
        
      totalNumber: element.querySelector(select.cart.totalNumber),
        
      form: element.querySelector(select.cart.form),

      address: element.querySelector(select.cart.address),

      phone: element.querySelector(select.cart.phone),
    };
  }

  initActions(){
    const thisCart = this;

    thisCart.dom.toggleTrigger.addEventListener('click', function(){

      thisCart.dom.wrapper.classList.toggle(classNames.cart.wrapperActive);
    });

    thisCart.dom.productList.addEventListener('updated', function(){
      thisCart.update();
    });
      
    thisCart.dom.productList.addEventListener('remove', function(event){
      thisCart.remove(event.detail.cartProduct);
    });

    thisCart.dom.form.addEventListener('submit', function(event){
      event.preventDefault();
      thisCart.sendOrder();
    });
  }

  add(menuProduct){
    const thisCart = this;

    const generatedHTML = templates.cartProduct(menuProduct);

    const generatedDOM = utils.createDOMFromHTML(generatedHTML);

    thisCart.dom.productList.appendChild(generatedDOM);

    thisCart.products.push(new CartProduct(menuProduct, generatedDOM));
      
    console.log('thisCart.products', thisCart.products);

    thisCart.update();
  }

  update(){
    const thisCart = this;
    thisCart.deliveryFee = settings.cart.defaultDeliveryFee;
    thisCart.totalNumber = 0;
    thisCart.subtotalPrice = 0;
    for (let product of thisCart.products) {
      thisCart.totalNumber += product.amountWidget.value;
      thisCart.subtotalPrice += product.price;
    }
    if (thisCart.totalNumber <= 0){
      thisCart.deliveryFee = 0;
    }

    thisCart.totalPrice = thisCart.subtotalPrice + thisCart.deliveryFee;
    console.log ('wszysztkie stale i totalPrice', thisCart.totalNumber, thisCart.subtotalPrice, thisCart.totalPrice);
    
    thisCart.dom.subtotalPrice.innerHTML = thisCart.subtotalPrice;
    thisCart.dom.deliveryFee.innerHTML = thisCart.deliveryFee;
    thisCart.dom.totalPrice.innerHTML = thisCart.totalPrice;
    thisCart.dom.totalNumber.innerHTML = thisCart.totalNumber;
    for ( let oneElement of thisCart.dom.totalPrice) {
      oneElement.innerHTML = thisCart.totalPrice;
    }
  }

  remove(product){
    const thisCart = this;

    const indexOfProduct = thisCart.products.indexOf(product);
    thisCart.products.splice(indexOfProduct, 1);
    let productElement = product.dom.wrapper;
    productElement.remove();
    thisCart.update();
  }

  sendOrder(){
    const thisCart = this;

    const url = settings.db.url + '/' + settings.db.orders;

    const payload = {
      address: thisCart.dom.address.value,
      phone: thisCart.dom.phone.value,
      totalPrice: thisCart.totalPrice,
      subtotalPrice: thisCart.subtotalPrice,
      totalNumber: thisCart.totalNumber,
      deliveryFee: thisCart.deliveryFee,
      products: [],
    };
    for(let prod of thisCart.products) {
      payload.products.push(prod.getData());
    }
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    };
      
    fetch(url, options)        
      .then(function (response) {
        return response.json();
      }).then(function (parsedResponse) {
        console.log('parsedResponse', parsedResponse);
      });
  }
}

export default Cart;