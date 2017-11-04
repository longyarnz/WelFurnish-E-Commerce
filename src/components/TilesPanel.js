import React, { Component } from 'react';
import TilesContainer from './TilesContainer';

export default class TilesPanel extends Component {
  render() {
  	return (
    	<section className="tile-panel">
    		<div className="block">
    			<TilesContainer tilesList={this.props.tilesList} />
    		</div>
    	</section>
    );
  }
}
