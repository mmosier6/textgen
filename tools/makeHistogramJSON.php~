<?php
	#Name: makeHistogramJSON.php
	#Created By: Matt Mosier
	#Purpose: Read ../src/histogram_values.csv and return JSON
	#Updates: 
	#	Version 1: October 10, 2022
	$file = "../src/histogram_values.csv";
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
				$num2 = count($tmp);
				$bin = $tmp[0];
			 	for($ii = 1; $ii < $num2; $ii++){
					$tmp2 = array();
					$tmp2 = split("Level", $keys[$ii]);
					$k = trim($tmp2[1]);
					//print "$bin => $keys[$ii] => $tmp[$ii] <br>";
					$info[$k][$bin] = $tmp[$ii];
				}
			}
		}
		print json_encode($info);
	}else{
		$a = array();
		$a['ERROR'] = "ERROR: $file does not exist";
		print json_encode($a);
	}

?>
