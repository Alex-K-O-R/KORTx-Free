KORtx.addKORtxPart({
    /**
     *
     */
    KEventLayer: class extends KORtx.Layer {
        priority;
        eventDetails;

        constructor(name, event, initFunc){
            super(name, 'kevlay');
            var self_ = this;

            if(initFunc !== 'undefined'){
                this.InitializeContents(initFunc);
            }
            document.addEventListener(event, async function (evt) {
                var result = {};
                self_.eventDetails = evt;

                var funcList = [];
                $.each(self_.nodeMap, function (i, ndLink){
                    $.each(self_.getNodes(ndLink.selector), function (num, elem) {
                        funcList = self_.addFunction(funcList, ndLink.rqFn, self_.eventDetails, elem);
                    });

                    $.each(self_.getNodesContentElements(ndLink.selector), function (num, elem) {
                        funcList = self_.addFunction(funcList, ndLink.rqFn, self_.eventDetails, elem);
                    });
                });

                funcList.reverse();
                await self_.Refresh_srv(funcList);
            });
        }

        InitializeContents = function(func){
            func(this);
        }

        ProcessAnswer = async function(){
            var self_ = this;
            var funcList = [];
            $.each(self_.nodeMap, function (i, ndLink){
                $.each(self_.getNodes(ndLink.selector), function (num, elem) {
                    funcList = self_.addFunction(funcList, ndLink.rsFn, self_.eventDetails, elem);
                });

                $.each(self_.getNodesContentElements(ndLink.selector), function (num, elem) {
                    funcList = self_.addFunction(funcList, ndLink.rsFn, self_.eventDetails, elem);
                });
            });
            funcList.reverse();

            return self_.Refresh_clnt(funcList);
        }
    },
});
