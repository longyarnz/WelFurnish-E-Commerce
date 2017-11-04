import UploadFileMethod from './UploadFileMethod';
import { SubscriptionClient } from 'subscriptions-transport-ws';
import Ajax from './components/Ajax';
import {
  Environment,
  Network,
  RecordSource,
  Store
} from 'relay-runtime';

function fetchQuery(
  operation,
  variables,
  cacheConfig,
  uploadables
) {
  // console.log(operation, variables);
  if(uploadables) UploadFileMethod(uploadables)
  // return Ajax(`http://192.168.43.16:8080/`, 'POST', JSON.stringify({ query: operation.text, variables }), response => JSON.parse(response) );
  return fetch(`http://192.168.43.16:8080/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      query: operation.text,
      variables
    })
  }).then(response => {
    return response.json();
  });
}

function setupSubscription(config, variables, cacheConfig, observer){
  const query = config.text;
  const client = new SubscriptionClient('ws://127.1.1.1/ws', {reconnect: true});
  client.subscribe({query, variables}, (error, result) => {
    observer.onNext({ data: result })
  });
}

const network = Network.create(fetchQuery, setupSubscription);
const source = new RecordSource();
const store = new Store(source);
export default new Environment({ network, store });
