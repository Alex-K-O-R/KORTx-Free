KORtx.Us = Object.assign((typeof KORtx !== 'undefined' && typeof KORtx.Us !== 'undefined')?KORtx.Us:{},{
    /*
     KFormFiller is a utility method that helps to distribute values across form elements or HTML blocks
     by key to class or name attribute match.

     3 parameters possible, of these only 2 are necessary:
        targetFormOrParentElement - selector of form or HTML block that has children between which values should be
                                    spreaded;
        formData - JSON object as key => JSON.stringify(val) means name/class HTML block to get value;
        activatorElementSelector - if passed, click on this element is required to distribute some data.
     */
    KFormFiller : class
    {
        constructor(targetFormOrParentElement, formData, activatorElementSelector)
        {
            this.formEl = null
            var self_ = this;

            if (typeof targetFormOrParentElement !== 'undefined' && typeof formData !== 'undefined'){
                if(typeof targetFormOrParentElement == "object"){
                    self_.formEl = targetFormOrParentElement;
                } else {
                    self_.formEl = $(targetFormOrParentElement);
                }

                if(self_.formEl){
                    if (typeof activatorElementSelector !== 'undefined'){
                        $(activatorElementSelector).on('click', function(event){
                            self_.PlaceData(formData);
                            event.preventDefault();
                            $('html, body').stop().animate({
                                scrollTop: $(self_.formEl).offset().top
                            }, 200);
                        })
                    } else {
                        self_.PlaceData(formData);
                    }
                }

            }
        }

        PlaceData = function(formData){
            var self_ = this;
            var inputs = self_.formEl.find('input, textarea, select');
            $(inputs).each(function(k,v){
                if(formData.hasOwnProperty($(v).prop('name'))){
                    if(['ínput', 'textarea'].indexOf($(v).prop('tagName').toLowerCase())){
                        if(!$(v).is(':checkbox')){
                            if($(v).is(':file')) {
                                console.log('WARNING! KFF doesn\'t mess with input-FILE-type!');
                            } else {
                                $(v).prop('value', (formData[$(v).prop('name')]!=='')?JSON.parse(formData[$(v).prop('name')]):'');
                            }
                        } else {
                            if (formData[$(v).prop('name')] !== '' && JSON.parse(formData[$(v).prop('name')])==true){
                                $(v).prop('checked', true);
                                $(v).val(true);
                            } else {
                                $(v).prop('checked', false);
                                $(v).val(false);
                            }
                        }
                        $(v).trigger('change');
                    } else {
                        // TODO: select tag?
                        //$(v).children("option[value=" + formData[$(v).prop('name')] + "]").first()
                        //    .prop("selected", true);
                        //$(v).prop('value', (formData[$(v).prop('name')]!=='')?JSON.parse(formData[$(v).prop('name')]):'');
                    }
                }
            });

            $.each(formData, function(key,v){
                var arrayContainerFound = key.endsWith("[]");
                if(arrayContainerFound) key = key.substring(0, key.length-2);
                var elem = self_.formEl.find('div'+(key.startsWith('.')?key:('.'+key)));
                if (elem.length==0 && !arrayContainerFound) elem = $('img'+(key.startsWith('.')?key:('.'+key)));
                if (elem.length==0 && !arrayContainerFound) elem = $('a'+(key.startsWith('.')?key:('.'+key)));
                if(elem.length > 0){
                    if(elem.prop('tagName').toLowerCase()=='div'){
                        var result = [];

                        if(!arrayContainerFound) {
                            if(v!='') v = result.push(JSON.parse(v));
                        } else {
                            result = v;
                        }
                        $(elem).empty();
                        $(result).each(function(index,value){
                            var img = new Image();
                            $(img).attr('src', value);
                            elem.append(img);
                        });
                    } else if(elem.prop('tagName').toLowerCase()=='img'){
                        elem.attr('src', JSON.parse(v));
                    } else if(elem.prop('tagName').toLowerCase()=='a'){
                        elem.attr('href', JSON.parse(v));
                    } else {
                        if(v!==""){
                            elem.text(JSON.parse(v));
                        }
                    }
                }
            });

        }
    }
});
