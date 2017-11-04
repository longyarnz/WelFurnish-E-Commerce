import React from 'react';

export default function Paginator(props) {
  return (
    <div className="paginator">
    	<span className="paginator" onClick={(e)=>props.onClick(false)}></span>
    	<span className="paginator" onClick={(e)=>props.onClick(true)}></span>
    	<span className="paginator">
    		<input className="paginator" type="text" onKeyPress={props.press} pattern="[0-9]*" placeholder="Go to page..." />
    		<i className="fa fa-arrow-right" onClick={props.arrow} />
    		<b>{props.currentPage}</b> of {props.totalPage}
    	</span>
    </div>
  );
}
