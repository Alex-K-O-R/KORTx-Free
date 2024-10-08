KORtx.addKORtxPart({
    Layer: class {
        data_attribute_selector;
        data_attribute_separators = ';,|+';

        static availableRequestTypes = {GET : "GET", POST : "POST"};
        static availableRequestEncodeTypes = {json : "json", url : "url", form : "form"};

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

        InitializeContents = function(func){
            func(this);
            return this;
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

            return self_;
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

        getDirectNodeElement = function(selectors){
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

        getNodesContentInnerElements = function(selectors){
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

        addNode = function (selector, prepFunction, responseFunction, priority){
            if(typeof this.nodeMap === 'undefined'){
                this.nodeMap = [];
            }

            var nextNode = new KORtx.KNodeLink(
                selector, prepFunction, responseFunction, priority
            );

            if(typeof this.nodeMap[0] === 'undefined' || (typeof this.nodeMap[0] !== 'undefined' && this.nodeMap[0].priority <= nextNode.priority)){
                this.nodeMap.push(nextNode);
            } else {
                this.nodeMap.unshift(nextNode);
            }

            return this;
        }

        useRequest = function (url, requestMethod, responseObject, encodeRequestMethod) {
            var rType = (typeof requestMethod !== 'undefined' && (typeof requestMethod == 'string' || requestMethod instanceof String)) ?
                requestMethod.toUpperCase() : null;

            if(rType == KORtx.Layer.availableRequestTypes.GET) {
                if(typeof encodeRequestMethod === 'undefined') {
                    this.encodeType = KORtx.Layer.availableRequestEncodeTypes.url
                }
            }

            if(rType == KORtx.Layer.availableRequestTypes.POST) {
                if(typeof encodeRequestMethod === 'undefined') {
                    this.encodeType = KORtx.Layer.availableRequestEncodeTypes.form
                }
            }

            this.method = rType;
            this.url = url;
            this.responseTo = responseObject;
            return this;
        }

        useSpecificAjaxSettings = function (settings) {
            this.settings = settings;
        }

        doRequest = function () {
            var self_ = this;

            var resultSettings = Object.assign({}, self_.settings);
            var resultRequest = null;

            if(typeof resultSettings['cache'] == 'undefined') resultSettings.cache = false;
            if(typeof resultSettings['crossDomain'] == 'undefined') resultSettings.crossDomain = true;
            if(typeof resultSettings['processData'] == 'undefined') resultSettings.processData = false;
            if(typeof resultSettings['timeout'] == 'undefined') resultSettings.timeout = 0;
            //if(typeof resultSettings['dataType'] == 'undefined') resultSettings.dataType = "json";

            if(self_.method == KORtx.Layer.availableRequestTypes.GET) {
                if(self_.encodeType == KORtx.Layer.availableRequestEncodeTypes.url || typeof resultSettings['contentType'] === 'undefined') {
                    resultRequest = new URLSearchParams(self_.transfer).toString();
                    resultSettings.contentType = 'application/x-www-form-urlencoded; charset=UTF-8';
                }
                if(self_.encodeType == KORtx.Layer.availableRequestEncodeTypes.json) {
                    resultRequest = JSON.stringify(self_.transfer);
                    resultSettings.contentType = 'text/plain';
                }
                $.ajaxSetup(resultSettings);
                $.get( self_.url, resultRequest, )
                    .done(function( data ) {
                        if(typeof self_.responseTo !== 'undefined') {
                            data = new self_.responseTo(data);
                        }
                        self_.ProcessAfter(data);
                    })
                    .fail(function( jqXHR, textStatus, errorThrown ) {
                        console.log(jqXHR);
                        console.log(textStatus);
                        console.log(errorThrown );

                        self_.ProcessAfter(null);
                        return null;
                    });
            }

            if(self_.method == KORtx.Layer.availableRequestTypes.POST) {
                if(self_.encodeType == KORtx.Layer.availableRequestEncodeTypes.form || typeof resultSettings['contentType'] === 'undefined') {
                    var resultRequest = new FormData();
                    KORtx.Us.fillFormDataFromObject(resultRequest, self_.transfer);
                    resultSettings.contentType = 'multipart/form-data';
                }
                if(self_.encodeType == KORtx.Layer.availableRequestEncodeTypes.json) {
                    resultRequest = JSON.stringify(self_.transfer);
                    resultSettings.contentType = 'text/plain';
                }
                $.ajaxSetup(resultSettings);
                $.post( self_.url, resultRequest, )
                    .done(function( data ) {
                        if(typeof self_.responseTo !== 'undefined') {
                            data = new self_.responseTo(data);
                        }
                        self_.ProcessAfter(data);
                    })
                    .fail(function( jqXHR, textStatus, errorThrown ) {
                        console.log(jqXHR);
                        console.log(textStatus);
                        console.log(errorThrown );

                        self_.ProcessAfter(null);
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
                            if(nodeLinkFunc.length < 4) {
                                nodeLinkFunc(inParams, self_, $(elem));
                                resolve(true);
                            } else {
                                nodeLinkFunc(inParams, self_, $(elem), resolve);
                            }
                        })
                    }
                );
            }

            return funcList;
        }

        Refresh_srv = async function(funcList){
            var self_ = this;

            if(typeof self_.defaultStates.interResults !== 'undefined') {
                self_.interResults = self_.defaultStates.interResults;
            }
            if(typeof self_.defaultStates.transfer !== 'undefined') {
                self_.transfer = self_.defaultStates.transfer;
            }

            var jltf = funcList.length;
            var i = 0;

            while(i < jltf){
                self_.funcListResult = await funcList[i](self_.funcListResult);
                i++;
            }

            if(
                typeof self_.method !== 'undefined' && self_.method != ''
            ) {
                self_.doRequest();
            } else {
                self_.ProcessAfter(self_.interResults);
            }

            return self_.funcListResult;
        }

        LoadAfterFuncs = function (resultData) {
            var self_ = this;
            var funcList = [];
            $.each(self_.nodeMap, function (i, ndLink) {
                $.each(self_.getDirectNodeElement(ndLink.selector), function (num, elem) {
                    funcList = self_.addFunction(funcList, ndLink.rsFn, resultData, elem);
                });

                $.each(self_.getNodesContentInnerElements(ndLink.selector), function (num, elem) {
                    funcList = self_.addFunction(funcList, ndLink.rsFn, resultData, elem);
                });
            });
            funcList.reverse();
            return funcList;
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

        showNodes = function (borderCssString) {
            borderCssString = (typeof borderCssString !== 'undefined' ?
                borderCssString : ('4px solid '+KORtx.Us.HtmTgs.getRandomHEXColor()))
            $.each(this.nodes, function (num, elem) {
                $(elem).parents("*").show().css('visibility', 'visible');
                $(elem).css('border', borderCssString);
            });
        }
    }
});