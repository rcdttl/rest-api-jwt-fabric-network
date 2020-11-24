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

let invokeChaincode = async function (user, channel, chaincode, fcn, args) {
  // Create a new file system based wallet for managing identities.
  const walletPath = path.join(process.cwd(), "wallet");
  const wallet = new FileSystemWallet(walletPath);
  logger.info(`Wallet path: ${walletPath}`);

  // Check to see if we've already enrolled the user.
  const userExists = await wallet.exists(user);
  if (!userExists) {
    logger.info(
      `An identity for the user "${user}" does not exist in the wallet`
    );
    logger.info("Run the registerUser.js application before retrying");
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

  // Get the network (channel) our contract is deployed to.
  const network = await gateway.getNetwork(channel);

  // Get the contract from the network.
  const contract = network.getContract(chaincode);

  // Submit the specified transaction.
  const transaction = await contract.createTransaction(fcn);
  const result = await transaction.submit(...args);
  const transactionID = transaction._transactionId._transaction_id;

  // Disconnect from the gateway.
  await gateway.disconnect();
  return transactionID;
};

exports.invokeChaincode = invokeChaincode;
