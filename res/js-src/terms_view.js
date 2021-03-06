var termsnum = 0;
var loading = false;
var endlist = false;
var query = '';

$(document).ready(function() {
    $('#doSearch').click(function(){
        query = $('#search').val();
        clearContainer(function(){loadTerms()});
    });
    bindEnterKey('#search','#doSearch');

    $('#doAddTerm').click(function(){
        doAddTerm();
    });
    bindEnterKey('#newTermName','#confirmAdd');

    $('#doDeleteSelected').click(function(){
        doDeleteSelected();
    });

    onScrollEnd(function(){
        loadTerms();
    });

    clearContainer(function(){loadTerms()});

    if(getURL(4) == 'add'){
        doAddTerm();
    }  
});

function loadTerms(){
    if(loading || endlist) return false;

    var cont = $('#term-container');
    var pid = cont.data('pid');

    var listpart = $('<div>');
    startLoading(listpart);
    cont.append(listpart);

    loading = true;
    getJSON('terms','load',{query:query,num:termsnum,pid:pid},function(resp) {
        stopLoading(listpart);
		if(resp.status != 200){
            if(termsnum == 0) {
                showToast(resp.error,{type:'error'});
                showEmpty();
            }
            endlist=true;
            loading=false;
            return false;
        }
        var list = resp.data;
        if(!$.isArray(list)) return false;
        if(list.length == 0 && termsnum == 0){
            showEmpty();
            return true;
        }

        var cont = $('#term-container');
        $.each(list,function(k,term){
            termsnum++;
            var tile = $('#tile-sample').clone();
            var input = tile.find(".term-input");
            var num = tile.find(".term-num");
            var delBut = tile.find(".doDeleteTerm");
            var check = tile.find('.term-check');
            tile.prop('id','tid-'+term.id);
            num.text(termsnum);
            cont.append(tile);
            tile.removeClass('hide');

            input.val(term.name);
            input.prop('tabindex',termsnum);
            var inVal = term.name;
            input.focusin(function(){
                inVal = $(this).val();
            });
            input.focusout(function(){
                var outVal = $(this).val();
                if(inVal == outVal) return false;
                saveTerm(term.id,pid,outVal,inVal);
            });

            delBut.click(function(){
                doDeleteTerm(term.id,pid)
            });

            check.data('tid',term.id);
            check.change(function(){
                toggleDelButton();
            });
        });
        loading = false;
	});
}

function saveTerm(tid,pid,newVal,oldVal){
    var cont = $('#term-container');
    var loading = $('#tid-'+tid).find('.loading');
   
    loading.removeClass('hide');
    getJSON('terms','save',{tid:tid,value:newVal,pid:pid},function(resp) {
        loading.addClass('hide');
        if(resp.status == 200){
            showToast(resp.data,{type:'success'});
        }else{
            showToast(resp.error,{type:'error'});
            $('#tid-'+tid).find('.term-input').val(oldVal);
        }
    });  
}

function clearContainer(func){
    termsnum = 0;
    endlist = false;
    var cont = $('#term-container');
    cont.slideUp(function(){
        cont.html('');
        cont.show(1);
        func();
    });
}

function showEmpty(){
    var empty = $('#empty-terms').clone();
    var cont = $('#term-container');
    cont.append(empty);
    empty.slideDown();
}

function doDeleteTerm(tid,pid){
	var button = $('#confirmDelete');
	var modal = $('#modal-delete');

	modal.addClass('active');
	
	button.off();
	button.click(function(){
		startLoading(button);
		getJSON('terms','delete',{pid:pid,tid:tid},function(resp) {
			if(resp.status == 200){
				removeFromList(tid);
				showToast(resp.data,{type:'success'});
			}else{
				showToast(button.data('err'),{type:'error'});
			}
			stopLoading(button);
			modal.removeClass('active');
		});
	});
}

function removeFromList(tid){
    var tile = $("#tid-"+tid);
    termsnum--;
	tile.slideUp(500,function(){
        tile.remove();
        if(termsnum == 0){
            clearContainer(function(){showEmpty()});
        }else{
            var i = 1;
            $('.term-num').each(function(){
                $(this).text(i);
                i++;
            });

            if(termsnum < 20){loadTerms();}
        }
    });
}

function doAddTerm(){
	var button = $('#confirmAdd');
	var modal = $('#modal-add');
    var input = $('#newTermName');
    var pid = $('#term-container').data('pid');

    modal.addClass('active');
    input.val('');
    input.focus();

    button.off();
	button.click(function(){
        startLoading(button);
        var name = input.val();
		getJSON('terms','add',{pid:pid,name:name},function(resp) {
			if(resp.status == 200){
                showToast(resp.data,{type:'success'});
                query = name;
                $('#search').val(query);
                clearContainer(function(){loadTerms()});
			}else{
				showToast(resp.error,{type:'error'});
			}
			stopLoading(button);
			modal.removeClass('active');
		});
    });
}

function toggleDelButton(){
    var button = $('#doDeleteSelected');
    if($(".term-check:checked").length > 0)  
        button.fadeIn(400);
    else
        button.fadeOut(400);
}

function doDeleteSelected(){
    var checked = $(".term-check:checked");
    if(checked.length == 0) return false;

	var button = $('#confirmDeleteSelected');
	var delButton = $('#doDeleteSelected');
    var modal = $('#modal-delete-selected');
    var pid = $('#term-container').data('pid');
    var list = [];

    checked.each(function(){
        list.push($(this).data('tid'));
    });

	modal.addClass('active');
	
	button.off();
	button.click(function(){
		startLoading(button);
		getJSON('terms','deleteselected',{pid:pid,list:JSON.stringify(list)},function(resp) {
			if(resp.status == 200){
                $.each(list,function(k,tid){
                    removeFromList(tid);
                });
				
				showToast(resp.data,{type:'success'});
			}else{
				showToast(button.data('err'),{type:'error'});
			}
            stopLoading(button);
            delButton.fadeOut(400);
			modal.removeClass('active');
		});
	});
}
