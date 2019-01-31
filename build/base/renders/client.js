const path = require("path");

module.exports = {
    run({rigger, itemConfig, processArgv, Loaders, Plugins, Helper, Const}) {
        Helper.log(processArgv.debug, "render: client");
        let entry = {};
        let plugins = [];
        let entryFile = `index.${itemConfig.entryJsExt}`;

        Helper.getApps(itemConfig.absolutePath.appsPath, processArgv.apps)
            .forEach((val) => {
                let name = path.basename(val);
                entry[name] = [
                    "babel-polyfill",
                    path.resolve(val, entryFile),
                    path.resolve(val, `index.${itemConfig.entryCssExt}`)
                ];

            });

        plugins.push(
            Plugins[Plugins.CONST.extractCss]( {
                filename: `${itemConfig.relativePath.styles}/[name]_[${Helper.getHashTag(processArgv.env === Const.ENVS.LOCAL)}].css`,
            } ),
            Plugins[Plugins.CONST.copy]([{
                from: `${itemConfig.absolutePath.staticPath}/${itemConfig.relativePath.scriptLibraries}`,
                to: itemConfig.relativePath.scriptLibraries
            }]),
            Plugins[Plugins.CONST.webpackManifestPlugin]()
        );
        plugins.push(
            Plugins[Plugins.CONST.htmlIncludeAssets]({
                assets: [ ...itemConfig.dll.assets.css,  ...itemConfig.buildAssets.css],
                append: false,
            }),
            Plugins[Plugins.CONST.htmlIncludeAssets]({
                assets: [ ...itemConfig.dll.assets.js,  ...itemConfig.buildAssets.js],
                append: false,
            })
        )
        rigger
            .entry(entry)
            .plugins(plugins);

        return rigger.done();
    }
};

