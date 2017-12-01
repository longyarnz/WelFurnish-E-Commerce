import React, { Component } from 'react';
import TileSection from './TileSection';
import BigItemView from './BigItemView';
import CustomOrder from './CustomOrder';

export default class CartPanel extends Component {
  constructor(props){
    super(props);
    this.actions = this.actions.bind(this);
    this.state = { 
      catClicked: false, patClicked: false, total: this.props.actions.total 
    }
  }

  actions(){
    const { actions } = this.props.actions;
    const item = actions.Data.find(({ keyID }) => keyID === actions.keyID);
    return {
      item,
      add: actions.add,
      arrow: actions.arrow,
      remove: actions.remove,
      cart: actions.cart,
      prevOrder: actions.prevOrder,
      visibility: actions.visibility,
      clickBack: actions.back,
      clickCustomBack: actions.customBack,
      keyID: actions.keyID,
      goToPage: actions.changePage,
      paginate: { changePage: actions.paginate, totalPage: actions.totalPage, currentPage: actions.counter + 1 },
      price: actions.price,
      figure: actions.figure,
      tilesList: actions.Data,
      display: actions.display,
      onClick: actions.clickTile,
      reNumber: actions.reNumber,
      loadMore: actions.loadMore,
      touch: actions.touch,
      noItem: actions.noItem,
      hasMore: actions.hasMore,
      store: actions.store
    }
  }

  render() {
    const actions = this.actions();
    const inline = { minHeight: this.props.actions.height }
    return (
      <aside className="cart-panel" style={inline}>
        {
          actions.visibility.big === 'jill' ? <BigItemView actions={actions} /> : null
        }
        {
          actions.visibility.custom === 'jill' ? <CustomOrder actions={actions} /> : null
        }
        {
          actions.visibility.tile === 'jill' ? <TileSection actions={actions} /> : null
        }
      </aside>
    );
  }
}
