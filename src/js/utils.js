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
    if (string == '60 s') {
        return 60 * 1000;
    }
    else if (string == '3 m') {
        return 3 * 60 * 1000;
    }
    else if (string == '5 m') {
        return 5 * 60 * 1000;
    }
    else if (string == '10 m') {
        return 10 * 60 * 1000;
    }
}