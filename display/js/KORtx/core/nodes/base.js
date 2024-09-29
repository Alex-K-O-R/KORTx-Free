KORtx.addKORtxPart({
    Node: class {
        priority;
        parentLayer;
        selector;
        constructor(){
            if (this.constructor == KORtx.Node) {
                throw new Error("Abstract classes can't be instantiated.");
            }
        }
/*
        Initialize = function(){
        }*/
        Refresh_clnt = function(){
        }
        Refresh_srv = function(){
        }
    },
    KEventDesc : class {
        DATA;
        MESSAGE;
        STATUS;
        constructor(){
        }
    }
});