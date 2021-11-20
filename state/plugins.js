const plugins = [];

const filter = (plugins) => {
	return Array.from(plugins.values()).filter(
		(e) => !e.isInternal && e.updateIdentifier !== "plugins_hot-reload",
	);
};

const initialize = (initialPlugins) => {
	const filtered = filter(initialPlugins);
	const ids = plugins.map((e) => e.entityID);

	for (const plugin of filtered) {
		if (!ids.includes(plugin.entityID)) {
			plugins.push(plugin);
		}
	}
};

module.exports = { initialize, plugins };
