/*
    KFollower is a service that provides type repeat for group of inputs placed in area with [ scn ] (Scene) selector.
    Elements with class follower-[name_of_input] will repeat master's content symultaneously.
 */
KORTx = Object.assign((typeof KORTx !== 'undefined')?KORTx:{}, {
    KFollowers : function (scn){
        if(typeof scn==='undefined'){
            return;
        }var s_=this;this.cdn='follower-';this.W=$(scn);this.Ps=[];var P=function (sjs, ws){this.ss=sjs;this.fs=ws;}
        var fsa=function(){if(s_.W.length<1)return null;for (var i=0;i<s_.W.length;i++){var af=[];var cs=$(s_.W[i]).find('[class^="'+s_.cdn+'"]');var sjs=[];for(var j=0;j<cs.length;j++){var clss=cs[j].className.split(' ').filter(function(e){if(e.indexOf(s_.cdn)==0)return e;});clss=clss[0].substring(s_.cdn.length);sjs=$(s_.W[i]).find('[name="'+clss+'"]');if(sjs.length > 0 && af.indexOf(clss)==-1){s_.Ps.push(new P(sjs,$(s_.W[i]).find('[class="'+s_.cdn+clss+'"]')));af.push(clss);}}}}/*Made by Alex_K aka Alex-K-O-R*/
        fsa();var ffs=function(){if(s_.Ps.length<1)return null;for (var i=0;i<s_.Ps.length;i++){s_.Ps[i].fs.each(function(k,e){$(e).on('change',function (ev){if(typeof $(ev.target).val()!="undefined" && $(ev.target).val()!=''){$(ev.target).addClass('blocked');$(ev.target).removeClass('following');}else{$(ev.target).removeClass('blocked');$(ev.target).removeClass('following');}})});var secret_code='09.01.1990';s_.Ps[i].ss.each(function(k,e){var fs=s_.Ps[i].fs;$(e).on('keyup change',function(ev){fs.each(function(z,f){if(!$(f).hasClass('blocked')){$(f).val($(ev.target).val());$(f).addClass('following');}if(typeof $(ev.target).val()=="undefined"||$(ev.target).val()==''){$(f).removeClass('following');}});})});}}
        ffs();}
});