# Docker 部署说明

## 项目结构

```
reminder/
├── docker-compose.yml          # Docker Compose 配置
├── backend/
│   ├── Dockerfile             # 后端 Docker 镜像配置
│   └── .dockerignore          # 后端 Docker 忽略文件
└── frontend/
    ├── Dockerfile             # 前端 Docker 镜像配置
    ├── nginx.conf             # Nginx 配置
    └── .dockerignore          # 前端 Docker 忽略文件
```

## 快速启动

1. **构建并启动所有服务**：

   ```bash
   docker compose up --build
   ```

2. **后台运行**：

   ```bash
   docker compose up -d --build
   ```

3. **查看日志**：

   ```bash
   docker compose logs -f
   ```

4. **停止服务**：
   ```bash
   docker compose down
   ```

## 服务说明

### 数据库 (PostgreSQL)

- **端口**: 仅内部网络 (5432)
- **用户名**: reminder
- **密码**: reminder
- **数据库**: reminder
- **数据持久化**: 存储在 `db_data` volume 中
- **网络**: 仅内部 Docker 网络访问

### 后端 API

- **端口**: 仅内部网络 (3000)
- **环境变量**:
  - `DATABASE_URL`: 自动指向内部数据库
  - `NODE_ENV`: production
- **健康检查**: 每 30 秒检查一次
- **数据库迁移**: 启动时自动运行 Prisma 迁移

### 前端应用

- **端口**: 80
- **API 代理**: 自动代理 `/api/*` 到后端
- **静态资源**: 使用 Nginx 服务

## 访问地址

- **前端应用**: http://localhost
- **后端 API**: 通过前端 Nginx 代理访问 (http://localhost/api/\*)
- **数据库**: 仅内部网络访问，不对外暴露

## 注意事项

1. **首次启动**：数据库需要初始化，后端会自动等待数据库就绪并运行迁移
2. **数据库迁移**：后端启动时会自动运行 `pnpm prisma migrate deploy`
3. **网络隔离**：数据库和后端仅通过内部 Docker 网络通信，不对外暴露
4. **环境变量**：所有环境变量都在 docker-compose.yml 中配置
5. **日志查看**：使用 `docker compose logs [service-name]` 查看特定服务的日志

## 故障排除

1. **端口冲突**：如果端口被占用，可以修改 docker-compose.yml 中的端口映射
2. **构建失败**：检查 Dockerfile 和依赖是否正确
3. **数据库连接失败**：确保数据库服务已启动并健康
4. **前端无法访问后端**：检查 nginx.conf 中的代理配置
