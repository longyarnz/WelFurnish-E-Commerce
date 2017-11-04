const Click = () => new MouseEvent('click', { 
		'view': window, 'bubbles': false, 'cancelable': true, 'isTrusted': true 
});

const Submit = () => new CustomEvent('submit', { 
	'view': window, 'bubbles': false, 'cancelable': true, 'isTrusted': true 
});

const KeyPress = (key) => new KeyboardEvent('keypress', { 
	'view': window, 'bubbles': false, 'cancelable': true, 'isTrusted': true, key,
});

module.exports = { Click, Submit, KeyPress };