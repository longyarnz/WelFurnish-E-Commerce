import React from 'react';
import Tile from './Tile';

export default function TilesContainer(props) {
  const { actions } = props;
  const { cart, page } = actions;
  const load = "tile-container";
  const oops = actions.noItem ? "no-items" : "no-display";
  return (
    <div className={load}>
    	{
    		actions.tilesList.map((tile, i) => {
          const max = page * 6 - 1;
          const min = max - 6;
          if(i <= min || i > max) return null;
          const status = cart.findIndex(({ keyID })=>tile.keyID === keyID) >= 0 ? true : false;
          return(
    				<Tile 
              status={status}
              item={tile}
              add={actions.add}
              onClick={()=>actions.onClick(tile.keyID)}
              key={i}
              src={tile.src_file}
              title={tile.title}
              desc={tile.description}
              price={tile.price}
              reNumber={actions.reNumber}
            />
    			)
    		})
    	}
      <div className={oops}>
        <i className="fa fa-frown-o" />
        <span>Oops...No items here, check other categories!</span>
      </div>
      <footer className={load}>
        &copy; 2017 | Designed By Longyarnz Inc. 08082935102
      </footer>
    </div>
  );
}