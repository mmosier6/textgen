function generateText(){
	jQuery("#textarea-1").val("");
	jQuery("#textarea-2").val("");
	
	var desk		= jQuery("input[name=desks]:checked").val();
	var vrot 		= jQuery("input[name=vrots]:checked").val();
	var vrotcon = jQuery("input[name=vrot-conts]:checked").val();
	var stp 		= jQuery("input[name=stps]:checked").val();
	var popden 	= jQuery("input[name=popdens]:checked").val();
	var tds 		= jQuery("input[name=tdss]:checked").val();
	var follow 	= jQuery("input[name=followup]:checked").val();
	if(tds !== 'yes'){
		jQuery("#vrot-dialog").dialog("open");
	}
	var st = '';
	st = st + 'vrot = ' + vrot + '\n';
	st = st + 'stp = ' + stp + '\n';
	st = st + 'popden = ' + popden + '\n';
	st = st + 'tds = ' + tds + '\n';
	
	var level = getLevel(vrot, stp, popden, tds);

	if(level == '1-2' || level == '1-1'){
		jQuery("#weaktor-dialog").dialog("open");
	}
	var text = getText(level, vrot, vrotcon, stp, popden, tds);
	//Create box on ef-scale based on WSDE range
	var v = text['WSDE'].split(" ");
	var s = v[0];
	var e = v[2];
	createEFBox(s,e);
	//var wsde = getWSDE(level, vrotcon);				
	//var efRange = getEFRange(level, vrotcon);	
	//st = st + 'wsde = ' + wsde + "\n";
	
	//var vrotText = convert2Text('vrot', vrot);
	//var stpText = convert2Text('stp', stp);
	//var risk = '';
	console.log("Desk: " + desk);
	var radarSite = '[RADAR_ID]';
	var radarTilt = '[RADAR_TILT]';
	var radarTime = '[RADAR_UTC_TIME]';
	var srh = "[SRH]";
	var mlcape = "[MLCAPE]";
	readGR2Info(desk).done(function(info){
		console.log(info);
		if(info.hasOwnProperty('radar')){radarSite = 'K'+info['radar'];}
		if(info.hasOwnProperty('tilt')){radarTilt = info['tilt'];}
		if(info.hasOwnProperty('time')){radarTime = info['time'] + 'Z';}
		if(info.hasOwnProperty('srh01')){srh = info['srh01'];}
		if(info.hasOwnProperty('mlcape')){mlcape = info['mlcape'];}
	}).fail(function(info){
		//console.log(info);
		//jQuery("#GR2error-dialog").dialog("open");
		radarSite = '[RADAR_ID]';
		radarTilt = '[RADAR_TILT]';
		radarTime = '[RADAR_UTC_TIME]';
		srh = "[SRH]";
		mlcape = "[MLCAPE]";
	
	}).always(function(){
	
		var modeDescriptor = text['MODE_DESCRIPTOR'];
		if(modeDescriptor == ''){
			modeDescriptor = '[MODE_DESCRIPTOR]';	
		}
		var convectiveMode = text['CONVECTIVE_MODE']; 
		if(convectiveMode == ''){
			convectiveMode = '[CONVECTIVE_MODE]';
		}
	
		var geographicLocation = '[GEOGRAPHIC LOCATION]';
	
		//Create Summary Text
		var summaryTxt = 'SUMMARY\n';
		summaryTxt = summaryTxt + 'Based on recent radar and environmental data, ' + text['INTENSITY_DESCRIPTOR'] + ' tornado';
		summaryTxt = summaryTxt + ' with potential peak winds of ' + text['WSDE']  + ' (' + text['EF_RANGE'] + ') is ' + text['CONFIDENCE_A'] + '.';
		summaryTxt = summaryTxt + text['RARE_EVENT'];
		summaryTxt = summaryTxt + '\n\n';
	
		//Create Discussion Text
		//Version 1
		var txtv1 = 'DISCUSSION\n';
		txtv1 = txtv1 + 'Recent radar signatures from ' + radarSite + ' as of ' + radarTime + ' reveal ' + modeDescriptor + ' ' + convectiveMode;
		txtv1 = txtv1 + ' characterized by a ' + radarTilt + ' degree rotational velocity ' + text['VROT'] + '.'; 			
	
		//Version 2
		var txtv2 = 'DISCUSSION\n';
		txtv2 = txtv2 + modeDescriptor.charAt(0).toUpperCase() + modeDescriptor.slice(1)  + ' ' + convectiveMode;
		txtv2 = txtv2 + " will continue to move through a favorable environment over " + geographicLocation;
		txtv2 = txtv2 + ", characterized by 0-1 km SRH around " + srh + " m2/s2";
		txtv2 = txtv2 + " and MLCAPE near " + mlcape + " J/kg per latest mesoanalysis data. ";  
		txtv2 = txtv2 + 'Recent radar signatures from ' + radarSite + ' as of ' + radarTime + ' reveal ' + modeDescriptor + ' ' + convectiveMode;
		txtv2 = txtv2 + ' characterized by a ' + radarTilt + ' degree rotational velocity ' + text['VROT'] + '.'; 			

		//End Text
		var txt3 = '';
		if(tds === 'yes'){
			txt3 = txt3 + ' A tornadic debris signature has also been noted on recent radar scans.';	
		}
		txt3 = txt3 + ' These signatures are occurring in an environment characterized by STP ' + text['STP'] + '.';
		txt3 = txt3 + ' Previous signatures within similar environments produced tornado-damage-estimated wind speeds from ' + text['WSDE'];
		
		if(text['CONFIDENCE_IS_HIGH'] !== ''){
			txt3 = txt3 + ' and' + text['CONFIDENCE_IS_HIGH'] + ' for ' + text['TOR_STRENGTH_TEXT'] + ' tornado.'
			txt3 = txt3 + ' A ' + text['TRACK_LENGTH'] + 'tornado' + text['RISK'] + ' is ';
			txt3 = txt3 + text['TRACK_CONFIDENCE'] + ' based on the rotational velocity duration ';
			txt3 = txt3 + 'and the storm moving within a favorable downstream environment.';  	
		}else{
			txt3 = txt3 + ".";
			txt3 = txt3 + ' A ' + text['TRACK_LENGTH'] + 'tornado' + text['RISK'] + ' ';
			txt3 = txt3 + text['TRACK_CONFIDENCE'] + ' based on the rotational velocity duration ';
			txt3 = txt3 + 'and the storm moving within a favorable downstream environment.';  
		}
		txt3 = txt3 + '\n\n' + getExceedenceProbText(level); 
		txt3 = txt3 + '\n\n' + level;
	
		//Follow-up text
		var summaryTxt2 = 'SUMMARY\n';
		summaryTxt2 = summaryTxt2 + 'Based on recent radar data, the ' + convectiveMode + ' discussed in [MCD_NUM] has continued to intensify and ';
		summaryTxt2 = summaryTxt2 +  text['INTENSITY_DESCRIPTOR'] + ' tornado';
		summaryTxt2 = summaryTxt2 + ' with potential peak winds of ' + text['WSDE']  + ' (' + text['EF_RANGE'] + ') is now ' + text['CONFIDENCE_A'] + '.';	
		summaryTxt2 = summaryTxt2 + '\n\n';

		//var txtv4 = 'DISCUSSION\n';
		//txtv4 = txtv4 + 'Recent radar signatures from ' + radarSite + ' as of ' + radarTime + ' reveal ' + modeDescriptor + ' ' + convectiveMode;
		//txtv4 = txtv4 + ' characterized by a ' + radarTilt + ' degree rotational velocity ' + text['VROT'] + '.';
		
		var text1 = jQuery('#text-version-1').prop("checked");
		var text2 = jQuery('#text-version-2').prop("checked");
					
		if(follow == 'yes'){
			if(text1 === true){
				jQuery("#textarea-1").val(summaryTxt2 + txtv1 + txt3);
				checkTextArea("1", summaryTxt2 + txtv1 + txt3);
			}else if(text2 === true){	
				jQuery("#textarea-1").val(summaryTxt2 + txtv2 + txt3);
				checkTextArea("2", summaryTxt2 + txtv2 + txt3);
			}	
		}else{
			if(text1 === true){
				jQuery("#textarea-1").val(summaryTxt + txtv1 + txt3);
				checkTextArea("1", summaryTxt + txtv1 + txt3)
			}else if(text2 == true){	
				jQuery("#textarea-1").val(summaryTxt + txtv2 + txt3);
				checkTextArea("2", summaryTxt + txtv2 + txt3);
			}	
		}	
	});		
}

