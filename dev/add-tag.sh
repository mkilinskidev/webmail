#!/bin/bash

# eval $(ssh-agent)
# ssh-add ~/.ssh/id_rsa

update_push () 
{
	#prepare tags
	loginWithPassword=$1":"$2"@github.com"
	loginWithAt=$1"@"
	emptyString=""
	guthubString="github.com"

	url="$(git config --get remote.origin.url)"
	url="${url/$loginWithAt/$emptyString}"
	resultUrl="${url/$guthubString/$loginWithPassword}"
	
	#pull
	# git pull
	
	#add tag
	if [[ "$3" != "" ]]; then
		git tag -a "$3" -m ""
	fi

	#push changes
	git push --repo $resultUrl --tags
} 

get_next_version ()
{
	# DESCRIBE=$(git describe --tags $(git rev-list --tags --max-count=1) --abbrev=0);
	DESCRIBE=$(git describe --tags --abbrev=0);

	# increment the build number (ie 115 to 116)
	VERSION=`echo $DESCRIBE | awk '{split($0,a,"."); print a[1]}'`
	BUILD=`echo $DESCRIBE | awk '{split($0,a,"."); print a[2]}'`
	PATCH=`echo $DESCRIBE | awk '{split($0,a,"."); print a[3]}'`
	
	if [[ "$(git describe --tags)" =~ -+ ]]; then
		if [[ "${DESCRIBE}" =~ ^[0-9]+$ ]]; then
			VERSION="0.0.0"
			BUILD=`git rev-list HEAD --count`
			PATCH=${DESCRIBE}
		fi

		if [ "${BUILD}" = "" ]; then
			BUILD='0'
		fi

		if [ "${PATCH}" = "" ]; then
			PATCH=$DESCRIBE
		fi
		
		PATCH=$((PATCH+1))
		
		next_tag=${VERSION}.${BUILD}.${PATCH}
	else
		next_tag=""
	fi
}

read -p "GitHub Login: " login
read -p "GitHub Password: " password
read -p "Tag name: " tag

cd ../modules
# cd ../modules/StandardLoginFormWebclient
# cd ../modules/TwoFactorAuth

for dir in $(find . -name ".git")
do
   cd ${dir%/*} > /dev/null
    
	echo ${dir%/*}

	if [ "${tag}" = "" ]; then
		get_next_version
		new_tag=$next_tag
	else
		new_tag=$tag
	fi
	
	if [ "${next_tag}" = "" ]; then
		echo "No tag update is needed. The latest tag is ${DESCRIBE}"
	else
		echo "${DESCRIBE}->${new_tag}"
	
		update_push $login $password "$new_tag"
	fi
	echo "";

   cd -  > /dev/null
done