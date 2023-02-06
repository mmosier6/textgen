function buildPage(page){
	jQuery("#desk").buttonset();
	//jQuery("#vrot").buttonset();
	//jQuery("#vrot-cont").buttonset();
	//jQuery("#stp").buttonset();
	//jQuery("#popden").buttonset();
	//jQuery("#tds").buttonset();
	jQuery("#spotter").buttonset();

	jQuery("#follow-up").buttonset();
	jQuery("#autopop-btn").button().on('click', function(){console.log("auto pop");});

	jQuery("#generate-btn").button().on('click', function(){generateText();});

	jQuery("#generate-wsde").button().on('click', function(){getWSDE();generateText();});

	jQuery('input[type=radio][name=text-version]').on("change", function(){
		console.log("radio button change");
		generateText();
	});

	jQuery('input[type=checkbox][name=cb-1]').buttonset();

	jQuery("#prev").button();
	jQuery("#next").button();
	jQuery("#clear").button();


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

	jQuery("#generate-text-btn").button().on('click', function(){generateText();});


	var c = document.getElementById("canvas-3");
	var ctx = c.getContext("2d");
	var img = new Image();
	img.onload = function(){
		ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, c.width, c.height);
	};
	img.src = "./src/2D_c15plusmin_levels_decision_tree_wind_speeds.png";

	var c2 = document.getElementById("canvas-4");
	var ctx2 = c2.getContext("2d");
	var img2 = new Image();
	img2.onload = function(){
		ctx2.drawImage(img2, 0, 0, img2.width, img2.height, 0, 0, c2.width, c2.height);
	};
	img2.src = "./src/2D_IBW_c15plusmin.png";


	//jQuery("#textarea-3").text("");
	//jQuery("#textarea-4").text("");


	/*
	jQuery("#textarea-1").bind('input propertychange', function(){
		var text1 = jQuery('#text-version-1').prop("checked");
		var text2 = jQuery('#text-version-2').prop("checked");
		if(text1 === true){
			checkTextArea("1");
		}else if(text2 === true){
			checkTextArea("2");
		}

	});
	*/
	//jQuery("#textarea-2").bind('input propertychange', function(){
	//	checkTextArea("2");
	//});

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