function getWSDE(){
	var vrot 		= jQuery("input[name=vrots]:checked").val();
	var vrotcon = jQuery("input[name=vrot-conts]:checked").val();
	var stp 		= jQuery("input[name=stps]:checked").val();
	var popden 	= jQuery("input[name=popdens]:checked").val();
	var tds 		= jQuery("input[name=tdss]:checked").val();
	var follow 	= jQuery("input[name=followup]:checked").val();
	
	var st = '';
	st = st + 'vrot = ' + vrot + '\n';
	st = st + 'stp = ' + stp + '\n';
	st = st + 'popden = ' + popden + '\n';
	st = st + 'tds = ' + tds + '\n';
	
	var level = getLevel(vrot, stp, popden, tds);
	var wsde = new Array();
	
	if(level === '5-1'){
		if(vrotcon === '6+'){
			text['WSDE'] = '190 to 205 mph';
			wsde[0] = 190;
			wsde[1] = 205;
		}else	if(vrotcon === '3-5'){
			text['WSDE'] = '175 to 205 mph';
			wsde[0] = 175;
			wsde[1] = 205;
		}else{
			text['WSDE'] = '145 to 190 mph';
			wsde[0] = 145;
			wsde[1] = 190;		
		}
	}else if(level === '4-1'){
		if(vrotcon === '6+'){
			text['WSDE'] = '170 to 205 mph';
			wsde[0] = 170;
			wsde[1] = 205;		
		}else if(vrotcon === '3-5'){ 
			text['WSDE'] = '140 to 190 mph';
			wsde[0] = 140;
			wsde[1] = 190;				
		}else{
			text['WSDE'] = '120 to 170 mph';
			wsde[0] = 120;
			wsde[1] = 170;				
		}			
	}else if(level === '3-1'){
		if(vrotcon === '6+'){
			text['WSDE'] = '140 to 190 mph';
			wsde[0] = 140;
			wsde[1] = 190;								
		}else if(vrotcon === '3-5'){
			text['WSDE'] = '130 to 180 mph';
			wsde[0] = 130;
			wsde[1] = 180;					
		}else{
			text['WSDE'] = '120 to 165 mph';
			wsde[0] = 120 ;
			wsde[1] = 165;		
		}			
	}else if(level === '3-2'){
		if(vrotcon === '6+'){
			text['WSDE'] = '120 to 170 mph';
			wsde[0] = 120 ;
			wsde[1] = 170;		
		}else if(vrotcon === '3-5'){
			text['WSDE'] = '115 to 165 mph';
			wsde[0] = 115;
			wsde[1] = 165;			
		}else{
			text['WSDE'] = '115 to 155 mph';
			wsde[0] = 115;
			wsde[1] = 155;		
		}			
	}else if((level === '2-1') || (level === '2-2') || (level === '2-3')){
		if(vrotcon === '6+'){
			text['WSDE'] = '110 to 145 mph';			
			wsde[0] = 110;
			wsde[1] = 145;		
		}else if(vrotcon === '3-5'){
			text['WSDE'] = '100 to 145 mph';
			wsde[0] = 100;
			wsde[1] = 145;		
		}else{
			text['WSDE'] = '90 to 135 mph';
			wsde[0] = 90;
			wsde[1] = 135;		
		}
	}else if((level === '1-1') || (level === '1-2')){
		if(vrotcon === '6+'){
			text['WSDE'] = '90 to 120 mph';
			wsde[0] = 90;
			wsde[1] = 120;		
		}else if(vrotcon === '3-5'){
			text['WSDE'] = '80 to 115 mph';
			wsde[0] = 80;
			wsde[1] = 115;		
		}else{
			text['WSDE'] = '70 to 110 mph';
			wsde[0] = 70;
			wsde[1] = 110;		
		}
	}
	
	jQuery("#textarea-1").val("");
	jQuery("#textarea-2").val("");

	var lower = wsde[0];
	var upper = wsde[1];
	jQuery("#wsde-lower").empty();
	jQuery("#wsde-lower").text(lower);
	jQuery("#wsde-upper").empty();
	jQuery("#wsde-upper").text(upper);
	createEFBox(lower,upper);
	colorCodeWSDE(lower, upper);
}	

