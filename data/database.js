import SQL from 'sequelize';
// import _ from 'lodash';
// import Faker from 'faker';
// import { Itemizer, Userify, Invoicefy } from './Data';

// const Db = new SQL('beyondi1_welfurnish', 'beyondi1_bigboss', 'BeyondIfe@OAU', {dialect: 'mysql', host: 'www.beyondife.org'});
const Db = new SQL('welfurnish', 'lekan', 'longyarn', {dialect: 'mysql', host: '127.0.0.1'});
Db.authenticate().then(() => 
  {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  }
);

const Item = Db.define('item', {
  type: {
    type: new SQL.VIRTUAL(SQL.STRING),
    get() {
      return 'ItemType';
    }
  },
  keyID: {
    type: SQL.INTEGER,
    allowNull: true,
    autoIncrement: true,
    primaryKey: true
  },
	realID: {
    type: SQL.UUID,
    defaultValue: SQL.UUIDV4,
    allowNull: true
  },
	title: {
  	type: SQL.STRING,
    allowNull: false  
  },
  category: {
    type: SQL.STRING,
    allowNull: false
  },
  price: {
    type: SQL.INTEGER,
    allowNull: false
  },
  description: {
    type: SQL.STRING,
    allowNull: false
  },
  sub: {
    type: SQL.STRING,
    allowNull: false
  },
  src_file: {
    type: SQL.STRING,
    allowNull: false
  },
  purchased: {
    type: SQL.BOOLEAN,
    allowNull: false
  }
});

const User = Db.define('user', {
  type: {
    type: new SQL.VIRTUAL(SQL.STRING),
    get() {
      return 'UserType';
    }
  },
  keyID: {
    type: SQL.UUID,
    defaultValue: SQL.UUIDV4,
    primaryKey: true,
    allowNull: false
  },
  _name: {
    type: SQL.TEXT,
    allowNull: false
  },
  email: {
    type: SQL.STRING,
    allowNull: false
  },
  phone: {
    type: SQL.STRING,
    allowNull: false
  },
  address: {
    type: SQL.TEXT,
    allowNull: false
  },
  city: {
    type: SQL.TEXT,
    allowNull: false
  }
});

const Client = Db.define('client', {
  type: {
    type: new SQL.VIRTUAL(SQL.STRING),
    get() {
      return 'ClientType';
    }
  },
  keyID: {
    type: SQL.UUID,
    defaultValue: SQL.UUIDV4,
    primaryKey: true,
    allowNull: false
  },
  _name: {
    type: SQL.TEXT,
    allowNull: false
  },
  email: {
    type: SQL.STRING,
    allowNull: false
  },
  phone: {
    type: SQL.BIGINT,
    allowNull: false
  },
  address: {
    type: SQL.TEXT,
    allowNull: true
  },
  city: {
    type: SQL.TEXT,
    allowNull: false
  },
  work_order: {
    type: SQL.TEXT,
    allowNull: false
  },
  picture_file: {
    type: SQL.TEXT,
    allowNull: true
  }
});

const Invoice = Db.define('invoice',{
  invoice_number: {
    type: SQL.INTEGER,
    primaryKey: true,
    allowNull: false
  },
  cost: {
    type: SQL.INTEGER,
    allowNull: false
  },
  items: {
    type: SQL.TEXT,
    allowNull: false
  }
});

Invoice.belongsTo(User);
User.hasOne(Invoice);
Db.sync();

// Db.sync({force: true}).then(()=>{
// 	return _.times(50, () =>
// 		User.create(Userify()).
//     then(user => user.createInvoice(Invoicefy()).
//     then(() => Item.create(Itemizer())))
// 	)
// }).then(()=>console.log("Entries Completed"));

export { Db, Item, Invoice, User, Client };