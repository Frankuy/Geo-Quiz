import similarity from '../../asset/similarity.json';

export function clue(name) {
    var names = name.split(' ');
    var clueName = names.map(val => {
        if (val.length > 6) {
            var rdx = 1 + Math.floor(Math.random() * (val.length - 1));
            return val[0] + val.substr(1, rdx - 1).replace(/\D/g, "_") + val[rdx] + val.substr(rdx + 1, val.length).replace(/\D/g, "_");
        }
        else {
            var rdx = Math.floor(Math.random() * val.length);
            return val.substr(0, rdx).replace(/\D/g, "_") + val[rdx] + val.substr(rdx + 1, val.length).replace(/\D/g, "_");
        }
    }).join(' ');

    return clueName;
}

export function stringToMs(string) {
    if (string == '60s') {
        return 60 * 1000;
    }
    else if (string == '3m') {
        return 3 * 60 * 1000;
    }
    else if (string == '5m') {
        return 5 * 60 * 1000;
    }
    else if (string == '10m') {
        return 10 * 60 * 1000;
    }
}

export function getSimilar(name) {
    return similarity[name];
}
