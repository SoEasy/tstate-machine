// https://stackoverflow.com/a/1042676/2122752

export function clone(from: any): any {
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