function getLevel(vrot, stp, popden){
	//"Level" decision tree
	if(vrot === 'gt70'){
		if(stp === 'gt6'){
			if(popden === 'ge20'){
				return '5-1';
			}	
			if(popden === 'lt20'){
				return '4-1';
			}
		}else if(stp === 'lt1'){
			return '2-2';
		}else{
			return '3-1';
		}	
	}else if(vrot === '61-70' || vrot === '51-60'){
		if(stp === 'gt6' || stp === '5-6' || stp === '4-5' || stp === '3-4'){
			return '3-2';
		}else if (stp === 'lt1'){
			return '2-2';
		}else{
			return '2-3';
		}
	}else if(vrot === '41-50'){
		if(stp === 'gt6' || stp === '5-6' || stp === '4-5' || stp === '3-4'){
			return '2-1';
		}else if(stp === 'lt1'){
			return '2-2';
		}else{
			return '2-3';
		}
	}else if(vrot === '25-40'){
		if(stp === 'gt6' || stp === '5-6' || stp === '4-5' || stp === '3-4'){
			return '2-1';
		}else if(stp === 'lt1'){
			return '1-2';
		}else{
			return '2-3';
		}
	}else if(vrot === 'lt25'){
		return '1-1';
	}else{
		return '???';
	}
}

