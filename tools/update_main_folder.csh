#!/bin/csh
#
# Description:
#	csh script to copy 'dev' files to main folder before repo commit
#
cd .. > /dev/null
set homedir = `pwd`
set userdir = `cd`
cd homedir > /dev/null

if($#argv < 1) then
	echo "No version number found"
	printf "\tExample usage: update_main_folder 'v3'\n"
	printf "\t\t'dirname' (i.e. v3) should match the name of the dev directory\n";
	exit(1)
endif

set version = $1
set devdir = "$homedir/dev/$1"

if(! -d $devdir) then
	echo "$devdir not found. Exiting";
	echo ""
endif

foreach d (`ls $devdir`)
	echo $d
	set a =  `echo $d | rev | cut -c -1`
	if("$a" =~ "/") then
		#Remove the folder if it exists in homedir
		if(-d "$homedir/$d") then
			echo "$homedir/$d exists. Removing..."
			rm -rf $homedir/$d
		endif
		#Copy in new folder
		cp -r "${devdir}/${d}" $homedir
	else if ("$a" =~ $userdir) then
		printf "\tbackup\n"	
	else
#		printf "\tregular file\n"
		cp "${devdir}/${d}" $homedir
	endif
end
