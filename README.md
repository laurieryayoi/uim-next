### feature

### pending 

# multidev

## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn run serve
```

### Compiles and minifies for production
```
yarn run build
```

### Run your tests
```
yarn run test
```

### Lints and fixes files
```
yarn run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

需要dev最新commit
支付是当面付
复制一份旧的主题，起个名字uim-next
在public下新建目录uim-next,把dist中除了tpl文件的东西放进去
tpl替换到views/uim-next 里面：
1. login,register放在auth, 
2. token放在在password,
3.  next-config在admin/config
4. 别的文件在user

导入sql到数据库

php文件说明:
php中，main.tpl是给旧主题增加next主题设置页面的链接的,放到views/uim-next/admin/config
routes.php为路由文件,修改app/routes.php
Update.php是方便php xcat update升级主题设置的,修改src/Command/Update.php
Vuecontroller.php给config页面添加api支持,修改src/Controllers/Vuecontroller.php
要修改的地方都用//next标出了

其余的几个php文件，放到对应目录即可

所有文件安装到位后执行phpxcat update初始化设置
