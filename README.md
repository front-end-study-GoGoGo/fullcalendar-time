# 日程日历

**本项目基于[fullcalendar6](https://fullcalendar.io/)**

使用[vue3](https://cn.vuejs.org/)框架和typescript开发, vite快速构建, 组件库采用[element-plus](https://element-plus.org/zh-CN/)

## 预览

http://calendar.stryear.top/


## 快速开始

1. 安装依赖

```bash
pnpm install
```

2. 启动服务

```bash
pnpm dev
```

3. 打包

```bash
pnpm build
```

## Docker部署

1. 构建镜像
docker build . -t calendar

2. 运行镜像
docker run --name calendar -d -p 8888:8888 calendar

**如果对您的项目有帮助，请给个star吧！**
