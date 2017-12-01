// export default (query, variables, cb) => {
// 	return fetch('http://127.0.0.1:4000/graphql', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json'
//     },
//     body: JSON.stringify({ query, variables })
//   }).then(function(response){
//   	return response.json();
// 	}).then(response => cb(response));
// }
import UploadFileMethod from '../UploadFileMethod';
export default (query, variables, uploadables, responseHandler, progress) => {
	let data = JSON.stringify({ query, variables });
	if(uploadables) UploadFileMethod(uploadables);
	return new Promise((resolve, reject) => {
		const ajax = new XMLHttpRequest();
		ajax.open('POST', 'http://127.0.0.1:4000/graphql', true);
		ajax.setRequestHeader("Content-type", "application/json");
		ajax.send(data);
		ajax.onprogress = progress;
		ajax.onreadystatechange = () => {
			if(ajax.readyState === 4 && ajax.status === 200) {
				data = JSON.parse(ajax.responseText);
				resolve(responseHandler(data));
			}
		}
	})
}