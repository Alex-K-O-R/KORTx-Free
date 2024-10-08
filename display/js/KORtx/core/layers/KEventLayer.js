KORtx.addKORtxPart({
    /*
        KEventLayer has 3 parameters in it's constructor:
        name - is some string that should exist in specific data-attributes (data-kevlay) of Layer controllable areas;
                separators (see KORtx.Layer.data_attribute_separators) are available for the area to be used in different Layers.

        eventName - is the string name of DOM-event to subscribe for. Once the event had happened (you can use KORtx.emitEvent(...)
                    for firing), Layer *recalculation* (w/wo server request) begins.

        initFunc(layer) : this - is a function that fires when Layer was initialized. May be used for adding initial state for variables
                or Nodes.
     */
    KEventLayer: class extends KORtx.Layer {
        // Holds event.details information
        eventDetails;

        constructor(name, eventName, initFunc){
            super(name, 'kevlay');
            var self_ = this;

            if(typeof initFunc !== 'undefined'){
                this.InitializeContents(initFunc);
            }
            document.addEventListener(eventName, async function (evt) {
                self_.eventDetails = evt.detail;

                var funcList = [];
                $.each(self_.nodeMap, function (i, ndLink){
                    $.each(self_.getDirectNodeElement(ndLink.selector), function (num, elem) {
                        funcList = self_.addFunction(funcList, ndLink.rqFn, self_.eventDetails, elem);
                    });

                    $.each(self_.getNodesContentInnerElements(ndLink.selector), function (num, elem) {
                        funcList = self_.addFunction(funcList, ndLink.rqFn, self_.eventDetails, elem);
                    });
                });
                await self_.Refresh_srv(funcList);
            });
        }

        ProcessAfter = async function(resultData){
            var self_ = this;
            var funcList = self_.LoadAfterFuncs(resultData);
            return await self_.Refresh_clnt(funcList);
        }
    },
});
