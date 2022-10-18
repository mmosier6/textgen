function buildPage(page){
	jQuery("#desk").buttonset();
	jQuery("#vrot").buttonset();
	jQuery("#vrot-cont").buttonset();
	jQuery("#stp").buttonset();
	jQuery("#popden").buttonset();
	jQuery("#tds").buttonset();
	jQuery("#spotter").buttonset();
	
	jQuery("#follow-up").buttonset();
	jQuery("#autopop-btn").button().on('click', function(){console.log("auto pop");});
	
	jQuery("#generate-btn").button().on('click', function(){generateText();checkTextArea("textarea-2");});
	
	jQuery("#generate-wsde").button().on('click', function(){getWSDE();});
	
	//Lower minus/plus clicks
	jQuery("#wsde-lower-minus .ui-icon-circle-minus").on('click', function(){
		adjustWSDE('lower', 'down');
	});
	jQuery("#wsde-lower-plus .ui-icon-circle-plus").on('click', function(){
		adjustWSDE('lower', 'up');
	});
	//Upper minus/plus clicks
	jQuery("#wsde-upper-minus .ui-icon-circle-minus").on('click', function(){
		adjustWSDE('upper', 'down');
	});
	jQuery("#wsde-upper-plus .ui-icon-circle-plus").on('click', function(){
		adjustWSDE('upper', 'up');
	});

	jQuery("#generate-text-btn").button().on('click', function(){generateText();checkTextArea("textarea-2");});
	
	jQuery("#textarea-1").bind('input propertychange', function(){
		checkTextArea("textarea-1");
	});
	
	jQuery("#textarea-2").bind('input propertychange', function(){
		checkTextArea("textarea-2");
	});
	
	jQuery("#vrot-dialog").dialog({
		autoOpen: false,
		resizable: false,
		height: 'auto',
		width: 400,
		modal: true,
		buttons: {
			"Dismiss": function(){
				$(this).dialog("close");
			}
		}
	});	
	jQuery("#weaktor-dialog").dialog({
		autoOpen: false,
		resizable: false,
		height: 'auto',
		width: 400,
		modal: true,
		buttons: {
			"Dismiss": function(){
				$(this).dialog("close");
			}
		}
	});
	jQuery("#GR2error-dialog").dialog({
		autoOpen: false,
		resizable: false,
		height: 'auto',
		width: 400,
		modal: true,
		buttons: {
			"Dismiss": function(){
				$(this).dialog("close");
			}
		}
	});
	jQuery("#followup-dialog").dialog({
		autoOpen: false,
		resizable: false,
		height: 'auto',
		width: 400,
		modal: true,
		buttons: {
			"Dismiss": function(){
				$(this).dialog("close");
			}
		}
	});

}

function getOpts(page){
	console.log("Running getOpts");
	page.options = new Object();
	//Allowed url options
	var urlOpts = new Array("debug", "site=", "dt=", "range=", "slat=", "slon=", "srad=");
	//Default page options
	page.options['debug']	= false;
	page.options['site']	= false;
	page.options['dt']		= false;
	page.options['range']	= false;
	page.options['slat']	= false;
	page.options['slon']	= false;
	page.options['srad']	= false;
	page.options['range_before'] = false;
	page.options['range_after']	 = false;
	page.options['highlight_opt']= 'operational';
	
	//Get Url Options
	var optString = location.search.substring(1);
	urlOpts.forEach(function(d, i){
		if(optString.indexOf(d) > -1){
			var a = getUrlVar(d);
			if(d.indexOf("=") > -1){
				page.options[d.slice(0,-1)] = a;
			}else{
				page.options[d] = a;
			}	
		}
	});
	page.debug = page.options['debug'];

}

