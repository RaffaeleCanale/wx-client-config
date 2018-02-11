import _ from 'lodash'

export function isDefined(options, ...keys) {
    ensure(options, keys, (k, v) => {
        if (_.isNil(v)) throw new Error(`'${k}' cannot be undefined or null\nOptions: ${JSON.stringify(options)}`)
    })
}

export function isNumber(options, ...keys) {
    ensure(options, keys, (k, v) => {
        if (!_.isNumber(v) || isNaN(v)) throw new Error(`'${k} = ${v}' must be a positive number\nOptions: ${JSON.stringify(options)}`)
    })
}

export function isPos(options, ...keys) {
    ensure(options, keys, (k, v) => {
        if (!_.isNumber(v) || isNaN(v) || v < 0) throw new Error(`'${k} = ${v}' must be a positive number\nOptions: ${JSON.stringify(options)}`)
    })
}

export function isPosInt(options, ...keys) {
    ensure(options, keys, (k, v) => {
        if (!_.isSafeInteger(v) || isNaN(v) || v < 0) throw new Error(`'${k} = ${v}' must be a positive integer\nOptions: ${JSON.stringify(options)}`)
    })
}

export function isStrictPosInt(options, ...keys) {
    ensure(options, keys, (k, v) => {
        if (!_.isSafeInteger(v) || isNaN(v) || v <= 0) throw new Error(`'${k} = ${v}' must be a strictly positive integer\nOptions: ${JSON.stringify(options)}`)
    })
}

export function isString(options, ...keys) {
    ensure(options, keys, (k, v) => {
        if (!_.isString(v)) throw new Error(`'${k} = ${v}' must be a string\nOptions: ${JSON.stringify(options)}`)
    })
}

export function isObject(options, ...keys) {
    ensure(options, keys, (k, v) => {
        if (!_.isPlainObject(v)) throw new Error(`'${k} = ${v}' must be an object\nOptions: ${JSON.stringify(options)}`)
    })
}

export function isArray(options, ...keys) {
    ensure(options, keys, (k, v) => {
        if (!_.isArray(v)) throw new Error(`'${k} = ${v}' must be an array\nOptions: ${JSON.stringify(options)}`)
    })
}

export function isFunction(options, ...keys) {
    ensure(options, keys, (k, v) => {
        if (!_.isFunction(v)) throw new Error(`'${k} = ${v}' must be a function\nOptions: ${JSON.stringify(options)}`)
    })
}

export function isRatio(options, ...keys) {
    ensure(options, keys, (k, v) => {
        if (!_.isNumber(v) || isNaN(v) || v < 0 || v > 1) throw new Error(`'${k} = ${v}' must be a number within [0,1]\nOptions: ${JSON.stringify(options)}`)
    })
}

export function isBoolean(options, ...keys) {
    ensure(options, keys, (k, v) => {
        if (!_.isBoolean(v)) throw new Error(`'${k} = ${v}' must be a boolean\nOptions: ${JSON.stringify(options)}`)
    })
}

function ensure(options, keys, test) {
    if (!_.isPlainObject(options)) throw new Error('options are undefined')
    if (!keys || keys.length === 0) keys = _.keys(options)

    keys.forEach((key) => test(key, options[key]))
}
