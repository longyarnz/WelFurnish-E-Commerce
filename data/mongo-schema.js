import Mongoose from './mongoDB';
import Models from './models';
import Merge from '../src/components/Merge';
import Faker from 'faker';
import assert from 'assert';

import { 
	GraphQLInputObjectType,
	GraphQLObjectType, 
	GraphQLInt,
  GraphQLString, 
	GraphQLList, 
	GraphQLSchema,
	GraphQLNonNull,
  GraphQLBoolean 
} from 'graphql';

Mongoose();

const userObject = bool => {
  const string = bool === true ? (new GraphQLNonNull(GraphQLString)) : GraphQLString;
  const int = bool === true ? (new GraphQLNonNull(GraphQLInt)) : GraphQLString;
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
      type: GraphQLString,
      description: 'Picture Sample of Work Order'
    },
    work_order: {
      type: string,
      description: 'Description of Work Order'
    }
  }
};

const itemObject = bool => {
  const string = bool === true  ? (new GraphQLNonNull(GraphQLString)) : GraphQLString;
  const int = bool === true ? (new GraphQLNonNull(GraphQLInt)) : GraphQLInt;
  bool = bool === true ? (new GraphQLNonNull(GraphQLBoolean)) : GraphQLBoolean;
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

const invoiceObject = bool => {
  const string = bool === true  ? (new GraphQLNonNull(GraphQLString)) : GraphQLString;
  const int = bool === true ? (new GraphQLNonNull(GraphQLInt)) : GraphQLInt;
  bool = bool === true ? (new GraphQLNonNull(GraphQLBoolean)) : GraphQLBoolean;
  return {
    invoice_number: {
      type: int,
      description: "Invoice Number",
    },
    cost: {
      type: int,
      description: "Cost of Items Purchased",
    },
    items: {
      type: string,
      description: "Purchased Items",
    },
    user: {
      type: string,
      description: "User ID",
    }
  }
}

const ClientOutputType = new GraphQLObjectType({
  name: 'ClientOutput',
  description: 'This is the Client Information Object',
  fields: () => userObject(false)
});

const ClientInputType = new GraphQLInputObjectType({
  name: 'ClientInput',
  description: 'This is the Client Information Object',
  fields: () => {
    const fields = userObject(true);
    delete fields.address;
    return fields;
  }
});

const UserInputType = new GraphQLInputObjectType({
  name: 'UserInput',
  description: 'This is the Client Information Object',
  fields: () => {
    const fields = userObject(true);
    delete fields.picture_file;
    delete fields.work_order;
    return fields;
  }
});

const ItemType = new GraphQLObjectType({
	name: 'ItemOutput',
	description: 'This is a graphql table for Welfurnish works',
	fields: () => itemObject(false)
});

const ItemInputType = new GraphQLInputObjectType({
  name: 'ItemInput',
  description: 'This is an input type for Items',
  fields: () => itemObject(true)
});

const UpdateItemType = new GraphQLInputObjectType({
  name: 'UpdateItemInput',
  description: 'This is a graphql table for Welfurnish works',
  fields: () => {
    const fields = itemObject(false);
    fields.keyID.type = new GraphQLNonNull(GraphQLInt);
    return fields;
  }
});

const UserType = new GraphQLObjectType({
  name: 'User',
  description: 'This is a graphql table for Welfurnish customers',
  fields: () => Merge( 
    {
      keyID: {
        type: GraphQLString,
        description: "KeyID Field"
      }
    },
    userObject(false),
    {
      invoices: {
        type: new GraphQLList(InvoiceType),
        resolve: ({ keyID }) => {
          const { Invoice } = Models;
          return Invoice.find({ user: keyID })
        }
      }
    }
  ),
});

const InvoiceType = new GraphQLObjectType({
  name: 'InvoiceOutput',
  description: 'This is a graphql table for Welfurnish customers',
    fields: () => {
      const fields = invoiceObject(false);
      delete fields.user;
      return Merge(
        fields,
        {
          user: { type: UserType }
        } 
      )
    }
});

const InvoiceInputType = new GraphQLInputObjectType({
  name: 'InvoiceInput',
  description: 'This is a graphql table for Welfurnish customers',
  fields: () => {
    const fields = invoiceObject(true);
    delete fields.user;
    return fields;
  }
});

const QueryType = new GraphQLObjectType({
	name: 'Query',
	description: 'This is the root query',
	fields: {
		items: {
			type: new GraphQLList(ItemType),
      args: {
        options: { 
          type: new GraphQLInputObjectType({
            name: 'ItemOptions',
            fields: itemObject(false)
          })
        },
        limits: { 
          type: GraphQLInt
        },
        sort: { 
          type: GraphQLString
        }
      },
			resolve: (root, { options, limits, sort }) => {
        const { Item } = Models;
        return Item.find(options).limit(limits).sort(sort);
      }
		},
    users: {
      type: new GraphQLList(UserType),
      args: {
        options: { 
          type: new GraphQLInputObjectType({
            name: 'UserOptions',
            fields: userObject(false)
          })
        },
        limits: { 
          type: GraphQLInt
        },
        sort: { 
          type: GraphQLString
        }
      },
      resolve: (root, { options, limits, sort }) => {
        const { User } = Models;
        return User.find(options).limit(limits).sort(sort);
      }
    },
    clients: {
      type: new GraphQLList(ClientOutputType),
      args: {
        options: { 
          type: new GraphQLInputObjectType({
            name: 'ClientOptions',
            fields: userObject(false)
          })
        },
        limits: {
          type: GraphQLInt
        },
        sort: { 
          type: GraphQLString
        }
      },
      resolve: (root, { options, limits, sort }) => {
        const { Client } = Models;
        return Client.find(options).limit(limits).sort(sort);
      }
    },
    invoices: {
      type: new GraphQLList(InvoiceType),
      args: {
        options: { 
          type: new GraphQLInputObjectType({
            name: 'InvoiceOptions',
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
              user: {
                type: GraphQLString,
                description: "User ID",
              }
            }
          })
        },
        limits: {
          type: GraphQLInt
        },
        sort: { 
          type: GraphQLString
        }
      },
      resolve: (root, { options, limits, sort }) => {
        const { Invoice } = Models;
        return Invoice.find(options).limit(limits).populate('user').sort(sort);
      }
    }
  }
});

