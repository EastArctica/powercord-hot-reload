const { React } = require("powercord/webpack");
const { SwitchItem, Category } = require("powercord/components/settings");
const KeybindRecorder = require("./KeybindRecorder");

const { plugins } = require("../state/plugins");

module.exports = class Settings extends React.Component {
	render() {
		const { getSetting, toggleSetting, updateSetting } = this.props;

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
