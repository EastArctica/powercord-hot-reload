const { Plugin } = require("powercord/entities");
const Settings = require("./components/Settings");

module.exports = class HotReload extends Plugin {
	constructor() {
		super();
		this.boundListener = this.listener.bind(this);
		this.keybind = "F5";
	}

	async startPlugin() {
		powercord.api.settings.registerSettings("hot-reload", {
			category: "hot-reload",
			label: "Hot Reload",
			render: Settings,
		});

		document.body.addEventListener("keyup", this.boundListener);
	}

	async pluginWillUnload() {
		powercord.api.settings.unregisterSettings("hot-reload");
		document.body.removeEventListener("keyup", this.boundListener);
	}

	listener(e) {
		const keybind = this.settings.get("keybind", "F5");

		// don't reload when changing keybind
		if (this.keybind !== keybind) {
			this.keybind = keybind;
			return;
		}

		if (e.key !== keybind) return;
		if (e.ctrlKey || e.altKey || e.shiftKey || e.metaKey) return;
		e.preventDefault();

		const pluginNames = [];

		for (const plugin of powercord.pluginManager.plugins.values()) {
			const whitelisted = this.settings.get(plugin.updateIdentifier, false);
			if (!whitelisted) continue;

			const name = plugin.manifest.name;
			const id = plugin.entityID;
			pluginNames.push(name);
			powercord.pluginManager.remount(id);
		}

		if (!pluginNames.length) return;

		const pluginText = pluginNames.join(", ");

		powercord.api.notices.sendToast("hot-reload-success", {
			header: "Hot Reload",
			content: `Reloaded plugins: ${pluginText}.`,
			type: "success",
			timeout: 5000,
		});
	}
};