function getText(level, vrot, vrotcon, stp, popden, tds){
	//Initialize object
	var text = new Object();
	
	//Object keys
	var keys = new Array(
		"INTENSITY_DESCRIPTOR", "WSDE", "EF_RANGE", "CONFIDENCE_A", "RARE_EVENT", "MODE_DESCRIPTOR", "CONVECTIVE_MODE",
		"VROT", "TDS", "STP", "CONFIDENCE_IS_HIGH", "TOR_STRENGTH_TEXT", "TRACK_LENGTH", "RISK", "TRACK_CONFIDENCE");
	for(var i in keys){
		text[keys[i]] = "";
	}	
		
	text['VROT'] = convert2Text('vrot', vrot);
	if(tds === 'yes'){
		text['TDS'] = ' A tornadic debris signature has also been noted on recent radar scans.';	
	}else{			
		text['TDS'] = '';
	}
	text['CONFIDENCE_IS_HIGH'] = '';
	text['STP'] = convert2Text('stp', stp);
	text['RISK'] = '';
	text['CONFIDENCE_A'] = 'possible';
	text['TRACK_CONFIDENCE'] = '';
	text['RARE_EVENT'] = '';
	if(level === '5-1'){
		text['CONFIDENCE_A'] = 'likely ongoing';
		text['CONFIDENCE_IS_HIGH'] = ' confidence is high';
		text['MODE_DESCRIPTOR'] = 'an intense';
		text['CONVECTIVE_MODE'] = 'supercell';
		if(vrotcon === '6+'){
			text['INTENSITY_DESCRIPTOR'] = "a violent";
			text['TOR_STRENGTH_TEXT'] = 'a likely violent';
			text['WSDE'] = '190 to 205 mph';
			text['EF_RANGE'] = 'EF4-EF5';			
			text['TRACK_LENGTH'] = 'long-track ';
			text['TRACK_CONFIDENCE'] = 'expected to continue';
			text['RARE_EVENT'] = ' THIS IS AN EXCEPTIONALLY RARE EVENT.';						
		}else	if(vrotcon === '3-5'){
			text['INTENSITY_DESCRIPTOR'] = "a violent";
			text['TOR_STRENGTH_TEXT'] = 'a likely violent';
			text['WSDE'] = '175 to 205 mph';
			text['EF_RANGE'] = 'EF4-EF5';
			text['TRACK_LENGTH'] = 'long-track ';
			text['TRACK_CONFIDENCE'] = 'expected to continue';
			text['RARE_EVENT'] = ' THIS IS AN EXCEPTIONALLY RARE EVENT.';		
		}else{
			text['INTENSITY_DESCRIPTOR'] = "an intense to potentially violent";
			text['TOR_STRENGTH_TEXT'] = 'an intense to potentially violent';
			text['WSDE'] = '145 to 190 mph';
			text['EF_RANGE'] = 'EF3-EF4';
			text['TRACK_LENGTH'] = 'longer-track ';
			text['TRACK_CONFIDENCE'] = 'ongoing and may continue';	
		}
	}else if(level === '4-1'){
		text['CONFIDENCE_A'] = 'likely ongoing';
		text['CONFIDENCE_IS_HIGH'] = ' confidence is high';
		text['MODE_DESCRIPTOR'] = 'an intense';
		text['CONVECTIVE_MODE'] = 'supercell';
		if(vrotcon === '6+'){
			text['INTENSITY_DESCRIPTOR'] = 'a violent';
			text['TOR_STRENGTH_TEXT'] = 'a likely violent';
			text['WSDE'] = '170 to 205 mph';
			text['EF_RANGE'] = 'EF4-EF5';		
			text['TRACK_LENGTH'] = 'long-track ';
			text['TRACK_CONFIDENCE'] = 'expected to continue';
			text['RARE_EVENT'] = ' THIS IS AN EXCEPTIONALLY RARE EVENT.';				
		}else if(vrotcon === '3-5'){ 
			text['INTENSITY_DESCRIPTOR'] = 'an intense to potentially violent';
			text['TOR_STRENGTH_TEXT'] = text['INTENSITY_DESCRIPTOR'];
			text['WSDE'] = '140 to 190 mph';
			text['EF_RANGE'] = 'EF3-EF4';
			text['TRACK_LENGTH'] = 'long-track ';
			text['TRACK_CONFIDENCE'] = 'expected to continue';	
		}else{
			text['INTENSITY_DESCRIPTOR'] = 'a strong to potentially violent';
			text['TOR_STRENGTH_TEXT'] = text['INTENSITY_DESCRIPTOR'];
			text['WSDE'] = '120 to 170 mph';
			text['EF_RANGE'] = 'EF2-EF4';
			text['TRACK_LENGTH'] = 'longer-track ';
			text['TRACK_CONFIDENCE'] = 'ongoing and may continue';	
		}			
	}else if(level === '3-1'){
		text['CONFIDENCE_A'] = 'likely ongoing';
		text['CONFIDENCE_IS_HIGH'] = ' confidence is high';
		text['MODE_DESCRIPTOR'] = 'an intense';
		text['CONVECTIVE_MODE'] = 'supercell';
		if(vrotcon === '6+'){
			text['INTENSITY_DESCRIPTOR'] = 'an intense to potentially violent';
			text['TOR_STRENGTH_TEXT'] = text['INTENSITY_DESCRIPTOR'];
			text['WSDE'] = '140 to 190 mph';
			text['EF_RANGE'] = 'EF3-EF4';
			text['TRACK_LENGTH'] = 'long-track ';
			text['TRACK_CONFIDENCE'] = 'expected to continue';	
			
		}else if(vrotcon === '3-5'){
			text['INTENSITY_DESCRIPTOR'] = 'a strong to potentially violent';
			text['TOR_STRENGTH_TEXT'] = text['INTENSITY_DESCRIPTOR'];
			text['WSDE'] = '130 to 180 mph';
			text['EF_RANGE'] = 'EF2-EF4';
			text['TRACK_LENGTH'] = 'long-track ';
			text['TRACK_CONFIDENCE'] = 'expected to continue';	
		}else{
			text['INTENSITY_DESCRIPTOR'] = 'a strong to intense';
			text['TOR_STRENGTH_TEXT'] = text['INTENSITY_DESCRIPTOR'];
			text['WSDE'] = '120 to 165 mph';
			text['EF_RANGE'] = 'EF2-EF3';
			text['TRACK_LENGTH'] = 'longer-track ';
			text['TRACK_CONFIDENCE'] = 'ongoing and may continue';	
		}			
	}else if(level === '3-2'){
		text['CONFIDENCE_A'] = 'likely ongoing';
		text['CONFIDENCE_IS_HIGH'] = ' confidence is high';
		text['MODE_DESCRIPTOR'] = 'an intense';
		text['CONVECTIVE_MODE'] = 'supercell';
		if(vrotcon === '6+'){
			text['INTENSITY_DESCRIPTOR'] = 'a strong to potentially violent';
			text['TOR_STRENGTH_TEXT'] = text['INTENSITY_DESCRIPTOR'];
			text['WSDE'] = '120 to 170 mph';
			text['EF_RANGE'] = 'EF2-EF4';
			text['TRACK_LENGTH'] = 'potential long-track ';
			text['TRACK_CONFIDENCE'] = 'ongoing and may continue';	
		}else if(vrotcon === '3-5'){
			text['INTENSITY_DESCRIPTOR'] = 'a strong to intense';
			text['TOR_STRENGTH_TEXT'] = 'likely strong to intense';
			text['WSDE'] = '115 to 165 mph';
			text['EF_RANGE'] = 'EF2-EF3';
			text['TRACK_LENGTH'] = 'longer-track ';
			text['TRACK_CONFIDENCE'] = 'ongoing and may continue';
		}else{
			text['INTENSITY_DESCRIPTOR'] = 'a strong to potentially intense';
			text['TOR_STRENGTH_TEXT'] = 'likely strong to potentially intense';
			text['WSDE'] = '115 to 155 mph';
			text['EF_RANGE'] = 'EF2-EF3';
			text['TRACK_LENGTH'] = '';
			text['TRACK_CONFIDENCE'] = 'ongoing and may continue';	
		}			
	}else if((level === '2-1') || (level === '2-2') || (level === '2-3')){
		text['CONFIDENCE_A'] = 'likely ongoing';
		text['CONFIDENCE_IS_HIGH'] = ' confidence is high';
		text['MODE_DESCRIPTOR'] = 'a strong';
		text['CONVECTIVE_MODE'] = 'supercell';
		if(vrotcon === '6+'){
			text['INTENSITY_DESCRIPTOR'] = 'a strong';
			text['TOR_STRENGTH_TEXT'] = 'a likely strong';
			text['WSDE'] = '110 to 145 mph';
			text['EF_RANGE'] = 'EF1-EF3';
			text['TRACK_LENGTH'] = 'longer-track ';
			text['TRACK_CONFIDENCE'] = 'ongoing and may continue';	
			
		}else if(vrotcon === '3-5'){
			text['INTENSITY_DESCRIPTOR'] = 'a potentially strong';
			text['TOR_STRENGTH_TEXT'] = 'a possibly strong';
			text['WSDE'] = '100 to 145 mph';
			text['EF_RANGE'] = 'EF1-EF3';
			text['CONFIDENCE_IS_HIGH'] = '';
			text['TRACK_LENGTH'] = '';
			text['RISK'] = ' risk';
			text['TRACK_CONFIDENCE'] = 'continues with this storm';	
		}else{
			text['INTENSITY_DESCRIPTOR'] = 'a potentially strong';
			text['TOR_STRENGTH_TEXT'] = 'a possibly strong';
			text['WSDE'] = '90 to 135 mph';
			text['EF_RANGE'] = 'EF1-EF2';
			text['CONFIDENCE_IS_HIGH'] = '';
			text['TRACK_LENGTH'] = '';
			text['RISK'] = ' risk';
			text['TRACK_CONFIDENCE'] = 'continues with this storm';	
		}
	}else if((level === '1-1') || (level === '1-2')){
		text['CONFIDENCE_A'] = 'possible';
		text['CONFIDENCE_IS_HIGH'] = '';
		text['MODE_DESCRIPTOR'] = 'a';
		text['CONVECTIVE_MODE'] = '[supercell/QLCS]';
		text['TRACK_LENGTH'] = '';
		text['RISK'] = ' risk';
		text['TRACK_CONFIDENCE'] = 'continues with this storm';	
		if(vrotcon === '6+'){
			text['INTENSITY_DESCRIPTOR'] = 'a';
			text['TOR_STRENGTH_TEXT'] = 'a';
			text['WSDE'] = '90 to 120 mph';
			text['EF_RANGE'] = 'EF1-EF2';
		}else if(vrotcon === '3-5'){
			text['INTENSITY_DESCRIPTOR'] = 'a';
			text['TOR_STRENGTH_TEXT'] = 'a';
			text['WSDE'] = '80 to 115 mph';
			text['EF_RANGE'] = 'EF0-EF2';
		}else{
			text['INTENSITY_DESCRIPTOR'] = 'a';
			text['TOR_STRENGTH_TEXT'] = 'a';
			text['WSDE'] = '70 to 110 mph';
			text['EF_RANGE'] = 'EF0-EF1';
		}
	}
	
	
	var lower = jQuery("#wsde-lower").text();
	var upper = jQuery("#wsde-upper").text();

	if((upper === 'N/A') || (lower === 'N/A')){
		var a = text['WSDE'].split(" ");
		lower = a[0];
		jQuery("#wsde-lower").empty();
		jQuery("#wsde-lower").text(lower);
		upper = a[2];
		jQuery("#wsde-upper").empty();
		jQuery("#wsde-upper").text(upper);
		colorCodeWSDE(a[0], a[2]);	 
	}else if((upper === '') || (lower === '')){
		
	}else{
		text['WSDE'] = lower + ' to ' + upper + ' mph';
		efs = new Array();
		efs[0] = windSpeed2EF(lower);
		efs[1] = windSpeed2EF(upper);
		text['EF_RANGE'] = efs[0] + '-' + efs[1];
		colorCodeWSDE(lower,upper);	 	
	}
	
	return text;
	
}

