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
		if (e.key !== "F5") return;
		if (e.ctrlKey || e.altKey || e.shiftKey || e.metaKey) return;
		e.preventDefault();

		const settings = powercord.pluginManager.get("hot-reload").settings;

		let pluginText = "";
		for (const plugin of powercord.pluginManager.plugins.values()) {
			const whitelisted = settings.get(plugin.entityID, false);
			if (!whitelisted) continue;

			const name = plugin.manifest.name;
			const id = plugin.entityID;
			pluginText += `${name}, `;
			powercord.pluginManager.remount(id);
		}
		pluginText = pluginText.slice(0, -2); // remove last comma

		powercord.api.notices.sendToast("hot-reload-success", {
			header: "Hot Reload",
			content: `Reloaded plugins: ${pluginText}.`,
			type: "success",
			timeout: 5000
		});
	}
};
