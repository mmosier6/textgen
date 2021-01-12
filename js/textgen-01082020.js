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
	console.log("level: " + level);
	if(level == '1-2' || level == '1-1'){
		jQuery("#weaktor-dialog").dialog("open");
	}
	var text = getText(level, vrot, vrotcon, stp, popden, tds);
	console.log(text);
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
		/*
		if(level === '5-1'){
			if((vrotcon === '6+') || (vrotcon === '3-5')){
				summaryTxt = summaryTxt +	' THIS IS A RARE EVENT.';
			}
		}else if(level === '4-1'){
			if(vrotcon === '6+'){
				summaryTxt = summaryTxt +	' THIS IS A RARE EVENT.';
			} 
		}
		*/
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
		if(follow == 'yes'){
			jQuery("#textarea-1").val(summaryTxt2 + txtv1 + txt3);
			jQuery("#textarea-2").val(summaryTxt2 + txtv2 + txt3);
		}else{
			jQuery("#textarea-1").val(summaryTxt + txtv1 + txt3);
			jQuery("#textarea-2").val(summaryTxt + txtv2 + txt3);
		}
	});		
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
	/*
	//Object keys
	var keys = new Array(
		"INTENSITY_DESCRIPTOR", "WSDE", "EF_RANGE", "CONFIDENCE_A", "RARE_EVENT", "MODE_DESCRIPTOR", "CONVECTIVE_MODE",
		"VROT", "TDS", "STP", "CONFIDENCE_IS_HIGH", "TOR_STRENGTH_TEXT", "TRACK_LENGTH", "RISK", "TRACK_CONFIDENCE");
	for(var i in keys){
		console.log(keys[i]);
	}	
	*/
		
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
			text['RARE_EVENT'] = ' THIS IS A RARE EVENT.';						
		}else	if(vrotcon === '3-5'){
			text['INTENSITY_DESCRIPTOR'] = "a violent";
			text['TOR_STRENGTH_TEXT'] = 'a likely violent';
			text['WSDE'] = '175 to 205 mph';
			text['EF_RANGE'] = 'EF4-EF5';
			text['TRACK_LENGTH'] = 'long-track ';
			text['TRACK_CONFIDENCE'] = 'expected to continue';
			text['RARE_EVENT'] = ' THIS IS A RARE EVENT.';		
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
			text['RARE_EVENT'] = ' THIS IS A RARE EVENT.';				
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
	/*				
	}else if(level === '2-2'){
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
			text['TOR_STRENGTH_TEXT'] = 'a possbily strong';
			text['WSDE'] = '90 to 135 mph';
			text['EF_RANGE'] = 'EF1-EF2';
			text['CONFIDENCE_IS_HIGH'] = '';
			text['TRACK_LENGTH'] = '';
			text['RISK'] = ' risk';
			text['TRACK_CONFIDENCE'] = 'continues with this storm';	
		}
	}else if(level === '2-3'){
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
			text['TOR_STRENGTH_TEXT'] = 'a possbily strong';
			text['WSDE'] = '100 to 145 mph';
			text['EF_RANGE'] = 'EF1-EF3';
			text['CONFIDENCE_IS_HIGH'] = '';
			text['TRACK_LENGTH'] = '';
			text['RISK'] = ' risk';
			text['TRACK_CONFIDENCE'] = 'continues with this storm';	
		}else{
			text['INTENSITY_DESCRIPTOR'] = 'a potentially strong';
			text['TOR_STRENGTH_TEXT'] = 'a possbily strong';
			text['WSDE'] = '90 to 135 mph';
			text['EF_RANGE'] = 'EF1-EF2';
			text['CONFIDENCE_IS_HIGH'] = '';
			text['TRACK_LENGTH'] = '';
			text['RISK'] = ' risk';
			text['TRACK_CONFIDENCE'] = 'continues with this storm';	
		}
		*/
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
	/*else if(level === '1-2'){
		text['CONFIDENCE_A'] = 'possible';
		text['CONFIDENCE_IS_HIGH'] = ' confidence is high';
		text['MODE_DESCRIPTOR'] = 'a';
		text['CONVECTIVE_MODE'] = 'supercell/QLCS';
		text['TRACK_LENGTH'] = '';
		text['RISK'] = ' risk';
		text['TRACK_CONFIDENCE'] = '';
		text['TRACK_CONFIDENCE'] = 'continues with this storm';	
		if(vrotcon === '6+'){
			text['INTENSITY_DESCRIPTOR'] = 'a';
			text['TOR_STRENGTH_TEXT'] = 'a';
			text['WSDE'] = '90 to 120 mph';
			text['EF_RANGE'] = 'EF1-EF2'
		}else if(vrotcon === '3-5'){
			text['INTENSITY_DESCRIPTOR'] = 'a';
			text['TOR_STRENGTH_TEXT'] = 'a';
			text['WSDE'] = '80 to 115 mph';
			text['EF_RANGE'] = 'EF0-EF2'
		}else{
			text['INTENSITY_DESCRIPTOR'] = 'a';
			text['TOR_STRENGTH_TEXT'] = 'a';
			text['WSDE'] = '70 to 110 mph';
			text['EF_RANGE'] = 'EF0-EF1'
		}
	}
	*/
	return text;
	
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
			return 'between 25 and 40 kt';
		}else if(value ==='41-50'){
			return 'between 41 and 50 kt';
		}else if(value ==='51-60'){
			return 'between 51 and 60 kt';
		}else if(value ==='61-70'){
			return 'between 61 and 70 kt';
		}else if(value ==='gt70'){
			return 'greater than 70 kt';
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
				info[d] = data[d]
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

