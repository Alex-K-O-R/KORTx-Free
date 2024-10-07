KORtx.addKORtxPart({
    Layer: class {
        data_attribute_selector;// = 'klay';
        data_attribute_separators = ';,|+';

        availableRequestTypes = {GET : "GET", POST : "POST"};
        availableRequestEncodeTypes = {json : "json", url : "url", form : "form"};

        name = '';
        nodes = [];
        nodeMap = [];

        // on use Request
        method;
        url;
        settings = {};
        transfer;
        encodeType;
        responseTo;

        // cumulative common results for every Node's functions on layer refresh 
        interResults;

        // default states for every iteration of general variables
        // see this.useDefaultStatesEveryTime(...)
        defaultStates = {/*transfer: null, interResults: null*/};

        constructor(name, dataSel){
            if (this.constructor == KORtx.Layer) {
                throw new Error("Abstract classes can't be instantiated.");
            }
            this.name = name;
            if(typeof dataSel !== 'undefined'){
                this.data_attribute_selector = dataSel;
            }
            this.Initialize();
        }

        Initialize = function(){
            var self_ = this;
            $('[data-'+this.data_attribute_selector+']').each(function (i,elem){
                self_.CheckElement(elem);
            });
            var observer = new MutationObserver(mutationList =>
                mutationList.filter(m => m.type === 'childList').forEach(m => {
                    m.addedNodes.forEach(function (elem){self_.CheckElement(elem);});
                }));
            observer.observe(document,{childList: true, subtree: false});
        }

        useDefaultStatesEveryTime = function (transfer, interResults) {
            this.defaultStates.transfer = (typeof transfer === 'undefined') ? null : transfer;
            this.defaultStates.interResults = (typeof interResults === 'undefined') ? null : interResults;
        }

        CheckElement = function(elem) {
            var splitRes = null;
            var dataVal = $(elem).data(this.data_attribute_selector);
            for (var i = 0; i < this.data_attribute_separators.length; i++) {
                splitRes = dataVal?.split(this.data_attribute_separators.charAt(i));
                if (splitRes.length > 1) {
                    break;
                }
            }
            for (var j = 0; j < splitRes.length; j++) {
                if (splitRes[j]?.trim() == this.name) {
                    this.nodes.push(elem);
                }
            }
        }

        setResultAction = function(resultFunc, transfer){
            resultFunc(transfer);
        }

        getNodes = function(selectors){
            var self_ = this;
            var result = null;

            selectors = KORtx.Us.Glbl.ToArray(selectors);
            $.each(self_.nodes, function (num, elem) {
                for (var i = 0; i < selectors.length; i++) {
                    if ($(elem).is(selectors[i])) {
                        if(result === null){
                            result = $([elem]);
                        } else {
                            result = result.add([elem]);
                        }
                    }
                }
            });

            return result;
        }

        getNodesContentElements = function(selectors){
            var self_ = this;
            var result = null;
            selectors = KORtx.Us.Glbl.ToArray(selectors);
            $.each(self_.nodes, function (num, elem) {
                for (var i = 0; i < selectors.length; i++) {
                    var childElems = $(elem).find(selectors[i]);
                    if (childElems.length > 0) {
                        if(result === null){
                            result = $(childElems);
                        } else {
                            result = result.add(childElems);
                        }
                    }
                }
            });

            return result;
        }

        addNode = function (selector, requestFunction, responseFunction, priority){
            if(typeof this.nodeMap === 'undefined'){
                this.nodeMap = [];
            }

            if(typeof this.nodeMap[0] === 'undefined' || (typeof this.nodeMap[0] !== 'undefined' && this.nodeMap[0].priority <= priority)){
                this.nodeMap.push(new KORtx.KNodeLink(
                    selector, requestFunction, responseFunction, priority
                ));
            } else {
                this.nodeMap.unshift(new KORtx.KNodeLink(
                    selector, requestFunction, responseFunction, priority
                ));
            }
        }

        useRequestJson = function (url, requestMethod, responseObject, encodeRequestMethod) {
            var rType = (typeof requestMethod !== 'undefined' && (typeof requestMethod == 'string' || requestMethod instanceof String)) ?
                requestMethod.toUpperCase() : null;

            if(rType == this.availableRequestTypes.GET) {
                if(typeof encodeRequestMethod === 'undefined') {
                    this.encodeType = this.availableRequestEncodeTypes.url
                }
            }

            if(rType == this.availableRequestTypes.POST) {
                if(typeof encodeRequestMethod === 'undefined') {
                    this.encodeType = this.availableRequestEncodeTypes.form
                }
            }

            this.method = rType;
            this.url = url;
            this.responseTo = responseObject;
        }

        useSpecificAjaxSettings = function (settings) {
            this.settings = settings;
        }

        doRequest = function () {
            var self_ = this;

                var resultSettings = self_.settings;
                var resultRequest = null;

                if(typeof resultSettings['cache'] == 'undefined') resultSettings.cache = false;
                if(typeof resultSettings['crossDomain'] == 'undefined') resultSettings.crossDomain = true;
                if(typeof resultSettings['processData'] == 'undefined') resultSettings.processData = false;

                if(self_.method == self_.availableRequestTypes.GET) {
                    if(self_.encodeType == self_.availableRequestEncodeTypes.url || typeof resultSettings['contentType'] === 'undefined') {
                        resultRequest = new URLSearchParams(self_.transfer).toString();
                        resultSettings.contentType = 'application/x-www-form-urlencoded; charset=UTF-8';
                    }
                    if(self_.encodeType == self_.availableRequestEncodeTypes.json) {
                        resultRequest = JSON.stringify(self_.transfer);
                        resultSettings.contentType = 'text/plain';
                    }
                    $.ajaxSetup(resultSettings);
                    $.get( self_.url, resultRequest, )
                        .done(function( data ) {
                            if(typeof self_.responseTo !== 'undefined') {
                                data = new self_.responseTo(data);
                            }
                            self_.Refresh_clnt(data);
                        })
                        .fail(function( jqXHR, textStatus, errorThrown ) {
                            console.log(jqXHR);
                            console.log(textStatus);
                            console.log(errorThrown );

                            return null;
                        });
                }

                if(self_.method == self_.availableRequestTypes.POST) {
                    if(self_.encodeType == self_.availableRequestEncodeTypes.form || typeof resultSettings['contentType'] === 'undefined') {
                        var resultRequest = new FormData();
                        KORtx.Us.fillFormDataFromObject(resultRequest, self_.transfer);
                        resultSettings.contentType = 'multipart/form-data';
                    }
                    if(self_.encodeType == self_.availableRequestEncodeTypes.json) {
                        resultRequest = JSON.stringify(self_.transfer);
                        resultSettings.contentType = 'text/plain';
                    }
                    $.ajaxSetup(resultSettings);
                    $.post( self_.url, resultRequest, )
                        .done(function( data ) {
                            if(typeof self_.responseTo !== 'undefined') {
                                data = new self_.responseTo(data);
                            }
                            self_.ProcessAnswer(data);
                        })
                        .fail(function( jqXHR, textStatus, errorThrown ) {
                            console.log(jqXHR);
                            console.log(textStatus);
                            console.log(errorThrown );

                            console.log(new self_.responseTo());

                            return null;
                        });
                }
        }

        addFunction = function(funcList, nodeLinkFunc, inParams, elem) {
            var self_ = this;
            if(nodeLinkFunc) {
                funcList.push(
                    (funcListResult) => {
                        return new Promise((resolve) => {
                            //setTimeout( /* for delayed demo*/
                            //detail, self, el) => {
                            nodeLinkFunc(inParams.detail, self_, $(elem)); //detail, self, el);
                            resolve(true);
                            //}
                            //, 2000, evt.detail, self_, $(elem));
                        })
                    }
                );
            }

            return funcList;
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
                self_.ProcessAnswer();
            }

            return self_.funcListResult;
        }

        ProcessAnswer = async function(){

        }

        Refresh_clnt = async function(funcList){
            var self_ = this;

            var jltf = funcList.length;
            var i = 0;

            while(i < jltf){
                self_.funcListResult = await funcList[i](self_.funcListResult);
                i++;
            }

            return self_.funcListResult;
        }

        showNodes = function (borderCssRule) {
            borderCssRule = (typeof borderCssRule !== 'undefined' ?
                borderCssRule : ('4px solid '+KORtx.Us.HtmTgs.getRandomHEXColor()))
            $.each(this.nodes, function (num, elem) {
                $(elem).parents("*").show().css('visibility', 'visible');
                $(elem).css('border', borderCssRule);
            });
        }
    },
    /**
     *
     */
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