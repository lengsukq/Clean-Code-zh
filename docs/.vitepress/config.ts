import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Clean Code 中文",
  description: "Clean Code 中文翻译",
  // base: "/doc-cleancode/", // 注释掉基础路径，在开发环境中使用根路径
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [],

    sidebar: [
      {
        text: '目录',
        items: [
          { text: '首页', link: '/' },
          { text: '第1章 Clean Code 整洁代码', link: '/ch1' },
          { text: '第2章 Meaningful Names 有意义的命名', link: '/ch2' },
          { text: '第3章 Functions 函数', link: '/ch3' },
          { text: '第4章 Comments 注释', link: '/ch4' },
          { text: '第5章 Formatting 格式', link: '/ch5' },
          { text: '第6章 Objects and Data Structures 对象和数据结构', link: '/ch6' },
          { text: '第7章 Error Handling 错误处理', link: '/ch7' },
          { text: '第8章 Boundaries 边界', link: '/ch8' },
          { text: '第9章 Unit Tests 单元测试', link: '/ch9' },
          { text: '第10章 Classes 类', link: '/ch10' },
          { text: '第11章 Systems 系统', link: '/ch11' },
          { text: '第12章 Emergence 涌现', link: '/ch12' },
          { text: '第13章 Concurrency 并发', link: '/ch13' },
          { text: '第14章 Successive Refactoring 逐步重构', link: '/ch14' },
          { text: '第15章 JUnit Internals JUnit内部', link: '/ch15' },
          { text: '第16章 Refactoring SerialDate 重构SerialDate', link: '/ch16' },
          { text: '第17章 Smells and Heuristics 代码坏味道和启发式', link: '/ch17' },
          { text: '附录A Concurrency II 并发II', link: '/apA' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/lengsukq/Clean-Code-zh' }
    ],

    editLink: {
      pattern: 'https://github.com/lengsukq/Clean-Code-zh/edit/master/docs/:path',
      text: '帮助我们改善此页面！'
    },

    footer: {
      message: '基于 MIT 许可发布',
      copyright: '版权所有 © 2023-present lengsukq'
    },

    lastUpdated: {
      text: '最后更新于',
      formatOptions: {
        dateStyle: 'short',
        timeStyle: 'medium'
      }
    }
  }
})