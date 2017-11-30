import React, { Component } from 'react';
import AppLogic from './AppLogic';
import FetchGraph from './components/FetchGraph';
import LandingPanel from './components/LandingPanel';

export default class App extends Component {
	constructor(props){
    super(props);
    this.actions = this.actions.bind(this);
    this._viewShop = this._viewShop.bind(this);
		this._collectScreenHeight = this._collectScreenHeight.bind(this);
		this.state = { display: false, screenHeight: 'auto', items: [] }
  }

	componentDidCatch(error, info) {
    console.log(error, info);
  }

  componentWillMount() {
  	const query = `
    	query AppQuery{
			  items{
			    keyID
			    realID
			    title
			    sub
			    category
			    price
			    description
			    src_file
			    purchased
			  }
			}
    `;
    FetchGraph(query, {}, null, ({ data }) => {
    	this.setState({ items: data.items });
    })
  }

  _collectScreenHeight(screenHeight){
    this.setState({ screenHeight });
  }

	_viewShop(display){
    this.setState({ display });
  }

  actions(){
    return {
     	getScreenHeight: this._collectScreenHeight,
     	viewShop: this._viewShop
    }
  }

	render() {
		const actions = this.actions();
		return this.state.display ? <AppLogic items={this.state.items} /> 
		: <LandingPanel actions={actions} />;
	}
}
