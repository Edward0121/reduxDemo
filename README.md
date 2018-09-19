# 电子发票与税务服务云平台 - 企业账户前端页面

## 如何使用本项目
### Windows 环境
1, 将项目代码 clone 到本地目录中，这里假设本地目录为 `D:/views`。
```shell
cd /d D:/views
git clone git@git.yonyou.com:e-invoice-FE/piaoeda-views.git
cd piaoeda-views
```
2, 安装 npm 依赖包
```shell
npm i
```
3, 启动开发环境  
启动之前，首先[配置API地址](#配置API地址)。

如果是启动本地调试环境(local)，即使用 127.0.0.1 的API，执行如下命令：
```shell
npm run local
```
如果是调试非本地环境，如 192.168.52.81 的 API，执行如下命令：
```shell
npm start
```
4, 修改代码后，浏览器自动刷新。  
5, 可以正常开发了。

### macOS 环境
1, 将项目代码 clone 到本地目录中，这里假设本地目录为 `/Users/someone/views`。
```shell
cd /Users/someone/views
git clone git@git.yonyou.com:e-invoice-FE/piaoeda-views.git
cd piaoeda-views
```
2, 安装 npm 依赖包
```shell
npm i
```
3, 启动开发环境  
启动之前，首先[配置API地址](#配置API地址)。

如果是启动本地调试环境(local)，即使用 127.0.0.1 的API，执行如下命令：
```shell
npm run local
```
如果是调试非本地环境，如 192.168.52.81 的 API，执行如下命令：
```shell
npm start
```
4, 修改代码后，浏览器自动刷新。  
5, 可以正常开发了。

## 本地调试  
如果在本地调试过程中，有多个后端地址需要代理，则修改 `server-webpack.local.js` 文件。  
该文件根据不同 URL 路径区分是否需要代理。  
例如默认情况下，所有 /ent-views/ 路径下的请求走自定义路由。所有其他路径下的请求，走配置代理。 
```js
var path = urlParse(req.url).pathname;
// 如果是 workbench 目录下的，则表示登录、界面静态资源，使用路由处理。其他所有情况，都使用代理。
if (/^\/ent-views\/.*/.test(path)) {
    return callback(req, res);
}

var API = `${envConfig.fp_base}`;
return proxy.web(req, res, {target: API})
```

如果需要增加后台代理接口，则添加如下代码：
```js
var path = urlParse(req.url).pathname;
// 如果是 workbench 目录下的，则表示登录、界面静态资源，使用路由处理。其他所有情况，都使用代理。
if (/^\/ent-views\/.*/.test(path)) {
    return callback(req, res);
}
if (/^\/others\/.*/.test(path)) {
    return proxy.web(req, res, {target: "https://127.0.0.1:8085"})
}
var API = `${envConfig.fp_base}`;
return proxy.web(req, res, {target: API})
```
如果增加了上述代码，那么所有针对 /others/ 路径的请求，都会被转发到 `https://127.0.0.1:8085` 地址下。


### 项目代码目录
src/client_web：电子发票与税务服务平台中，企业端的前端页面。该目录的命名，与 [piaoeda 项目](http://git.yonyou.com/e-invoice/piaoeda)目录命名保持一致。
`src/client_web` 目录下的内容，对应 piaoeda 项目的 `client_web/src/main/webapp` 目录下的内容。
这两个目录的子文件内容完全一样。

## 编写 API 测试代码
测试工具：[mocha](https://mochajs.org/#hooks)
断言写法：http://chaijs.com/api/bdd/



## 配置API地址
如果需要增加或者修改前端页面对用的后台服务，则修改 `config/envConfig.js` 文件即可。

需要修改两处：
1. 在 envConfig.js 文件中，修改 `config` 对象，添加一个环境对象。
2. 修改 envConfig.js 文件中的 `current` 变量，指向刚添加的环境对象。

环境对象的结构如下：  
```json
  env: {
    username: '', //用户名
    password: '', //密码
    fp_base: '', //后台服务的基地址，具体格式为 `http(s)://host:port`
    fp_cas_url: '', //后台 CAS 地址
    yht_base: '', //友互通服务基地址
    yht_sysid: '', //友互通为税务云平台分配的 sysid，该值是确定的。
  },
```

配置文件中默认增加了本地调试的环境变量 `local`。  
注意用户名和密码是否正确即可。

## 项目部署方式
项目前端页面独立部署，部署后的访问地址为 `https://<host>:<port>/ent-views/`。
`/ent-views/` 路径下的 URL 全部重定向到 index.html 页面。
生产环境采用 nginx 方式部署，所有针对 /ent-views/ 路径下的访问，或者转发到具体静态资源或者返回 index.html 页面。

**nginx 参考配置**

Step 1, 配置静态资源服务器  
```
server {
  listen       9999;
  server_name  mobileview;
  root /data/www/static-server/dist;

  location / {
    index index.html;
    try_files $uri $uri/ /index.html;
  }
}
```

__注意__：`/data/www/static-server/dist` 目录下包含 index.html 页面。

Step 2, 配置负载均衡服务器(本例中配置了一个)
```
upstream mobile_server{
  server 10.3.36.45:9999;
}
```

Step 3, 配置反向代理服务器
```
server {
 listen 80;
 server_name meet.yonyoucloud.com
 location ^~ /mobileview/ {
  proxy_set_header Host $host;
  proxy_set_header X-Forwarded-For $remote_addr;
  proxy_pass http://mobile_server/;  #注意最后的根目录符号（/），用于移除请求 URL 的 /mobileview/ 前缀。
 }
}
```

Step 4, 完成以上三个步骤即部署完成。

## 其他资料
1. 热加载的 JS，https://github.com/mklabs/tiny-lr
2. SuperAgent 进行 API 测试，https://visionmedia.github.io/superagent/#agents-for-global-state

## 测试 
### 在根目录中

- 执行所有测试用例
```
mocha
``` 
- 执行含有 add 的测试用例
``` 
mocha -g add 
``` 
- 执行不含有 add 的测试用例
``` 
mocha -g add -invert 
``` 
- 执行文件名为bd_test的测试用例
``` 
mocha bd_test
``` 
- 检测文件变动自动执行测试用例
``` 
mocha -watch
``` 

## 代码分支管理
### 迭代开发流程
1. 当新迭代启动后，从 develop 分支新建功能迭代分支 topic-itr<迭代序号>。
所有迭代功能在该分支上执行。

2. 当 topic-itr 分支达到测试要求时，将该分支合并到 develop 分支。
如果内部测试发现仍然存在问题，则继续在 topic-itr 分支上修改。
当 topic-itr 分支联调不在需要时，合并到 develop 分支。
当新建 release-itr 分支后，立即删除 topic-itr 迭代分支。

3. 之后，进入[上线发布流程](#上线发布流程)。


### 上线发布流程
1. 当 develop 分支达到迭代上线要求后，从 develop 分支新建预发布分支，命名为 release-itr<迭代版本号>。
release 分支部署到线上，提交测试组同学。
当 release 分支中发现问题时，直接在 release 分支修改，修改后重新部署到测试环境。

2. 当 release 分支达到上线要求后，将 release 分支合并到 develop 分支、同时合并到 master 分支。
（一般为上线当天执行该动作）对合并后的 master 执行标记动作（tag）。删除 release 分支。

3. 当 master 分支发现线上问题时，从对应 tag 处，新建 fixbug-<迭代版本号> 分支。
在 fixbug 分支修改线上问题（这些问题一般比较紧急）。
当问题修复后，将 fixbug 分支部署测试环境，执行内部测试（该步骤根据需要考虑）。
如果仍然存在问题，则继续在 fixbug 分支上修复。

4. 当 fixbug 分支达到线上要求时，将 fixbug 分支合并到 develop 分支、同时合并到 master 分支。
对合并后的 master 执行标记动作（tag）。删除 fixbug 分支。


## 打包工具迁移
打包工具介绍：[webpack](https://webpack.js.org)

重构步骤
1. 整理打包配置文件（开发环境）
2. 整理打包配置文件（生产环境）
3. 移除 requirejs 库
4. 修改业务代码的模块结构（CMD 规范）
5. 移除无效的文件、代码、第三方库
6. 网络层封装（统一管理 URL）
7. 页面状态管理（如，viewmodal 的初始化）


更新 node 版本
`nvm install 8.11.1`
> Now using node v8.11.1 (npm v5.6.0)


安装版本检查工具 
`npm i -g npm-check`
检查 npm 包的版本
`npm-check -u`



迁移参考资料：
1. https://gist.github.com/xjamundx/b1c800e9282e16a6a18e

## 前端工程环境说明
### 概述
**开发环境**
开发环境下，打包工具支持以下功能：
1. 资源文件热加载
2. 自动登录

koa-webpack

**生产环境**
生产环境下，打包工具支持以下功能：
1. 文件名 hash
2. 代码混淆
3. CSS 插件（SASS、PostCSS）
4. 代码压缩
5. 样式文件提取
6. 公共模块提取
7. 代码延迟加载

### 脚本
自动化脚本支持的功能：
分不同环境，部署打包后的程序。
