function LoadJSScript(filePath) {
    return new Promise((loaded, error) => {
        var script = document.createElement('script');
        script.src = filePath;
        script.defer = true;
        script.type = 'text/javascript';
        document.head.append(script);
        script.onload = loaded;
        script.onerror = error;
    });
}

function LoadJSLibrary(scriptsArr, readyFunction, ...args) {
    var loadings = [];
    Array.prototype.forEach.call(scriptsArr, function(e,i){
        loadings.push(LoadJSScript(e));
    });
    Promise.all(loadings).then(() => {
        readyFunction(args);
    })
}


class KORtx {
    static merge(current, updates) {
        if(current) {
            for (var key of Object.keys(updates)) {
                if (!current.hasOwnProperty(key) || typeof updates[key] !== 'object') current[key] = updates[key];
                else if (current[key] instanceof Array && updates[key] instanceof Array) current[key] = current[key].concat(updates[key])
                else KORtx.merge(current[key], updates[key]);
            }
        }
        return current;
    }

    addKORtxPart = function(partialClass){
        KORtx.merge(this, partialClass);
    }

    onStart = function (startFunc, ...args) {
        LoadJSLibrary([
            '../js/KORtx/core/jquery/jquery-3.6.1.min.js',
            '../js/KORtx/utilities/Functions.js',
            '../js/KORtx/utilities/Procedures.js',
            '../js/KORtx/utilities/KChain.js',
            '../js/KORtx/utilities/KAddableBlock.js',
            '../js/KORtx/utilities/KFollower-min.js',
            '../js/KORtx/utilities/KCookies.js',

            '../js/KORtx/utilities/KShowPassword.js'],
            startFunc, args
        );
    }
}

KORtx = new KORtx();