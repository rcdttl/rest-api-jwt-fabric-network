/*
 * SPDX-License-Identifier: Apache-2.0
 */

"use strict";

const { FileSystemWallet, Gateway } = require("fabric-network");
const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");

const ccpPath = path.resolve(__dirname, "network-config.yaml");
const ccpJSON = fs.readFileSync(ccpPath, "utf8");
const ccp = yaml.safeLoad(ccpJSON);

const logger = require("./common/logger");

async function getGateway(user) {
  // Create a new file system based wallet for managing identities.
  const walletPath = path.join(process.cwd(), "wallet");
  const wallet = new FileSystemWallet(walletPath);
  logger.debug(`Wallet path: ${walletPath}`);

  // Check to see if we've already enrolled the user.
  const userExists = await wallet.exists(user);
  if (!userExists) {
    logger.error(
      `An identity for the user "${user}" does not exist in the wallet`
    );
    throw new Error("wallet does not exist");
  }

  // Create a new gateway for connecting to our peer node.
  const gateway = new Gateway();
  await gateway.connect(ccp, {
    wallet,
    identity: user,
    discovery: {
      enabled: false,
    },
  });
  return gateway;
}

async function getNetwork(user, channel) {
  const gateway = await getGateway(user);
  return await gateway.getNetwork(channel);
}

async function getContract(user, channel, chaincode) {
  const network = await getNetwork(user, channel);
  return network.getContract(chaincode);
}

let queryChaincode = async function (user, channel, chaincode, fcn, args) {
  const contract = await getContract(user, channel, chaincode);
  return await contract.evaluateTransaction(fcn, ...args);
};

let queryTransaction = async function (user, channel, transactionId) {
  const network = await getNetwork(user, channel);
  const channelInstance = network.getChannel();
  const response = await channelInstance.queryTransaction(transactionId);
  if (!response) {
    logger.error("response is null");
    throw new Error("response is null");
  }
  logger.debug(response);
  return response;
};

let queryBlock = async function (user, channel, blockNumber) {
  const network = await getNetwork(user, channel);
  const channelInstance = network.getChannel();
  const response = await channelInstance.queryBlock(blockNumber);
  if (!response) {
    logger.error("response is null");
    throw new Error("response is null");
  }
  logger.debug(response);
  return response;
};

let channelInfo = async function (user, channel) {
  const network = await getNetwork(user, channel);
  const channelInstance = network.getChannel();
  const response = await channelInstance.queryInfo();
  if (!response) {
    logger.error("response is null");
    throw new Error("response is null");
  }
  logger.debug(response);
  return response;
};

let channelList = async function (user, peer) {
  const gateway = await getGateway(user);
  const clientInstance = gateway.client;
  const response = await clientInstance.queryChannels(peer);
  if (!response) {
    logger.error("response is null");
    throw new Error("response is null");
  }
  logger.debug(response);
  return response;
};

let installedChaincode = async function (user, peer) {
  const gateway = await getGateway(user);
  const clientInstance = gateway.client;
  const response = await clientInstance.queryInstalledChaincodes(peer);
  if (!response) {
    logger.error("response is null");
    throw new Error("response is null");
  }
  logger.debug(response);
  return response;
};

let instantiatedChaincode = async function (user, peer, channel) {
  const network = await getNetwork(user, channel);
  const channelInstance = network.getChannel();
  const response = await channelInstance.queryInstantiatedChaincodes(peer);
  if (!response) {
    logger.error("response is null");
    throw new Error("response is null");
  }
  logger.debug(response);
  return response;
};

exports.queryChaincode = queryChaincode;
exports.queryTransaction = queryTransaction;
exports.queryBlock = queryBlock;
exports.channelInfo = channelInfo;
exports.channelList = channelList;
exports.installedChaincode = installedChaincode;
exports.instantiatedChaincode = instantiatedChaincode;
