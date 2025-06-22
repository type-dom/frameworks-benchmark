
# Frameworks 多框架基准测试项目
## 项目结构概览
    
    frameworks/
    ├── packages/           # 多框架实现目录
    │   ├── type-dom/        # 自定义框架实现
    │   ├── solidjs/         # SolidJS 2.0 实现
    │   ├── svelte/          # Svelte 实现
    │   ├── vue/             # Vue 3 实现
    │   └── react/           # React 18 实现
    ├── tools/              # 开发工具集
    ├── README.md           # 项目说明
    ├── package.json        # 根工作区配置
    └── nx.json             # Nx Monorepo 配置


## 框架实现对比

| 框架类型    | 组件路径                          | 核心技术栈                  |
|------------|-----------------------------------|---------------------------|
| type-dom   | `/packages/type-dom`              | TypeScript 类继承体系      |
| SolidJS    | `/packages/solidjs`               | 响应式系统 + 编译时优化    |
| Svelte     | `/packages/svelte`                | 编译时框架 + 无运行时     |
| Vue        | `/packages/vue`                   | Composition API + Options API |
| React      | `/packages/react`                 | React 18 + Suspense       |

## 核心组件实现

所有框架均实现以下标准化组件：
1. **Counter** - 基础状态管理组件
2. **VirtualList** - 虚拟滚动列表组件
3. **AppRoot** -


## 安装依赖

    npm install
    启动开发服务器（以 React 为例）
    cd packages/react npm run dev

## 构建生产版本

    nx build [framework-name] # 例：nx build react

## 项目特性

- 支持 Web Component 跨框架集成
- 提供统一的性能分析工具集（`/tools` 目录）
- 各框架实现保持相同功能特性：
    - 状态管理对比
    - 组件通信模式
    - 异步加载策略
    - 样式处理方案

## 技术决策

1. **Monorepo 架构**：采用 Nx 管理多框架实现
2. **标准化组件**：确保跨框架可比性
3. **性能基线**：通过统一 VirtualList 实现进行渲染性能测试
4. **可扩展性**：预留新增框架的模板结构

## 目录规范

- `public/`：静态资源目录（各框架独立）
- `assets/`：构建生成资源目录
- `styles.css`：全局样式表（各框架独立）
- `main.*`：框架入口文件标准命名规范
=======
# frameworks-performance
测试各个不同前端框架
