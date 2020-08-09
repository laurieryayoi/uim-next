module.exports = {
  publicPath: '/uim-next/',
  devServer: {
    proxy: ''
  },
  pages: {
    index: {
      // page 的入口
      entry: 'src/pages/index/main.js',
      // 模板来源
      template: 'src/pages/index/index.html',
      // 在 dist/index.html 的输出
      filename: 'index.html',
      // filename: 'index.tpl',
      // 当使用 title 选项时，
      // template 中的 title 标签需要是 <title><%= htmlWebpackPlugin.options.title %></title>
      title: '首页',
      // 在这个页面中包含的块，默认情况下会包含
      // 提取出来的通用 chunk 和 vendor chunk。
      chunks: ['chunk-vendors', 'chunk-common', 'index']
    },
    // 当使用只有入口的字符串格式时，
    // 模板会被推导为 `public/subpage.html`
    // 并且如果找不到的话，就回退到 `public/index.html`。
    // 输出文件名会被推导为 `subpage.html`。
    shop: {
      entry: 'src/pages/shop/shop.js',
      template: 'src/pages/shop/shop.html',
      filename: 'shop.html',
      // filename: 'shop.tpl',
      title: '商店',
      chunks: ['chunk-vendors', 'chunk-common', 'shop']
    },
    profile: {
      entry: 'src/pages/profile/profile.js',
      template: 'src/pages/profile/profile.html',
      filename: 'profile.html',
      // filename: 'profile.tpl',
      title: '账户设置',
      chunks: ['chunk-vendors', 'chunk-common', 'profile']
    },
    code: {
      entry: 'src/pages/code/code.js',
      template: 'src/pages/code/code.html',
      filename: 'code.html',
      // filename: 'code.tpl',
      title: '我的钱包',
      chunks: ['chunk-vendors', 'chunk-common', 'code']
    },
    detect: {
      entry: 'src/pages/detect/detect.js',
      template: 'src/pages/detect/detect.html',
      filename: 'detect_index.html',
      // filename: 'detect_index.tpl',
      title: '审计规则',
      chunks: ['chunk-vendors', 'chunk-common', 'detect']
    },
    detectlog: {
      entry: 'src/pages/detectlog/detectlog.js',
      template: 'src/pages/detectlog/detectlog.html',
      filename: 'detect_log.html',
      // filename: 'detect_log.tpl',
      title: '审计记录',
      chunks: ['chunk-vendors', 'chunk-common', 'detectlog']
    },
    announcement: {
      entry: 'src/pages/announcement/announcement.js',
      template: 'src/pages/announcement/announcement.html',
      filename: 'announcement.html',
      // filename: 'announcement.tpl',
      title: '公告栏',
      chunks: ['chunk-vendors', 'chunk-common', 'announcement']
    },
    node: {
      entry: 'src/pages/node/node.js',
      template: 'src/pages/node/node.html',
      filename: 'node.html',
      // filename: 'node.tpl',
      title: '节点列表',
      chunks: ['chunk-vendors', 'chunk-common', 'node']
    },
    invite: {
      entry: 'src/pages/invite/invite.js',
      template: 'src/pages/invite/invite.html',
      filename: 'invite.html',
      // filename: 'invite.tpl',
      title: '参与推广',
      chunks: ['chunk-vendors', 'chunk-common', 'invite']
    },
    ticket: {
      entry: 'src/pages/ticket/ticket.js',
      template: 'src/pages/ticket/ticket.html',
      filename: 'ticket.html',
      // filename: 'ticket.tpl',
      title: '工单系统',
      chunks: ['chunk-vendors', 'chunk-common', 'ticket']
    },
    edit: {
      entry: 'src/pages/edit/edit.js',
      template: 'src/pages/edit/edit.html',
      filename: 'edit.html',
      // filename: 'edit.tpl',
      title: '连接设置',
      chunks: ['chunk-vendors', 'chunk-common', 'edit']
    },
    login: {
      entry: 'src/pages/login/login.js',
      template: 'src/pages/login/login.html',
      filename: 'login.html',
      // filename: 'login.tpl',
      title: '登录',
      chunks: ['chunk-vendors', 'chunk-common', 'login']
    },
    register: {
      entry: 'src/pages/register/register.js',
      template: 'src/pages/register/register.html',
      filename: 'register.html',
      // filename: 'register.tpl',
      title: '注册',
      chunks: ['chunk-vendors', 'chunk-common', 'register']
    },
    token: {
      entry: 'src/pages/token/token.js',
      template: 'src/pages/token/token.html',
      filename: 'token.html',
      // filename: 'token.tpl',
      title: '密码重置',
      chunks: ['chunk-vendors', 'chunk-common', 'token']
    },
    tutorial: {
      entry: 'src/pages/tutorial/tutorial.js',
      template: 'src/pages/tutorial/tutorial.html',
      filename: 'tutorial.html',
      // filename: 'tutorial.tpl',
      title: '使用教程',
      chunks: ['chunk-vendors', 'chunk-common', 'tutorial']
    },
    paysuccess: {
      entry: 'src/pages/paysuccess/paysuccess.js',
      template: 'src/pages/paysuccess/paysuccess.html',
      filename: 'pay_success.html',
      // filename: 'pay_success.tpl',
      title: '支付成功',
      chunks: ['chunk-vendors', 'chunk-common', 'paysuccess']
    },
    config: {
      entry: 'src/pages/config/config.js',
      template: 'src/pages/config/config.html',
      filename: 'next_config.html',
      // filename: 'next_config.tpl',
      title: '主题选项',
      chunks: ['chunk-vendors', 'chunk-common', 'config']
    },
    '404': {
      entry: 'src/pages/404/404.js',
      template: 'src/pages/404/404.html',
      filename: '404.html',
      // filename: '404.tpl',
      title: '页面不存在',
      chunks: ['chunk-vendors', 'chunk-common', '404']
    },
    '405': {
      entry: 'src/pages/405/405.js',
      template: 'src/pages/405/405.html',
      filename: '405.html',
      // filename: '405.tpl',
      title: '访问方式不正确',
      chunks: ['chunk-vendors', 'chunk-common', '405']
    },
    '500': {
      entry: 'src/pages/500/500.js',
      template: 'src/pages/500/500.html',
      filename: '500.html',
      // filename: '500.tpl',
      title: '服务器出错',
      chunks: ['chunk-vendors', 'chunk-common', '500']
    },
  }
}