import _ from 'lodash';
import faker from 'faker';
import Swap from '../files/swap.png';

export default _.times(48, (i)=>({
	keyID: i,
  title: faker.commerce.product(),
  cat: faker.commerce.product(),
  price: parseInt(faker.commerce.price(10000, 1000000), 0),
  src: Swap, //faker.image.imageUrl(600, 240, "technics", true),
  desc: faker.lorem.sentences(3),  
  view: ""
}));