const CreateItems = {
  name: 'CreateItems',
  type: new GraphQLList(ItemType),
  description: 'New Items can be added',
  args: {
    items: {
      type: new GraphQLList(ItemInputType),
      description: 'Input fields for new Items'
    }
  },  
  resolve: async (obj, { items }) => {
    const { Item } = Models;
    let keyID = await Item.find().limit(1).sort({keyID: -1}).select({keyID: 1});
    keyID = keyID[0].keyID;
    items.forEach(item => {
      item.keyID = ++keyID;
    });
    return Item.create(items);
  }
};

const UpdateItems = {
  name: 'UpdateItems',
  description: 'Item properties can be updated',
  type: new GraphQLList(ItemType),
  args: {
    items: {
      type: UpdateItemType,
      description: 'Item update field'
    }
  },
  resolve: (obj, { items }) => {
    const { Item } = Models;
    const { keyID } = items;
    return Item.update({ keyID }, items).then(async i => {
      if (i.nModified === 0) return {};
      return Item.find({ keyID });
    }); 
  }
};

const MakeRegularOrder = {
  name: 'MakeRegularOrder',
  description: 'Customer can make regular orders',
  type: new GraphQLObjectType({
    name: 'MakeRegularOrderPayload',
    description: 'Output for Regular Orders',
    fields: {
      keyID: { type: GraphQLString },
      customer: {
        type: ClientOutputType,
        description: 'Result from order',
      },
      invoice: {
        type: InvoiceType,
        description: 'New Invoice'
      }
    }
  }),
  args: {
    customer: {
      type: UserInputType,
      description: 'Input fields for customer order'
    },
    invoice: {
      type: InvoiceInputType,
      description: 'Input fields for Invoice'
    }
  },
  resolve: async (obj, { customer, invoice }) => {
    let check, invoice_number;
    const { Invoice, User } = Models;
    do{
      invoice_number = Faker.random.number({min: 100000, max: 199999});
      check = await Invoice.count({ invoice_number });
      invoice.invoice_number = invoice_number;
    }
    while(check > 0);
    return User.create(customer).then(({ keyID }) => {
      invoice.user = keyID;
      return Invoice.create(invoice)
      .then(invoice => {
        return { customer, invoice, keyID }
      })
    });
  }
};

const MakeCustomOrder = {
  name: 'MakeCustomOrder',
  description: 'Customer can make custom orders',
  args: {
    customer: { type: ClientInputType },
  },
  type: ClientOutputType,
  resolve: (obj, { customer }) => {
    console.log(customer);
    const { Client } = Models;
    return Client.create(customer);
  }
};

const AllFields = (bool) => ({
  client: {
    type: bool === true ? new GraphQLList(new GraphQLInputObjectType({
      name: 'ClientToBeRemoved',
      fields: userObject(false)
    })) : GraphQLInt
  },
  user: {
    type: bool === true ? new GraphQLList(new GraphQLInputObjectType({
      name: 'UserToBeRemoved',
      fields: userObject(false)
    })) : GraphQLInt
  },
  item: {
    type: bool === true ? new GraphQLList(new GraphQLInputObjectType({
      name: 'ItemToBeRemoved',
      fields: itemObject(false)
    })) : GraphQLInt
  },
  invoice: {
    type: bool === true ? new GraphQLList(new GraphQLInputObjectType({
      name: 'InvoiceToBeRemoved',
      fields: invoiceObject(false)
    })) : GraphQLInt
  },
  allUsers: {
    type: GraphQLBoolean
  },
  allItems: {
    type: GraphQLBoolean
  },
  allClients: {
    type: GraphQLBoolean
  },
  allInvoices: {
    type: GraphQLBoolean
  }
});

const RemoveEntry = {
  name: 'RemoveEntry',
  description: 'Moderator can remove entries',
  args: AllFields(true),
  type: new GraphQLObjectType({
    name: 'RemoveEntryPayload',
    fields: AllFields(false)
  }),
  resolve: async (obj, order) => {
    const { Item, Invoice, Client, User } = Models;
    let model, options, all, response = {};
    for (const fields in order){
      all = false;
      options = order[fields];
      switch(fields){
        case 'allUsers': all = true; fields = 'user';
        case 'user': model = User; break;
        case 'allInvoices': all = true; fields = 'invoices';
        case 'invoice': model = Invoice; break;
        case 'allClients': all = true; fields = 'client';
        case 'client': model = Client; break;
        case 'allItems': all = true; fields = 'items';
        default: model = Item;
      }      
      options = all ? await model.remove({}) : await model.remove({$or: options});
      response[fields] = options.result.n;
    }    
    return response;
  }
};

const MutationType = new GraphQLObjectType({
  name: 'Mutation',
  description: 'Root Mutation',
  fields: {
    CustomOrder: MakeCustomOrder,
    RegularOrder: MakeRegularOrder,
    CreateItems: CreateItems,
    UpdateItems: UpdateItems,
    RemoveEntries: RemoveEntry 
  }
});

const Schema = new GraphQLSchema({
	query: QueryType,
  mutation: MutationType
});

export default Schema;