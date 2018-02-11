import fs from 'fs'
import path from 'path'
import * as Ensure from 'util/ensure'

export function readJsonSync(file) {
    Ensure.isString({ file })

    return JSON.parse(fs.readFileSync(file, 'utf8'))
}

export function readJson(file) {
    Ensure.isString({ file })

    return new Promise((resolve, reject) => {
        fs.readFile(file, 'utf8', (err, data) => {
            if (err) return reject(err)

            try {
                return resolve(JSON.parse(data))
            } catch (e) {
                return reject(e)
            }
        })
    })
}

export function readToArray(file) {
    Ensure.isString({
        file
    })

    return new Promise((resolve, reject) => {
        return fs.readFile(file, function(err, data) {
            if (err) return reject(err)

            const array = data.toString().split("\r\n")
            return resolve(array)
        })
    })
}

export function writeArray(file, array) {
    Ensure.isString({ file })
    Ensure.isArray({ array })

    return new Promise((resolve, reject) => {
        fs.writeFile(file, array.join('\n'), 'utf8', (err) => {
            if (err) return reject(err)
            return resolve()
        })
    })
}

export function writeJson(file, data) {
    Ensure.isString({ file })
    Ensure.isObject({ data })

    return new Promise((resolve, reject) => {
        fs.writeFile(file, JSON.stringify(data), 'utf8', (err) => {
            if (err) return reject(err)
            return resolve()
        })
    })
}


export function walkSync(dir) {
    let result = []
    const files = fs.readdirSync(dir)

    files.forEach(file => {
        file = path.resolve(dir, file)

        const stat = fs.statSync(file)
        if (stat && stat.isDirectory()) {
            result = result.concat(walkSync(file))
        } else {
            result.push(file)
        }
    })

    return result


    // var results = [];
    // fs.readdir(dir, function(err, list) {
    //     if (err) return done(err);
    //     var pending = list.length;
    //     if (!pending) return done(null, results);
    //     list.forEach(function(file) {
    //         file = path.resolve(dir, file);
    //         fs.stat(file, function(err, stat) {
    //             if (stat && stat.isDirectory()) {
    //                 walk(file, function(err, res) {
    //                     results = results.concat(res);
    //                     if (!--pending) done(null, results);
    //                 });
    //             } else {
    //                 results.push(file);
    //                 if (!--pending) done(null, results);
    //             }
    //         });
    //     });
    // });
}
