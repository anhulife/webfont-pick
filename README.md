# webfont-pick
> webfont-pick 是一个生成 Webfont 的工具，它可以从字体文件中提取指定文字的信息并生成 Webfont 文件

## 安装

```sh
npm install webfont-pick -g
```

## 命令行

```sh
webfont-pick --font=/Library/Fonts/YuppySC-Regular.otf --text="你好，世界！" -o ~/Desktop/webfont
```

## 程序调用

### webfont-pick(options, callback)

#### options.font
Type: `String` Default: `undefined`

源字体文件路径，系统安装的字体一般会出现在：`Windows`的`C:\\WINDOWS\\fonts`，`Mac`的`/Library/Fonts`

#### opitons.text
Type: `String` Default: `undefined`

挑选的文本

#### options.fontName
Type: `String` Default: `webfont`

目标字体名称

#### options.className
Type: `String` Default: `web-font`

目标样式名称

#### options.output
Type: `String` Default: `.`

输出目录
