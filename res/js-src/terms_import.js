$(document).ready(function() {
	$('#doImportFile').click(function(){
		doImportFile();
	});

	$('#importfile').on('change', function () {
		var file_data = $(this).prop("files")[0]; 
		var type = file_data.name.match(/.+\.(.+)$/)[1];
		showParsers(type);
	});
});

function showParsers(type){
	$('#unsupported').addClass('hide');
	var checked = getParserSelection();
	var firstMatch = false;
	$('input[name="parser"]').each(function(){
		var parser = $(this).val();
		var container = $('#parser-'+parser);
		var alTypes  = $(this).data('type').split('|');
		var flagUse = false;
		$.each(alTypes,function(i,alType){
			if(alType == type) {
				flagUse = true;
				if(!firstMatch) firstMatch=parser;
				return false;
			}
		});

		if(flagUse) {
			container.show(300);
		}else{
			if(checked==parser) $(this).prop('checked',false);
			container.hide(300);
		}
	});
	if(firstMatch){
		if(!getParserSelection()) $('input[value="'+firstMatch+'"]').prop('checked',true);
		enable('#doImportFile');
	}else{
		$('#unsupported').removeClass('hide');
		showToast($('#unsupported').data('err'),{type:'error',duration:4000});
	}
	
}

function getParserSelection(){
	var parser = $('input[name="parser"]:checked').val();
	if(parser === undefined) return false;
	return parser;
}

function doImportFile(){
	var file_data = $("#importfile").prop("files")[0];   
	var parser = getParserSelection();
	var pid = $('#doImportFile').data('pid');
	if(!parser) return false;
	startLoading('#doImportFile');
	showProgress(function(){
		upload('terms','importfile',file_data,{parser:parser,pid:pid},function(resp){
			if(resp.status == 200){
				locate('/terms/view/'+pid+'/');
			}else{
				hideProgress(function(){
					showToast(resp.error,{type:'error'});
				});
			}
			stopLoading('#doImportFile');
		},function(percent){
			percent=Math.round(percent*100);
			setProgress(percent);
		});
	});
}

function showProgress(func){
	$('#upload-form').slideUp(300,function(){
		$('#upload-progress').fadeIn(300,func);
	});
}

function setProgress(percent){
	$('#upload-progress .progress').val(percent);
	if(percent == 100){
		$('#stage-upload').addClass('hide');
		$('#stage-parsing').removeClass('hide');
	}
}

function hideProgress(func){
	$('#upload-progress').fadeOut(300,function(){
		$('#upload-form').slideDown(300,func);
	});
}

