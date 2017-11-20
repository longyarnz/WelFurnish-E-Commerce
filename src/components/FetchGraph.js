export default (query, variables, cb) => {
	return fetch('http://127.0.0.1:4000/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ query, variables })
  }).then(function(response){
  	return response.json();
	}).then(response => cb(response));
}