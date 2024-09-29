KORtx.addKORtxPart({
    Us : {
    /*
     KFormFiller is a utility method that helps to distribute values across form elements or HTML blocks
     by key to class or name attribute match.

     3 parameters possible, of these only 2 are necessary:
        targetFormOrParentElement - selector of form or HTML block that has children between which values should be
                                    spreaded;
        jsonFormData - JSON object as key => JSON.stringify(val) means name/class HTML block to get value;
        activatorElementSelector - if passed, click on this element is required to distribute some data.
     */
        KFormFiller : class
        {
            constructor(targetFormOrParentElement, jsonFormData, activatorElementSelector)
            {
                this.formEl = null
                var self_ = this;

                if (typeof targetFormOrParentElement !== 'undefined' && typeof jsonFormData !== 'undefined'){
                    if(typeof targetFormOrParentElement == "object"){
                        self_.formEl = targetFormOrParentElement;
                    } else {
                        self_.formEl = $(targetFormOrParentElement);
                    }

                    if(self_.formEl){
                        if (typeof activatorElementSelector !== 'undefined'){
                            $(activatorElementSelector).on('click', function(event){
                                self_.PlaceData(jsonFormData);
                                event.preventDefault();
                                $('html, body').stop().animate({
                                    scrollTop: $(self_.formEl).offset().top
                                }, 200);
                            })
                        } else {
                            self_.PlaceData(jsonFormData);
                        }
                    }

                }
            }

            PlaceData = function(jsonFormData){
                var self_ = this;
                var inputs = self_.formEl.find('input, textarea, select');
                $(inputs).each(function(k,v){
                    if(jsonFormData.hasOwnProperty($(v).prop('name'))){
                        if(['ínput', 'textarea'].indexOf($(v).prop('tagName').toLowerCase())){
                            if(!$(v).is(':checkbox')){
                                if($(v).is(':file')) {
                                    console.log('WARNING! KFF doesn\'t mess with input-FILE-type!');
                                } else {
                                    $(v).prop('value', (jsonFormData[$(v).prop('name')]!=='')?JSON.parse(jsonFormData[$(v).prop('name')]):'');
                                }
                            } else {
                                if (jsonFormData[$(v).prop('name')] !== '' && JSON.parse(jsonFormData[$(v).prop('name')])==true){
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
                            //$(v).children("option[value=" + jsonFormData[$(v).prop('name')] + "]").first()
                            //    .prop("selected", true);
                            //$(v).prop('value', (jsonFormData[$(v).prop('name')]!=='')?JSON.parse(jsonFormData[$(v).prop('name')]):'');
                        }
                    }
                });

                $.each(jsonFormData, function(key,v){
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
        },

        fillFormDataFromObject(formData, data, parentKey) {
            if (data && typeof data === 'object' && !(data instanceof Date) && !(data instanceof File) && !(data instanceof Blob)) {
                Object.keys(data).forEach(key => {
                    KORtx.Us.fillFormDataFromObject(formData, data[key], parentKey ? `${parentKey}[${key}]` : key);
                });
            } else {
                const value = data == null ? '' : data;
        
                formData.append(parentKey, value);
            }
        }
    }
});
