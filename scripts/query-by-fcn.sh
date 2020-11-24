#!/bin/bash

SCRIPT=`realpath -s ${0}`
SCRIPTPATH=`dirname ${SCRIPT}`
cd ${SCRIPTPATH}

FUNCTION=${1:-'query'}
USER=${2:-'User1'}
CHANNEL=${3:-'mychannel'}
CHAINCODE=${4:-'mycc'}
ARGS=${5:-'["a"]'}

CERT_PATH="../certs/tlsapi_client01@service.eco-blockchain.customs.go.kr"

SCRIPT="curl -v -s -k --cacert ${CERT_PATH}/ca.crt --key ${CERT_PATH}/cert.key --cert ${CERT_PATH}/cert.crt -X POST \
  https://localhost:3030/query/by-fcn \
  -H \"content-type: application/json\" \
  -d '{
    \"fcn\":\"${FUNCTION}\",
    \"user\":\"${USER}\",
    \"channel\":\"${CHANNEL}\",
    \"chaincode\":\"${CHAINCODE}\",
	  \"args\":${ARGS}
  }'"

echo "${SCRIPT}"
RESP=$(eval ${SCRIPT})
echo ${RESP}

exit 0
