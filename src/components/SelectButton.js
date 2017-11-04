import React, { Component } from 'react';

export default class SelectButton extends Component {
  render() {
  	return this.props.selectClass === "no-display" ? null : 
    (
      <div className={this.props.selectClass}>
      	<div className={this.props.selectClass === "select-button on" ? "inner-on" : "inner-off"}></div>
      </div>
    );
  }
}
