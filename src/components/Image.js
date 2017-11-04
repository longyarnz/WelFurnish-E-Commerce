import React, { Component } from 'react';

export default class Image extends Component {
	constructor(props){
		super(props);
		this.state = {
			select: [],
			fadeIndex: 0
		}
	}

	componentWillMount() {
		if(this.props.selectClass !== "no-display"){
		  const number = this.props.sources.length;
		  const select = new Array(number);
		  select.fill("fade-out");
		  select[0] = "fade-in";
		  this.setState({ select });
		}
	}

	_handleClick(i, o){
		if(this.state.select.length > 1){
			i = i < 0 ? this.state.select.length - 1 : i;
			i = i >= this.state.select.length ? 0 : i;
			const odd = this.state.select[i] === "fade-out" ? "fade-in" : "fade-out";
			const even = this.state.select[o] === "fade-out" ? "fade-in" : "fade-out";
			const select = this.state.select;
			const fadeIndex = i;
			select.fill("fade-out");
			select[i] = odd; select[o] = even;
			this.setState({ select, fadeIndex });
		}
	}

  render() {
  	return(
  		<div className={this.props.imgClass}>
  			{
			   	this.props.sources.map((img, i)=>{
			   		return (
			   			<img key={i} src={img.src} alt="" />
			   		)
			   	})
			  }
			  <nav className={this.props.imgClass}>
			  	<i className="fa fa-chevron-up" onClick={e=>{let i = this.state.fadeIndex++, o = i--; this._handleClick(i, o)}} />
			  	<i className="fa fa-chevron-down" onClick={e=>{let i = this.state.fadeIndex--, o = i++; this._handleClick(i, o)}} />
			  </nav>
		  </div>
	  )
   }
}
