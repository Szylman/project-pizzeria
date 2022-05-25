import {settings,select} from './settings.js';
import Product from './components/Product.js';
import Cart from './components/Cart.js';
const app = {
  initMenu: function(){
    const thisApp = this;
    //console.log('thisApp.data:', thisApp.data);

    for(let productData of thisApp.data.products){
      new Product(productData.id, productData);
    }
  },

  initData: function(){
    const thisApp = this;
      
    thisApp.data = {};
      
    const url = settings.db.url + '/' + settings.db.products;
      
    fetch(url)
      .then(function(rawResponse){
        return rawResponse.json();
      })
      .then(function(prasedResponse){
          

        /*save prasedResponse as thisApp.data.products */
        thisApp.data.products = prasedResponse;
        /*execute initMenu method */
        thisApp.initMenu();
        console.log('praseResponse', prasedResponse);
      });    
  },

  init: function(){
    const thisApp = this;
    //console.log('*** App starting ***');
    //console.log('thisApp:', thisApp);
    //console.log('classNames:', classNames);
    //console.log('settings:', settings);
    //console.log('templates:', templates);

    thisApp.initData();
    thisApp.initCart();
  },

  initCart: function(){
    const thisApp = this;

    const cartElem = document.querySelector(select.containerOf.cart);
    thisApp.cart = new Cart(cartElem);

    thisApp.prductList = document.querySelector(select.containerOf.menu);
    thisApp.prductList.addEventListener('add-to-cart', function(event){
      app.cart.add(event.detail.product);
    });
  },
};
app.init();