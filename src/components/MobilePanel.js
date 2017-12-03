import React, { Component } from 'react';
import DynamicList from './DynamicList';

export default class MobilePanel extends Component {
  constructor(props){
    super(props);
    this._getCategory = this._getCategory.bind(this);
    this._getSubs = this._getSubs.bind(this);
    this._interceptItem = this._interceptItem.bind(this);
    this.state = { figure: ()=>{}, options: [], title: "CATEGORIES", listClass: "shop-items", item: "" }
  }

  componentWillMount() {
    this._getCategory();
    this.setState({figure: this._getSubs});
  }

  _getSubs(category, item){
    let options = [];
    item = item ? item : "";
    const { actions } = this.props;
    if(category === "Show All" || category === "CATEGORIES") return this._interceptItem(category);
    actions.rawData.forEach(item => {
      if(item.category === category && options.indexOf(item.sub) < 0) options.push(item.sub);
      else if(category === "Go Back" && options.indexOf(item.sub) < 0) return this._getCategory();
    });
    options.push("Go Back");
    this.setState({ options, figure: this._interceptItem, title: category, item, listClass: "shop-items reload" });
  }

  _getCategory(ctgy){
    const { actions } = this.props;
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
    const { actions } = this.props;
  	let options = [];
    actions.rawData.forEach(({ category })=>{
      if(options.indexOf(category) < 0) options.push(category)
    });
    options.push("Show All");
    const filters = [50000, 200000, 500000, 1000000];
    const className = `mobile-panel`;
    const inline = { minHeight: actions.height }
    const shop = actions.knob ? "shop-items" : "shop-items no-display";
    const filter = actions.knob ? "filter-items no-display" : "filter-items";
    return (
      <section className={className} style={inline}>
        <DynamicList list={this.state.options} back={this._getCategory} figure={this.state.figure} listClass={shop} />
        <DynamicList list={filters} selectClass="select-button" filter={actions.filter} setFilter={actions.setFilter} reArrange={true} price={actions.setPrice} listClass={filter} />
        <button className="mobile-panel" onClick={actions.custom}>MAKE A CUSTOM ORDER</button>
        <button className="mobile-panel" onClick={()=>actions.shop("", "no-display", true)}>BACK TO SHOP</button>
      </section>
    );
  }
}