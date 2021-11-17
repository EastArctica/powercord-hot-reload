const { Plugin } = require("powercord/entities");
const Settings = require("./Settings");

module.exports = class HotReload extends Plugin {
	async startPlugin() {
		powercord.api.settings.registerSettings("hot-reload", {
			category: "hot-reload",
			label: "Hot Reload",
			render: Settings,
		});

		document.body.addEventListener("keyup", this.listener);
	}

	async pluginWillUnload() {
		powercord.api.settings.unregisterSettings("hot-reload");
		document.body.removeEventListener("keyup", this.listener);
	}

	listener(e) {
		console.log("F5");
		if (e.key !== "F5") return;
		if (e.ctrlKey || e.altKey || e.shiftKey || e.metaKey) return;
		e.preventDefault();

		console.log("preventing default...");

		const settings = powercord.pluginManager.get("hot-reload").settings;

		for (const plugin of powercord.pluginManager.plugins.values()) {
			const whitelisted = settings.get(plugin.entityID, false);
			if (!whitelisted) continue;

			const name = plugin.manifest.name;
			const id = plugin.entityID;
			console.log(`remounting ${name}`);
			powercord.pluginManager.remount(id);
		}
	}
};
