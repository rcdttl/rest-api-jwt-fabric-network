#!/bin/bash

SCRIPT=`realpath -s ${0}`
SCRIPTPATH=`dirname ${SCRIPT}`
cd ${SCRIPTPATH}

USER=${1:-'User1'}
CHANNEL=${2:-'mychannel'}
CHAINCODE=${3:-'pilot01'}
ARGS=${4:-'["a","b"]'}

CERT_PATH="../certs/tlsapi_client01@service.eco-blockchain.customs.go.kr"

SCRIPT="curl -v -s -k --cacert ${CERT_PATH}/ca.crt --key ${CERT_PATH}/cert.key --cert ${CERT_PATH}/cert.crt -X POST \
  https://localhost:3030/invoke/invoke \
  -H \"content-type: application/json\" \
  -d '{
    \"user\":\"${USER}\",
    \"channel\":\"${CHANNEL}\",
    \"chaincode\":\"${CHAINCODE}\",
	  \"args\":${ARGS}
  }'"

echo "${SCRIPT}"
RESP=$(eval ${SCRIPT})
echo ${RESP}

exit 0
