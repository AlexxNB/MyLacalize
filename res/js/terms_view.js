var termsnum = 0;
var loading = false;
var endlist = false;
var search = '';

$(document).ready(function() {
    $('#doSearch').click(function(){
        search = $('#search').val();
        termsnum = 0;
        endlist = false;
        clearContainer(function(){loadTerms(search)});
    });
    bindEnterKey('#search','#doSearch');

    onScrollEnd(function(){
        loadTerms(search);
    });

    clearContainer(function(){loadTerms(search)});
});

function loadTerms(query){
    query = query || '';

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
            if(termsnum == 0) showToast(resp.error,{type:'error'});
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
            tile.data('tid',term.id);
            input.val(term.name);
            num.text(termsnum);
            cont.append(tile);
            tile.removeClass('hide');
        });
        loading =false;
	});
}

function clearContainer(func){
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
