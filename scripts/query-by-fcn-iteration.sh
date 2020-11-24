#!/bin/bash

SCRIPT=`realpath -s ${0}`
SCRIPTPATH=`dirname ${SCRIPT}`
cd ${SCRIPTPATH}

ITERATION=${1:-10}

for i in $(seq 1 ${ITERATION})
do
	./query-by-fcn.sh &
done

exit 0
