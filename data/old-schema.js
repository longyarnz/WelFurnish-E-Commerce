import { Db, Item, Invoice, User, Client } from './database';
import Merge from '../src/components/Merge';
import Faker from 'faker';

import { 
	GraphQLInputObjectType,
	GraphQLObjectType, 
	GraphQLInt,
  GraphQLFloat, 
	GraphQLString, 
	GraphQLList, 
	GraphQLSchema,
	GraphQLNonNull,
  GraphQLBoolean 
} from 'graphql';

import {
	connectionFromPromisedArray,
  connectionArgs,
  connectionDefinitions,
  connectionFromArray,
  fromGlobalId,
  globalIdField,
  mutationWithClientMutationId,
  nodeDefinitions,
  cursorForObjectInConnection
} from 'graphql-relay';

import {
  getModelsByClass,
  resolveArrayData,
  getArrayData,
  resolveArrayByClass,
  resolveModelsByClass
} from 'sequelize-relay';

const { nodeInterface, nodeField } = nodeDefinitions(
	(globalId) => {
		const { type, id } = fromGlobalId(globalId);
    if (type === 'Item') {
      return Item.findByPrimary(id);
    }
		else if (type === 'User'){
      return User.findByPrimary(id);
    }
    else if (type === 'Invoice'){
      return Invoice.findByPrimary(id);
    }
    else return null;
	}, 
	(obj) => {
    console.log(obj)
    switch(obj.type){
      case 'ItemType': return ItemType;
      case 'UserType': return UserType;
      case 'ClientType': return ClientType;
      default: return null;
    }
  }
);

const userObject = (bool) => {
  const string = typeof bool === "number" ? (new GraphQLNonNull(GraphQLString)) : GraphQLString;
  const int = typeof bool === "number" ? (new GraphQLNonNull(GraphQLInt)) : GraphQLString;
  return {
    _name: {
      type: string,
      description: "Name of Customer" 
    },
    email: {
      type: string,
      description: "Email of Customer"
    },
    phone: {
      type: string,
      description: "Phone number of Customer"
    },
    address: {
      type: string,
      description: "Address of customer"
    },
    city: {
      type: string,
      description: "City of delivery"
    },
    picture_file: {
      type: string,
      description: 'Picture Sample of Work Order'
    },
    work_order: {
      type: string,
      description: 'Description of Work Order'
    }
  }
};

const itemObject = (bool) => {
  const string = typeof bool === "number" ? (new GraphQLNonNull(GraphQLString)) : GraphQLString;
  const int = typeof bool === "number" ? (new GraphQLNonNull(GraphQLInt)) : GraphQLInt;
  bool = typeof bool === "number" ? (new GraphQLNonNull(GraphQLBoolean)) : GraphQLBoolean;
  return {
    realID: {
      type: GraphQLString,
      description: "RealID Field"
    },
    keyID: {
      type: GraphQLInt,
      description: "KeyID Field"
    },
    title: {
      type: string,
      description: "Name of Item" 
    },
    category: {
      type: string,
      description: "Category of Item"
    },
    price: {
      type: int,
      description: "Price of Item"
    },
    description: {
      type: string,
      description: "Information on Item"
    },
    src_file: {
      type: string,
      description: "Path to image"
    },
    sub: {
      type: string,
      description: "Path to image"
    },
    purchased: {
      type: bool,
      description: "State of Purchase"
    }
  }
};

const ClientOutputType = new GraphQLObjectType({
  name: 'ClientOutput',
  description: 'This is the Client Information Object',
  fields: ()=>userObject(false)
});

const ClientInputType = new GraphQLInputObjectType({
  name: 'ClientInput',
  description: 'This is the Client Information Object',
  fields: ()=>userObject(true)
});

const ItemType = new GraphQLObjectType({
	name: 'ItemOutput',
	description: 'This is a graphql table for Welfurnish works',
	fields: ()=>itemObject(false)
});

const ItemInputType = new GraphQLInputObjectType({
  name: 'ItemInput',
  description: 'This is an input type for Items',
  fields: ()=>itemObject(true)
});

const UpdateItemType = new GraphQLInputObjectType({
  name: 'UpdateItemInput',
  description: 'This is a graphql table for Welfurnish works',
  fields: ()=>itemObject(true)
});

const UserType = new GraphQLObjectType({
  name: 'User',
  description: 'This is a graphql table for Welfurnish customers',
  fields: ()=>Merge( 
    {
      id: globalIdField('User', obj=>obj.keyID),
      keyID: {
        type: GraphQLString,
        description: "KeyID Field"
      }
    },
    userObject(false),
    {
      invoices: {
        type: InvoiceType,
        resolve: (user)=> user.getInvoice()
      }
    }
  ),
  interfaces: [nodeInterface]
});

