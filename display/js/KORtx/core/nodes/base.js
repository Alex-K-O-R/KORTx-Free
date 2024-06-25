KORtx.addKORtxPart({
    Node: class {
        priority;
        anchor;
        element;
        constructor(){
            if (this.constructor == Node) {
                throw new Error("Abstract classes can't be instantiated.");
            }
        }
        Initialize = function(){
        }
        Refresh_clnt = function(){
        }
        Refresh_srv = function(){
        }
    }
});