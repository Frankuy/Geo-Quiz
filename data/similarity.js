const difflib = require('difflib');
const mapData = require('../src/asset/world.geo.json');

const names = mapData.features.map(feature => feature.properties.name);
const similarity = {}
for (let name of names) {
    let close = difflib.getCloseMatches(name, names, 4, 0.0)
    similarity[name.toUpperCase()] = close.map(name => name.toUpperCase())
}
const json = JSON.stringify(similarity);

const fs = require('fs');
fs.writeFile('src/asset/similarity.json', json, function (err) {
    if (err) throw err;
    console.log('complete');
});