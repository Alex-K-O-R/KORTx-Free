KORtx.addKORtxPart({
    Us: {
        HtmTgs: {
            getDataAttributes : function(node) {
                var d = [];
                var re_dataAttr = /^data\-(.+)$/;

                Array.prototype.forEach.call(node.attributes, function(attr, index) {
                    if (re_dataAttr.test(attr.nodeName)) {
                        var key = attr.nodeName.match(re_dataAttr)[1];
                        d[key] = attr.nodeValue;
                    }
                });

                return d;
            }

            ,getElementsThatContainClassThatStartsWith : function(classNameBeginingStr, areaOfSearchShrinkSelector){
                var shrinker = '';
                if(typeof areaOfSearchShrinkSelector !== 'undefined') shrinker = areaOfSearchShrinkSelector+' ';
                var candidates = $(shrinker + '*[class*="'+classNameBeginingStr+'"]');
                var result = [];
                for(var i = 0, j = candidates.length; i < j; i++) {
                    if((' ' + $(candidates[i]).attr("class")).indexOf(' ' + classNameBeginingStr) > -1) {
                        result.push(candidates[i]);
                    }
                }
                return result;
            }

            ,getRandomHEXColor : function () {return "#"+((1<<24)*Math.random()|0).toString(16);}
        }
        ,Glbl: {
            Cdf : function(obj){

                if (typeof obj === 'undefined') { return false;}
                return true;
            }
            , Cxs : function(obj){
                if(KORtx.Cdf(obj)){
                    if(Array.isArray(obj) && obj.length>0) {return true;}

                    if(obj !== null) {return true;}
                }
                return false;
            }
            , ToArray(something) {
                if(something) {
                    if(Array.isArray(something)){
                        return something;
                    }
                    if (something.constructor === Object) {
                        return Object.values(obj);
                    } else {
                        var arr = [];
                        arr.push(something);
                        return arr;
                    }
                }
                return null;
            }
        }

    }
});