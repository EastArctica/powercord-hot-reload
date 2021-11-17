const { React } = require("powercord/webpack");
const { SwitchItem } = require("powercord/components/settings");

module.exports = class Settings extends React.Component {
	render() {
		const { getSetting, toggleSetting } = this.props;

		const plugins = Array.from(powercord.pluginManager.plugins.values());

		return (
			<div>
				{plugins.map((plugin) => (
					<SwitchItem
						note={`${plugin.manifest.description} (${plugin.entityID})`}
						value={getSetting(plugin.entityID, false)}
						onChange={() => toggleSetting(plugin.entityID)}
					>
						{plugin.manifest.name}
					</SwitchItem>
				))}
			</div>
		);
	}
};