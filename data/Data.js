import faker from 'faker';
import _ from 'lodash';
import UUID from 'uuid';

const { phone, address, name, commerce, image, lorem, random, internet } = faker;
const Itemizer = () => ({
	title: commerce.product(),
  category: commerce.product(),
  price: parseInt(commerce.price(10000, 1000000), 0),
  src: image.imageUrl(600, 240, "technics", true),
  description: lorem.sentences(3),
  purchased: false
});

const Userify = () => ({
	_name: `${name.firstName()} ${name.lastName()}`,
  email: internet.email(),
  phone: phone.phoneNumber(),
  address: address.streetAddress(),
  city: address.city()
});

const Invoicefy = () => ({
	invoice_number: random.number({min: 100000, max: 199999}),
  cost: parseInt(commerce.price(100000, 90000000), 0),
  items: _.times(3, ()=>commerce.product()).toString()
});

export { Itemizer, Userify, Invoicefy }