function LoadJSLibrary(filePath){
    const script = document.createElement('script');
    script.src = filePath;
    //script.async = 'true';
    script.type = 'text/javascript';
    document.head.append(script);
}
if (typeof window.$ === 'undefined')  {
    LoadJSLibrary('../js/KORTx/core/jquery-3.6.1.min.js');
}

LoadJSLibrary('../js/KORTx/utility/Functions.js');
LoadJSLibrary('../js/KORTx/utility/Procedures.js');
LoadJSLibrary('../js/KORTx/nodes/KChain.js');

LoadJSLibrary('../js/KORTx/nodes/KAddableBlock.js');
LoadJSLibrary('../js/KORTx/nodes/KFollower-min.js');
LoadJSLibrary('../js/KORTx/nodes/KCookies.js');

KORTx = Object.assign((typeof KORTx !== 'undefined')?KORTx:{}, {
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