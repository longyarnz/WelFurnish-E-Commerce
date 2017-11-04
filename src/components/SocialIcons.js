import React, { Component } from 'react';

export default class SocialIcons extends Component {
  render() {
  	const { iconClass, iconList } = this.props;
    return (
      <div className={iconClass}>
      	{
      		iconList.map((icons, i)=>{
      			const type = "fa " + icons;
      			return (
      				<div key={i} className={icons + "-icon"}>
      					<i className={type} />
      				</div>
      			)
      		})
      	}
      </div>
    );
  }
}
