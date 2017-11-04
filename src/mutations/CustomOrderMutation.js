import { commitMutation, graphql } from 'relay-runtime';
import Environment from '../createRelayEnvironment';

const mutation = graphql`
  mutation CustomOrderMutation($customOrder: MakeCustomOrderInput!){
    customOrder(input: $customOrder){
      customer {
        _name
        email
        phone
        address
        city
        picture_file
        work_order
      }
    }
  }
`;

export default function commit(
  variables,
  uploadables,
  callback
) {
  console.log(variables);
  return commitMutation(
    Environment,
    {
      mutation,
      variables,
      onCompleted: res => callback(),
      onError: err => console.log(err),
      uploadables,
      optimisticUpdater: () => callback()
    }
  );
}