function createEFBox(start,end){
	var wspd = new Array(start, end);
	var s;
	var e;
	
	for(var i = 0; i < wspd.length; i++){
		var v = wspd[i];
		console.log('wspd:' + v);
		if(v >= 200){
			if(v == 200){p = 504;}
			else if(v > 200){p = 604;}
		}else if(v >= 170){
			p = (2.9118 * v) - 78.353;
		}else if(v >= 135){
			p = (3.3793 * v) - 154.59;
		}else if(v >= 86){
			p = (4.04 * v) - 243.4;
		}else{
			var p = (3.92 * v) - 233.2;
		}
		if(i === 0){s = p;}
		if(i === 1){e = p;}
	}
	//var s = (start * 3.7576) - 216.72;
	//var e = (end * 3.7576) - 216.72;
	var w = e - s;
	jQuery("#ef-box").css("top", "-5px");
	jQuery("#ef-box").css("left", s.toString()+"px");
	jQuery("#ef-box").css("width", w.toString()+'px');
	jQuery("#ef-box").show();	
}

function colorCodeWSDE(wspd1, wspd2){
	var wspd = new Array(wspd1, wspd2);
	for(var i = 0; i < wspd.length; i++){
		var v = wspd[i];
		var c;
		if(v >= 170){
			c = {'background': 'rgba(255, 0, 255, 1)','text': 'black'};	
		}else if(v >= 135){
			c = {'background': 'rgba(112,  48, 160, 1)','text': 'white'};
		}else if(v >= 110){
			if(v == 110){c = {'background': 'rgba(255,205,17,1)','text': 'white'};}
			if(v == 115){c = {'background': 'rgba(255,135,0,1)','text': 'white'};}
			if(v == 120){c = {'background': 'rgba(224, 4, 13,1)','text': 'white'};}
			if(v == 125){c = {'background': 'rgba(199,18,62,1)','text': 'white'};}
			if(v == 130){c = {'background': 'rgba(149,36,119,1)','text': 'white'};}
		}else if(v >= 86){
			c = {'background': 'rgba(166, 166, 166, 1)','text': 'white'};
		}else{
			c = {'background': 'rgba(191, 191, 191, 1)','text': 'white'};
		}
		if(i === 0){
			jQuery("#wsde-lower").css('background-color',c['background']);
			jQuery("#wsde-lower").css('color', c['text']);
			jQuery("#wsde-lower").css('font-weight', 'bold');
		}else if (i === 1){
			jQuery("#wsde-upper").css('background-color', c['background']);
			jQuery("#wsde-upper").css('color', c['text']);
			jQuery("#wsde-upper").css('font-weight', 'bold');
		}
	}		 
}

