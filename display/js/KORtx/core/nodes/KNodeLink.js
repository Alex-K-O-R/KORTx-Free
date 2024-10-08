KORtx.addKORtxPart({
    KNodeLink : class {
        selector;
        rqFn;
        rsFn;
        priority;

        constructor(selector, rqFn, rsFn, priority) {
            this.selector = selector;
            this.rqFn = rqFn;
            this.rsFn = rsFn;
            this.priority = (typeof priority !== 'undefined') ? priority : 257;
        }
    },
});