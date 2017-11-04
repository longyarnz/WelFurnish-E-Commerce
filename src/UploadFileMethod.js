export default uploadables => {
	const Form = new FormData();
	Form.append("File", uploadables);
	Form.append("Filename", uploadables['alias']);
	return fetch('http://graphql.io:8080/upload', { method: 'POST', body: Form });
}