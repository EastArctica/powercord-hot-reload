const { React } = require("powercord/webpack");
const { SwitchItem, Category } = require("powercord/components/settings");
const KeybindRecorder = require("./KeybindRecorder");

module.exports = class Settings extends React.Component {
	render() {
		const { getSetting, toggleSetting, updateSetting } = this.props;
		const plugins = Array.from(powercord.pluginManager.plugins.values());

		return (
			<div>
				<KeybindRecorder
					value={getSetting("keybind", "F5")}
					onChange={(e) => {
						this.setState({ value: e });
						updateSetting("keybind", e);
					}}
					onReset={() => {
						this.setState({ value: "F5" });
						updateSetting("keybind", "F5");
					}}
				>
					Toggle Keybind
				</KeybindRecorder>
				<br />
				<Category
					name="Whitelist"
					description="Choose which plugins you want to hot reload."
					opened={getSetting("whitelist", false)}
					onChange={() => toggleSetting("whitelist")}
				>
					{plugins.map((plugin) => {
						if (plugin.isInternal) return null;
						if (plugin.updateIdentifier === "plugins_hot-reload") return null;
						return (
							<SwitchItem
								note={`${plugin.manifest.description} (${plugin.entityID})`}
								value={getSetting(plugin.updateIdentifier, false)}
								onChange={() => toggleSetting(plugin.updateIdentifier)}
							>
								{plugin.manifest.name}
							</SwitchItem>
						);
					})}
				</Category>
			</div>
		);
	}
};
