const crypto = require("crypto");

async function getStartAndEnd() {
  const now = new Date();
  let end = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    now.getHours(),
    now.getMinutes(),
    0,
    000
  ).toISOString();

  let start = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    now.getHours(),
    now.getMinutes() - 1,
    0,
    000
  ).toISOString();

  return { start: start, end: end };
}

const getEncrypt = (plainText) => {
  return new Promise((res) => {
    const cipher = crypto.createCipher("aes-256-cbc", "econt");
    let result = cipher.update(plainText, "utf8", "base64");
    result += cipher.final("base64");
    res(result);
  });
};

const getDecrypt = (cipher) => {
  return new Promise((res) => {
    const decipher = crypto.createDecipher("aes-256-cbc", "econt");
    let result = decipher.update(cipher, "base64", "utf8");
    result += decipher.final("utf8");
    res(result);
  });
};

module.exports = {
  getStartAndEnd: getStartAndEnd,
  getEncrypt: getEncrypt,
  getDecrypt: getDecrypt,
};
