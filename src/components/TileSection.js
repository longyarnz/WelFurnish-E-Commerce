import React, { Component } from 'react';
import TilesContainer from './TilesContainer';
import Paginator from './Paginator';

export default class TilesSection extends Component {
	render() {
		let { actions } = this.props;
		const { currentPage, totalPage, changePage } = this.props.actions.paginate;
		actions = {
			cart: actions.cart,
			keyID: actions.keyID,
			status: actions.status,
			add: actions.add,
			price: actions.price,
			figure: actions.figure,
			tilesList: actions.tilesList,
			display: actions.display,
			onClick: actions.onClick,
			reNumber: actions.reNumber,
			loadMore: actions.loadMore, 
			touch: actions.touch,
			noItem: actions.noItem,
			hasMore: actions.hasMore
		}
		return (
      <section className={`cart-section ${this.props.actions.visibility.tile}`}>
      	<Paginator currentPage={currentPage} totalPage={totalPage} onClick={changePage} press={this.props.actions.goToPage} arrow={this.props.actions.arrow} />
	    	<TilesContainer actions={actions} />
	    </section>
		);
  }
}
