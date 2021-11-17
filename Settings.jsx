const { React } = require("powercord/webpack");
const { SwitchItem, Category } = require("powercord/components/settings");

module.exports = class Settings extends React.Component {
	render() {
		const { getSetting, toggleSetting } = this.props;
		const plugins = Array.from(powercord.pluginManager.plugins.values());

		return (
			<div>
				<Category
					name="Whitelist"
					description="Choose which plugins you want to hot reload."
					// could potentially cause issue if plugin was named 'whitelist'
					opened={getSetting("whitelist", false)}
					onChange={() => toggleSetting("whitelist")}
				>
					{plugins.map((plugin) => (
						<SwitchItem
							note={`${plugin.manifest.description} (${plugin.entityID})`}
							value={getSetting(plugin.entityID, false)}
							onChange={() => toggleSetting(plugin.entityID)}
						>
							{plugin.manifest.name}
						</SwitchItem>
					))}
				</Category>
			</div>
		);
	}
};
