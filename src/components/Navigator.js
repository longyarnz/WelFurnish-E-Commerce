import React, { Component } from 'react';

export default class Navigator extends Component {
  render() {
  	const { actions } = this.props;
    const shop = "no-display", mobi = "reload";
  	const className = `${actions.appView.nav} navigator`;
    return (
      <header className={className}>
      	<button className="navigator" onClick={()=>actions.shop(shop, mobi, true)}>CATEGORIES</button>
      	<button className="navigator" onClick={()=>actions.shop(shop, mobi, false)}>FILTER</button>
      </header>
    );
  }
}
