KORtx = Object.assign((typeof KORtx !== 'undefined')?KORtx:{}, {
    /*
     Function KShowPassword allows you to show/hide passwords in inputs
     by tapping or clicking some activator element.

     Activator element (parameter activatorElementSelector) got to have
     2 children (svg, img) with classes 'show' and 'hide'.

     If no affectedElementsSelector parameter is passed, target input
     has to be inside same parent as trigger icon.
     */
    KShowPassword : class {
        affected = [];

        constructor(activatorElementSelector, affectedElementsSelector){
            var This = this;
            if(typeof affectedElementsSelector === 'undefined'){
                This.affected = $(activatorElementSelector).parent().children('input[type=password]');
            } else {
                This.affected = $(affectedElementsSelector);
            }

            $(activatorElementSelector).on(
                'mouseover', function(){This.show(activatorElementSelector);}
            );
            $(activatorElementSelector).on(
                'click', function(){This.show(activatorElementSelector);}
            );

            $(activatorElementSelector).on(
                'mouseout', function(){This.hide(activatorElementSelector);}
            );
            $(activatorElementSelector).on(
                'blur', function(){This.hide(activatorElementSelector);}
            );
        }

        show = function(activatorElement){
            if(this.affected.length>0){
                $(activatorElement).children('svg.hide, img.hide').css('display', 'none');
                $(activatorElement).children('svg.show, img.show').css('display', 'inline-block');
                this.affected.each(function(i,e){$(e).prop('type', 'text');});
            }
        }

        hide = function(activatorElement){
            if(this.affected.length>0){
                $(activatorElement).children('svg.hide, img.hide').css('display', 'inline-block');
                $(activatorElement).children('svg.show, img.show').css('display', 'none');
                this.affected.each(function(i,e){$(e).prop('type', 'password');});
            }
        }
    }
});