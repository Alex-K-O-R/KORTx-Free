KORtx.addKORtxPart({
    /*
        KTimeLayer has 4 parameters in it's constructor:
        name - is some string that should exist in specific data-attributes (data-ktmlay) of Layer controllable areas;
                separators (see KORtx.Layer.data_attribute_separators) are available for the area to be used in different Layers.

        msInterval - is an integer interval of milliseconds at which Layer *recalculation* (w/wo server request) occurs.

        scanTriggerFunc(layer) : bool - is an additional function that can break *recalculation* process after the preparatory functions
                have been completed. For example, for making request you've got to have all 3 of 3 inputs in different areas
                to be filled. The check for fillness might be created via Layer.interResults values to be added within each
                preparatory function, then the final check in scanTriggerFunc occurs.

        initFunc(layer) : this - is a function that fires when Layer was initialized. May be used for adding initial state for variables
                or Nodes.
     */
    KTimeLayer: class extends KORtx.Layer {
        intervalMs;
        scanTriggerFunc;
        r2r;

        constructor(name, msInterval, scanTriggerFunc, initFunc){
            super(name, 'ktmlay');
            var self_ = this;
            self_.r2r = true;

            self_.intervalMs = msInterval;
            self_.scanTriggerFunc = scanTriggerFunc;

            if(typeof initFunc !== 'undefined'){
                this.InitializeContents(initFunc);
            }

            setTimeout(self_.ProcessBefore, msInterval, self_);
        }

        ProcessBefore = function (self_) {
            if(!self_.r2r)
                return false;

            var goOn = true;
            if (self_.scanTriggerFunc !== 'undefined' && self_.scanTriggerFunc != null && self_.scanTriggerFunc instanceof Function) {
                goOn = (self_.scanTriggerFunc(self_)) ? true : false;
            }
            if (goOn) {
                var funcList = [];
                $.each(self_.nodeMap, function (i, ndLink) {
                    $.each(self_.getDirectNodeElement(ndLink.selector), function (num, elem) {
                        funcList = self_.addFunction(funcList, ndLink.rqFn, self_.interResults, elem);
                    });

                    $.each(self_.getNodesContentInnerElements(ndLink.selector), function (num, elem) {
                        funcList = self_.addFunction(funcList, ndLink.rqFn, self_.interResults, elem);
                    });
                });
                self_.Refresh_srv(funcList);
            }
        }

        ProcessAfter = async function(resultData){
            var self_ = this;
            var funcList = self_.LoadAfterFuncs(resultData);
            return await self_.Refresh_clnt(funcList).then(() => {setTimeout(self_.ProcessBefore, self_.intervalMs, self_);});
        }

        Stop = function(){
            this.r2r = false;
        }
        Resume = function(){
            this.r2r = true;
            this.ProcessBefore(this);
        }
    },
});