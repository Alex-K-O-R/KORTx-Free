KORtx.addKORtxPart({
    /**
     *
     */
    KEventLayer: class extends KORtx.Layer {
        priority;

        constructor(name, event, initFunc){
            super(name, 'kevlay');
            var self_ = this;

            if(initFunc !== 'undefined'){
                this.InitializeContents(initFunc);
            }
            document.addEventListener(event, async function (evt) {
                var result = {};
                console.log(evt);

                var funcList = [];
                $.each(self_.nodeMap, function (i, ndLink){
                    $.each(self_.getNodes(ndLink.selector), function (num, elem) {
                        funcList = self_.addFunction(funcList, ndLink, evt, elem);
                    });

                    $.each(self_.getNodesContentElements(ndLink.selector), function (num, elem) {
                        funcList = self_.addFunction(funcList, ndLink, evt, elem);
                    });
                });

                self_.Refresh_srv(funcList);
            });
        }

        addFunction = function(funcList, ndLink, evt, elem) {
            var self_ = this;
            funcList.push(
                (funcListResult) => {
                    return new Promise((resolve) => {
                        //setTimeout( /* for delayed demo*/
                        (detail, self, el) => {
                            ndLink.rqFn(detail, self, el);
                            resolve(true);
                        }
                        //, 2000,
                        evt.detail, self_, $(elem)
                        //);
                    })
                }
            );

            return funcList;
        }

        InitializeContents = function(func){
            func(this);
        }
        Refresh_clnt = function(beforeResult, afterResult){
            var self_ = this;
            console.log(self_.method, self_.transfer, self_.interResults);
        }
        Refresh_srv = async function(funcList){
            var self_ = this;

            var jltf = funcList.length;
            var i = 0;

            while(i < jltf){
                self_.funcListResult = await funcList[i](self_.funcListResult);
                i++;
            }

            if(
                typeof self_.method !== 'undefined' && self_.method != ''
                && typeof self_.transfer !== 'undefined' && self_.transfer != null
            ) {
                self_.doRequest();
            } else {
                self_.Refresh_clnt();
            }

            return self_.funcListResult;
        }
    },
});
