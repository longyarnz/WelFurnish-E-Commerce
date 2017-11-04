import React from 'react';

export default function Tile(props) {
  const { src, title, desc, figure, pat, display, reNumber } = props;
  const text = display + figure + pat;
  let { price } = props; price = reNumber(price);
  return (
    <figure className={text} onClick={props.onClick}>
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
