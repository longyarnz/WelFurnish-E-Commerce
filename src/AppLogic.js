import React, { Component } from 'react';
import Navigator from './components/Navigator';
import MobilePanel from './components/MobilePanel';
import ShopArea from './components/ShopArea';
import CheckoutPanel from './components/CheckoutPanel';
import CheckoutForm from './components/CheckoutForm';
import PrintPage from './components/PrintPage';

export default class AppLogic extends Component {
  constructor(props){
    super(props);
    this.actions = this.actions.bind(this);
    this._getRef = this._getRef.bind(this);
    this._onTouch = this._onTouch.bind(this);
    this._setPage = this._setPage.bind(this);
    this._paginate = this._paginate.bind(this);
    this._viewCart = this._viewCart.bind(this);
    this._viewForm = this._viewForm.bind(this);
    this._viewShop = this._viewShop.bind(this);
    this._setPrice = this._setPrice.bind(this);  
    this._viewPrint = this._viewPrint.bind(this);  
    this._addToCart = this._addToCart.bind(this);
    this._setFigure = this._setFigure.bind(this);
    this._setStatus = this._setStatus.bind(this);
    this._clickBack = this._clickBack.bind(this);
    this._clickTile = this._clickTile.bind(this);
    this._clickArrow = this._clickArrow.bind(this);
    this._changePage = this._changePage.bind(this);
    this._clickCustom = this._clickCustom.bind(this);
    this._controlShop = this._controlShop.bind(this);
    this._collectHeight = this._collectHeight.bind(this);
    this._setClientInfo = this._setClientInfo.bind(this);
    this._removeFromCart = this._removeFromCart.bind(this);
    this._collectScreenHeight = this._collectScreenHeight.bind(this);
    this.mobile = window.innerWidth <= 767;
    this.laptop = window.innerWidth > 1024;
    this.tablet = window.innerWidth > 767 && window.innerWidth <= 1024;
    const nav = "no-display";
    const totalPage = Math.ceil(this.props.items.length / 6);
    this.state = { 
      counter: 0, totalPage, cartItems: [], height: 0, keyID: 1, prevOrder: [], display: [], knob: "", loadMore: false, noItem: false,
      dataList: [], figure: "Show All", price: Infinity , customDisplay: false, newTotal: 0, catClicked: false,  hasMore: true,
      tile: "jill", restore: { bigView: "jack", custom: "jack", tile: "jill" }, bigView: "jack", custom: "jack", screenHeight: 0, cost: 0,
      appView: {shop: "", nav, form: nav, panel: nav, print: nav, mobi: nav}, info:  { customer: { _name: "", 
      email: "", phone: "", address: "", city: ""}, invoice: {invoice_number: 0, items: "", cost: 0, userKeyID: "0000" }}, 
    }
  }

  _addToCart(item, qty, cost){
    const { cartItems, prevOrder } = this.state;
    cartItems.push(item);
    prevOrder.push({ qty });
    this.setState({cartItems, prevOrder });
  }

  componentWillMount() {
    this._reArrangeData(this.state.figure, this.state.price);
  }

  componentDidMount() {
    window.addEventListener('resize', e => {
      this.mobile = window.innerWidth <= 767;
      this.laptop = window.innerWidth > 1024;
      this.tablet = window.innerWidth > 767 && window.innerWidth <= 1024;
      this._structure(this.state.counter, this.state.totalPage);      
    }, true);
  }

  _clickTile(keyID){
    this.setState({ bigView: "jill", custom: "jack", tile: "jack", keyID,
      appView: {shop: "", nav: "no-display", form: "no-display", panel: "no-display", print: "no-display", mobi: "no-display"} 
    });
  }

  _controlShop(shop, mobi, knob){
    this.setState({ appView: { shop, mobi, nav: "reload", form: "no-display", panel: "no-display", print: "no-display" }, knob });
  }

  _collectHeight(height){
    this.setState({ height });
  }

