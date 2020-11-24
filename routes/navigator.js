"use strict";

const express = require("express");
const router = express.Router();
const auth = require("./auth");
const invoke = require("../invoke.js");
const query = require("../query.js");
const logger = require("../common/logger");

const configYaml = require("config-yaml");
const config = configYaml(`${__dirname}/../network-config.yaml`);

const LEVEL = {
  ADMIN: 0,
  MANUFACTURER: 1,
  SERVICE: 2,
  USER: 3,
};

/*
계약번호(contractId)
계약종류(contractType)
계약대상(contractTarget)
계약열람(contractReading)
계약방식(contractMethod)
주계약자서명시각(signingTimeMain)
부계약자서명시각(signingTimeSub)
계약시작(contractStartTime)
계약완료(contractEndTime)
서버계약저장정보(contractSaveInfo)
서버계약저장시간(contractSaveTime)
계약자(contractor)
등록원본파일정보(originInfo)
등록원본파일해시(originHash)
등록첨부파일정보(attachInfo)
등록첨부파일해시(attachHash)
*/

router.post("/e-contract", auth.isAuthenticated(), async function (req, res) {
  if (
    req.user.authLevel == LEVEL.MANUFACTURER ||
    req.user.authLevel == LEVEL.ADMIN
  ) {
    logger.debug("****************** ECreate ****************** ");

    const FUNCTION = "ECreate";

    const USER = config.user;
    const CHANNEL = config.channel;
    const CHAINCODE = config.chaincode;

    const ARGUMENTS = [
      req.body.contractId ? req.body.contractId : "",
      req.body.contractType ? req.body.contractType : "",
      req.body.contractTarget ? req.body.contractTarget : "",
      req.body.contractReading ? req.body.contractReading : "",
      req.body.contractMethod ? req.body.contractMethod : "",
      req.body.signingTimeMain ? req.body.signingTimeMain : "",
      req.body.signingTimeSub ? req.body.signingTimeSub : "",
      req.body.contractStartTime ? req.body.contractStartTime : "",
      req.body.contractEndTime ? req.body.contractEndTime : "",
      req.body.contractSaveInfo ? req.body.contractSaveInfo : "",
      req.body.contractSaveTime ? req.body.contractSaveTime : "",
      req.body.contractor ? req.body.contractor : "",
      req.body.originInfo ? req.body.originInfo : "",
      req.body.originHash ? req.body.originHash : "",
      req.body.attachInfo ? req.body.attachInfo : "",
      req.body.attachHash ? req.body.attachHash : "",
    ];

    logger.debug(
      `fcn: [${FUNCTION}], user: [${USER}], channel: [${CHANNEL}], chaincode: [${CHAINCODE}], args: [${JSON.stringify(
        ARGUMENTS
      )}],`
    );

    if (!FUNCTION || !USER || !CHANNEL || !CHAINCODE || !ARGUMENTS) {
      res.json(400, {
        status: "error",
        msg: "invalid parameters",
      });
      logger.error("invalid parameters");
      return;
    }

    try {
      const RESULT = await invoke.invokeChaincode(
        USER,
        CHANNEL,
        CHAINCODE,
        FUNCTION,
        ARGUMENTS
      );
      logger.debug(RESULT);
      res.json(201, {
        status: "succeed",
        msg: RESULT,
      });
    } catch (err) {
      logger.error("error: " + err.message);
      res.json(500, {
        status: "error",
        msg: err.message,
      });
    }
  } else {
    res.send(403, {
      status: "error",
      msg: "unauthorized",
    });
  }
  logger.debug("******************************************* ");
});

router.get("/e-contract", auth.isAuthenticated(), async function (req, res) {
  if (
    req.user.authLevel == LEVEL.MANUFACTURER ||
    req.user.authLevel == LEVEL.ADMIN
  ) {
    logger.debug("****************** ERead ****************** ");

    //var Fcn = req.params.fcn;
    let user_id = req.query.id;
    const FUNCTION = "ERead";

    const USER = config.user;
    const CHANNEL = config.channel;
    const CHAINCODE = config.chaincode;

    if (!user_id) {
      res.json(400, {
        status: "error",
        msg: "invalid parameters",
      });
      logger.error("invalid parameters");
      return;
    }

    try {
      const RESULT = await query.queryChaincode(
        USER,
        CHANNEL,
        CHAINCODE,
        FUNCTION,
        [user_id]
      );
      logger.debug(RESULT);
      res.json(200, {
        status: "succeed",
        msg: RESULT.toString(),
      });
    } catch (err) {
      logger.error("error: " + err.message);
      res.json(500, {
        status: "error",
        msg: err.message,
      });
    }
  } else {
    res.send(403, {
      status: "error",
      msg: "unauthorized",
    });
  }
  logger.debug("******************************************* ");
});

router.put("/e-contract", auth.isAuthenticated(), async function (req, res) {
  if (
    req.user.authLevel == LEVEL.MANUFACTURER ||
    req.user.authLevel == LEVEL.ADMIN
  ) {
    logger.debug("****************** EUpdate ****************** ");

    const FUNCTION = "EUpdate";

    const USER = config.user;
    const CHANNEL = config.channel;
    const CHAINCODE = config.chaincode;

    const ARGUMENTS = [
      req.body.contractId ? req.body.contractId : "",
      req.body.contractType ? req.body.contractType : "",
      req.body.contractTarget ? req.body.contractTarget : "",
      req.body.contractReading ? req.body.contractReading : "",
      req.body.contractMethod ? req.body.contractMethod : "",
      req.body.signingTimeMain ? req.body.signingTimeMain : "",
      req.body.signingTimeSub ? req.body.signingTimeSub : "",
      req.body.contractStartTime ? req.body.contractStartTime : "",
      req.body.contractEndTime ? req.body.contractEndTime : "",
      req.body.contractSaveInfo ? req.body.contractSaveInfo : "",
      req.body.contractSaveTime ? req.body.contractSaveTime : "",
      req.body.contractor ? req.body.contractor : "",
      req.body.originInfo ? req.body.originInfo : "",
      req.body.originHash ? req.body.originHash : "",
      req.body.attachInfo ? req.body.attachInfo : "",
      req.body.attachHash ? req.body.attachHash : "",
    ];

    logger.debug(
      `fcn: [${FUNCTION}], user: [${USER}], channel: [${CHANNEL}], chaincode: [${CHAINCODE}], args: [${JSON.stringify(
        ARGUMENTS
      )}],`
    );

    if (!FUNCTION || !USER || !CHANNEL || !CHAINCODE || !ARGUMENTS) {
      res.json(400, {
        status: "error",
        msg: "invalid parameters",
      });
      logger.error("invalid parameters");
      return;
    }

    try {
      const RESULT = await invoke.invokeChaincode(
        USER,
        CHANNEL,
        CHAINCODE,
        FUNCTION,
        ARGUMENTS
      );
      logger.debug(RESULT);
      res.json(200, {
        status: "succeed",
        msg: RESULT,
      });
    } catch (err) {
      logger.error("error: " + err.message);
      res.json(500, {
        status: "error",
        msg: err.message,
      });
    }
  } else {
    res.send(403, {
      status: "error",
      msg: "unauthorized",
    });
  }
  logger.debug("******************************************* ");
});

module.exports = router;
