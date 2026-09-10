// prod-server 前置：把 jsx runtime 修正为 development 版本（bundle 以 dev JSX 编译）
import process from "node:process";
process.env.NODE_ENV = "development";
