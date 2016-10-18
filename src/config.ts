
 

import path = require('path')
import fs = require('fs')


export interface SiLibGlobalConfig {
    authorName?: string;
    authorURI?: string;
    authorEmail?: string;
    appInsight?: boolean | null;

    [key: string]: any;
}



var home = process.env.HOME || process.env.USERPROFILE
    , configDirectory = path.join(home, '.yeoman-silib')
    , configPath = path.join(configDirectory, 'config.json')
    , defaults = {
        authorName: ''
        , authorURI: ''
        , appInsight: null as boolean
    }

/**
 *  Read the config file
 *  And trigger the callback function with errors and
 *  datas as parameters
 */
export function getConfig(cb: (flag: boolean, defaults: SiLibGlobalConfig) => void
) {
    try {
        fs.readFile(configPath, 'utf8', function (err, data) {
            if (err) {
                cb(true, defaults)
                return
            }
            try {
                cb(false, JSON.parse(data))
            } catch (e) {
                cb(true, defaults);
            }
        })
    }
    catch (e) {
        cb(true, defaults)
    }
}

/**
 *  Create the config file
 *
 *  @param object values Values to write in the config file
 *  @param function cb Callback function
 */
export function createConfig(values: SiLibGlobalConfig, cb?: any) {
    //var configValues = {
    //    authorName: values.authorName || defaults.authorName
    //    , authorURI: values.authorURI || defaults.authorURI
    //    , appInsight: values.appInsight || defaults.appInsight
    //}

    //var configData = ['{\n\t'
    //    , '"authorName": "' + configValues.authorName + '",\n\t'
    //    , '"appInsight": "' + configValues.appInsight + '",\n\t'
    //    , '"authorURI": "' + configValues.authorURI + '"\n'
    //    , '}'
    //].join('')

    fs.mkdir(configDirectory, '0777', function () {
        fs.writeFile(configPath, JSON.stringify(values), 'utf8', cb)
    })
}

///**
// * Update the config file to bump
// * the Wordpress version
// *
// * @param string version Wordpress version
// */
//function updateWordpressVersion(version) {
//    getConfig(function (err, values) {
//        var newValues = {
//            authorName: values.authorName
//            , authorURI: values.authorURI
//            , themeUrl: values.themeUrl
//            , latestVersion: version
//        }

//        createConfig(newValues)
//    })
//}