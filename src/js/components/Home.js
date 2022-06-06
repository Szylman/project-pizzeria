import {  templates } from '../settings.js';
class Home{
  constructor(element){
    const thisHome = this;
    thisHome.render(element);
    thisHome.initWidghet();
  }

  render(element){
    const thisHome = this;
    const generatedHTML = templates.homeWidget();
    thisHome.dom = {};
    thisHome.dom.wrapper = element;
    thisHome.dom.wrapper.innerHTML = generatedHTML;
  }

  initWidghet(){
    const elem = document.querySelector('.main-carousel');

    //eslint-disable-next-line no-undef
    new Flickity (elem, {
      //options
      cellAlign: 'left',
      contain: true,
      autoPlay: true,
      prevNextButtons: false,
      wrapAround: true,
      imagesLoaded: true,
    });
  }

}
export default Home;