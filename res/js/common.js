$(document).ready(function() {
    var ddTimer;
    $('.overdown').mouseenter(function(){
        clearTimeout(ddTimer);
        $(this).addClass('active');
    });	

    $('.overdown').mouseleave(function(){
        ddTimer = setTimeout(function(e){
            e.removeClass('active');
        },200,$(this));
    });
});

function getJSON(group,command,data,func){
    $.getJSON('/api/'+group+'/'+command+'/',data)
        .done(func)
        .fail(function( jqxhr, textStatus, error ) {
            console.log( "Request Failed: " + err );
        });
}


function setInpError(e,text){
    $(e).addClass('is-error').after('<p class="form-input-hint inpError">'+text+'</p>');
}

function clearInpError(){
    $('.inpError').remove();
	$('.is-error').removeClass('is-error');
}

function bindEnterKey($keypressed,$to_click){
    $($keypressed).keypress(function(e){
        if(e.keyCode==13){
            $($to_click).click();
        }
    });
}

function exists($id){
    if($($id).length > 0)
        return true;
    else
        return false;
}

function startLoading($id){
    $($id).addClass('loading');
}

function stopLoading($id){
    $($id).removeClass('loading');
}

function disable($id){
    $($id).attr('disabled','disabled');
}

function enable($id){
    $($id).removeAttr('disabled');
}