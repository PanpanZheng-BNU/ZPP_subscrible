/**
 * 入口文件
 */

/**
 * 开发依赖
 */
const path = require("path");
const util = require("./util");
let base64 = util.base64;
let readSync = util.readSync;
let writeSync = util.writeSync;
let mkDir = util.mkDir;
let existsDir = util.existsDir;
let PASSWORD = "password"; // 密码

let requestSync = require("sync-request");

let BUILD_DIR = "dist"; // 构建目录
let ENTRY_FILE = "./node.txt"; // SS(R)入口
let PASSWORD_DIR = path.join(BUILD_DIR, PASSWORD); // 新建一个目录，防止他人直接访问

let str = readSync(ENTRY_FILE);

if (!existsDir(PASSWORD_DIR)) {
  mkDir(PASSWORD_DIR);
}

let checker = (item) => {
  return (item) => item.includes("ssr://") || item.includes('ss"//');
};

// Map all the item include `ssr://` and serialize those items
let result = str
  .split("\n\n")
  .filter((item) => checker(item))
  .join("\r\n");

writeSync(path.resolve(__dirname, PASSWORD_DIR, "index.html"), base64(result));

let resultForClash = encodeURIComponent(
  str
    .split("\n")
    .filter((item) => checker(item))
    .join("|"),
);

// Generate a Clash configuration file through subconv service
const subconv_url = "http://subconv.uhft.top/sub?target=clash&emoji=true&url=";
const url = subconv_url + resultForClash;
let res = requestSync("GET", url);
writeText1 = res.getBody("utf-8");
writeSync(path.resolve(__dirname, PASSWORD_DIR, "conf_meta.yaml"), writeText1);

let dns = `

dns:
  enable: true
  enhanced-mode: redir-host
  listen: 0.0.0.0:53
  nameserver:
    - 223.5.5.5

`;

writeText2 =
  res.getBody("utf-8").slice(0, res.getBody("utf-8").indexOf("proxies:")) +
  dns +
  res.getBody("utf-8").slice(res.getBody("utf-8").indexOf("proxies:"));

writeSync(
  path.resolve(__dirname, PASSWORD_DIR, "clash_global.yaml"),
  writeText2,
);

