import React, { Component } from 'react';
import DynamicList from './DynamicList';
import CartButton from './CartButton';

export default class SidePanel extends Component {
  constructor(props){
    super(props);
    this._getCategory = this._getCategory.bind(this);
    this._getSubs = this._getSubs.bind(this);
    this._interceptItem = this._interceptItem.bind(this);
    this.state = { figure: ()=>{}, options: [], title: "CATEGORIES", listClass: "shop-items", item: "" }
  }

  componentWillReceiveProps() {
    if (this.state.options.length === 0) this._getCategory();
  }

  componentWillMount() {
    this._getCategory(this.props.actions.actions.ctgy);
  }

  componentWillUnmount() {
    this.props.actions.actions.setCat([this.state.title, this.state.item]);
  }

  _getSubs(category, item){
    let options = [];
    item = item ? item : "";
    const { actions } = this.props.actions;
    if(category === "Show All" || category === "CATEGORIES") return this._interceptItem(category);
    actions.rawData.forEach(item => {
      if(item.category === category && options.indexOf(item.sub) < 0) options.push(item.sub);
      else if(category === "Go Back" && options.indexOf(item.sub) < 0) return this._getCategory();
    });
    options.push("Go Back");
    this.setState({ options, figure: this._interceptItem, title: category, item, listClass: "shop-items reload" });
  }

  _getCategory(ctgy){
    const { actions } = this.props.actions;
    if (ctgy) return this._getSubs(ctgy[0], ctgy[1]);
    if (actions.rawData.length === 0) return;
    let options = [];
    actions.rawData.forEach(({ category })=>{
      options.indexOf(category) < 0 && options.push(category);
    });
    options.push("Show All");
    this.setState({ options, figure: this._getSubs, listClass: "shop-items" });
  }

  _interceptItem(item){
    item = item === "CATEGORIES" ? "Show All" : item;
    item === "Show All" ? this.setState({title: "CATEGORY", item: ""}) : this.setState({ item: "/ "+item });
    this.props.actions.actions.setFigure(item);
  }

  render() {
    const { actions } = this.props.actions;
    const filters = [50000, 200000, 500000, 1000000];
    const inline = {height: (window.innerWidth > 1024 ? (window.screen.availHeight - 115) : "auto")}   
    return (
      <aside className="side-panel" style={inline}>
        <h3 className="side-panel">{`${this.state.title} ${this.state.item}`}</h3>
      	<DynamicList list={this.state.options} back={this._getCategory} figure={this.state.figure} 
          setCat={actions.setCat} cat={actions.ctgy} listClass={this.state.listClass}
        />
        <button className="side-panel" onClick={actions.custom}>MAKE A CUSTOM ORDER</button>
        <h3 className="side-panel">FILTER</h3>
        <DynamicList list={filters} selectClass="select-button" reArrange={true} filter={actions.filter}
          price={actions.setPrice} setFilter={actions.setFilter} listClass="filter-items"
        />
        <CartButton number={actions.cart.length} onClick={actions.viewCart} />
      </aside>
    );
  }
}
