import {settings,select, classNames} from './settings.js';
import Product from './components/Product.js';
import Cart from './components/Cart.js';
import Booking from './components/Booking.js';

const app = {
  initPages: function(){
    const thisApp = this;

    thisApp.pages = document.querySelector(select.containerOf.pages).children;
    thisApp.navLinks = document.querySelectorAll(select.nav.links);

    const idFromHash = window.location.hash.replace('#/', '');
   
    let pageMatchingHash = thisApp.pages[0].id;

    for(const page of thisApp.pages){
      if(page.id == idFromHash){
        pageMatchingHash = page.id;
        break;
      }
    }

    thisApp.activatePage(pageMatchingHash);

    for (const link of thisApp.navLinks){
      link.addEventListener('click', function(event){
        const clickedElement = this;
        event.preventDefault();

        /* get page id from href attribute */
        const id = clickedElement.getAttribute('href').replace('#', '');

        /* run thisApp.activatePage with that id */
        thisApp.activatePage(id);

        /* change URL hash */
        window.location.hash = '#/' + id;
      });
    }
  },

  activatePage: function(pageId){
    const thisApp = this;

    /* add class "active" to matching pages, remove from non-maching*/
    for(const page of thisApp.pages){
    //  if(page.id == pageId){
    //    page.classList.add(classNames.pages.active);
    //  } else {
    //    page.classList.remove(classNames.pages.active);

      page.classList.toggle(classNames.pages.active, page.id == pageId);
    }
    
    /* add class "active" to matching link, remove from non-maching*/
    for(const link of thisApp.navLinks){
      link.classList.toggle(
        classNames.nav.active, 
        link.getAttribute('href') == '#' + pageId
      );
    }
  },

  initBooking: function(){
    const thisApp = this;

    thisApp.widgetContainer = document.querySelector(select.containerOf.booking);
    thisApp.booking = new Booking(thisApp.widgetContainer);
  },

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

    thisApp.initPages();
    
    thisApp.initData();
    thisApp.initCart();
    thisApp.initBooking();
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