KORTx = Object.assign((typeof KORTx !== 'undefined')?KORTx:{}, {
/*
 KAddable is a handy tool that makes possible ease creation of block sets with different input types:
 from a simple ones like single text/image fields to complex forms, description cards, etc...

 Kaddable needs 3 parameters to be passed, but only 1 of them is required:
    blockClassNamePrefix - prefix of class name that indicates the template block of set's element;
                WARNING!!! IT IS A CLASS NAME, NOT SELECTOR !!!
    json_source - JSON array of objects AddableSourceRecord[] which represents the existing set;
    external_add_button_selector - selector for some element that gets Add-via-click functionality.

 Kaddable needs the specific structure of a Work Area:
        <section class="add-area"> <!-- [ add-area ]  is  the SPECIFIC MARKER of the set area for existing and new items -->
                                   <!-- closest parent with [ add-area ] class next to template block is being used -->


            <div class="file_select_result site-video"> <!--  set's template block; use [ blockName ] parameter to indicate template -->


                <input name="site-video-url-{i}" type="text"> <!--  inner part of block with Markers-via-nameOrClass -->
                <input name="site-video-desc-{i}" type="text" hidden="hidden">
                <div class="text">
                    <span></span>
                </div>
                <!-- Everything above is the inner part of the template block with Markers-via-nameOrClass.
                     Input names would be extended automatically with 4 possible suffixes:
                         "-new" for every new element that's being added;
                         "-N" instead of "{i}" for every existing element of a set (see [ json_source ] parameter)
                         "-delete" for every element that's being deleted
                         "-delete-all" when last existing element was deleted
                -->


                <i class="delete-minus"></i> <!-- [ delete-minus ] class is used to SPEC. MARK current item for deletion on server side -->
            </div>
        </section>


 */
    KAddable : class {
        /*
         [ AddableSourceRecord ] is an object of current set that is stored in [ json_source ] parameter
         It has 5 fields:
         .value is either a simple type like string/int/etc  or  an Object with k => v pairs.
         [ k ] is a class/name marker of input for [ v ] value
         ^^^ THIS PART REQUIRES KORTx.KFormFiller() for work
         .hidden cause $.hide() method to be executed for specific input
         .disabled cause 'disabled' class and some properties to be added for specific input
         .class is used to add any class for input
         .order - possible id of record (could be provided from server side)
         */
        AddableSourceRecord = function(recFetchedJSON){
            this.value = recFetchedJSON["value"];
            this.hidden = recFetchedJSON["hidden"];
            this.disabled = recFetchedJSON["disabled"];
            this.class = recFetchedJSON["class"];
            if(typeof recFetchedJSON["order"]!="undefined"){this.order = recFetchedJSON["order"];}
        }

        constructor(blockClassNamePrefix, json_source, external_add_button_selector){
            this.counter = 0;
            this.cloneAble = KORTx.Us.HtmTgs.getElementsThatContainClassThatStartsWith(blockClassNamePrefix, '.add-area');

            if($(this.cloneAble).length){
                this.WorkArea = $(this.cloneAble[0]).parents('.add-area').first();
                this.cloneAble = this.WorkArea.contents().clone();
                // if simple [means 1 input per element] then click on creation
                this.isCloneAbleSimple = (this.cloneAble.find('input, textarea').length==1)?true:false;

                this.cloneAble.hide();
                this.WorkArea.children().remove();
                var _self = this;

                if(typeof external_add_button_selector != "undefined"){
                    $(external_add_button_selector).click(
                        function(){_self.Place(_self);}
                    );
                } else {
                    this.WorkArea.find('.add-plus').first().click(function(){_self.Place(_self);});
                }
            }

            if(typeof json_source!=="undefined" && json_source!=null && json_source.length) {
                $.each(json_source, function(i,e){
                    if(e!=null){
                        var rec = new AddableSourceRecord(e);
                        if(typeof rec["order"]!=="undefined"){
                            _self.Place(_self, rec, rec.order);
                        } else {
                            _self.Place(_self, rec);
                        }
                    }
                });
            }
        }

        Place = function(obj, options, id){
            obj.WorkArea.find("input[name$='-delete-all']").each(function(i,e){e.parentNode.remove();});
            var tmp = obj.cloneAble.clone();
            tmp.show();
            var _self_link = obj;

            if(typeof id === 'undefined') {++_self_link.counter;}
            tmp.find('input').each(function(j, input){
                var result_name = $(input).attr('name').replace('{i}', ((typeof id === 'undefined')?(_self_link.counter)+'-new':id));
                if($(input).is(':file')){
                    tmp.children().each(function(k, img_container){
                        if($(img_container).hasClass($(input).attr('name'))){
                            $(img_container).removeClass($(input).attr('name')).addClass(result_name);
                        }
                    });
                }

                $(input).attr('name', result_name);
                if(typeof options != "undefined" && options != null){
                    if (typeof options.value != "undefined" && options.value!=null) {
                        if(typeof options.value == "object" && typeof KORTx.Us.KFormFiller != "undefined"){
                            new KFormFiller(tmp, options.value);
                        } else {
                            $(input).attr("value", options.value);
                        }
                    }
                    if (typeof options.hidden != "undefined" && options.hidden!=null && options.hidden == true) tmp.hide();
                    if (typeof options.class != "undefined" && options.class!=null) tmp.addClass(options.class);
                    if (typeof options.disabled != "undefined" && options.disabled!=null && options.disabled==true) {
                        tmp.children('.delete-minus').remove();
                        $(input).addClass('disabled');
                        $(input).attr("readonly", true);
                        $(input).attr("title", "Поле не подлежит редактированию.");
                        $(input).click(function(){this.select();});
                        $(input).css("cursor", "crosshair");
                    }
                }

                obj.WorkArea.append(tmp);
                if(obj.isCloneAbleSimple){
                    //tmp.on('click', function(event){event.stopPropagation(); $(this).find('input, textarea').trigger('click');});

                    tmp.click(function (e) {
                        e.stopImmediatePropagation();
                        $(this).find('input, textarea').trigger('click');
                        return false;
                    });

                    tmp.on('click', 'input, textarea', function (e) {
                        e.stopPropagation();
                        return true;
                    });

                    tmp.trigger('click');
                }
            });

            tmp.find('.delete-minus').click(function(e){
                e.stopPropagation();
                if(obj.WorkArea.children().length == 1) {
                    tmp.find('input').each(function(i,e){
                        $(e).attr("name", $(e).attr("name")+'-delete-all');
                        $(e).attr("type", 'hidden');
                        $(e).attr("value", " ");
                        $(e).trigger("change");
                    });
                    tmp.hide();
                } else {
                    tmp.hide();
                    tmp.find('input').each(function(i,e){
                        $(e).attr("name", $(e).attr("name")+'-delete');
                        $(e).trigger("change");
                        $(e).attr("value", " ");
                    });
                }
            });

            return tmp;
        }
    }
});