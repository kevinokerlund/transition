export function convertStyleObjectToCSSText(styleObject) {
	const styles = [];
	Object.keys(styleObject).forEach(key => {
		const kebabKey = key.replace(/([A-Z])/g, (m, c) => {
			return `-${c.toLowerCase()}`;
		});
		styles.push(`${kebabKey}:${styleObject[key]}`);
	});
	return styles.join(';');
}
