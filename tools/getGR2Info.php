<?php
	#Name: getGR2Info.php
	#Created By: Matt Mosier
	#Purpose: Query stations.json and create a JSON with site id as first key
	#Updates: 
	#	Version 1: November 18, 2019
	
	if(isset($_GET["desk"])){
		$d = $_GET["desk"];
	}
	$info = array();
	$file = "../tracks/vrot_data_rtTrack_desk".$d.".txt";
	if(file_exists($file)){
		$a = file_get_contents($file);
		$lines = split("\n", $a);
		$num = count($lines);
		$keys = array();
		$info = array();
		for($i = 0; $i < $num; $i++){
			$l = trim($lines[$i]);
			$tmp = split(",", $l);
			if($i == 0){
				foreach ($tmp as $t){
					array_push($keys, trim($t));
				}
			}else{
				if(count($keys) != count($tmp)){continue;}
				$tmp2 = array();
				$num2 = count($tmp);
			 	for($ii = 0; $ii < $num2; $ii++){
					$tmp2[$keys[$ii]] = $tmp[$ii];
				}
				array_push($info, $tmp2);
			}
		}
		#Double-check that the data is recent
		$d = $info[count($info)-1];
		$tmp 	= explode("/", $d['date_utc']);
		$yr 	= intval($tmp[2]); 
		$mo 	= intval($tmp[0]);
		$dy	 	= intval($tmp[1]);
		$hr		= intval(substr($d['time'],0,2));
		$mi 	= intval(substr($d['time'],2,2));
		$sc		= 0;
		$rad_epoch = mktime($hr,$mi,$sc,$mo,$dy,$yr);
		$cur_epoch = mktime();
		$diff = ($cur_epoch - $rad_epoch);		//In seconds
		$diff_min = ($diff/60.0);
		//**DEBUGGING***
		//$diff_min = 26;
		if($diff_min > 30){
			$a = array();
			$a['ERROR'] = "ERROR: latest data in file is over 30 mins old";
			print json_encode($a);		
		}else{
			print json_encode($info[count($info)-1]);
		}	
	}else{
		$a = array();
		$a['ERROR'] = "ERROR: $file does not exist";
		print json_encode($a);
	}	

	
?>