  _collectScreenHeight(screenHeight){
    this.setState({ screenHeight });
  }

  _clickCustom(){
    const { bigView, custom, tile } = this.state;
    this.setState({ bigView: "jack", custom: "jill", tile: "jack", restore: { bigView, custom, tile }, customDisplay: true, catClicked: false,
      appView: {shop: "", nav: "no-display", form: "no-display", panel: "no-display", print: "no-display", mobi: "no-display"}  
    });
  }

  _clickBack(){
    this.setState({ bigView: "jack", custom: "jack", tile: "jill", 
      appView: {shop: "", nav: "reload", form: "no-display", panel: "no-display", print: "no-display", mobi: "no-display"}
    });
  }

  _clickArrow(e){
    const target = document.querySelector("input.paginator");
    this._changePage({target, which: 13});
  }

  _changePage(e){
    // eslint-disable-next-line
    let { value, placeholder } = e.target, { which } = e;
    if(isNaN(parseInt(value, 0))) {
      e.target.value = ""; value = "";
      e.target.placeholder = "Type a number";
      this._structure(this.state.counter, this.state.totalPage);
    }
    else{
      value = Math.floor(parseInt(value, 0)) - 1;
      value = value < 0 ? this.state.counter : value;
      if(which === 13 & value < this.state.totalPage) {
        e.target.value = "";
        e.target.placeholder = "Go to page...";
        this._structure(value, this.state.totalPage);
      }
      else if(which === 13 & value >= this.state.totalPage){
        e.target.value = ""; value = "";
        e.target.placeholder = "Out of range";
        this._structure(this.state.counter, this.state.totalPage);
      }
    }
  }

  _getRef(ref){
    this.app = ref;
  }

  _onTouch(e){
    if(window.innerWidth <= 1024 && document.body.scrollTop + window.innerHeight >= document.body.scrollHeight - 100) {
      let { counter, totalPage } = this.state;
      this._structure(counter + 1, totalPage);
    }
  }

  _paginate(check){
    const { counter, totalPage } = this.state;
    check = check ? (counter + 1) : (counter - 1);
    check = check < 0 ? 0 : check; 
    check = check > totalPage ? totalPage : check;
    this._structure(check, totalPage);
  }

  _reArrangeData(figure, price){
    let counter = 0,
    totalPage = 0, Data = [];
    if(figure === "Show All"){
      this.props.items.forEach(item=>{
        if(item.price < price) Data.push(item);
      });
    }
    else{
      this.props.items.forEach(item => {
        if(item.price < price & item.sub === figure || figure === 'Show All' & item.price < price){
          Data.push(item);
        }
      });
    }
    counter = Data.length;
    totalPage = this.laptop ? Math.ceil(counter / 6) : Math.ceil(counter / 4);
    totalPage = totalPage === 0 ? 1 : totalPage;
    const noItem = counter === 0 ? true : false;
    this.setState({ figure, price, catClicked: true, counter: 0, totalPage, dataList: Data, customDisplay: false, newTotal: counter, noItem });
    this._structure(0, totalPage);
  }

  _reArrangeMoney(number){
    number = number.toString().split("").reverse();
    for (let i = 0; i < number.length; i++)
      if(i % 3 === 0 && i !== 0) number[i] += ", ";
    number = number.reverse().reduce((sum, i)=>sum + i);
    return number;
  }

  _removeFromCart(item){
    if(item === 'all') return this.setState({ cartItems: [], prevOrder: [], appView: { 
      shop: "", mobi: "no-display", form: "no-display", panel: "no-display", print: "no-display", nav: "reload" },
      bigView: "jack", custom: "jack", tile: "jill", info:  { customer: { _name: "", email: "", phone: "", 
      address: "", city: ""}, invoice: {invoice_number: 0, items: "", cost: 0, userKeyID: "0000" }}
    });
    const { cartItems, prevOrder } = this.state;
    const findItem = cartItems.indexOf(item);
    cartItems.splice(findItem, 1);
    prevOrder.splice(findItem, 1);
    this.setState({ cartItems, prevOrder });
  }