function windSpeed2EF(wspd){
	var ef_breaks = new Array(0, 60, 86, 111, 136, 166, 201);
	if(wspd >= ef_breaks[6]){	
		return 'EF5';
	}else if(wspd >= ef_breaks[5]){
		return 'EF4';
	}else if(wspd >= ef_breaks[4]){
		return 'EF3';
	}else if(wspd >= ef_breaks[3]){
		return 'EF2';
	}else if(wspd >= ef_breaks[2]){
		return 'EF1';
	}else if(wspd >= ef_breaks[1]){
		return 'EF0';
	}
}

function getExceedenceProbText(level){
	var probs = getExceedanceProbs(level);
	console.log(probs);
	var t = 'Conditional Probability of an:\n';
	t = t + 'EF1+ Tornado =\t' + probs[1] + '%' + '\n';
	t = t + 'EF2+ Tornado =\t' + probs[2] + '%' + '\n';
	if(probs[3] === 0){
		if(level === '1-1' || level === '1-2'){
			t = t + 'EF3 Tornado =\tLess than 1%' + '\n';
		}else{
			t = t + 'EF3+ Tornado =\tLess than 1%' + '\n';
		}
	}else{
		if(level === '1-1' || level === '1-2'){
			t = t + 'EF3 Tornado =\t' + probs[3] + '%' + '\n';
		}else{
			t = t + 'EF3+ Tornado =\t' + probs[3] + '%' + '\n';
		}
	}
	if(probs[4] === 0){
		if(level === '2-2' || level === '2-3'){
			t = t + 'EF4 Tornado =\tLess than 1%' + '\n';
		}else{
			t = t + 'EF4+ Tornado =\tLess than 1%' + '\n';
		}
	}else if(probs[4] === -9999){
		//t = t + 'EF4+ Tornado =\t0%' + '\n'; 
	}else{
		t = t + 'EF4+ Tornado =\t' + probs[4] + '%' + '\n';
	}
	if(probs[5] === 0){
		t = t + 'EF5 Tornado  =\tLess than 1%' + '\n';
	}else if(probs[5] === -9999){
		//t = t + 'EF5 Tornado =\t0%' + '\n';
	}else{
		t = t + 'EF5 Tornado  =\t' + probs[5] + '%' + '\n';
	}
	
	return t;
}

