#!/bin/bash

SCRIPT=`realpath -s ${0}`
SCRIPTPATH=`dirname ${SCRIPT}`
cd ${SCRIPTPATH}

TRANSACTION_ID=${1:-""}
USER=${2:-'User1'}
CHANNEL=${3:-'mychannel'}
CERT_PATH="../certs/tlsapi_client01@service.eco-blockchain.customs.go.kr"

SCRIPT="curl -v -s -k --cacert ${CERT_PATH}/ca.crt --key ${CERT_PATH}/cert.key --cert ${CERT_PATH}/cert.crt -X POST \
  https://localhost:3030/query/by-txid \
  -H \"content-type: application/json\" \
  -d '{
    \"user\":\"${USER}\",
    \"channel\":\"${CHANNEL}\",
	  \"transaction_id\":\"${TRANSACTION_ID}\"
  }'"

echo "${SCRIPT}"
RESP=$(eval ${SCRIPT})
echo ${RESP}

exit 0
