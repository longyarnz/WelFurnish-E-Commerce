import React from 'react';

export default function Tile(props) {
  const { src, title, desc, reNumber } = props;
  let { price } = props; price = reNumber(price);
  return (
    <figure onClick={props.onClick}>
      <img className="" src={src} alt="" />
      <figcaption>
        {title} <br />
        <div>{desc}</div>
        <span>₦ {price}</span>
        <span className={props.status ? "show-tile" : "no-display"}>ADDED</span>  
      </figcaption>
    </figure>
  )
}
