import React, { Component } from 'react';
import TileSection from './TileSection';
import BigItemView from './BigItemView';
import CustomOrder from './CustomOrder';
import Data from './FakerData';

export default class CartPanel extends Component {
  constructor(props){
    super(props);
    this.actions = this.actions.bind(this);
    this._addStats = this._addStats.bind(this);
    this._removeStats = this._removeStats.bind(this);
    this._clickBack = this._clickBack.bind(this);
    this._paginate = this._paginate.bind(this);
    this.state = { status: [], cartItems: this.props.actions().cartItems, display: [], counter: 0, keyID: 0, bigView: "jack", custom: "jack", tile: "jill", restore: { bigView: "jack", custom: "jack", tile: "jill" }, totalPage: 0, dataList: Data, catClicked: false, patClicked: false, updated: false }
  }

  _structure(counter, dataLength, figure){
    //  when new props and data are coming in, rearrange the paginator
    counter = !counter || counter <= 0 ? 0 : counter; 
    const length = arguments[1] ? dataLength : Data.length;
    const totalPage = Math.ceil(length / 6);
    if(counter < totalPage){      
      const display = new Array(Data.length).fill("no-display");
      for (let i = 0; i < 6; i++) {
        display[counter * 6 + i] = "";
      }
      this.setState({ display, counter, totalPage });
    }
    else{
      counter = length / 6 - 1;
    }
    return length;
  }

  componentWillMount(counter) {
    const length = this._structure(counter);
    const status = new Array(length).fill("no-display");
    this.setState({ status });
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.actions().customDisplay) {
      //  when custom is true and figure is empty (no category is clicked)
      const { bigView, custom, tile } = this.state;
      this.setState({ bigView: "jack", custom: "jill", tile: "jack", restore: { bigView, custom, tile }, catClicked: false, updated: true });
    }
    else if(!nextProps.actions().customDisplay){
      //  when custom is false and a category has been clicked
      const totalPage = this._reArrangeData(nextProps.actions().figure, nextProps.actions().price);
      this._structure(0, totalPage);
      const { bigView, custom, tile } = this.state;
      this.setState({ bigView: "jack", custom: "jack", tile: "jill", restore: { bigView, custom, tile } });
      if(nextProps.actions().update) this.setState({ updated: true });
    }
    else {
      const { bigView, custom, tile } = this.state.restore || this.state;
      this.setState({ bigView, custom, tile });
    }
  }

  _paginate(check){
    //  paginate small item view
    let { counter } = this.state;
    check = check ? (counter + 1) : (counter - 1);
    if (this.state.catClicked) {
      const totalPage = this.state.totalPage;
      check = check < 0 ? 0 : check; 
      this._structure(check, totalPage * 6);
    }
    else{
      this._structure(check);
    }
  }

  _reArrangeData(figure, price){
    // Rearrange data to match the clicked category and pricing
    let newData = [], newStatus = [], oldData = [], oldStatus = []; let counter = 0;
    this.state.dataList.forEach((item, i)=>{
      if(item.price < price & item.title === figure || figure === 'Show All' & item.price < price){
        counter += 1; 
        oldData.push(item);
        oldStatus.push(this.state.status[i]);
      }
      else {
        newData.push(item);
        newStatus.push(this.state.status[i]);
      }
    });
    newData = oldData.concat(newData);
    newStatus = oldStatus.concat(newStatus);
    counter = Math.ceil(counter / 6);
    counter = counter === 0 ? 1 : counter;
    this.setState({ counter: 0, totalPage: counter, dataList: newData, status: newStatus, catClicked: true });
    return counter * 6;
  }

  _clickBack(){
    //  go back to small item view
    this.setState({ bigView: "jack", custom: "jack", tile: "jill", updated: true });
  }

  _clickTile(i){
    //  view items in big item view
    this.setState({ keyID: i, bigView: "jill", custom: "jack", tile: "jack", updated: true });
  }

  // shouldComponentUpdate(nextProps, nextState) {
  //   return nextState.updated;
  // }

  // componentDidUpdate(prevProps, prevState) {
  //   this.setState({ updated: false });
  // }

  _addStats(){
    this.setState(e=>{
      e.status[e.keyID] = "";
      console.log(e.status);
      return { status: e.status }
    })
  }

  _removeStats(){
    this.setState(e=>{
      e.status[e.keyID] = "no-display";
      console.log("meat");
      return { status: e.status }
    });
  }

  actions(){
    return {
      height: this.props.actions().height,
      add: this.props.actions().add,
      remove: this.props.actions().remove,
      visibility: {big: this.state.bigView, custom: this.state.custom, tile: this.state.tile},
      item: this.state.dataList[this.state.keyID],
      clickBack: this._clickBack,
      clickCustomBack: this.props.actions().customBack,
      keyID: this.state.keyID,
      status: this.state.status,
      paginate: { changePage: this._paginate, totalPage: this.state.totalPage, currentPage: this.state.counter + 1 },
      price: this.props.actions().price,
      figure: this.props.actions().figure,
      tilesList: this.state.dataList,
      display: this.state.display,
      update: this.state.updated,
      addStatus: this._addStats,
      removeStatus: this._removeStats,
      onClick: e=>this._clickTile(e)
    }
  }

  render() {
    const inline = { minHeight: this.props.actions().height }
    const Paginate = { changePage: this._paginate, totalPage: this.state.totalPage, currentPage: this.state.counter + 1 };
    return (
      <aside className="cart-panel" style={inline}>
        <BigItemView actions={this.actions} add={this._addToCart} remove={this._removeFromCart} visibility={this.state.bigView} item={this.state.dataList[this.state.keyID]} clickBack={this._clickBack} />
        <CustomOrder actions={this.actions} add={this._addToCart} visibility={this.state.custom} clickBack={this._clickBack} clickCustomBack={this.props.actions().customBack} />
        <TileSection actions={this.actions} add={this._addToCart} visibility={this.state.tile} keyID={this.state.keyID} status={this.state.status} paginate={Paginate} price={this.props.actions().price} figure={this.props.actions().figure} tilesList={this.state.dataList} display={this.state.display} onClick={e=>this._clickTile(e)} />
      </aside>
    );
  }
}
