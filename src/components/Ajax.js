export default function Ajax(url, method, data, responseHandler){
	return new Promise((resolve, reject)=>{
		const ajax = new XMLHttpRequest();
		ajax.open(method, url, true);
		method === 'POST' && ajax.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		ajax.send(data);
		ajax.onreadystatechange = ()=> {
			if(ajax.readyState === 4 && ajax.status === 200) {
				resolve(responseHandler(ajax.responseText));
			}
		}
	})
}