  _structure(counter, totalPage, figure){
    if(counter < totalPage){ 
      const display = new Array(this.props.items.length).fill(" no-display ");
      if(this.laptop){
        for (let i = 0; i < 6; i++){
          const count =  counter * 6 + i;
          display[count] = "aload ";
        }
      }
      else display.fill("aload ");
      this.setState({ display, counter, totalPage });
    }
  }

  _setClientInfo(info){
    this.setState({ info });
  }

  _setFigure(figure){
    this._reArrangeData(figure, this.state.price);
  }

  _setPrice(price){
    this._reArrangeData(this.state.figure, price);
  }

  _setStatus(status){
    this.setState({ status });
  }

  _setPage(totalPage){
    this.setState({ totalPage });
  }

  _viewCart(){
    this.setState({ appView: {shop: "no-display", mobi: "no-display", form: "no-display", panel: "reload", print: "no-display", nav: "no-display"} });
  }

  _viewShop(){
    this.setState({ appView: {shop: "", mobi: "no-display", form: "no-display", panel: "no-display", print: "no-display", nav: "reload"} });
  }

  _viewForm(cost){
    this.setState({ appView: {shop: "no-display", mobi: "no-display", form: "reload", panel: "no-display", print: "no-display", nav: "no-display"}, cost });
  }

  _viewPrint(){
    this.setState({ appView: {shop: "no-display", mobi: "no-display", form: "no-display", panel: "no-display", print: "reload", nav: "no-display"} });
  }

  actions(){
    return {
      add: this._addToCart,
      cost: this.state.cost,
      arrow: this._clickArrow,
      custom: this._clickCustom,
      remove: this._removeFromCart,
      setStatus: this._setStatus,
      getHeight: this._collectHeight,
      getScreenHeight: this._collectScreenHeight,
      counter: this.state.counter, 
      info: this.state.info,
      noItem: this.state.noItem,
      hasMore: this.state.hasMore,
      shop: this._controlShop,
      totalPage: this.state.totalPage,
      cart: this.state.cartItems,
      height: this.state.height,
      clickTile: this._clickTile,
      changePage: this._changePage,
      keyID: this.state.keyID,
      prevOrder: this.state.prevOrder,
      Data: this.state.dataList,
      customDisplay: this.state.customDisplay,
      figure: this.state.figure,
      price: this.state.price,
      knob: this.state.knob,
      loadMore: this.state.loadMore,
      setFigure: this._setFigure,
      setPrice: this._setPrice,
      setPage: this._setPage,
      setInfo: this._setClientInfo,
      total: this.state.newTotal,
      cat: this.state.catClicked,
      display: this.state.display,
      paginate: this._paginate,
      back: this._clickBack,
      touch: this._onTouch,
      rawData: this.props.items,
      viewCart: this._viewCart,
      viewForm: this._viewForm,
      viewShop: this._viewShop,
      viewPrint: this._viewPrint,
      appView: this.state.appView,
      reNumber: this._reArrangeMoney,
      store: this.props,
      visibility: { big: this.state.bigView, custom: this.state.custom, tile: this.state.tile }
    }
  }

  render() {
    const actions = this.actions();
    return (
      <div className="app" ref={this._getRef}>  
      	{
          actions.appView.nav === 'no-display' ? null : <Navigator actions={actions} />
        }
        {
          actions.appView.mobi === 'no-display' ? null : <MobilePanel actions={actions} />
        }
        {
          actions.appView.shop === 'no-display' ? null : <ShopArea actions={actions} />
        }
        {
          actions.appView.panel === 'no-display' ? null : <CheckoutPanel actions={actions} />
        }
        {
          actions.appView.form === 'no-display' ? null : <CheckoutForm actions={actions} />
        }
        {
          actions.appView.print === 'no-display' ? null : <PrintPage actions={actions} />
        }
      </div>
    );
  }
}
