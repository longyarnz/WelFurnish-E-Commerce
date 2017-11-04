export default function ParseData(data){
	const newData = {};
	for (const x in data){
		newData[x] = data[x].value;
	}
	return newData;
}