KORTx = Object.assign((typeof KORTx !== 'undefined')?KORTx:{}, {
/*
    KChain is a handy tool that provides a nice and easy animation chain describer for group of elements.

    KChain consists of two basic classes:
        [ ChainParams ] - parameters of animation chain
        , [ Chain ] - chain object
    and 2 control functions:
        Start - begins the animation, locks chain from repeat;
        Rewind - resets the key properties for animated HTML-containers,
                 such as inline-styles, classes and data-* attributes.
                 It's possible to pass Rewind Function that will be executed and reset some other elements state.

    [ Chain ] is the main class constructor which requires parameters of animation.

    [ ChainParams ] are parameters of animation. Object needs 3 parameters to be passed, everyone matters:
        timeouts - milliseconds amount or an array of milliseconds that is cyclically traveled through and provide delays
        actions - procedure or a set of procedures that is cyclically traveled through and provide animation effects
        elements - collection of elements that are to be animated

    Also it's possible to pass Final Function which is being called after animation had processed last element from group.
    Final Function is called with animation chain HTML-elements passed inside.


 */
    KChain : {
        Chain : class {
            chainParams;
            rootElementsInitialStates = [];

            totalDuration = 0;

            timeouts = [];
            started = false;

            containers = [];
            finalFunc;

            constructor(chainParams){
                if (typeof chainParams === 'undefined') return;

                this.chainParams = chainParams;
                var stepTO = 0;

                var REIS = this.rootElementsInitialStates;

                for(var i=0; i<chainParams.elements.length; i++){
                    REIS[i] = new KORTx.KChain.ElementStateContainer(chainParams.elements[i]);
                    this.totalDuration = this.totalDuration + parseInt(chainParams.timeouts[stepTO]);
                    stepTO++;
                    if (stepTO >= chainParams.timeouts.length) stepTO = 0;
                }
                //if(typeof finalFunction !== 'undefined') this.finalFunction = finalFunction;
                return this;
            }

            ClearTOs = function(){
                for(var i=0; i< this.timeouts.length; i++){
                    clearTimeout(this.timeouts[i]);
                    this.timeouts.splice([i]);
                }
            }
            //StartIS = function(){alert(123);}
            Start = function(){
                if(this.started) return;

                var This = this;

                var stepTO = 0;
                var currTO = 0;
                var stepActs = 0;

                var paramSubj = this.chainParams;



                Array.prototype.forEach.call(paramSubj.elements, function(e,i){


                        if (typeof paramSubj.actions === 'undefined') return;

                        var currAct = paramSubj.actions[stepActs];

                        This.timeouts.push(
                            setTimeout(
                                function(){currAct(e);}
                                , currTO
                            )
                        );
                        e.innerHTML = currTO;

                        if(i != 0){
                            stepTO++;
                            stepActs++;
                            if (stepTO >= paramSubj.timeouts.length) stepTO = 0;
                            if (stepActs >= paramSubj.actions.length) stepActs = 0;
                        }
                        currTO += paramSubj.timeouts[stepTO];
                    }
                );

                var TOtotal = this.totalDuration;

                var TOFinal = setTimeout(
                    function(){
                        This.ClearTOs();
                        clearTimeout(TOFinal);
                        if(KORTx.Us.Glbl.Cdf(This.finalFunc)){This.finalFunc();}
                        This.started = false;
                    }, TOtotal+200);
                This.started = true;
                return this;
            }

            Finalize = function(finalFunction){
                var This = this;

                if(KORTx.Us.Glbl.Cdf(finalFunction)){
                    This.finalFunc = function(){return finalFunction(This.chainParams.elements);};
                }
                return this;
            }

            Rewind = function(rewAdditionalsFunc){
                if(this.started) return;

                this.ClearTOs();
                this.started = false;

                var paramSubj = this.chainParams;

                var REIS = this.rootElementsInitialStates;
                Array.prototype.forEach.call(paramSubj.elements, function(e,i){
                    REIS[i].ApplyToElement(e);
                });

                if(KORTx.Us.Glbl.Cdf(rewAdditionalsFunc)){rewAdditionalsFunc();}
                return this;
            }
        }

    ,ElementStateContainer: class {
            cssText = "";
            cssClasses = "";
            dataAttrs = [];

            constructor(elem){
                if(!KORTx.Us.Glbl.Cdf(elem)){return;}
                this.cssText = elem.style.cssText;
                this.cssClasses = elem.className;
                this.dataAttrs = KORTx.Us.HtmTgs.getDataAttributes(elem);
            }

            ApplyToElement = function(elem){
                elem.style.cssText = this.cssText;
                elem.className = this.cssClasses;
                Array.prototype.forEach.call(this.dataAttrs, function(val, key) {
                    elem.setAttribute(key, val);
                });
            }
        }

    ,ChainParams : class {
            constructor(timeouts, actions, elements){
                this.elements=elements;

                if (typeof timeouts === 'undefined') timeouts = 0;
                this.timeouts = (Array.isArray(timeouts) && timeouts.length > 0)?timeouts:[timeouts];
                this.actions = (Array.isArray(actions) && actions.length > 0)?actions:[actions];
            }
        }
    }
});