const InvoiceType = new GraphQLObjectType({
  name: 'InvoiceOutput',
  description: 'This is a graphql table for Welfurnish customers',
  fields: {
    invoice_number: {
      type: GraphQLInt,
      description: "Invoice Number",
    },
    cost: {
      type: GraphQLInt,
      description: "Cost of Items Purchased",
    },
    items: {
      type: GraphQLString,
      description: "Purchased Items",
    },
    userKeyID: {
      type: GraphQLString,
      description: "User ID",
    },
    user: {
      type: UserType,
      resolve: (invoice)=>invoice.getUser()
    }
  }
});

const InvoiceInputType = new GraphQLInputObjectType({
  name: 'InvoiceInput',
  description: 'This is a graphql table for Welfurnish customers',
  fields: {
    invoice_number: {
      type: new GraphQLNonNull(GraphQLInt),
      description: "Invoice Number",
    },
    cost: {
      type: new GraphQLNonNull(GraphQLInt),
      description: "Cost of Items Purchased",
    },
    items: {
      type: new GraphQLNonNull(GraphQLString),
      description: "Purchased Items",
    }
  }
});

const { connectionType: itemConnection } = connectionDefinitions({nodeType: ItemType});
const { connectionType: userConnection } = connectionDefinitions({nodeType: UserType});
const { connectionType: clientConnection } = connectionDefinitions({nodeType: ClientOutputType});

const QueryType = new GraphQLObjectType({
	name: 'Query',
	description: 'This is the root query',
	fields: ()=>({
		items: {
			type: new GraphQLList(ItemType),
			resolve: (root, args) => resolveArrayByClass(Item, {order: [['createdAt', 'DESC']]})
		},
    users: {
      type: userConnection,
      args: connectionArgs,
      resolve: (root, args) => connectionFromPromisedArray(resolveArrayByClass(User, {order: [['createdAt', 'DESC']]}), args)
    },
    clients: {
      type: clientConnection,
      args: connectionArgs,
      resolve: (root, args) => connectionFromPromisedArray(resolveArrayByClass(Client, {order: [['createdAt', 'DESC']]}), args)
    },
    invoices: {
      type: new GraphQLList(InvoiceType),
      resolve: () => resolveModelsByClass(Invoice)
    },
    node: nodeField
	})
});

const CreateItems = mutationWithClientMutationId({
  name: 'CreateItems',
  description: 'New Items can be added',
  inputFields: {
    items: {
      type: new GraphQLList(ItemInputType),
      description: 'Input fields for new Items'
    }
  },
  outputFields: {
    items: {
      type: new GraphQLList(ItemType),
      description: 'Input fields for new Items'
    }
  },
  mutateAndGetPayload: ({ items })=>Item.bulkCreate(items).then(items=>({items}))
});

const UpdateItems = mutationWithClientMutationId({
  name: 'UpdateItems',
  description: 'Item properties can be updated',
  inputFields: {
    items: {
      type: UpdateItemType,
      description: 'Item update field'
    }
  },
  outputFields: {
    items: {
      type: ItemType,
      description: 'Input fields for new Items'
    }
  },
  mutateAndGetPayload: ({ items })=>{
    const { keyID, purchased } = items;
    return Item.update({ purchased }, {where: { realID }}).then(i=>{
      return i > 0 ? (Item.findByPrimary(realID).then(items=>({items}))) : {};
    });
  }
});

const MakeRegularOrder = mutationWithClientMutationId({
  name: 'MakeRegularOrder',
  description: 'Customer can make regular orders',
  inputFields: {
    customer: {
      type: ClientInputType,
      description: 'Input fields for customer order'
    },
    invoice: {
      type: InvoiceInputType,
      description: 'Input fields for Invoice'
    }
  },
  outputFields: {
    customer: {
      type: ClientOutputType,
      description: 'Result from order',
    },
    invoice: {
      type: InvoiceType,
      description: 'New Invoice'
    }
  },
  mutateAndGetPayload: ({ customer, invoice })=>{
    let check, invoice_number;
    do{
      invoice_number = Faker.random.number({min: 100000, max: 199999});
      check = Invoice.count({where: { invoice_number }});
      invoice.invoice_number = invoice_number;
    }
    while(check > 0);
    return User.create(customer).then(customer=>customer.createInvoice(invoice)).then(invoice=>({customer, invoice}));
  }
});

const MakeCustomOrder = mutationWithClientMutationId({
  name: 'MakeCustomOrder',
  description: 'Customer can make custom orders',
  inputFields: ()=>userObject(true),
  outputFields: {
    customer: {
      type: ClientOutputType,
      description: 'Result from order'
    }
  },
  mutateAndGetPayload: (order)=>Client.create(order).then(customer=>({customer}))
});

const MutationType = new GraphQLObjectType({
  name: 'Mutation',
  description: 'Root Mutation',
  fields: {
    customOrder: MakeCustomOrder,
    regularOrder: MakeRegularOrder,
    createItems: CreateItems,
    updateItems: UpdateItems 
  }
});

const Schema = new GraphQLSchema({
	query: QueryType,
  mutation: MutationType
});

export default Schema;