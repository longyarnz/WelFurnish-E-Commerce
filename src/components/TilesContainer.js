import React from 'react';
import Tile from './Tile';

export default function TilesContainer(props) {
  const { actions } = props;
  const { cart } = actions;
  const load = "tile-container";
  const oops = actions.noItem ? "no-items" : "no-display";
  return (
    <div className={load}>
    	{
    		actions.tilesList.map((tile, i) => {
          const status = cart.findIndex(({ keyID })=>tile.keyID === keyID) >= 0 ? true : false;
          const figure = actions.figure === "Show All"  || tile.sub === actions.figure ? "" : " cat";
          const price = tile.price <= actions.price ? "" : " pat"; 
          if(price === " pat" || figure === " cat") return null;
          else return(
    				<Tile 
              status={status}
              item={tile}
              add={actions.add}
              onClick={()=>actions.onClick(tile.keyID)}
              pat={price}
              figure={figure}
              display={actions.display[i]}
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