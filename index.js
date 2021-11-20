const { Plugin } = require("powercord/entities");
const Settings = require("./components/Settings");
const { initialize, plugins } = require("./state/plugins");

const fs = require("fs");

module.exports = class HotReload extends Plugin {
	constructor() {
		super();
		this.boundListener = this.listener.bind(this);
		this.keybind = "F5";
		this.buffer = [];
		initialize(powercord.pluginManager.plugins);
		setInterval(() => {
			initialize(powercord.pluginManager.plugins);
		}, 5000);
	}

	async startPlugin() {
		powercord.api.settings.registerSettings("hot-reload", {
			category: "hot-reload",
			label: "Hot Reload",
			render: Settings,
		});

		document.body.addEventListener("keyup", this.boundListener);

		const directory = plugins[0].basePath;
		fs.watch(directory, { recursive: true }, this.watcher.bind(this));
	}

	async pluginWillUnload() {
		powercord.api.settings.unregisterSettings("hot-reload");
		document.body.removeEventListener("keyup", this.boundListener);
	}

	reload(plugins) {
		for (const plugin of plugins) {
			const id = plugin.entityID;
			powercord.pluginManager.remount(id);
		}

		const pluginNames = plugins.map((e) => e.manifest.name);
		const pluginText = pluginNames.join(", ");

		this.notify(`Reloaded plugins: ${pluginText}.`);
	}

	notify(content) {
		powercord.api.notices.sendToast("hot-reload-success", {
			header: "Hot Reload",
			content: content,
			type: "success",
			timeout: 5000,
		});
	}

	updateBuffer(plugin) {
		console.log(`buffer at start:`, this.buffer);

		const ids = this.buffer.map((e) => e.entityID);
		if (!ids.includes(plugin.entityID)) this.buffer.push(plugin);

		setTimeout(() => this.checkBuffer(), 5000);
	}

	checkBuffer() {
		const buffer = [...this.buffer];

		this.buffer.length = 0;
		if (!buffer.length) return;

		this.reload(buffer);
	}

	watcher(event, filename) {
		console.log(event, filename);
		const split = filename.split("\\").join("/").split("/");
		const basename = split.shift();

		if (split.some((e) => e === ".git")) return;

		const plugin = plugins.find((p) => p.entityID === basename);

		if (!plugin) return;

		this.updateBuffer(plugin);
	}

	listener(event) {
		const keybind = this.settings.get("keybind", "F5");

		// don't reload when changing keybind
		if (this.keybind !== keybind) {
			this.keybind = keybind;
			return;
		}

		if (event.key !== keybind) return;
		if (event.ctrlKey || event.altKey || event.shiftKey || event.metaKey) return;
		event.preventDefault();

		const reloaded = plugins.filter((plugin) => this.settings.get(plugin.updateIdentifier, false));
		this.reload(reloaded);
	}
};
