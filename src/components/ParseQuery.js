export default function ParseQuery(data, first){
	let dataString = first ? `type=${first}&` : "";
	for (const x in data){
		dataString+=`${x}=${data[x].value}&`;
	}
	return dataString;
}