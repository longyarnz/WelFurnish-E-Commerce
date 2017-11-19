import { commitMutation, graphql } from 'relay-runtime';
import Environment from '../createRelayEnvironment';

const mutation = graphql`
  mutation RegularOrderMutation($regOrder: MakeRegularOrderInput!){
    regularOrder(input: $regOrder){
      invoice{
        invoice_number
        # userKeyID
        user{
          keyID
        }
      }
    }
  }
`;

// function sharedUpdater(store, item, newEdge) {
  // const itemProxy = store.get(item.__id);
  // console.log(itemProxy);
  // const conn = ConnectionHandler.getConnection(
  //   itemProxy,
  //   'Itemlist_marketItems'
  // );
  // ConnectionHandler.insertEdgeAfter(conn, newEdge);
// }

export default function commit(
  variables,
  callback,
  _callback,
  _store
) {
  // delete variables.regOrder.invoice.userKeyID;
  delete variables.regOrder.invoice.user;
  return commitMutation(
    Environment,
    {
      mutation,
      variables,
      onCompleted: payload => _callback(payload),
      onError: err => console.log(err),
      optimisticUpdater: callback
    }
  );
}