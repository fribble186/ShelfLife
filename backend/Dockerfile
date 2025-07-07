# 使用 Node.js 18 作为基础镜像
FROM node:18-alpine

# 安装 wget 和 postgresql-client 用于健康检查
RUN apt-get update && apt-get install -y wget postgresql-client && rm -rf /var/lib/apt/lists/*

# 设置工作目录
WORKDIR /app

# 设置 npm 和 pnpm 使用国内镜像
RUN npm config set registry https://registry.npmmirror.com && \
    npm install -g pnpm && \
    pnpm config set registry https://registry.npmmirror.com

# 复制 package.json 和 pnpm-lock.yaml
COPY package.json pnpm-lock.yaml ./

# 安装依赖
RUN pnpm install --frozen-lockfile

# 复制源代码
COPY . .

# 生成 Prisma 客户端
RUN pnpm prisma generate

# 构建项目
RUN pnpm build

# 创建启动脚本
RUN echo '#!/bin/sh' > /app/start.sh && \
    echo 'echo "Waiting for database..."' >> /app/start.sh && \
    echo 'until pg_isready -h db -p 5432 -U reminder -d reminder; do' >> /app/start.sh && \
    echo '  echo "Database is not ready yet. Waiting..."' >> /app/start.sh && \
    echo '  sleep 2' >> /app/start.sh && \
    echo 'done' >> /app/start.sh && \
    echo 'echo "Database is ready!"' >> /app/start.sh && \
    echo 'echo "Running database migrations..."' >> /app/start.sh && \
    echo 'pnpm prisma migrate deploy' >> /app/start.sh && \
    echo 'echo "Starting application..."' >> /app/start.sh && \
    echo 'pnpm start:prod' >> /app/start.sh && \
    chmod +x /app/start.sh

# 暴露端口
EXPOSE 3000

# 启动命令
CMD ["/app/start.sh"] 