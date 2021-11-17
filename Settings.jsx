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