function getExceedanceProbs(level){
	if(level === '5-1'){
		return [100, 100, 100, 94, 88, 25];
	}else if(level === '4-1'){
		return [100, 100, 92, 76, 54, 11];
	}else if(level === '3-1'){
		return [100, 100, 81, 63, 12, 0];
	}else if(level === '3-2'){
		return [100, 93, 60, 32, 12, 1];
	}else if(level === '2-1'){
		return [100, 83, 35, 13, 4, -9999];
	}else if(level === '2-2'){
		return [100, 82, 27, 4, 0, -9999];
	}else if(level === '2-3'){
		return [100, 72, 21, 5, 0, -9999];
	}else if(level === '1-1'){
		return [100, 58, 8, 0, -9999, -9999];
	}else if(level === '1-2'){
		return [100, 66, 16, 3, -9999, -9999];
	}else{
		return 'ERROR';
	}	
}
		
function convert2Text(which, value){
	if(which === 'vrot'){
		if(value === 'lt25'){
			return 'less than 25 kt';
		}else if(value === '25-40'){
			return 'between 25 and 39 kt';
		}else if(value ==='41-50'){
			return 'between 40 and 49 kt';
		}else if(value ==='51-60'){
			return 'between 50 and 59 kt';
		}else if(value ==='61-70'){
			return 'between 60 and 69 kt';
		}else if(value ==='gt70'){
			//return 'greater than 69 kt';
			return 'of at least 70 kt';
		}
	}
	
	if(which === 'stp'){
		if(value === 'lt1'){
			return 'less than 1';
		}else if(value === '1-2'){
			return 'between 1 and 2';					
		}else if(value === '2-3'){
			return 'between 2 and 3';
	  }else if(value === '3-4'){
	 		return 'between 3 and 4';
	  }else if(value === '4-5'){			 
			return 'between 4 and 5';
		}else if(value === '5-6'){
			return 'between 5 and 6';
		}else if(value === 'gt6'){
			return 'greater than 6';
		}	
	}			
}


