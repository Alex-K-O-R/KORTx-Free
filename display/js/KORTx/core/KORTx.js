function LoadJSLibrary(filePath){
    const script = document.createElement('script');
    script.src = filePath;
    //script.async = 'true';
    script.type = 'text/javascript';
    document.head.append(script);
}
if (typeof window.$ === 'undefined')  {
    LoadJSLibrary('../js/KORtx/core/jquery-3.6.1.min.js');
}

LoadJSLibrary('../js/KORtx/utilities/Functions.js');
LoadJSLibrary('../js/KORtx/utilities/Procedures.js');
LoadJSLibrary('../js/KORtx/nodes/KChain.js');

LoadJSLibrary('../js/KORtx/nodes/KAddableBlock.js');
LoadJSLibrary('../js/KORtx/nodes/KFollower-min.js');
LoadJSLibrary('../js/KORtx/nodes/KCookies.js');

LoadJSLibrary('../js/KORtx/nodes/KShowPassword.js');

KORtx = Object.assign((typeof KORtx !== 'undefined')?KORtx:{}, {
    Node: class {
        constructor(){
            this.group;
            this.priority;
            this.anchor;
        }
        Initialize = function(){
        }
        Refresh_clnt = function(){
        }
        Refresh_srv = function(){
        }
    }

    ,NodeAsync: class {}
});