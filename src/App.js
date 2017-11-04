import React, { Component } from 'react';
import environment from './createRelayEnvironment';
import { QueryRenderer, graphql } from 'react-relay';
import AppLogic from './AppLogic';

export default class App extends Component {
	componentDidCatch(error, info) {
    console.log(error, info);
  }

  relayRender({error, props}){
  	return props && <AppLogic items={props.items} />
  }

	render() {
		return (
			<QueryRenderer 
		    environment={environment}
		    render={this.relayRender}
		    query={
		      graphql`
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
		      `
		    }
		  />
		)
	}
}
