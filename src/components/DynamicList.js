import React, { Component } from 'react';
import SelectButton from './SelectButton';

export default class DynamicList extends Component {
	constructor(props){
		super(props);
		this.ul = [];
		this._getRef = this._getRef.bind(this);
		this.state = { select: [], display: []	}
	}

	componentWillReceiveProps(nextProps) {
	  this.inspect = nextProps.selectClass === "select-button";
	  if (!this.inspect) return;
	  const display = this.state.display;
    display.fill("");
    this.setState({ display });
	}

	componentWillMount() {
		this.inspect = this.props.selectClass === "select-button";
		const number = this.props.list.length;
		const display = !this.props.cat ? new Array(number).fill("") : this.props.cat;
		const select = !this.props.filter ? new Array(number).fill(" off") : this.props.filter;
		this.setState({ display, select });
	}

	_handleClick(i, item){
		if(item === "Go Back") return this.props.back();
		const display = this.state.display;
    display.fill("");
    display[i] = this.inspect ? "" : "clicked";
    this.setState({ display });
    !this.inspect && this.props.setCat({ display });
    if(this.inspect){
      const odd = this.state.select[i] === " off" ? " on" : " off";
      const select = this.state.select;
      select.fill(" off");
      select[i] = odd;
      this.setState({ select });
      if(odd === " on" && this.props.price) this.props.price(item);
      else if(odd === " off" && this.props.price) this.props.price(Infinity);
      if(odd === " on" && this.props.figure) this.props.figure(item);
      else if(odd === " off" && this.props.figure) this.props.figure('Show All');
      this.props.setFilter(select);
    }
    this.props.figure && this.props.figure(item);
  }

  _getRef(ref){
  	this.ul.indexOf(ref) < 0 && this.ul.push(ref);
  }

  _reArrangeMoney(number){
    number = number.toString().split("").reverse();
    for (let i = 0; i < number.length; i++) {
      if(i % 3 === 0 && i !== 0) number[i] += ", ";
    }
    number = number.reverse().reduce((sum, i)=>sum + i);
    return number;
  }

	render() {
		const { listClass, list, selectClass } = this.props;
    return (
    	<div className={listClass}>
	    	<ul className={listClass}>
	    		{
	    			list.map((item, i) => {
	    				const number = item;
	    				const select = this.state.select[i] ? this.state.select[i] : "";
	    				item = this.props.reArrange ? (" ₦ " + this._reArrangeMoney(item)) : item;
	    				return (
		    				<li className={`${this.state.display[i]} ${listClass}`} key={i} onClick={()=>this._handleClick(i, number)}>
		    					{item}
		    					<SelectButton selectClass={`${selectClass}${select}`} />
		    				</li>
		    			)
	    			})
	    		}
	    	</ul>
	    </div>
		);
  }
}
