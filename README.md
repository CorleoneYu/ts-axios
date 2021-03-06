# ts-axios

## 项目脚手架 TypeScript library starter

### 使用

```cmd
git clone https://github.com/alexjoverm/typescript-library-starter.git YOUR_FOLDER_NAME
cd YOUR_FOLDER_NAME
npm install
```

### 项目文件目录

```javascript
|-- src // 源码目录 
|-- test // 测试目录
|-- tools // 发布到 GitHub pages 以及 发布到 npm 的配置脚本工具
|-- rollup.config.ts // rollup 配置文件
|-- tslint.json // Typescript lint 文件
|-- tsconfig.json // Typescript 编译配置文件
|-- package.json
|-- node_modules
```

### 优秀工具集成

1. RollupJs 打包
2. Prettier 和 TSLint 格式化代码以及保证代码风格一致性
3. TypeDoc
4. Jest 单元测试
5. Commitizen 规范化提交注释
6. Semantic release 管理版本和发布
7. husky 简单使用 git hooks
8. Conventional changelog 自动生成changelog

### npm script常用命令

## 记录

### 混合类型

一个对象可以同时做为函数和对象使用，并带有额外的属性。

```typescript
interface Counter {
  (start: number): string
  interval: number
  reset(): void
}

function getCounter(): Counter {
  let counter = (function (start: number) { }) as Counter
  counter.interval = 123
  counter.reset = function () { }
  return counter
}

let c = getCounter()
c(10)
c.reset()
c.interval = 5.0
```

在 axios 例子为

```typescript
export interface Axios {
  // Axios 实例属性方法等
  request<T = any>(config: AxiosRequestConfig): AxiosPromise<T>
}

export interface AxiosInstance extends Axios {
  // 作为函数的签名
  <T = any>(config: AxiosRequestConfig): AxiosPromise<T>

  // 函数重载
  <T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>
}
```

使用时，可以如此

```typescript
// 做函数使用
axios(config)

// 作为类实例使用
axios.get(config)
```