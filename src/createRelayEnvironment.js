import UploadFileMethod from './UploadFileMethod';
// import Ajax from './components/Ajax';
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
  if(uploadables) UploadFileMethod(uploadables)
  // return Ajax(`http://192.168.43.16:8080/`, 'POST', JSON.stringify({ query: operation.text, variables }), response => JSON.parse(response) );
  return fetch(`http://127.0.0.1:4000/graphql`, {
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

const network = Network.create(fetchQuery);
const source = new RecordSource();
const store = new Store(source);
export default new Environment({ network, store });
