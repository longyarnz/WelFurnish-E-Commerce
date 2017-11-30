export default uploadables => {
	const Form = new FormData();
	Form.append("File", uploadables);
	Form.append("Filename", uploadables['alias']);
	return fetch('http://127.0.0.1:4000/upload', { method: 'POST', body: Form });
}