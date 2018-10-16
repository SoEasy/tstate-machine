// Yep, I'm too lazy to do cloning and merging myself :D
// But I add some changes - drop links to target and sources by using `clone`
// https://stackoverflow.com/a/1042676/2122752
// https://stackoverflow.com/a/34749873/2122752

function clone(from: any): any {
    if (from === null || typeof from !== 'object') return from;
    if (from.constructor !== Object && from.constructor !== Array) return from;
    if (from.constructor === Date || from.constructor === RegExp || from.constructor === Function ||
        from.constructor === String || from.constructor === Number || from.constructor === Boolean) {
        return new from.constructor(from);
    }

    const to = new from.constructor();

    for (const name in from) {
        to[name] = typeof to[name] === 'undefined' ? clone(from[name]) : to[name];
    }

    return to;
}

function isObject(item: any): boolean {
    return (item && typeof item === 'object' && !Array.isArray(item));
}

export function merge(target: any, ...sources: Array<any>): any {
    if (!sources.length) return target;
    const source = clone(sources.shift());
    // target = clone(target);

    if (isObject(target) && isObject(source)) {
        for (const key in source) {
            // Only merge "own" properties
            if (!source.hasOwnProperty(key)) {
                continue;
            }            
            if (isObject(source[key])) {
                if (!target[key]) {
                    Object.assign(target, { [key]: {} });
                }
                if (isObject(target[key])) {
                    merge(target[key], source[key]);
                } else {
                    target[key] = source[key];
                }

            } else {
                Object.assign(target, { [key]: source[key] });
            }
        }
    } else {
        target = clone(source);
    }

    return merge(target, ...sources);
}