function readGR2Info(desk){
	var def = jQuery.Deferred();
	var info = new Object();
	var keys = new Array("time", "radar", "tilt", "mode", "mlcape", "srh01");  
	
	getGR2Info(desk).done(function(data){
		keys.forEach(function(d,n){
			if(d in data){
				if(d === 'mlcape'){
					info[d] = Math.ceil(data[d]/10) * 10;	//Nearest 10
				}else if(d === 'srh01'){
					info[d] = Math.ceil(data[d]/10) * 10;	//Nearest 10
				}else if(d === 'tilt'){
					info[d] = Math.round(data[d] * 10) / 10;
				}else{
					info[d] = data[d];
				}	
			}
			if(n ===(keys.length-1)){
				def.resolve(info);
			}
		});
	}).fail(function(data){
		def.reject(data);
	});
	
	return def.promise();
}

function getGR2Info(desk){
	var _def = jQuery.Deferred();
	jQuery.ajax({
		dataType: "json",
		url: "/mosier/textgen/tools/getGR2Info.php?desk=" + desk	
	}).done(function(data){
		console.log(data);
		if("ERROR" in data){
			_def.reject(data);
		}else{
			_def.resolve(data);
		}	
	});
	
	return _def.promise();
	
}		


function checkTextArea(which, text){
		var testKeys = new Array();
		if(which === "1"){
			testKeys = new Array('[RADAR_ID]', '[RADAR_UTC_TIME]', '[RADAR_TILT]');
		}else if(which === "2"){
			testKeys = new Array('[GEOGRAPHIC LOCATION]', '[SRH]', '[MLCAPE]', '[RADAR_ID]', '[RADAR_UTC_TIME]', '[RADAR_TILT]')
		}	
		var txt;
		if(text){
			txt = text;
		}else{	
			txt = jQuery("#textarea-1").val();
		}	
		var errors = false;
		testKeys.forEach(function(k, i){
			if(txt.includes(k)){
				if(errors === false){
					errors = '<b><i>' + k + "</i></b>"; 
				}else{
					errors = errors + "," + '<b><i>' + k + "</i></b>"; 
				}
			}
		});
		var out = "Text Error(s): ";
		var ec_id = 'errorcheck' + which;
		ec_id = 'errorcheck1';
		if(errors === false){
			out = out + "<b>NONE</b>";
			jQuery("#" + ec_id).css("background-color", "#41BB00");
		}else{
			out = out + errors;
			jQuery("#" + ec_id).css("background-color", "red");
		}
		
		jQuery("#errorcheck1").empty();
		jQuery("#errorcheck1").html(out);	
		
}

function adjustWSDE(which, way){
	var v = jQuery("#wsde-" + which).text();
	if(v === 'N/A'){
		return false;
	}else{
		v = parseInt(v);
		var nv;
		if(way === 'down'){
			nv = v  - 5;
		}else if(way === "up"){
			nv = v + 5;
		}
		jQuery("#wsde-" + which).empty();
		jQuery("#wsde-" + which).text(nv);
	}
	var s = jQuery("#wsde-lower").text();
	var e = jQuery("#wsde-upper").text();
	createEFBox(s,e);
	colorCodeWSDE(s,e);
}
