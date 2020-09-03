# 基于SpringBoot的个人博客

> 作者：raging snail

## 1.需求分析

### 1.1 访客

* 可以分页查看所有博客
* 可以快速查看阅读量最高的博客
* 可以查看所有博客分类
* 可以查看某个分类下的博客列表
* 可以快速查看标记博客最多的10个标签
* 可以查看所有标签
* 可以查看某个标签下的博客列表
* 可以根据时间线查看博客列表
* 可以快速查看最新的推荐博客
* 可以用关键字全局搜索博客
* 可以查看单个博客内容
* 可以对博客内容进行评论
* 可以赞赏博客内容
* 可以微信扫码阅读博客内容
* 可以在首页扫描公众号二维码关注我

---

### 1.2 管理员

* 用户名密码登录后台管理
* 管理博客
  - 发布新的博客
  - 对博客进行分类
  - 给博客打标签
  - 修改博客
  - 删除博客
  - 可以根据标题、分类、标签查询博客
* 管理博客分类
  - 新增分类
  - 修改分类
  - 删除分类
  - 查询分类
* 管理标签
  - 新增标签
  - 修改标签
  - 删除标签
  - 查询标签

------

### 1.3 功能规划图

<img src="G:\IDEAProjects\blog\文档\个人博客.png"  />



---

## 2.页面设计与开发

### 2.1 设计

前端展示：首页、详情页、分类、标签、时间线、关于我

后台管理：模板页

### 2.2 页面开发

[Semantic UI中文文档](https://zijieke.com/semantic-ui/)

[占位图](https://picsum.photos/images)

[背景图](https://www.toptal.com/designers/subtlepatterns/)

------

#### 2.2.1 首页

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>首页</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/semantic-ui/2.2.10/semantic.min.css">
    <link rel="stylesheet" type="text/css" href="../static/css/me.css">
</head>
<body>

    <!--导航header-->
    <nav class="ui inverted attached segment m-padded-tb-mini m-shadow-small">
        <div class="ui container">
            <div class="ui inverted secondary stackable menu">
                <h2 class="ui teal header item">iBlog</h2>
                <a href="#" class="m-item item m-mobile-hide"><i class="tiny home icon"></i>首页</a>
                <a href="#" class="m-item item m-mobile-hide"><i class="tiny idea icon"></i>分类</a>
                <a href="#" class="m-item item m-mobile-hide"><i class="tiny tags icon"></i>标签</a>
                <a href="#" class="m-item item m-mobile-hide"><i class="tiny clone icon"></i>归档</a>
                <a href="#" class="m-item item m-mobile-hide"><i class="tiny info icon"></i>&nbsp;关于我</a>
                <div class="m-item right item m-mobile-hide">
                    <div class="ui icon inverted transparent input">
                        <input type="text" placeholder="Search...">
                        <i class="search link icon"></i>
                    </div>
                </div>
            </div>
        </div>
        <a href="#" class="ui menu toggle black icon button m-right-top m-mobile-show">
            <i class="sidebar icon"></i>
        </a>
    </nav>

    <!--中间内容-->
    <div class="m-container m-padded-tb-big">
        <div class="ui container">
            <div class="ui stackable grid">
                <!--左部博客列表-->
                <div class="eleven wide column">
                    <!--top-->
                    <div class="ui top attached segment">
                        <div class="ui middle aligned two column grid">
                            <div class="column">
                                <h3 class="ui teal header">博客</h3>
                            </div>
                            <div class="right aligned column">
                                共<h2 class="ui orange header m-inline-block m-text-thin">15</h2>篇
                            </div>
                        </div>
                    </div>
                    
                    <!--content-->
                    <div class="ui attached segment">
                        <div class="ui segment">
                            <div class="ui mobile reversed stackable grid">
                                <div class="eleven wide column">
                                    <h3 class="ui header">SpringBoot启动原理</h3>
                                    <p class="m-text">SpringBoot通过默认配置了很多框架的使用方式帮我们大大简化了项目初始搭建以及开发过程。本博客的目的就是一步步分析SpringBoot的启动过程，分析SpringBoot是如何帮我们简化这个过程的。</p>
                                    <div class="ui grid">
                                        <div class="eleven wide column">
                                            <div class="ui mini horizontal link list">
                                                <div class="item middle aligned">
                                                    <img src="https://picsum.photos/id/1028/100" alt="" class="ui avatar image">
                                                    <div class="content"><a href="#" class="header">叶伟伟</a></div>
                                                </div>
                                                <div class="item middle aligned">
                                                    <i class="calendar icon"></i> 2020 07-29
                                                </div>
                                                <div class="item middle aligned">
                                                    <i class="eye icon"></i> 250
                                                </div>
                                            </div>
                                        </div>
                                        <div class="right aligned middle aligned five wide column">
                                            <a href="#" target="_blank" class="ui teal basic label m-padded-tiny m-text-thin">学习笔记</a>
                                        </div>
                                    </div>
                                </div>
                                <div class="five wide column middle aligned">
                                    <a href="#" target="_blank">
                                        <img src="https://picsum.photos/id/1033/800/450" alt="" class="ui rounded image">
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div class="ui segment">
                            <div class="ui mobile reversed stackable grid">
                                <div class="eleven wide column">
                                    <h3 class="ui header">SpringBoot启动原理</h3>
                                    <p class="m-text">SpringBoot通过默认配置了很多框架的使用方式帮我们大大简化了项目初始搭建以及开发过程。本博客的目的就是一步步分析SpringBoot的启动过程，分析SpringBoot是如何帮我们简化这个过程的。</p>
                                    <div class="ui grid">
                                        <div class="eleven wide column">
                                            <div class="ui mini horizontal link list">
                                                <div class="item middle aligned">
                                                    <img src="https://picsum.photos/id/1028/100" alt="" class="ui avatar image">
                                                    <div class="content"><a href="#" class="header">叶伟伟</a></div>
                                                </div>
                                                <div class="item middle aligned">
                                                    <i class="calendar icon"></i> 2020 07-29
                                                </div>
                                                <div class="item middle aligned">
                                                    <i class="eye icon"></i> 250
                                                </div>
                                            </div>
                                        </div>
                                        <div class="right aligned middle aligned five wide column">
                                            <a href="#" target="_blank" class="ui teal basic label m-padded-tiny m-text-thin">SpringBoot</a>
                                        </div>
                                    </div>
                                </div>
                                <div class="five wide column middle aligned">
                                    <a href="#" target="_blank">
                                        <img src="https://picsum.photos/id/1033/800/450" alt="" class="ui rounded image">
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div class="ui segment">
                            <div class="ui mobile reversed stackable grid">
                                <div class="eleven wide column">
                                    <h3 class="ui header">SpringBoot启动原理</h3>
                                    <p class="m-text">SpringBoot通过默认配置了很多框架的使用方式帮我们大大简化了项目初始搭建以及开发过程。本博客的目的就是一步步分析SpringBoot的启动过程，分析SpringBoot是如何帮我们简化这个过程的。</p>
                                    <div class="ui grid">
                                        <div class="eleven wide column">
                                            <div class="ui mini horizontal link list">
                                                <div class="item middle aligned">
                                                    <img src="https://picsum.photos/id/1028/100" alt="" class="ui avatar image">
                                                    <div class="content"><a href="#" class="header">叶伟伟</a></div>
                                                </div>
                                                <div class="item middle aligned">
                                                    <i class="calendar icon"></i> 2020 07-29
                                                </div>
                                                <div class="item middle aligned">
                                                    <i class="eye icon"></i> 250
                                                </div>
                                            </div>
                                        </div>
                                        <div class="right aligned middle aligned five wide column">
                                            <a href="#" target="_blank" class="ui teal basic label m-padded-tiny m-text-thin">SpringBoot</a>
                                        </div>
                                    </div>
                                </div>
                                <div class="five wide column middle aligned">
                                    <a href="#" target="_blank">
                                        <img src="https://picsum.photos/id/1033/800/450" alt="" class="ui rounded image">
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div class="ui segment">
                            <div class="ui mobile reversed stackable grid">
                                <div class="eleven wide column">
                                    <h3 class="ui header">SpringBoot启动原理</h3>
                                    <p class="m-text">SpringBoot通过默认配置了很多框架的使用方式帮我们大大简化了项目初始搭建以及开发过程。本博客的目的就是一步步分析SpringBoot的启动过程，分析SpringBoot是如何帮我们简化这个过程的。</p>
                                    <div class="ui grid">
                                        <div class="eleven wide column">
                                            <div class="ui mini horizontal link list">
                                                <div class="item middle aligned">
                                                    <img src="https://picsum.photos/id/1028/100" alt="" class="ui avatar image">
                                                    <div class="content"><a href="#" class="header">叶伟伟</a></div>
                                                </div>
                                                <div class="item middle aligned">
                                                    <i class="calendar icon"></i> 2020 07-29
                                                </div>
                                                <div class="item middle aligned">
                                                    <i class="eye icon"></i> 250
                                                </div>
                                            </div>
                                        </div>
                                        <div class="right aligned middle aligned five wide column">
                                            <a href="#" target="_blank" class="ui teal basic label m-padded-tiny m-text-thin">SpringBoot</a>
                                        </div>
                                    </div>
                                </div>
                                <div class="five wide column middle aligned">
                                    <a href="#" target="_blank">
                                        <img src="https://picsum.photos/id/1033/800/450" alt="" class="ui rounded image">
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div class="ui segment">
                            <div class="ui mobile reversed stackable grid">
                                <div class="eleven wide column">
                                    <h3 class="ui header">SpringBoot启动原理</h3>
                                    <p class="m-text">SpringBoot通过默认配置了很多框架的使用方式帮我们大大简化了项目初始搭建以及开发过程。本博客的目的就是一步步分析SpringBoot的启动过程，分析SpringBoot是如何帮我们简化这个过程的。</p>
                                    <div class="ui grid">
                                        <div class="eleven wide column">
                                            <div class="ui mini horizontal link list">
                                                <div class="item middle aligned">
                                                    <img src="https://picsum.photos/id/1028/100" alt="" class="ui avatar image">
                                                    <div class="content"><a href="#" class="header">叶伟伟</a></div>
                                                </div>
                                                <div class="item middle aligned">
                                                    <i class="calendar icon"></i> 2020 07-29
                                                </div>
                                                <div class="item middle aligned">
                                                    <i class="eye icon"></i> 250
                                                </div>
                                            </div>
                                        </div>
                                        <div class="right aligned middle aligned five wide column">
                                            <a href="#" target="_blank" class="ui teal basic label m-padded-tiny m-text-thin">SpringBoot</a>
                                        </div>
                                    </div>
                                </div>
                                <div class="five wide column middle aligned">
                                    <a href="#" target="_blank">
                                        <img src="https://picsum.photos/id/1033/800/450" alt="" class="ui rounded image">
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div class="ui segment">
                            <div class="ui mobile reversed stackable grid">
                                <div class="eleven wide column">
                                    <h3 class="ui header">SpringBoot启动原理</h3>
                                    <p class="m-text">SpringBoot通过默认配置了很多框架的使用方式帮我们大大简化了项目初始搭建以及开发过程。本博客的目的就是一步步分析SpringBoot的启动过程，分析SpringBoot是如何帮我们简化这个过程的。</p>
                                    <div class="ui grid">
                                        <div class="eleven wide column">
                                            <div class="ui mini horizontal link list">
                                                <div class="item middle aligned">
                                                    <img src="https://picsum.photos/id/1028/100" alt="" class="ui avatar image">
                                                    <div class="content"><a href="#" class="header">叶伟伟</a></div>
                                                </div>
                                                <div class="item middle aligned">
                                                    <i class="calendar icon"></i> 2020 07-29
                                                </div>
                                                <div class="item middle aligned">
                                                    <i class="eye icon"></i> 250
                                                </div>
                                            </div>
                                        </div>
                                        <div class="right aligned middle aligned five wide column">
                                            <a href="#" target="_blank" class="ui teal basic label m-padded-tiny m-text-thin">SpringBoot</a>
                                        </div>
                                    </div>
                                </div>
                                <div class="five wide column middle aligned">
                                    <a href="#" target="_blank">
                                        <img src="https://picsum.photos/id/1033/800/450" alt="" class="ui rounded image">
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div class="ui segment">
                            <div class="ui mobile reversed stackable grid">
                                <div class="eleven wide column">
                                    <h3 class="ui header">SpringBoot启动原理</h3>
                                    <p class="m-text">SpringBoot通过默认配置了很多框架的使用方式帮我们大大简化了项目初始搭建以及开发过程。本博客的目的就是一步步分析SpringBoot的启动过程，分析SpringBoot是如何帮我们简化这个过程的。</p>
                                    <div class="ui grid">
                                        <div class="eleven wide column">
                                            <div class="ui mini horizontal link list">
                                                <div class="item middle aligned">
                                                    <img src="https://picsum.photos/id/1028/100" alt="" class="ui avatar image">
                                                    <div class="content"><a href="#" class="header">叶伟伟</a></div>
                                                </div>
                                                <div class="item middle aligned">
                                                    <i class="calendar icon"></i> 2020 07-29
                                                </div>
                                                <div class="item middle aligned">
                                                    <i class="eye icon"></i> 250
                                                </div>
                                            </div>
                                        </div>
                                        <div class="right aligned middle aligned five wide column">
                                            <a href="#" target="_blank" class="ui teal basic label m-padded-tiny m-text-thin">SpringBoot</a>
                                        </div>
                                    </div>
                                </div>
                                <div class="five wide column middle aligned">
                                    <a href="#" target="_blank">
                                        <img src="https://picsum.photos/id/1033/800/450" alt="" class="ui rounded image">
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!--bottom-->
                    <div class="ui bottom attached segment">
                        <div class="ui middle aligned two column grid">
                            <div class="column">
                                <a href="#" class="ui mini teal basic button">上一页</a>
                            </div>
                            <div class="right aligned column">
                                <a href="#" class="ui mini teal basic button">下一页</a>
                            </div>
                        </div>
                    </div>
                </div>

                <!--右部的Top-->
                <div class="five wide column">

                    <!--分类-->
                    <div class="ui segments">
                        <div class="ui secondary segment">
                            <div class="ui two column grid">
                                <div class="column">
                                    <i class="idea icon"></i>分类
                                </div>
                                <div class="right aligned column">
                                    <a href="#" target="_blank">more<i class="angle double right icon"></i></a>
                                </div>
                            </div>
                        </div>
                        <div class="ui teal segment">
                            <div class="ui fluid vertical menu">
                                <a href="" class="item">
                                    学习笔记
                                    <div class="ui teal basic label">18</div>
                                </a>
                                <a href="" class="item">
                                    项目总结
                                    <div class="ui teal basic label">18</div>
                                </a>
                                <a href="" class="item">
                                    思考感悟
                                    <div class="ui teal basic label">18</div>
                                </a>
                                <a href="" class="item">
                                    错误日志
                                    <div class="ui teal basic label">18</div>
                                </a>
                                <a href="" class="item">
                                    数据结构与算法
                                    <div class="ui teal basic label">18</div>
                                </a>
                                <a href="" class="item">
                                    优秀文章转载
                                    <div class="ui teal basic label">18</div>
                                </a>
                            </div>
                        </div>
                    </div>

                    <!--标签-->
                    <div class="ui segments m-margin-top-large">
                        <div class="ui secondary segment">
                            <div class="ui two column grid">
                                <div class="column">
                                    <i class="tags icon"></i>标签
                                </div>
                                <div class="right aligned column">
                                    <a href="#" target="_blank">more<i class="angle double right icon"></i></a>
                                </div>
                            </div>
                        </div>
                        <div class="ui teal segment">
                            <a href="#" target="_blank" class="ui teal basic left pointing label m-margin-tb-tiny">
                                Redis
                                <div class="detail">1</div>
                            </a>
                            <a href="#" target="_blank" class="ui teal basic left pointing label m-margin-tb-tiny">
                                Css
                                <div class="detail">1</div>
                            </a>
                            <a href="#" target="_blank" class="ui teal basic left pointing label m-margin-tb-tiny">
                                HTML
                                <div class="detail">1</div>
                            </a>
                            <a href="#" target="_blank" class="ui teal basic left pointing label m-margin-tb-tiny">
                                JavaScript
                                <div class="detail">1</div>
                            </a>
                            <a href="#" target="_blank" class="ui teal basic left pointing label m-margin-tb-tiny">
                                Spring
                                <div class="detail">1</div>
                            </a>
                            <a href="#" target="_blank" class="ui teal basic left pointing label m-margin-tb-tiny">
                                Mybatis
                                <div class="detail">1</div>
                            </a>
                            <a href="#" target="_blank" class="ui teal basic left pointing label m-margin-tb-tiny">
                                SpringMVC
                                <div class="detail">1</div>
                            </a>
                        </div>
                    </div>

                    <!--最新推荐-->
                    <div class="ui segments m-margin-top-large">
                        <div class="ui secondary segment">
                            <i class="bookmark icon"></i>最新推荐
                        </div>
                        <div class="ui teal segment">
                            <div class="ui segment">
                                <a href="#" target="_blank" class="m-black m-text-thin">SpringBoot启动原理</a>
                            </div>
                            <div class="ui segment">
                                <a href="#" target="_blank" class="m-black m-text-thin">SpringBoot启动原理</a>
                            </div>
                            <div class="ui segment">
                                <a href="#" target="_blank" class="m-black m-text-thin">SpringBoot启动原理</a>
                            </div>
                            <div class="ui segment">
                                <a href="#" target="_blank" class="m-black m-text-thin">SpringBoot启动原理</a>
                            </div>
                            <div class="ui segment">
                                <a href="#" target="_blank" class="m-black m-text-thin">SpringBoot启动原理</a>
                            </div>
                        </div>
                    </div>

                    <!--二维码-->
                    <h4 class="ui horizontal divider header m-margin-top-large">扫码关注我</h4>
                    <div class="ui centered card"  style="width: 140px">
                        <img src="../static/images/wechat.jpg" alt="" class="ui rounded image">
                    </div>
                </div>
            </div>
        </div>
    </div>

    <br>
    <br>


    <!--底部footer-->
    <footer class="ui inverted vertical segment m-padded-tb-massive">
        <div class="ui center aligned container">
            <div class="ui inverted divided stackable grid">
                <div class="three wide column">
                    <div class="ui inverted link list">
                       <div class="item">
                           <img src="../static/images/wechat.jpg" class="ui rounded image" style="width: 110px">
                       </div>
                    </div>
                </div>
                <div class="four wide column">
                    <h4 class="ui inverted header m-text-thin m-text-spaced">最新博客</h4>
                    <div class="ui inverted link list">
                        <a href="#" class="item">SpringBoot</a>
                        <a href="#" class="item">Redis</a>
                        <a href="#" class="item">Mysql</a>
                    </div>
                </div>
                <div class="four wide column">
                    <h4 class="ui inverted header m-text-thin m-text-spaced">联系我</h4>
                    <div class="ui inverted link list">
                        <span class="m-text-thin m-opacity-mini">Email:ye13770663565@163.com</span>
                        <span class="m-text-thin m-opacity-mini">QQ:2013722607</span>
                    </div>
                </div>
                <div class="five wide column">
                    <h4 class="ui inverted header m-text-thin m-text-spaced">iBlog</h4>
                    <p class="m-text-thin m-text-spaced m-text-lined m-opacity-mini">这是我的个人博客，会分享日常工作学习中的相关的任何内容，希望对你有所帮助</p>
                </div>
            </div>
            <div class="ui inverted section divider"></div>
            <p class="m-text-thin m-text-spaced m-opacity-tiny">Copyright © 2019 - 2020 iBlog Designed by raging snail</p>
        </div>
    </footer>

<script src="../static/js/jquery-3.1.1.min.js"></script>
<script src="https://cdn.jsdelivr.net/semantic-ui/2.2.10/semantic.min.js"></script>

<script>
    $('.menu.toggle').click(function () {
        $('.m-item ').toggleClass('m-mobile-hide');
    });
</script>
</body>
</html>
```

#### 2.2.2 博客详情页

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>博客详情</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/semantic-ui/2.2.10/semantic.min.css">
    <link rel="stylesheet" href="../static/css/typo.css">
    <link rel="stylesheet" href="../static/css/animate.css">
    <link rel="stylesheet" href="../static/lib/prism/prism.css">
    <link rel="stylesheet" href="../static/lib/tocbot/tocbot.css">
    <link rel="stylesheet" type="text/css" href="../static/css/me.css">
</head>
<body>

    <!--导航header-->
    <nav class="ui inverted attached segment m-padded-tb-mini m-shadow-small">
        <div class="ui container">
            <div class="ui inverted secondary stackable menu">
                <h2 class="ui teal header item">iBlog</h2>
                <a href="#" class="m-item item m-mobile-hide"><i class="tiny home icon"></i>&nbsp;首页</a>
                <a href="#" class="m-item item m-mobile-hide"><i class="tiny idea icon"></i>&nbsp;分类</a>
                <a href="#" class="m-item item m-mobile-hide"><i class="tiny tags icon"></i>&nbsp;标签</a>
                <a href="#" class="m-item item m-mobile-hide"><i class="tiny clone icon"></i>归档</a>
                <a href="#" class="m-item item m-mobile-hide"><i class="tiny info icon"></i>&nbsp;关于我</a>
                <div class="m-item right item m-mobile-hide">
                    <div class="ui icon inverted transparent input">
                        <input type="text" placeholder="Search...">
                        <i class="search link icon"></i>
                    </div>
                </div>
            </div>
        </div>
        <a href="#" class="ui menu toggle black icon button m-right-top m-mobile-show">
            <i class="sidebar icon"></i>
        </a>
    </nav>

    <!--中间内容-->
    <div id="waypoint" class="m-container-small m-padded-tb-big animated fadeIn">
       <div class="ui container">
            <!--头部-->
           <div class="ui top attached segment">
               <div class="ui horizontal link list">
                   <div class="item middle aligned">
                       <img src="https://picsum.photos/id/1028/100" alt="" class="ui avatar image">
                       <div class="content"><a href="#" class="header">叶伟伟</a></div>
                   </div>
                   <div class="item middle aligned">
                       <i class="calendar icon"></i> 2020 07-29
                   </div>
                   <div class="item middle aligned">
                       <i class="eye icon"></i> 250
                   </div>
               </div>
           </div>

           <!--图片-->
           <div class="ui attached segment">
               <img src="https://picsum.photos/id/1033/800/450" alt="" class="ui fluid rounded image">
           </div>

           <!--内容-->
           <div class="ui attached padded segment">
               <div class="ui right aligned basic segment">
                   <div class="ui orange basic label">原创</div>
               </div>

               <h2 class="ui center aligned header">SpringBoot启动原理</h2>

               <pre><code class="language-css">p { color: red }</code></pre>

               <div id="content" class="typo typo-selection js-toc-content m-padded-lr-responsive m-padded-tb-large">
                   <h2 id="section1">一、关于 <i class="serif">Typo.css</i></h2>

                   <p><i class="serif">Typo.css</i> 的目的是，在一致化浏览器排版效果的同时，构建最适合中文阅读的网页排版。</p>
                   <h4>现状和如何去做：</h4>

                   <p class="typo-first">排版是一个麻烦的问题 <sup><a href="#appendix1"># 附录一</a></sup>，需要精心设计，而这个设计却是常被视觉设计师所忽略的。前端工程师更常看到这样的问题，但不便变更。因为在多个 OS 中的不同浏览器渲染不同，改动需要多的时间做回归测试，所以改变变得更困难。而像我们一般使用的
                       Yahoo、Eric Meyer 和 Alice base.css 中采用的 Reset 都没有很好地考虑中文排版。<i class="serif">Typo.css</i> 要做的就是解决中文排版的问题。</p>

                   <p><strong><i class="serif">Typo.css</i> 测试于如下平台：</strong></p>
                   <table class="ui table" summary="Typo.css 的测试平台列表">
                       <thead>
                       <tr>
                           <th>OS/浏览器</th>
                           <th>Firefox</th>
                           <th>Chrome</th>
                           <th>Safari</th>
                           <th>Opera</th>
                           <th>IE9</th>
                           <th>IE8</th>
                           <th>IE7</th>
                           <th>IE6</th>
                       </tr>
                       </thead>
                       <tbody>
                       <tr>
                           <td>OS X</td>
                           <td>✔</td>
                           <td>✔</td>
                           <td>✔</td>
                           <td>✔</td>
                           <td>-</td>
                           <td>-</td>
                           <td>-</td>
                           <td>-</td>
                       </tr>
                       <tr>
                           <td>Win 7</td>
                           <td>✔</td>
                           <td>✔</td>
                           <td>✔</td>
                           <td>✔</td>
                           <td>✔</td>
                           <td>✔</td>
                           <td>✔</td>
                           <td>-</td>
                       </tr>
                       <tr>
                           <td>Win XP</td>
                           <td>✔</td>
                           <td>✔</td>
                           <td>✔</td>
                           <td>✔</td>
                           <td>-</td>
                           <td>✔</td>
                           <td>✔</td>
                           <td>✔</td>
                       </tr>
                       <tr>
                           <td>Ubuntu</td>
                           <td>✔</td>
                           <td>✔</td>
                           <td>-</td>
                           <td>✔</td>
                           <td>-</td>
                           <td>-</td>
                           <td>-</td>
                           <td>-</td>
                       </tr>
                       </tbody>
                   </table>

                   <h4>中文排版的重点和难点</h4>

                   <p>在中文排版中，HTML4 的很多标准在语义在都有照顾到。但从视觉效果上，却很难利用单独的 CSS 来实现，像<abbr title="在文字下多加一个点">着重号</abbr>（例：这里<em class="typo-em">强调一下</em>）。在 HTML4 中，专名号标签（<code>&lt;u&gt;</code>）已经被放弃，而
                       HTML5 被<a href="//html5doctor.com/u-element/">重新提起</a>。<i class="serif">Typo.css</i> 也根据实际情况提供相应的方案。我们重要要注意的两点是：</p>
                   <ol>
                       <li>语义：语义对应的用法和样式是否与中文排版一致</li>
                       <li>表现：在各浏览器中的字体、大小和缩放是否如排版预期</li>
                   </ol>
                   <p>对于这些，<i class="serif">Typo.css</i> 排版项目的中文偏重注意点，都添加在附录中，详见：</p>
                   <blockquote>
                       <b>附录一</b>：<a href="#appendix1"><i class="serif">Typo.css</i> 排版偏重点</a>
                   </blockquote>

                   <p>目前已有像百姓网等全面使用 <i class="serif">Typo.css</i> 的项目，测试平台的覆盖，特别是在<abbr title="手机、平板电脑等移动平台">移动端</abbr>上还没有覆盖完主流平台，希望有能力的同学能加入测试行列，或者加入到 <i class="serif">Typo.css</i>
                       的开发。加入方法：<a href="https://github.com/sofish/Typo.css">参与 <i class="serif">Typo.css</i> 开发</a>。如有批评、建议和意见，也随时欢迎给在 Github 直接提 <a
                               href="https://github.com/sofish/Typo.css/issues">issues</a>，或给<abbr title="Sofish Lin, author of Typo.css"
                                                                                                   role="author">我</abbr>发<a
                               href="mailto:sofish@icloud.com">邮件</a>。</p>


                   <h2 id="section2">二、排版实例：</h2>

                   <p>提供2个排版实例，第一个中文实例来自于来自于<cite class="typo-unique">张燕婴</cite>的《论语》，由于古文排版涉及到的元素比较多，所以采用《论语》中《学而》的第一篇作为排版实例介绍；第2个来自到经典的
                       Lorem Ipsum，并加入了一些代码和列表等比较具有代表性的排版元素。</p>

                   <h3 id="section2-1">例1：论语学而篇第一</h3>

                   <p>
                       <small><b>作者：</b><abbr title="名丘，字仲尼">孔子</abbr>（
                           <time>前551年9月28日－前479年4月11日</time>
                           ）
                       </small>
                   </p>

                   <h4>本篇引语</h4>

                   <p>
                       《学而》是《论语》第一篇的篇名。《论语》中各篇一般都是以第一章的前二三个字作为该篇的篇名。《学而》一篇包括16章，内容涉及诸多方面。其中重点是「吾日三省吾身」；「节用而爱人，使民以时」；「礼之用，和为贵」以及仁、孝、信等道德范畴。 </p>

                   <h4>原文</h4>

                   <p>子曰：「学而时习之，不亦说乎？有朋自远方来，不亦乐乎？人不知，而不愠，不亦君子乎？」 </p>

                   <h4>译文</h4>

                   <p>孔子说：「学了又时常温习和练习，不是很愉快吗？有志同道合的人从远方来，不是很令人高兴的吗？人家不了解我，我也不怨恨、恼怒，不也是一个有德的君子吗？」 </p>

                   <h4>评析</h4>

                   <p>宋代著名学者<u class="typo-u">朱熹</u>对此章评价极高，说它是「入道之门，积德之基」。本章这三句话是人们非常熟悉的。历来的解释都是：学了以后，又时常温习和练习，不也高兴吗等等。三句话，一句一个意思，前后句子也没有什么连贯性。但也有人认为这样解释不符合原义，指出这里的「学」不是指学习，而是指学说或主张；「时」不能解为时常，而是时代或社会的意思，「习」不是温习，而是使用，引申为采用。而且，这三句话不是孤立的，而是前后相互连贯的。这三句的意思是：自己的学说，要是被社会采用了，那就太高兴了；退一步说，要是没有被社会所采用，可是很多朋友赞同<abbr
                           title="张燕婴">我</abbr>的学说，纷纷到我这里来讨论问题，我也感到快乐；再退一步说，即使社会不采用，人们也不理解我，我也不怨恨，这样做，不也就是君子吗？（见《齐鲁学刊》1986年第6期文）这种解释可以自圆其说，而且也有一定的道理，供读者在理解本章内容时参考。
                   </p>

                   <p>此外，在对「人不知，而不愠」一句的解释中，也有人认为，「人不知」的后面没有宾语，人家不知道什么呢？当时因为孔子有说话的特定环境，他不需要说出知道什么，别人就可以理解了，却给后人留下一个谜。有人说，这一句是接上一句说的，从远方来的朋友向我求教，我告诉他，他还不懂，我却不怨恨。这样，「人不知」就是「人家不知道我所讲述的」了。这样的解释似乎有些牵强。</p>

                   <p>总之，本章提出以学习为乐事，做到人不知而不愠，反映出孔子学而不厌、诲人不倦、注重修养、严格要求自己的主张。这些思想主张在《论语》书中多处可见，有助于对第一章内容的深入了解。</p>

                   <h3 id="section2-2">例2：英文排版</h3>

                   <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's
                       standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a
                       type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining
                       essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum
                       passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem
                       Ipsum.</p>
                   <blockquote>
                       Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna
                       aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                   </blockquote>

                   <h4>The standard Lorem Ipsum passage, used since the 1500s</h4>

                   <p>"Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna
                       aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                       Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
                       occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."</p>

                   <h4>Section 1.10.32 of "de Finibus Bonorum et Malorum", written by Cicero in 45 BC</h4>

                   <p>"Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam,
                       eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam
                       voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione
                       voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci
                       velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim
                       ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi
                       consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur,
                       vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?"</p>

                   <h4>List style in action</h4>
                   <ul>
                       <li>If you wish to succeed, you should use persistence as your good friend, experience as your reference, prudence as
                           your brother and hope as your sentry.
                           <p>如果你希望成功，当以恒心为良友，以经验为参谋，以谨慎为兄弟，以希望为哨兵。</p>
                       </li>
                       <li>Sometimes one pays most for the things one gets for nothing.
                           <p>有时候一个人为不花钱得到的东西付出的代价最高。</p>
                       </li>
                       <li>Only those who have the patience to do simple things perfectly ever acquire the skill to do difficult things
                           easily.
                           <p>只有有耐心圆满完成简单工作的人，才能够轻而易举的完成困难的事。</p>
                       </li>
                   </ul>

                   <h4>You may want to create a perfect <code>&lt;hr /&gt;</code> line, despite the fact that there will never have one
                   </h4>
                   <hr/>
                   <p><abbr title="法国作家罗切福考尔德">La Racheforcauld</abbr> said:
                       <mark>"Few things are impossible in themselves; and it is often for want of will, rather than of means, that man fails
                           to succeed".
                       </mark>
                       You just need to follow the browser's behavior, and set a right <code>margin</code> to it。it will works nice as the
                       demo you're watching now. The following code is the best way to render typo in Chinese:
                   </p>
                   <pre class="language-css"><code>
/* 标题应该更贴紧内容，并与其他块区分，margin 值要相应做优化 */
h1,h2,h3,h4,h5,h6 {
    line-height:1;font-family:Arial,sans-serif;margin:1.4em 0 0.8em;
}
h1{font-size:1.8em;}
h2{font-size:1.6em;}
h3{font-size:1.4em;}
h4{font-size:1.2em;}
h5,h6{font-size:1em;}

/* 现代排版：保证块/段落之间的空白隔行 */
.typo p, .typo pre, .typo ul, .typo ol, .typo dl, .typo form, .typo hr {
    margin:1em 0 0.6em;
}
</code></pre>

                   <h3 id="section3">三、附录</h3>

                   <h5 id="appendix1">1、<i class="serif">Typo.css</i> 排版偏重点</h5>
                   <table class="ui table" summary="Typo.css 排版偏重点">
                       <thead>
                       <tr>
                           <th>类型</th>
                           <th>语义</th>
                           <th>标签</th>
                           <th>注意点</th>
                       </tr>
                       </thead>
                       <tbody>
                       <tr>
                           <th rowspan="15">基础标签</th>
                           <td>标题</td>
                           <td><code>h1</code> ～ <code>h6</code></td>
                           <td>全局不强制大小，<code>.typo</code> 中标题与其对应的内容应紧贴，并且有相应的大小设置</td>
                       </tr>
                       <tr>
                           <td>上、下标</td>
                           <td><code>sup</code>/<code>sub</code></td>
                           <td>保持与 MicroSoft Office Word 等程序的日常排版一致</td>
                       </tr>
                       <tr>
                           <td>引用</td>
                           <td><code>blockquote</code></td>
                           <td>显示/嵌套样式</td>
                       </tr>
                       <tr>
                           <td>缩写</td>
                           <td><code>abbr</code></td>
                           <td>是否都有下划线，鼠标 <code>hover</code> 是否为帮助手势</td>
                       </tr>
                       <tr>
                           <td>分割线</td>
                           <td><code>hr</code></td>
                           <td>显示的 <code>padding</code> 和 <code>margin</code>正确</td>
                       </tr>
                       <tr>
                           <td>列表</td>
                           <td><code>ul</code>/<code>ol</code>/<code>dl</code></td>
                           <td>在全局没有 <code>list-style</code>，在 .<code>typo</code> 中对齐正确</td>
                       </tr>
                       <tr>
                           <td>定义列表</td>
                           <td><code>dl</code></td>
                           <td>全局 <code>padding</code> 和 <code>margin</code>为0， .<code>typo</code> 中对齐正确</td>
                       </tr>
                       <tr>
                           <td>选项</td>
                           <td><code>input[type=radio[, checkbox]]</code></td>
                           <td>与其他 <code>form</code> 元素排版时是否居中</td>
                       </tr>
                       <tr>
                           <td>斜体</td>
                           <td><code>i</code></td>
                           <td>只设置一种斜体，让 <code>em</code> 和 <code>cite</code> 显示为正体</td>
                       </tr>
                       <tr>
                           <td>强调</td>
                           <td><code>em</code></td>
                           <td>在全局显示正体，在 <code>.typo</code> 中显示与 <code>b</code> 和 <code>strong</code> 的样式一致，为粗体</td>
                       </tr>
                       <tr>
                           <td>加强</td>
                           <td><code>strong/b</code></td>
                           <td>显示为粗体</td>
                       </tr>
                       <tr>
                           <td>标记</td>
                           <td><code>mark</code></td>
                           <td>类似荧光笔</td>
                       </tr>
                       <tr>
                           <td>印刷</td>
                           <td><code>small</code></td>
                           <td>保持为正确字体的 80% 大小，颜色设置为浅灰色</td>
                       </tr>
                       <tr>
                           <td>表格</td>
                           <td><code>table</code></td>
                           <td>全局不显示线条，在 <code>table</code> 中显示表格外框，并且表头有浅灰背景</td>
                       </tr>
                       <tr>
                           <td>代码</td>
                           <td><code>pre</code>/<code>code</code></td>
                           <td>字体使用 <code>courier</code> 系字体，保持与 <code>serif</code> 有比较一致的显示效果</td>
                       </tr>
                       <tr>
                           <th rowspan="5">特殊符号</th>
                           <td>着重号</td>
                           <td><em class="typo-em">在文字下加点</em></td>
                           <td>在支持 <code>:after</code> 和 <code>:before</code> 的浏览器可以做渐进增强实现</td>
                       </tr>
                       <tr>
                           <td>专名号</td>
                           <td><u>林建锋</u></td>
                           <td>专名号，有下划线，使用 <code>u</code> 或都 <code>.typo-u</code> 类</td>
                       </tr>
                       <tr>
                           <td>破折号</td>
                           <td>——</td>
                           <td>保持一划，而非两划</td>
                       </tr>
                       <tr>
                           <td>人民币</td>
                           <td>&yen;</td>
                           <td>使用两平等线的符号，或者 HTML 实体符号 <code>&amp;yen;</code></td>
                       </tr>
                       <tr>
                           <td>删除符</td>
                           <td>
                               <del>已删除（deleted）</del>
                           </td>
                           <td>一致化各浏览器显示，中英混排正确</td>
                       </tr>
                       <tr>
                           <th rowspan="3">加强类</th>
                           <td>专名号</td>
                           <td><code>.typo-u</code></td>
                           <td>由于 <code>u</code> 被 HTML4 放弃，在向后兼容上推荐使用 <code>.typo-u</code></td>
                       </tr>
                       <tr>
                           <td>着重符</td>
                           <td><code>.typo-em</code></td>
                           <td>利用 <code>:after</code> 和 <code>:before</code> 实现着重符</td>
                       </tr>
                       <tr>
                           <td>清除浮动</td>
                           <td><code>.clearfix</code></td>
                           <td>与一般 CSS Reset 保持一对致 API</td>
                       </tr>
                       <tr>
                           <th rowspan="5">注意点</th>
                           <td colspan="3">（1）中英文混排行高/行距</td>
                       </tr>
                       <tr>
                           <td colspan="3">（2）上下标在 IE 中显示效果</td>
                       </tr>
                       <tr>
                           <td colspan="3">（3）块/段落分割空白是否符合设计原则</td>
                       </tr>
                       <tr>
                           <td colspan="3">（4）input 多余空间问题</td>
                       </tr>
                       <tr>
                           <td colspan="3">（5）默认字体色彩，目前采用 <code>#333</code> 在各种浏览显示比较好</td>
                       </tr>
                       </tbody>
                   </table>

                   <h5 id="appendix2">2、开源许可</h5>
               </div>

               <!--标签-->
               <div class="m-padded-lr-responsive">
                   <div class="ui basic teal left pointing label">SpringBoot</div>
               </div>

               <!--赞赏-->
               <div class="ui center aligned basic segment">
                   <button id="payButton" class="ui orange basic circular button">赞赏</button>
               </div>
               <div class="ui payQR flowing popup transition hidden">
                   <div class="ui orange basic label">
                       <div class="ui images" style="font-size: inherit !important;">
                           <div class="image">
                               <img src="../static/images/alipay.jpg" alt="" class="ui rounded bordered image" style="width: 120px; height: 120px">
                               <div>支付宝支付</div>
                           </div>
                           <div class="image">
                               <img src="../static/images/wepay.jpg" alt="" class="ui rounded bordered image" style="width: 120px; height: 120px">
                               <div>微信支付</div>
                           </div>
                       </div>
                   </div>
               </div>
           </div>

           <!--信息-->
           <div class="ui attached positive message">
               <div class="ui grid">
                   <div class="eleven wide middle aligned column">
                       <ui class="list">
                           <li>作者：叶伟伟（联系作者）</li>
                           <li>发表时间：2020-07-30 09:30</li>
                           <li>版权声明：自由转载-非商用-非衍生-保持署名（创意共享3.0许可证）</li>
                           <li>公众号转载：请在文末添加作者公众号二维码</li>
                       </ui>
                   </div>
                   <div class="five wide column">
                       <img src="../static/images/wechat.jpg" alt="" class="ui rounded bordered right floated image" style="width: 110px">
                   </div>
               </div>
           </div>

           <!--评论-->
           <div id="comment-container" class="ui bottom attached segment">
               <div class="ui teal segment">
                   <div class="ui comments">
                       <h3 class="ui dividing header">Comments</h3>
                       <div class="comment">
                           <a class="avatar">
                               <img src="https://picsum.photos/id/1005/100">
                           </a>
                           <div class="content">
                               <a class="author">Matt</a>
                               <div class="metadata">
                                   <span class="date">Today at 5:42PM</span>
                               </div>
                               <div class="text">
                                   How artistic!
                               </div>
                               <div class="actions">
                                   <a class="reply">回复</a>
                               </div>
                           </div>
                       </div>
                       <div class="comment">
                           <a class="avatar">
                               <img src="https://picsum.photos/id/1027/100">
                           </a>
                           <div class="content">
                               <a class="author">Elliot Fu</a>
                               <div class="metadata">
                                   <span class="date">Yesterday at 12:30AM</span>
                               </div>
                               <div class="text">
                                   <p>This has been very useful for my research. Thanks as well!</p>
                               </div>
                               <div class="actions">
                                   <a class="reply">回复</a>
                               </div>
                           </div>
                           <div class="comments">
                               <div class="comment">
                                   <a class="avatar">
                                       <img src="https://picsum.photos/id/338/100">
                                   </a>
                                   <div class="content">
                                       <a class="author">Jenny Hess</a>
                                       <div class="metadata">
                                           <span class="date">Just now</span>
                                       </div>
                                       <div class="text">
                                           Elliot you are always so right :)
                                       </div>
                                       <div class="actions">
                                           <a class="reply">回复</a>
                                       </div>
                                   </div>
                               </div>
                           </div>
                       </div>
                       <div class="comment">
                           <a class="avatar">
                               <img src="https://picsum.photos/id/349/100">
                           </a>
                           <div class="content">
                               <a class="author">Joe Henderson</a>
                               <div class="metadata">
                                   <span class="date">5 days ago</span>
                               </div>
                               <div class="text">
                                   Dude, this is awesome. Thanks so much
                               </div>
                               <div class="actions">
                                   <a class="reply">回复</a>
                               </div>
                           </div>
                       </div>
                   </div>
               </div>
               <div class="ui form">
                   <div class="field">
                       <textarea name="content" id="" placeholder="请输入评论信息......" cols="30" rows="10"></textarea>
                   </div>
                   <div class="fields">
                       <div class="field m-mobile-wide m-margin-bottom-small">
                           <div class="ui left icon input">
                               <i class="user icon"></i>
                               <input type="text" name="nickname" placeholder="昵称">
                           </div>
                       </div>
                       <div class="field m-mobile-wide m-margin-bottom-small">
                           <div class="ui left icon input">
                               <i class="mail icon"></i>
                               <input type="text" name="email" placeholder="邮箱">
                           </div>
                       </div>
                       <div class="field m-mobile-wide m-margin-bottom-small">
                           <button class="ui teal button m-mobile-wide"><i class="edit icon"></i>发布</button>
                       </div>
                   </div>
               </div>
           </div>
       </div>
    </div>

    <div id="toolbar" class="m-padded m-fixed m-right-bottom" style="display: none">
        <div class="ui vertical icon buttons">
            <button type="button" class="ui toc teal button">目录</button>
            <button id="toComment-button" class="ui teal button">留言</button>
            <button class="ui wechat icon button"><i class="weixin icon"></i></button>
            <button id="toTop-button" class="ui icon button"><i class="chevron up icon"></i></button>
        </div>
    </div>

    <div class="ui toc-container flowing popup transition hidden" style="width: 250px !important;">
        <ol class="js-toc"></ol>
    </div>

    <div id="qrcode" class="ui wechat-QR flowing popup transition hidden" style="width: 130px;">
<!--        <img src="./static/images/wechat.jpg" alt="" class="ui rounded image" style="width: 120px">-->
    </div>

    <br>
    <br>

    <!--底部footer-->
    <footer class="ui inverted vertical segment m-padded-tb-massive">
        <div class="ui center aligned container">
            <div class="ui inverted divided stackable grid">
                <div class="three wide column">
                    <div class="ui inverted link list">
                       <div class="item">
                           <img src="../static/images/wechat.jpg" class="ui rounded image" style="width: 110px">
                       </div>
                    </div>
                </div>
                <div class="four wide column">
                    <h4 class="ui inverted header m-text-thin m-text-spaced">最新博客</h4>
                    <div class="ui inverted link list">
                        <a href="#" class="item">SpringBoot</a>
                        <a href="#" class="item">Redis</a>
                        <a href="#" class="item">Mysql</a>
                    </div>
                </div>
                <div class="four wide column">
                    <h4 class="ui inverted header m-text-thin m-text-spaced">联系我</h4>
                    <div class="ui inverted link list">
                        <span class="m-text-thin m-opacity-mini">Email:ye13770663565@163.com</span>
                        <span class="m-text-thin m-opacity-mini">QQ:2013722607</span>
                    </div>
                </div>
                <div class="five wide column">
                    <h4 class="ui inverted header m-text-thin m-text-spaced">iBlog</h4>
                    <p class="m-text-thin m-text-spaced m-text-lined m-opacity-mini">这是我的个人博客，会分享日常工作学习中的相关的任何内容，希望对你有所帮助</p>
                </div>
            </div>
            <div class="ui inverted section divider"></div>
            <p class="m-text-thin m-text-spaced m-opacity-tiny">Copyright © 2019 - 2020 iBlog Designed by raging snail</p>
        </div>
    </footer>

<script src="../static/js/jquery-3.1.1.min.js"></script>
<script src="https://cdn.jsdelivr.net/semantic-ui/2.2.10/semantic.min.js"></script>
<script src="//cdn.jsdelivr.net/npm/jquery.scrollto@2.1.2/jquery.scrollTo.min.js"></script>
<script src="../static/lib/prism/prism.js"></script>
<script src="../static/lib/tocbot/tocbot.min.js"></script>
<script src="../static/lib/qrcode/qrcode.min.js"></script>
<script src="../static/lib/waypoints/jquery.waypoints.min.js"></script>

<script>
    $('.menu.toggle').click(function () {
        $('.m-item ').toggleClass('m-mobile-hide');
    });

    $('#payButton').popup({
       popup : $('.payQR.popup'),
       on : 'click',
       position : 'bottom center'
    });

    tocbot.init({
        // Where to render the table of contents.
        tocSelector: '.js-toc',
        // Where to grab the headings to build the table of contents.
        contentSelector: '.js-toc-content',
        // Which headings to grab inside of the contentSelector element.
        headingSelector: 'h1, h2, h3',
        // For headings inside relative or absolute positioned containers within content.
        hasInnerContainers: true,
    });

    $('.toc.button').popup({
        popup : $('.toc-container.popup'),
        on : 'click',
        position : 'left center'
    });

    $('.wechat').popup({
        popup : $('.wechat-QR.popup'),
        on : 'hover',
        position : 'left center'
    });

    var qrcode = new QRCode("qrcode", {
        text: "http://jindo.dev.naver.com/collie",
        width: 110,
        height: 110,
        colorDark : "#000000",
        colorLight : "#ffffff",
        correctLevel : QRCode.CorrectLevel.H
    });

    $('#toTop-button').click(function () {
        $(window).scrollTo(0,500);
    });

    $('#toComment-button').click(function () {
        $(window).scrollTo($('#comment-container'),500);
    });

    var waypoint = new Waypoint({
        element: document.getElementById('waypoint'),
        handler: function(direction) {
            if (direction == 'down') {
                $('#toolbar').show(300);
            }else {
                $('#toolbar').hide(500);
            }
            console.log('Scrolled to waypoint!' + direction)
        }
    })
</script>
</body>
</html>
```

#### 2.2.3 分类页面

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>分类</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/semantic-ui/2.2.10/semantic.min.css">
    <link rel="stylesheet" type="text/css" href="../static/css/me.css">
</head>
<body>

    <!--导航header-->
    <nav class="ui inverted attached segment m-padded-tb-mini m-shadow-small">
        <div class="ui container">
            <div class="ui inverted secondary stackable menu">
                <h2 class="ui teal header item">iBlog</h2>
                <a href="#" class="m-item item m-mobile-hide"><i class="tiny home icon"></i>&nbsp;首页</a>
                <a href="#" class="active m-item item m-mobile-hide"><i class="tiny idea icon"></i>&nbsp;分类</a>
                <a href="#" class="m-item item m-mobile-hide"><i class="tiny tags icon"></i>&nbsp;标签</a>
                <a href="#" class="m-item item m-mobile-hide"><i class="tiny clone icon"></i>归档</a>
                <a href="#" class="m-item item m-mobile-hide"><i class="tiny info icon"></i>&nbsp;关于我</a>
                <div class="m-item right item m-mobile-hide">
                    <div class="ui icon inverted transparent input">
                        <input type="text" placeholder="Search...">
                        <i class="search link icon"></i>
                    </div>
                </div>
            </div>
        </div>
        <a href="#" class="ui menu toggle black icon button m-right-top m-mobile-show">
            <i class="sidebar icon"></i>
        </a>
    </nav>

    <!--中间内容-->
    <div class="m-container-small m-padded-tb-big">
       <div class="ui container">
           <!--top-->
           <div class="ui top attached segment">
               <div class="ui middle aligned two column grid">
                   <div class="column">
                       <h3 class="ui teal header">分类</h3>
                   </div>
                   <div class="right aligned column">
                       共<h2 class="ui orange header m-inline-block m-text-thin">15</h2>个
                   </div>
               </div>
           </div>

           <div class="ui attached segment m-padded-tb-large">
               <div class="ui labeled button m-margin-tb-tiny">
                   <a href="#" class="ui basic teal button">学习笔记</a>
                   <div class="ui basic teal left pointing label">24</div>
               </div>
               <div class="ui labeled button m-margin-tb-tiny">
                   <a href="#" class="ui basic button">项目总结</a>
                   <div class="ui basic left pointing label">24</div>
               </div>
               <div class="ui labeled button m-margin-tb-tiny">
                   <a href="#" class="ui basic button">思考感悟</a>
                   <div class="ui basic left pointing label">24</div>
               </div>
               <div class="ui labeled button m-margin-tb-tiny">
                   <a href="#" class="ui basic button">错误日志</a>
                   <div class="ui basic left pointing label">24</div>
               </div>
               <div class="ui labeled button m-margin-tb-tiny">
                   <a href="#" class="ui basic button">数据结构与算法</a>
                   <div class="ui basic left pointing label">24</div>
               </div>
               <div class="ui labeled button m-margin-tb-tiny">
                   <a href="#" class="ui basic button">优秀文章转载</a>
                   <div class="ui basic left pointing label">24</div>
               </div>
           </div>

           <div class="ui top attached teal segment">
               <div class="ui segment">
                   <div class="ui mobile reversed stackable grid">
                       <div class="eleven wide column">
                           <h3 class="ui header">SpringBoot启动原理</h3>
                           <p class="m-text">SpringBoot通过默认配置了很多框架的使用方式帮我们大大简化了项目初始搭建以及开发过程。本博客的目的就是一步步分析SpringBoot的启动过程，分析SpringBoot是如何帮我们简化这个过程的。</p>
                           <div class="ui grid">
                               <div class="eleven wide column">
                                   <div class="ui mini horizontal link list">
                                       <div class="item middle aligned">
                                           <img src="https://picsum.photos/id/1028/100" alt="" class="ui avatar image">
                                           <div class="content"><a href="#" class="header">叶伟伟</a></div>
                                       </div>
                                       <div class="item middle aligned">
                                           <i class="calendar icon"></i> 2020 07-29
                                       </div>
                                       <div class="item middle aligned">
                                           <i class="eye icon"></i> 250
                                       </div>
                                   </div>
                               </div>
                               <div class="right aligned middle aligned five wide column">
                                   <a href="#" target="_blank" class="ui teal basic label m-padded-tiny m-text-thin">SpringBoot</a>
                               </div>
                           </div>
                       </div>
                       <div class="five wide column middle aligned">
                           <a href="#" target="_blank">
                               <img src="https://picsum.photos/id/1033/800/450" alt="" class="ui rounded image">
                           </a>
                       </div>
                   </div>
               </div>
               <div class="ui segment">
                   <div class="ui mobile reversed stackable grid">
                       <div class="eleven wide column">
                           <h3 class="ui header">SpringBoot启动原理</h3>
                           <p class="m-text">SpringBoot通过默认配置了很多框架的使用方式帮我们大大简化了项目初始搭建以及开发过程。本博客的目的就是一步步分析SpringBoot的启动过程，分析SpringBoot是如何帮我们简化这个过程的。</p>
                           <div class="ui grid">
                               <div class="eleven wide column">
                                   <div class="ui mini horizontal link list">
                                       <div class="item middle aligned">
                                           <img src="https://picsum.photos/id/1028/100" alt="" class="ui avatar image">
                                           <div class="content"><a href="#" class="header">叶伟伟</a></div>
                                       </div>
                                       <div class="item middle aligned">
                                           <i class="calendar icon"></i> 2020 07-29
                                       </div>
                                       <div class="item middle aligned">
                                           <i class="eye icon"></i> 250
                                       </div>
                                   </div>
                               </div>
                               <div class="right aligned middle aligned five wide column">
                                   <a href="#" target="_blank" class="ui teal basic label m-padded-tiny m-text-thin">SpringBoot</a>
                               </div>
                           </div>
                       </div>
                       <div class="five wide column middle aligned">
                           <a href="#" target="_blank">
                               <img src="https://picsum.photos/id/1033/800/450" alt="" class="ui rounded image">
                           </a>
                       </div>
                   </div>
               </div>
               <div class="ui segment">
                   <div class="ui mobile reversed stackable grid">
                       <div class="eleven wide column">
                           <h3 class="ui header">SpringBoot启动原理</h3>
                           <p class="m-text">SpringBoot通过默认配置了很多框架的使用方式帮我们大大简化了项目初始搭建以及开发过程。本博客的目的就是一步步分析SpringBoot的启动过程，分析SpringBoot是如何帮我们简化这个过程的。</p>
                           <div class="ui grid">
                               <div class="eleven wide column">
                                   <div class="ui mini horizontal link list">
                                       <div class="item middle aligned">
                                           <img src="https://picsum.photos/id/1028/100" alt="" class="ui avatar image">
                                           <div class="content"><a href="#" class="header">叶伟伟</a></div>
                                       </div>
                                       <div class="item middle aligned">
                                           <i class="calendar icon"></i> 2020 07-29
                                       </div>
                                       <div class="item middle aligned">
                                           <i class="eye icon"></i> 250
                                       </div>
                                   </div>
                               </div>
                               <div class="right aligned middle aligned five wide column">
                                   <a href="#" target="_blank" class="ui teal basic label m-padded-tiny m-text-thin">SpringBoot</a>
                               </div>
                           </div>
                       </div>
                       <div class="five wide column middle aligned">
                           <a href="#" target="_blank">
                               <img src="https://picsum.photos/id/1033/800/450" alt="" class="ui rounded image">
                           </a>
                       </div>
                   </div>
               </div>
               <div class="ui segment">
                   <div class="ui mobile reversed stackable grid">
                       <div class="eleven wide column">
                           <h3 class="ui header">SpringBoot启动原理</h3>
                           <p class="m-text">SpringBoot通过默认配置了很多框架的使用方式帮我们大大简化了项目初始搭建以及开发过程。本博客的目的就是一步步分析SpringBoot的启动过程，分析SpringBoot是如何帮我们简化这个过程的。</p>
                           <div class="ui grid">
                               <div class="eleven wide column">
                                   <div class="ui mini horizontal link list">
                                       <div class="item middle aligned">
                                           <img src="https://picsum.photos/id/1028/100" alt="" class="ui avatar image">
                                           <div class="content"><a href="#" class="header">叶伟伟</a></div>
                                       </div>
                                       <div class="item middle aligned">
                                           <i class="calendar icon"></i> 2020 07-29
                                       </div>
                                       <div class="item middle aligned">
                                           <i class="eye icon"></i> 250
                                       </div>
                                   </div>
                               </div>
                               <div class="right aligned middle aligned five wide column">
                                   <a href="#" target="_blank" class="ui teal basic label m-padded-tiny m-text-thin">SpringBoot</a>
                               </div>
                           </div>
                       </div>
                       <div class="five wide column middle aligned">
                           <a href="#" target="_blank">
                               <img src="https://picsum.photos/id/1033/800/450" alt="" class="ui rounded image">
                           </a>
                       </div>
                   </div>
               </div>
               <div class="ui segment">
                   <div class="ui mobile reversed stackable grid">
                       <div class="eleven wide column">
                           <h3 class="ui header">SpringBoot启动原理</h3>
                           <p class="m-text">SpringBoot通过默认配置了很多框架的使用方式帮我们大大简化了项目初始搭建以及开发过程。本博客的目的就是一步步分析SpringBoot的启动过程，分析SpringBoot是如何帮我们简化这个过程的。</p>
                           <div class="ui grid">
                               <div class="eleven wide column">
                                   <div class="ui mini horizontal link list">
                                       <div class="item middle aligned">
                                           <img src="https://picsum.photos/id/1028/100" alt="" class="ui avatar image">
                                           <div class="content"><a href="#" class="header">叶伟伟</a></div>
                                       </div>
                                       <div class="item middle aligned">
                                           <i class="calendar icon"></i> 2020 07-29
                                       </div>
                                       <div class="item middle aligned">
                                           <i class="eye icon"></i> 250
                                       </div>
                                   </div>
                               </div>
                               <div class="right aligned middle aligned five wide column">
                                   <a href="#" target="_blank" class="ui teal basic label m-padded-tiny m-text-thin">SpringBoot</a>
                               </div>
                           </div>
                       </div>
                       <div class="five wide column middle aligned">
                           <a href="#" target="_blank">
                               <img src="https://picsum.photos/id/1033/800/450" alt="" class="ui rounded image">
                           </a>
                       </div>
                   </div>
               </div>
               <div class="ui segment">
                   <div class="ui mobile reversed stackable grid">
                       <div class="eleven wide column">
                           <h3 class="ui header">SpringBoot启动原理</h3>
                           <p class="m-text">SpringBoot通过默认配置了很多框架的使用方式帮我们大大简化了项目初始搭建以及开发过程。本博客的目的就是一步步分析SpringBoot的启动过程，分析SpringBoot是如何帮我们简化这个过程的。</p>
                           <div class="ui grid">
                               <div class="eleven wide column">
                                   <div class="ui mini horizontal link list">
                                       <div class="item middle aligned">
                                           <img src="https://picsum.photos/id/1028/100" alt="" class="ui avatar image">
                                           <div class="content"><a href="#" class="header">叶伟伟</a></div>
                                       </div>
                                       <div class="item middle aligned">
                                           <i class="calendar icon"></i> 2020 07-29
                                       </div>
                                       <div class="item middle aligned">
                                           <i class="eye icon"></i> 250
                                       </div>
                                   </div>
                               </div>
                               <div class="right aligned middle aligned five wide column">
                                   <a href="#" target="_blank" class="ui teal basic label m-padded-tiny m-text-thin">SpringBoot</a>
                               </div>
                           </div>
                       </div>
                       <div class="five wide column middle aligned">
                           <a href="#" target="_blank">
                               <img src="https://picsum.photos/id/1033/800/450" alt="" class="ui rounded image">
                           </a>
                       </div>
                   </div>
               </div>
               <div class="ui segment">
                   <div class="ui mobile reversed stackable grid">
                       <div class="eleven wide column">
                           <h3 class="ui header">SpringBoot启动原理</h3>
                           <p class="m-text">SpringBoot通过默认配置了很多框架的使用方式帮我们大大简化了项目初始搭建以及开发过程。本博客的目的就是一步步分析SpringBoot的启动过程，分析SpringBoot是如何帮我们简化这个过程的。</p>
                           <div class="ui grid">
                               <div class="eleven wide column">
                                   <div class="ui mini horizontal link list">
                                       <div class="item middle aligned">
                                           <img src="https://picsum.photos/id/1028/100" alt="" class="ui avatar image">
                                           <div class="content"><a href="#" class="header">叶伟伟</a></div>
                                       </div>
                                       <div class="item middle aligned">
                                           <i class="calendar icon"></i> 2020 07-29
                                       </div>
                                       <div class="item middle aligned">
                                           <i class="eye icon"></i> 250
                                       </div>
                                   </div>
                               </div>
                               <div class="right aligned middle aligned five wide column">
                                   <a href="#" target="_blank" class="ui teal basic label m-padded-tiny m-text-thin">SpringBoot</a>
                               </div>
                           </div>
                       </div>
                       <div class="five wide column middle aligned">
                           <a href="#" target="_blank">
                               <img src="https://picsum.photos/id/1033/800/450" alt="" class="ui rounded image">
                           </a>
                       </div>
                   </div>
               </div>
           </div>

           <!--bottom-->
           <div class="ui bottom attached segment">
               <div class="ui middle aligned two column grid">
                   <div class="column">
                       <a href="#" class="ui mini teal basic button">上一页</a>
                   </div>
                   <div class="right aligned column">
                       <a href="#" class="ui mini teal basic button">下一页</a>
                   </div>
               </div>
           </div>
       </div>
    </div>

    <br>
    <br>


    <!--底部footer-->
    <footer class="ui inverted vertical segment m-padded-tb-massive">
        <div class="ui center aligned container">
            <div class="ui inverted divided stackable grid">
                <div class="three wide column">
                    <div class="ui inverted link list">
                       <div class="item">
                           <img src="../static/images/wechat.jpg" class="ui rounded image" style="width: 110px">
                       </div>
                    </div>
                </div>
                <div class="four wide column">
                    <h4 class="ui inverted header m-text-thin m-text-spaced">最新博客</h4>
                    <div class="ui inverted link list">
                        <a href="#" class="item">SpringBoot</a>
                        <a href="#" class="item">Redis</a>
                        <a href="#" class="item">Mysql</a>
                    </div>
                </div>
                <div class="four wide column">
                    <h4 class="ui inverted header m-text-thin m-text-spaced">联系我</h4>
                    <div class="ui inverted link list">
                        <span class="m-text-thin m-opacity-mini">Email:ye13770663565@163.com</span>
                        <span class="m-text-thin m-opacity-mini">QQ:2013722607</span>
                    </div>
                </div>
                <div class="five wide column">
                    <h4 class="ui inverted header m-text-thin m-text-spaced">iBlog</h4>
                    <p class="m-text-thin m-text-spaced m-text-lined m-opacity-mini">这是我的个人博客，会分享日常工作学习中的相关的任何内容，希望对你有所帮助</p>
                </div>
            </div>
            <div class="ui inverted section divider"></div>
            <p class="m-text-thin m-text-spaced m-opacity-tiny">Copyright © 2019 - 2020 iBlog Designed by raging snail</p>
        </div>
    </footer>

<script src="../static/js/jquery-3.1.1.min.js"></script>
<script src="https://cdn.jsdelivr.net/semantic-ui/2.2.10/semantic.min.js"></script>

<script>
    $('.menu.toggle').click(function () {
        $('.m-item ').toggleClass('m-mobile-hide');
    });

</script>
</body>
</html>
```

#### 2.2.4 标签页面

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>标签</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/semantic-ui/2.2.10/semantic.min.css">
    <link rel="stylesheet" type="text/css" href="static/css/me.css">
</head>
<body>

    <!--导航header-->
    <nav class="ui inverted attached segment m-padded-tb-mini m-shadow-small">
        <div class="ui container">
            <div class="ui inverted secondary stackable menu">
                <h2 class="ui teal header item">iBlog</h2>
                <a href="#" class="m-item item m-mobile-hide"><i class="tiny home icon"></i>&nbsp;首页</a>
                <a href="#" class="m-item item m-mobile-hide"><i class="tiny idea icon"></i>&nbsp;分类</a>
                <a href="#" class="active m-item item m-mobile-hide"><i class="tiny tags icon"></i>&nbsp;标签</a>
                <a href="#" class="m-item item m-mobile-hide"><i class="tiny clone icon"></i>归档</a>
                <a href="#" class="m-item item m-mobile-hide"><i class="tiny info icon"></i>&nbsp;关于我</a>
                <div class="m-item right item m-mobile-hide">
                    <div class="ui icon inverted transparent input">
                        <input type="text" placeholder="Search...">
                        <i class="search link icon"></i>
                    </div>
                </div>
            </div>
        </div>
        <a href="#" class="ui menu toggle black icon button m-right-top m-mobile-show">
            <i class="sidebar icon"></i>
        </a>
    </nav>

    <!--中间内容-->
    <div class="m-container-small m-padded-tb-big">
       <div class="ui container">
           <!--top-->
           <div class="ui top attached segment">
               <div class="ui middle aligned two column grid">
                   <div class="column">
                       <h3 class="ui teal header">标签</h3>
                   </div>
                   <div class="right aligned column">
                       共<h2 class="ui orange header m-inline-block m-text-thin">15</h2>个
                   </div>
               </div>
           </div>

           <div class="ui attached segment m-padded-tb-large">
               <a href="#" target="_blank" class="ui teal basic left pointing large label m-margin-tb-tiny">
                   Redis
                   <div class="detail">1</div>
               </a>
               <a href="#" target="_blank" class="ui basic left pointing large label m-margin-tb-tiny">
                   Redis
                   <div class="detail">1</div>
               </a>
               <a href="#" target="_blank" class="ui basic left pointing large label m-margin-tb-tiny">
                   Redis
                   <div class="detail">1</div>
               </a>
               <a href="#" target="_blank" class="ui basic left pointing large label m-margin-tb-tiny">
                   Redis
                   <div class="detail">1</div>
               </a>
               <a href="#" target="_blank" class="ui basic left pointing large label m-margin-tb-tiny">
                   Redis
                   <div class="detail">1</div>
               </a>
               <a href="#" target="_blank" class="ui basic left pointing large label m-margin-tb-tiny">
                   Redis
                   <div class="detail">1</div>
               </a>
               <a href="#" target="_blank" class="ui basic left pointing large label m-margin-tb-tiny">
                   Redis
                   <div class="detail">1</div>
               </a>
               <a href="#" target="_blank" class="ui basic left pointing large label m-margin-tb-tiny">
                   Redis
                   <div class="detail">1</div>
               </a>
               <a href="#" target="_blank" class="ui basic left pointing large label m-margin-tb-tiny">
                   Redis
                   <div class="detail">1</div>
               </a>
               <a href="#" target="_blank" class="ui basic left pointing large label m-margin-tb-tiny">
                   Redis
                   <div class="detail">1</div>
               </a>
               <a href="#" target="_blank" class="ui basic left pointing large label m-margin-tb-tiny">
                   Redis
                   <div class="detail">1</div>
               </a>
               <a href="#" target="_blank" class="ui basic left pointing large label m-margin-tb-tiny">
                   Redis
                   <div class="detail">1</div>
               </a>
           </div>

           <div class="ui top attached teal segment">
               <div class="ui segment">
                   <div class="ui mobile reversed stackable grid">
                       <div class="eleven wide column">
                           <h3 class="ui header">SpringBoot启动原理</h3>
                           <p class="m-text">SpringBoot通过默认配置了很多框架的使用方式帮我们大大简化了项目初始搭建以及开发过程。本博客的目的就是一步步分析SpringBoot的启动过程，分析SpringBoot是如何帮我们简化这个过程的。</p>
                           <div class="ui grid">
                               <div class="row">
                                   <div class="eleven wide column">
                                       <div class="ui mini horizontal link list">
                                           <div class="item middle aligned">
                                               <img src="https://picsum.photos/id/1028/100" alt="" class="ui avatar image">
                                               <div class="content"><a href="#" class="header">叶伟伟</a></div>
                                           </div>
                                           <div class="item middle aligned">
                                               <i class="calendar icon"></i> 2020 07-29
                                           </div>
                                           <div class="item middle aligned">
                                               <i class="eye icon"></i> 250
                                           </div>
                                       </div>
                                   </div>
                                   <div class="right aligned middle aligned five wide column">
                                       <a href="#" target="_blank" class="ui teal basic label m-padded-tiny m-text-thin">学习笔记</a>
                                   </div>
                               </div>
                               <div class="row">
                                   <div class="column">
                                       <a href="#" class="ui teal basic left pointing label m-padded-tiny m-text-thin">SpringBoot</a>
                                   </div>
                               </div>

                           </div>
                       </div>
                       <div class="five wide column">
                           <a href="#" target="_blank">
                               <img src="https://picsum.photos/id/1033/800/450" alt="" class="ui rounded image">
                           </a>
                       </div>
                   </div>
               </div>
               <div class="ui segment">
                   <div class="ui mobile reversed stackable grid">
                       <div class="eleven wide column">
                           <h3 class="ui header">SpringBoot启动原理</h3>
                           <p class="m-text">SpringBoot通过默认配置了很多框架的使用方式帮我们大大简化了项目初始搭建以及开发过程。本博客的目的就是一步步分析SpringBoot的启动过程，分析SpringBoot是如何帮我们简化这个过程的。</p>
                           <div class="ui grid">
                               <div class="row">
                                   <div class="eleven wide column">
                                       <div class="ui mini horizontal link list">
                                           <div class="item middle aligned">
                                               <img src="https://picsum.photos/id/1028/100" alt="" class="ui avatar image">
                                               <div class="content"><a href="#" class="header">叶伟伟</a></div>
                                           </div>
                                           <div class="item middle aligned">
                                               <i class="calendar icon"></i> 2020 07-29
                                           </div>
                                           <div class="item middle aligned">
                                               <i class="eye icon"></i> 250
                                           </div>
                                       </div>
                                   </div>
                                   <div class="right aligned middle aligned five wide column">
                                       <a href="#" target="_blank" class="ui teal basic label m-padded-tiny m-text-thin">学习笔记</a>
                                   </div>
                               </div>
                               <div class="row">
                                   <div class="column">
                                       <a href="#" class="ui teal basic left pointing label m-padded-tiny m-text-thin">SpringBoot</a>
                                   </div>
                               </div>

                           </div>
                       </div>
                       <div class="five wide column">
                           <a href="#" target="_blank">
                               <img src="https://picsum.photos/id/1033/800/450" alt="" class="ui rounded image">
                           </a>
                       </div>
                   </div>
               </div>
               <div class="ui segment">
                   <div class="ui mobile reversed stackable grid">
                       <div class="eleven wide column">
                           <h3 class="ui header">SpringBoot启动原理</h3>
                           <p class="m-text">SpringBoot通过默认配置了很多框架的使用方式帮我们大大简化了项目初始搭建以及开发过程。本博客的目的就是一步步分析SpringBoot的启动过程，分析SpringBoot是如何帮我们简化这个过程的。</p>
                           <div class="ui grid">
                               <div class="row">
                                   <div class="eleven wide column">
                                       <div class="ui mini horizontal link list">
                                           <div class="item middle aligned">
                                               <img src="https://picsum.photos/id/1028/100" alt="" class="ui avatar image">
                                               <div class="content"><a href="#" class="header">叶伟伟</a></div>
                                           </div>
                                           <div class="item middle aligned">
                                               <i class="calendar icon"></i> 2020 07-29
                                           </div>
                                           <div class="item middle aligned">
                                               <i class="eye icon"></i> 250
                                           </div>
                                       </div>
                                   </div>
                                   <div class="right aligned middle aligned five wide column">
                                       <a href="#" target="_blank" class="ui teal basic label m-padded-tiny m-text-thin">学习笔记</a>
                                   </div>
                               </div>
                               <div class="row">
                                   <div class="column">
                                       <a href="#" class="ui teal basic left pointing label m-padded-tiny m-text-thin">SpringBoot</a>
                                   </div>
                               </div>

                           </div>
                       </div>
                       <div class="five wide column">
                           <a href="#" target="_blank">
                               <img src="https://picsum.photos/id/1033/800/450" alt="" class="ui rounded image">
                           </a>
                       </div>
                   </div>
               </div>
               <div class="ui segment">
                   <div class="ui mobile reversed stackable grid">
                       <div class="eleven wide column">
                           <h3 class="ui header">SpringBoot启动原理</h3>
                           <p class="m-text">SpringBoot通过默认配置了很多框架的使用方式帮我们大大简化了项目初始搭建以及开发过程。本博客的目的就是一步步分析SpringBoot的启动过程，分析SpringBoot是如何帮我们简化这个过程的。</p>
                           <div class="ui grid">
                               <div class="row">
                                   <div class="eleven wide column">
                                       <div class="ui mini horizontal link list">
                                           <div class="item middle aligned">
                                               <img src="https://picsum.photos/id/1028/100" alt="" class="ui avatar image">
                                               <div class="content"><a href="#" class="header">叶伟伟</a></div>
                                           </div>
                                           <div class="item middle aligned">
                                               <i class="calendar icon"></i> 2020 07-29
                                           </div>
                                           <div class="item middle aligned">
                                               <i class="eye icon"></i> 250
                                           </div>
                                       </div>
                                   </div>
                                   <div class="right aligned middle aligned five wide column">
                                       <a href="#" target="_blank" class="ui teal basic label m-padded-tiny m-text-thin">学习笔记</a>
                                   </div>
                               </div>
                               <div class="row">
                                   <div class="column">
                                       <a href="#" class="ui teal basic left pointing label m-padded-tiny m-text-thin">SpringBoot</a>
                                   </div>
                               </div>

                           </div>
                       </div>
                       <div class="five wide column">
                           <a href="#" target="_blank">
                               <img src="https://picsum.photos/id/1033/800/450" alt="" class="ui rounded image">
                           </a>
                       </div>
                   </div>
               </div>
               <div class="ui segment">
                   <div class="ui mobile reversed stackable grid">
                       <div class="eleven wide column">
                           <h3 class="ui header">SpringBoot启动原理</h3>
                           <p class="m-text">SpringBoot通过默认配置了很多框架的使用方式帮我们大大简化了项目初始搭建以及开发过程。本博客的目的就是一步步分析SpringBoot的启动过程，分析SpringBoot是如何帮我们简化这个过程的。</p>
                           <div class="ui grid">
                               <div class="row">
                                   <div class="eleven wide column">
                                       <div class="ui mini horizontal link list">
                                           <div class="item middle aligned">
                                               <img src="https://picsum.photos/id/1028/100" alt="" class="ui avatar image">
                                               <div class="content"><a href="#" class="header">叶伟伟</a></div>
                                           </div>
                                           <div class="item middle aligned">
                                               <i class="calendar icon"></i> 2020 07-29
                                           </div>
                                           <div class="item middle aligned">
                                               <i class="eye icon"></i> 250
                                           </div>
                                       </div>
                                   </div>
                                   <div class="right aligned middle aligned five wide column">
                                       <a href="#" target="_blank" class="ui teal basic label m-padded-tiny m-text-thin">学习笔记</a>
                                   </div>
                               </div>
                               <div class="row">
                                   <div class="column">
                                       <a href="#" class="ui teal basic left pointing label m-padded-tiny m-text-thin">SpringBoot</a>
                                   </div>
                               </div>

                           </div>
                       </div>
                       <div class="five wide column">
                           <a href="#" target="_blank">
                               <img src="https://picsum.photos/id/1033/800/450" alt="" class="ui rounded image">
                           </a>
                       </div>
                   </div>
               </div>
               <div class="ui segment">
                   <div class="ui mobile reversed stackable grid">
                       <div class="eleven wide column">
                           <h3 class="ui header">SpringBoot启动原理</h3>
                           <p class="m-text">SpringBoot通过默认配置了很多框架的使用方式帮我们大大简化了项目初始搭建以及开发过程。本博客的目的就是一步步分析SpringBoot的启动过程，分析SpringBoot是如何帮我们简化这个过程的。</p>
                           <div class="ui grid">
                               <div class="row">
                                   <div class="eleven wide column">
                                       <div class="ui mini horizontal link list">
                                           <div class="item middle aligned">
                                               <img src="https://picsum.photos/id/1028/100" alt="" class="ui avatar image">
                                               <div class="content"><a href="#" class="header">叶伟伟</a></div>
                                           </div>
                                           <div class="item middle aligned">
                                               <i class="calendar icon"></i> 2020 07-29
                                           </div>
                                           <div class="item middle aligned">
                                               <i class="eye icon"></i> 250
                                           </div>
                                       </div>
                                   </div>
                                   <div class="right aligned middle aligned five wide column">
                                       <a href="#" target="_blank" class="ui teal basic label m-padded-tiny m-text-thin">学习笔记</a>
                                   </div>
                               </div>
                               <div class="row">
                                   <div class="column">
                                       <a href="#" class="ui teal basic left pointing label m-padded-tiny m-text-thin">SpringBoot</a>
                                   </div>
                               </div>

                           </div>
                       </div>
                       <div class="five wide column">
                           <a href="#" target="_blank">
                               <img src="https://picsum.photos/id/1033/800/450" alt="" class="ui rounded image">
                           </a>
                       </div>
                   </div>
               </div>
               <div class="ui segment">
                   <div class="ui mobile reversed stackable grid">
                       <div class="eleven wide column">
                           <h3 class="ui header">SpringBoot启动原理</h3>
                           <p class="m-text">SpringBoot通过默认配置了很多框架的使用方式帮我们大大简化了项目初始搭建以及开发过程。本博客的目的就是一步步分析SpringBoot的启动过程，分析SpringBoot是如何帮我们简化这个过程的。</p>
                           <div class="ui grid">
                               <div class="row">
                                   <div class="eleven wide column">
                                       <div class="ui mini horizontal link list">
                                           <div class="item middle aligned">
                                               <img src="https://picsum.photos/id/1028/100" alt="" class="ui avatar image">
                                               <div class="content"><a href="#" class="header">叶伟伟</a></div>
                                           </div>
                                           <div class="item middle aligned">
                                               <i class="calendar icon"></i> 2020 07-29
                                           </div>
                                           <div class="item middle aligned">
                                               <i class="eye icon"></i> 250
                                           </div>
                                       </div>
                                   </div>
                                   <div class="right aligned middle aligned five wide column">
                                       <a href="#" target="_blank" class="ui teal basic label m-padded-tiny m-text-thin">学习笔记</a>
                                   </div>
                               </div>
                               <div class="row">
                                   <div class="column">
                                       <a href="#" class="ui teal basic left pointing label m-padded-tiny m-text-thin">SpringBoot</a>
                                   </div>
                               </div>

                           </div>
                       </div>
                       <div class="five wide column">
                           <a href="#" target="_blank">
                               <img src="https://picsum.photos/id/1033/800/450" alt="" class="ui rounded image">
                           </a>
                       </div>
                   </div>
               </div>
               <div class="ui segment">
                   <div class="ui mobile reversed stackable grid">
                       <div class="eleven wide column">
                           <h3 class="ui header">SpringBoot启动原理</h3>
                           <p class="m-text">SpringBoot通过默认配置了很多框架的使用方式帮我们大大简化了项目初始搭建以及开发过程。本博客的目的就是一步步分析SpringBoot的启动过程，分析SpringBoot是如何帮我们简化这个过程的。</p>
                           <div class="ui grid">
                               <div class="row">
                                   <div class="eleven wide column">
                                       <div class="ui mini horizontal link list">
                                           <div class="item middle aligned">
                                               <img src="https://picsum.photos/id/1028/100" alt="" class="ui avatar image">
                                               <div class="content"><a href="#" class="header">叶伟伟</a></div>
                                           </div>
                                           <div class="item middle aligned">
                                               <i class="calendar icon"></i> 2020 07-29
                                           </div>
                                           <div class="item middle aligned">
                                               <i class="eye icon"></i> 250
                                           </div>
                                       </div>
                                   </div>
                                   <div class="right aligned middle aligned five wide column">
                                       <a href="#" target="_blank" class="ui teal basic label m-padded-tiny m-text-thin">学习笔记</a>
                                   </div>
                               </div>
                               <div class="row">
                                   <div class="column">
                                       <a href="#" class="ui teal basic left pointing label m-padded-tiny m-text-thin">SpringBoot</a>
                                   </div>
                               </div>

                           </div>
                       </div>
                       <div class="five wide column">
                           <a href="#" target="_blank">
                               <img src="https://picsum.photos/id/1033/800/450" alt="" class="ui rounded image">
                           </a>
                       </div>
                   </div>
               </div>
           </div>

           <!--bottom-->
           <div class="ui bottom attached segment">
               <div class="ui middle aligned two column grid">
                   <div class="column">
                       <a href="#" class="ui mini teal basic button">上一页</a>
                   </div>
                   <div class="right aligned column">
                       <a href="#" class="ui mini teal basic button">下一页</a>
                   </div>
               </div>
           </div>
       </div>
    </div>

    <br>
    <br>


    <!--底部footer-->
    <footer class="ui inverted vertical segment m-padded-tb-massive">
        <div class="ui center aligned container">
            <div class="ui inverted divided stackable grid">
                <div class="three wide column">
                    <div class="ui inverted link list">
                       <div class="item">
                           <img src="./static/images/wechat.jpg" class="ui rounded image" style="width: 110px">
                       </div>
                    </div>
                </div>
                <div class="four wide column">
                    <h4 class="ui inverted header m-text-thin m-text-spaced">最新博客</h4>
                    <div class="ui inverted link list">
                        <a href="#" class="item">SpringBoot</a>
                        <a href="#" class="item">Redis</a>
                        <a href="#" class="item">Mysql</a>
                    </div>
                </div>
                <div class="four wide column">
                    <h4 class="ui inverted header m-text-thin m-text-spaced">联系我</h4>
                    <div class="ui inverted link list">
                        <span class="m-text-thin m-opacity-mini">Email:ye13770663565@163.com</span>
                        <span class="m-text-thin m-opacity-mini">QQ:2013722607</span>
                    </div>
                </div>
                <div class="five wide column">
                    <h4 class="ui inverted header m-text-thin m-text-spaced">iBlog</h4>
                    <p class="m-text-thin m-text-spaced m-text-lined m-opacity-mini">这是我的个人博客，会分享日常工作学习中的相关的任何内容，希望对你有所帮助</p>
                </div>
            </div>
            <div class="ui inverted section divider"></div>
            <p class="m-text-thin m-text-spaced m-opacity-tiny">Copyright © 2019 - 2020 iBlog Designed by raging snail</p>
        </div>
    </footer>

<script src="./static/js/jquery-3.1.1.min.js"></script>
<script src="https://cdn.jsdelivr.net/semantic-ui/2.2.10/semantic.min.js"></script>

<script>
    $('.menu.toggle').click(function () {
        $('.m-item ').toggleClass('m-mobile-hide');
    });

</script>
</body>
</html>
```

#### 2.2.5 归档页面

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>归档</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/semantic-ui/2.2.10/semantic.min.css">
    <link rel="stylesheet" type="text/css" href="../static/css/me.css">
</head>
<body>

    <!--导航header-->
    <nav class="ui inverted attached segment m-padded-tb-mini m-shadow-small">
        <div class="ui container">
            <div class="ui inverted secondary stackable menu">
                <h2 class="ui teal header item">iBlog</h2>
                <a href="#" class="m-item item m-mobile-hide"><i class="tiny home icon"></i>&nbsp;首页</a>
                <a href="#" class="m-item item m-mobile-hide"><i class="tiny idea icon"></i>&nbsp;分类</a>
                <a href="#" class="m-item item m-mobile-hide"><i class="tiny tags icon"></i>&nbsp;标签</a>
                <a href="#" class="active m-item item m-mobile-hide"><i class="tiny clone icon"></i>归档</a>
                <a href="#" class="m-item item m-mobile-hide"><i class="tiny info icon"></i>&nbsp;关于我</a>
                <div class="m-item right item m-mobile-hide">
                    <div class="ui icon inverted transparent input">
                        <input type="text" placeholder="Search...">
                        <i class="search link icon"></i>
                    </div>
                </div>
            </div>
        </div>
        <a href="#" class="ui menu toggle black icon button m-right-top m-mobile-show">
            <i class="sidebar icon"></i>
        </a>
    </nav>

    <!--中间内容-->
    <div class="m-container-small m-padded-tb-big">
       <div class="ui container">
           <!--top-->
           <div class="ui top attached padded segment">
               <div class="ui middle aligned two column grid">
                   <div class="column">
                       <h3 class="ui teal header">归档</h3>
                   </div>
                   <div class="right aligned column">
                       共<h2 class="ui orange header m-inline-block m-text-thin">110</h2>篇博客
                   </div>
               </div>
           </div>

           <h3 class="ui center aligned header">2020</h3>
           <div class="ui fluid vertical menu">
               <a href="#" class="item">
                   <span>
                       <i class="mini teal circle icon"></i> SpringBoot启动原理
                       <div class="ui basic teal left pointing label m-padded-tiny m-text-thin">8月01日</div>
                   </span>
                   <div class="ui orange basic label">原创</div>
               </a>
               <a href="#" class="item">
                   <span>
                       <i class="mini teal circle icon"></i> SpringBoot启动原理
                       <div class="ui basic teal left pointing label m-padded-tiny m-text-thin">8月01日</div>
                   </span>
                   <div class="ui orange basic label">原创</div>
               </a>
               <a href="#" class="item">
                   <span>
                       <i class="mini teal circle icon"></i> SpringBoot启动原理
                       <div class="ui basic teal left pointing label m-padded-tiny m-text-thin">8月01日</div>
                   </span>
                   <div class="ui orange basic label">原创</div>
               </a>
               <a href="#" class="item">
                   <span>
                       <i class="mini teal circle icon"></i> SpringBoot启动原理
                       <div class="ui basic teal left pointing label m-padded-tiny m-text-thin">8月01日</div>
                   </span>
                   <div class="ui orange basic label">原创</div>
               </a>
           </div>

           <h3 class="ui center aligned header">2019</h3>
           <div class="ui fluid vertical menu">
               <a href="#" class="item">
                   <span>
                       <i class="mini teal circle icon"></i> SpringBoot启动原理
                       <div class="ui basic teal left pointing label m-padded-tiny m-text-thin">8月01日</div>
                   </span>
                   <div class="ui orange basic label">原创</div>
               </a>
               <a href="#" class="item">
                   <span>
                       <i class="mini teal circle icon"></i> SpringBoot启动原理
                       <div class="ui basic teal left pointing label m-padded-tiny m-text-thin">8月01日</div>
                   </span>
                   <div class="ui orange basic label">原创</div>
               </a>
               <a href="#" class="item">
                   <span>
                       <i class="mini teal circle icon"></i> SpringBoot启动原理
                       <div class="ui basic teal left pointing label m-padded-tiny m-text-thin">8月01日</div>
                   </span>
                   <div class="ui orange basic label">原创</div>
               </a>
               <a href="#" class="item">
                   <span>
                       <i class="mini teal circle icon"></i> SpringBoot启动原理
                       <div class="ui basic teal left pointing label m-padded-tiny m-text-thin">8月01日</div>
                   </span>
                   <div class="ui orange basic label">原创</div>
               </a>
           </div>

       </div>
    </div>

    <br>
    <br>


    <!--底部footer-->
    <footer class="ui inverted vertical segment m-padded-tb-massive">
        <div class="ui center aligned container">
            <div class="ui inverted divided stackable grid">
                <div class="three wide column">
                    <div class="ui inverted link list">
                       <div class="item">
                           <img src="../static/images/wechat.jpg" class="ui rounded image" style="width: 110px">
                       </div>
                    </div>
                </div>
                <div class="four wide column">
                    <h4 class="ui inverted header m-text-thin m-text-spaced">最新博客</h4>
                    <div class="ui inverted link list">
                        <a href="#" class="item">SpringBoot</a>
                        <a href="#" class="item">Redis</a>
                        <a href="#" class="item">Mysql</a>
                    </div>
                </div>
                <div class="four wide column">
                    <h4 class="ui inverted header m-text-thin m-text-spaced">联系我</h4>
                    <div class="ui inverted link list">
                        <span class="m-text-thin m-opacity-mini">Email:ye13770663565@163.com</span>
                        <span class="m-text-thin m-opacity-mini">QQ:2013722607</span>
                    </div>
                </div>
                <div class="five wide column">
                    <h4 class="ui inverted header m-text-thin m-text-spaced">iBlog</h4>
                    <p class="m-text-thin m-text-spaced m-text-lined m-opacity-mini">这是我的个人博客，会分享日常工作学习中的相关的任何内容，希望对你有所帮助</p>
                </div>
            </div>
            <div class="ui inverted section divider"></div>
            <p class="m-text-thin m-text-spaced m-opacity-tiny">Copyright © 2019 - 2020 iBlog Designed by raging snail</p>
        </div>
    </footer>

<script src="../static/js/jquery-3.1.1.min.js"></script>
<script src="https://cdn.jsdelivr.net/semantic-ui/2.2.10/semantic.min.js"></script>

<script>
    $('.menu.toggle').click(function () {
        $('.m-item ').toggleClass('m-mobile-hide');
    });

</script>
</body>
</html>
```

#### 2.2.6 博客管理列表页

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>博客管理</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/semantic-ui/2.2.10/semantic.min.css">
    <link rel="stylesheet" type="text/css" href="../../static/css/me.css">
</head>
<body>

    <!--导航header-->
    <nav class="ui inverted attached segment m-padded-tb-mini m-shadow-small">
        <div class="ui container">
            <div class="ui inverted secondary stackable menu">
                <h2 class="ui teal header item">iBlog</h2>
                <a href="#" class="m-item item m-mobile-hide"><i class="tiny home icon"></i>&nbsp;首页</a>
                <a href="#" class="m-item item m-mobile-hide"><i class="tiny file icon"></i> 发布</a>
                <a href="#" class="m-item item m-mobile-hide"><i class="tiny idea icon"></i>&nbsp;分类</a>
                <a href="#" class="m-item item m-mobile-hide"><i class="tiny tags icon"></i>&nbsp;标签</a>
                <div class="right m-item m-mobile-hide menu">
                    <div class="ui dropdown item">
                        <div class="text">
                            <img class="ui avatar image" src="https://picsum.photos/id/1028/100">
                            raging snail
                        </div>
                        <i class="icon dropdown"></i>
                        <div class="menu">
                            <a href="#" class="item">退出登录</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <a href="#" class="ui menu toggle black icon button m-right-top m-mobile-show">
            <i class="sidebar icon"></i>
        </a>
    </nav>

    <div class="ui attached pointing menu">
        <div class="ui container">
            <div class="right menu">
                <a href="#" class="item">发布</a>
                <a href="#" class="active teal item">列表</a>
            </div>
        </div>
    </div>

    <!--中间内容-->
    <div class="m-container-small m-padded-tb-big">
       <div class="ui container">
           <form action="" method="post" class="ui segment form">
               <div class="inline fields">
                   <div class="field">
                       <input type="text" name="title" placeholder="标题">
                   </div>
                   <div class="field">
                       <div class="ui selection dropdown">
                           <input type="hidden" name="type">
                           <i class="dropdown icon"></i>
                           <div class="default text">类型</div>
                           <div class="menu">
                               <div class="item" data-value="1">学习笔记</div>
                               <div class="item" data-value="2">错误日志</div>
                               <div class="item" data-value="3">项目总结</div>
                               <div class="item" data-value="4">思考感悟</div>
                           </div>
                       </div>
                   </div>
                   <div class="field">
                       <div class="ui checkbox">
                           <input type="checkbox" id="recommend" name="recommend">
                           <label for="recommend">推荐</label>
                       </div>
                   </div>
                   <div class="field">
                       <button class="ui mini green button"><i class="search icon"></i>搜索</button>
                   </div>
                   <div class="field">
                       <a href="#" class="ui mini green button"><i class="plus icon"></i>新增</a>
                   </div>
               </div>
           </form>
           <table class="ui celled table">
               <thead>
               <tr class="center aligned">
                   <th>序号</th>
                   <th>标题</th>
                   <th>类型</th>
                   <th>推荐</th>
                   <th>更新时间</th>
                   <th>操作</th>
               </tr>
               </thead>
               <tbody>
               <tr class="center aligned">
                   <td>1</td>
                   <td>SpringBoot启动原理</td>
                   <td>学习笔记</td>
                   <td>是</td>
                   <td>2020-08-01 09:45</td>
                   <td>
                       <a href="#" target="_blank" class="ui mini teal vertical animated button" tabindex="0">
                           <div class="hidden content">编辑</div>
                           <div class="visible content">
                               <i class="edit icon"></i>
                           </div>
                       </a>
                       <a href="#" class="ui mini red vertical animated button" tabindex="0">
                           <div class="hidden content">删除</div>
                           <div class="visible content">
                               <i class="trash icon"></i>
                           </div>
                       </a>
                   </td>
               </tr>
               <tr class="center aligned">
                   <td>1</td>
                   <td>SpringBoot启动原理</td>
                   <td>学习笔记</td>
                   <td>是</td>
                   <td>2020-08-01 09:45</td>
                   <td>
                       <a href="#" target="_blank" class="ui mini teal vertical animated button" tabindex="0">
                           <div class="hidden content">编辑</div>
                           <div class="visible content">
                               <i class="edit icon"></i>
                           </div>
                       </a>
                       <a href="#" class="ui mini red vertical animated button" tabindex="0">
                           <div class="hidden content">删除</div>
                           <div class="visible content">
                               <i class="trash icon"></i>
                           </div>
                       </a>
                   </td>
               </tr>
               <tr class="center aligned">
                   <td>1</td>
                   <td>SpringBoot启动原理</td>
                   <td>学习笔记</td>
                   <td>是</td>
                   <td>2020-08-01 09:45</td>
                   <td>
                       <a href="#" target="_blank" class="ui mini teal vertical animated button" tabindex="0">
                           <div class="hidden content">编辑</div>
                           <div class="visible content">
                               <i class="edit icon"></i>
                           </div>
                       </a>
                       <a href="#" class="ui mini red vertical animated button" tabindex="0">
                           <div class="hidden content">删除</div>
                           <div class="visible content">
                               <i class="trash icon"></i>
                           </div>
                       </a>
                   </td>
               </tr>
               <tr class="center aligned">
                   <td>1</td>
                   <td>SpringBoot启动原理</td>
                   <td>学习笔记</td>
                   <td>是</td>
                   <td>2020-08-01 09:45</td>
                   <td>
                       <a href="#" target="_blank" class="ui mini teal vertical animated button" tabindex="0">
                           <div class="hidden content">编辑</div>
                           <div class="visible content">
                               <i class="edit icon"></i>
                           </div>
                       </a>
                       <a href="#" class="ui mini red vertical animated button" tabindex="0">
                           <div class="hidden content">删除</div>
                           <div class="visible content">
                               <i class="trash icon"></i>
                           </div>
                       </a>
                   </td>
               </tr>
               <tr class="center aligned">
                   <td>1</td>
                   <td>SpringBoot启动原理</td>
                   <td>学习笔记</td>
                   <td>是</td>
                   <td>2020-08-01 09:45</td>
                   <td>
                       <a href="#" target="_blank" class="ui mini teal vertical animated button" tabindex="0">
                           <div class="hidden content">编辑</div>
                           <div class="visible content">
                               <i class="edit icon"></i>
                           </div>
                       </a>
                       <a href="#" class="ui mini red vertical animated button" tabindex="0">
                           <div class="hidden content">删除</div>
                           <div class="visible content">
                               <i class="trash icon"></i>
                           </div>
                       </a>
                   </td>
               </tr>
               <tr class="center aligned">
                   <td>1</td>
                   <td>SpringBoot启动原理</td>
                   <td>学习笔记</td>
                   <td>是</td>
                   <td>2020-08-01 09:45</td>
                   <td>
                       <a href="#" target="_blank" class="ui mini teal vertical animated button" tabindex="0">
                           <div class="hidden content">编辑</div>
                           <div class="visible content">
                               <i class="edit icon"></i>
                           </div>
                       </a>
                       <a href="#" class="ui mini red vertical animated button" tabindex="0">
                           <div class="hidden content">删除</div>
                           <div class="visible content">
                               <i class="trash icon"></i>
                           </div>
                       </a>
                   </td>
               </tr>
               <tr class="center aligned">
                   <td>1</td>
                   <td>SpringBoot启动原理</td>
                   <td>学习笔记</td>
                   <td>是</td>
                   <td>2020-08-01 09:45</td>
                   <td>
                       <a href="#" target="_blank" class="ui mini teal vertical animated button" tabindex="0">
                           <div class="hidden content">编辑</div>
                           <div class="visible content">
                               <i class="edit icon"></i>
                           </div>
                       </a>
                       <a href="#" class="ui mini red vertical animated button" tabindex="0">
                           <div class="hidden content">删除</div>
                           <div class="visible content">
                               <i class="trash icon"></i>
                           </div>
                       </a>
                   </td>
               </tr>
               <tr class="center aligned">
                   <td>1</td>
                   <td>SpringBoot启动原理</td>
                   <td>学习笔记</td>
                   <td>是</td>
                   <td>2020-08-01 09:45</td>
                   <td>
                       <a href="#" target="_blank" class="ui mini teal vertical animated button" tabindex="0">
                           <div class="hidden content">编辑</div>
                           <div class="visible content">
                               <i class="edit icon"></i>
                           </div>
                       </a>
                       <a href="#" class="ui mini red vertical animated button" tabindex="0">
                           <div class="hidden content">删除</div>
                           <div class="visible content">
                               <i class="trash icon"></i>
                           </div>
                       </a>
                   </td>
               </tr>
               </tbody>
               <tfoot>
               <tr>
                   <th colspan="6">
                       <div class="ui mini pagination menu">
                           <a class="ui icon item">
                               <i class="left chevron icon"></i>
                           </a>
                           <a class="item">1</a>
                           <a class="item">2</a>
                           <a class="item">3</a>
                           <a class="item">4</a>
                           <a class="item">5</a>
                           <a class="mini icon item">
                               <i class="right chevron icon"></i>
                           </a>
                       </div>
                       <a href="#" class="ui right floated mini violet  vertical animated button" tabindex="0">
                           <div class="hidden content">新增</div>
                           <div class="visible content">
                               <i class="plus icon"></i>
                           </div>
                       </a>
                   </th>
               </tr>
               </tfoot>
           </table>
       </div>
    </div>

    <br>
    <br>


    <!--底部footer-->
    <footer class="ui inverted vertical segment m-padded-tb-massive">
        <div class="ui center aligned container">
            <div class="ui inverted divided stackable grid">
                <div class="three wide column">
                    <div class="ui inverted link list">
                       <div class="item">
                           <img src="../../static/images/wechat.jpg" class="ui rounded image" style="width: 110px">
                       </div>
                    </div>
                </div>
                <div class="four wide column">
                    <h4 class="ui inverted header m-text-thin m-text-spaced">最新博客</h4>
                    <div class="ui inverted link list">
                        <a href="#" class="item">SpringBoot</a>
                        <a href="#" class="item">Redis</a>
                        <a href="#" class="item">Mysql</a>
                    </div>
                </div>
                <div class="four wide column">
                    <h4 class="ui inverted header m-text-thin m-text-spaced">联系我</h4>
                    <div class="ui inverted link list">
                        <span class="m-text-thin m-opacity-mini">Email:ye13770663565@163.com</span>
                        <span class="m-text-thin m-opacity-mini">QQ:2013722607</span>
                    </div>
                </div>
                <div class="five wide column">
                    <h4 class="ui inverted header m-text-thin m-text-spaced">iBlog</h4>
                    <p class="m-text-thin m-text-spaced m-text-lined m-opacity-mini">这是我的个人博客，会分享日常工作学习中的相关的任何内容，希望对你有所帮助</p>
                </div>
            </div>
            <div class="ui inverted section divider"></div>
            <p class="m-text-thin m-text-spaced m-opacity-tiny">Copyright © 2019 - 2020 iBlog Designed by raging snail</p>
        </div>
    </footer>

<script src="../../static/js/jquery-3.1.1.min.js"></script>
<script src="https://cdn.jsdelivr.net/semantic-ui/2.2.10/semantic.min.js"></script>

<script>
    $('.menu.toggle').click(function () {
        $('.m-item ').toggleClass('m-mobile-hide');
    });

    $('.ui.dropdown').dropdown({
        on: 'hover'
    });

</script>
</body>
</html>
```

#### 2.2.7 博客发表页面

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>博客发布</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/semantic-ui/2.2.10/semantic.min.css">
    <link rel="stylesheet" type="text/css" href="../../static/lib/editormd/css/editormd.min.css">
    <link rel="stylesheet" type="text/css" href="../../static/css/me.css">
</head>
<body>

    <!--导航header-->
    <nav class="ui inverted attached segment m-padded-tb-mini m-shadow-small">
        <div class="ui container">
            <div class="ui inverted secondary stackable menu">
                <h2 class="ui teal header item">iBlog</h2>
                <a href="#" class="m-item item m-mobile-hide"><i class="tiny home icon"></i>&nbsp;首页</a>
                <a href="#" class="active m-item item m-mobile-hide"><i class="tiny file icon"></i> 发布</a>
                <a href="#" class="m-item item m-mobile-hide"><i class="tiny idea icon"></i>&nbsp;分类</a>
                <a href="#" class="m-item item m-mobile-hide"><i class="tiny tags icon"></i>&nbsp;标签</a>
                <div class="right m-item m-mobile-hide menu">
                    <div class="ui dropdown item">
                        <div class="text">
                            <img class="ui avatar image" src="https://picsum.photos/id/1028/100">
                            raging snail
                        </div>
                        <i class="icon dropdown"></i>
                        <div class="menu">
                            <a href="#" class="item">退出登录</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <a href="#" class="ui menu toggle black icon button m-right-top m-mobile-show">
            <i class="sidebar icon"></i>
        </a>
    </nav>

    <div class="ui attached pointing menu">
        <div class="ui container">
            <div class="right menu">
                <a href="#" class="active teal item">发布</a>
                <a href="#" class="item">列表</a>
            </div>
        </div>
    </div>

    <!--中间内容-->
    <div class="m-container-small m-padded-tb-big">
       <div class="ui container">
           <form action="#" method="post" class="ui form">
               <div class="required field">
                   <div class="ui left labeled input">
                       <div class="ui selection compact teal basic dropdown label">
                           <input type="text" class="hidden">
                           <i class="dropdown icon"></i>
                           <div class="default text">版权</div>
                           <div class="menu">
                               <div class="item" data-value="原创">原创</div>
                               <div class="item" data-value="转载">转载</div>
                               <div class="item" data-value="翻译">翻译</div>
                           </div>
                       </div>
                       <input type="text" name="title" placeholder="标题">
                   </div>
               </div>

               <div class="field">
                   <div id="md-content" style="z-index: 1 !important;">
                       <textarea name="content" placeholder="博客内容..." style="display:none;">
     [TOC]

#### Disabled options

- TeX (Based on KaTeX);
- Emoji;
- Task lists;
- HTML tags decode;
- Flowchart and Sequence Diagram;</textarea>
                   </div>
               </div>

               <div class="two fields">
                   <div class="field">
                       <div class="ui left labeled action input">
                           <label class="ui compact teal basic label">类型</label>
                           <div class="ui fluid selection dropdown">
                               <input type="text" class="hidden" name="type">
                               <i class="dropdown icon"></i>
                               <div class="default text">类型</div>
                               <div class="menu">
                                   <div class="item" data-value="1">学习笔记</div>
                                   <div class="item" data-value="2">错误日志</div>
                                   <div class="item" data-value="3">项目总结</div>
                                   <div class="item" data-value="4">思考感悟</div>
                               </div>
                           </div>
                       </div>
                   </div>
                   <div class="field">
                       <div class="ui left labeled action input">
                           <label class="ui compact teal basic label">标签</label>
                           <div class="ui fluid multiple search selection dropdown">
                               <input type="text" class="hidden" name="tag">
                               <i class="dropdown icon"></i>
                               <div class="default text">标签</div>
                               <div class="menu">
                                   <div class="item" data-value="1">Redis</div>
                                   <div class="item" data-value="2">Tomcat</div>
                                   <div class="item" data-value="3">HTML</div>
                                   <div class="item" data-value="4">Spring</div>
                                   <div class="item" data-value="5">Css</div>
                                   <div class="item" data-value="6">Mybatis</div>
                                   <div class="item" data-value="7">SpringBoot</div>
                               </div>
                           </div>
                       </div>
                   </div>
               </div>
               <div class="field">
                   <div class="ui left labeled input">
                       <label class="ui teal basic label">首图</label>
                       <input type="text" name="indexPicture" placeholder="首图引用地址：https://picsum.photos/images">
                   </div>
               </div>
               <div class="inline fields">
                   <div class="field">
                       <div class="ui checkbox">
                           <input type="checkbox" id="recommend" name="recommend" checked class="hidden">
                           <label for="recommend">推荐</label>
                       </div>
                   </div>
                   <div class="field">
                       <div class="ui checkbox">
                           <input type="checkbox" id="shareInfo" name="shareInfo" class="hidden">
                           <label for="shareInfo">转载申明</label>
                       </div>
                   </div>
                   <div class="field">
                       <div class="ui checkbox">
                           <input type="checkbox" id="appreciation" name="appreciation" class="hidden">
                           <label for="appreciation">赞赏</label>
                       </div>
                   </div>
                   <div class="field">
                       <div class="ui checkbox">
                           <input type="checkbox" id="comment" name="comment" class="hidden">
                           <label for="comment">评论</label>
                       </div>
                   </div>
               </div>

               <div class="ui error message"></div>

               <div class="ui right aligned container">
                   <button type="button" class="ui button" onclick="window.history.go(-1)">返回</button>
                   <button class="ui secondary button">保存</button>
                   <button class="ui teal button">发布</button>
               </div>
           </form>
       </div>
    </div>

    <br>
    <br>


    <!--底部footer-->
    <footer class="ui inverted vertical segment m-padded-tb-massive">
        <div class="ui center aligned container">
            <div class="ui inverted divided stackable grid">
                <div class="three wide column">
                    <div class="ui inverted link list">
                       <div class="item">
                           <img src="../../static/images/wechat.jpg" class="ui rounded image" style="width: 110px">
                       </div>
                    </div>
                </div>
                <div class="four wide column">
                    <h4 class="ui inverted header m-text-thin m-text-spaced">最新博客</h4>
                    <div class="ui inverted link list">
                        <a href="#" class="item">SpringBoot</a>
                        <a href="#" class="item">Redis</a>
                        <a href="#" class="item">Mysql</a>
                    </div>
                </div>
                <div class="four wide column">
                    <h4 class="ui inverted header m-text-thin m-text-spaced">联系我</h4>
                    <div class="ui inverted link list">
                        <span class="m-text-thin m-opacity-mini">Email:ye13770663565@163.com</span>
                        <span class="m-text-thin m-opacity-mini">QQ:2013722607</span>
                    </div>
                </div>
                <div class="five wide column">
                    <h4 class="ui inverted header m-text-thin m-text-spaced">iBlog</h4>
                    <p class="m-text-thin m-text-spaced m-text-lined m-opacity-mini">这是我的个人博客，会分享日常工作学习中的相关的任何内容，希望对你有所帮助</p>
                </div>
            </div>
            <div class="ui inverted section divider"></div>
            <p class="m-text-thin m-text-spaced m-opacity-tiny">Copyright © 2019 - 2020 iBlog Designed by raging snail</p>
        </div>
    </footer>

<script src="../../static/js/jquery-3.1.1.min.js"></script>
<script src="https://cdn.jsdelivr.net/semantic-ui/2.2.10/semantic.min.js"></script>
<script src="../../static/lib/editormd/editormd.min.js"></script>

<script type="text/javascript">
    //初始化markdown编辑器
    var contentEditor;
    $(function() {
        contentEditor = editormd("md-content", {
            width   : "100%",
            height  : 640,
            syncScrolling : "single",
            path    : "../static/lib/editormd/lib/"
        });
    });

    $('.menu.toggle').click(function () {
        $('.m-item ').toggleClass('m-mobile-hide');
    });

    $('.ui.dropdown').dropdown({
        on: 'hover'
    });

    $('.ui.form').form({
       fields : {
           title : {
               identifier: 'title',
               rules: [{
                   type : 'empty',
                   prompt : '标题：请输入博客标题'
               }]
           }
       }
    });
</script>
</body>
</html>
```

------

### 2.3 插件集成

[编辑器 Markdown](https://pandao.github.io/editor.md/)

[内容排版 typo.css](https://github.com/sofish/typo.css)

[动画 animate.css](https://daneden.github.io/animate.css/)

[代码高亮 prism](https://github.com/PrismJS/prism)

[目录生成 Tocbot](https://tscanlin.github.io/tocbot/)

[滚动侦测 waypoints](http://imakewebthings.com/waypoints/)

[平滑滚动 jquery.scrollTo](http://github.com/flesler/jquery.scrollTo)

[二维码生成 qrcode.js](https://davidshimjs.github.io/qrcodejs/)

------

## 3.框架搭建

### 3.1 构建与配置

#### 3.1.1 引入SpringBoot模块

- web
- Thymeleaf
- JPA
- MySQL
- Aspects
- DevTools

#### 3.1.2 配置文件

* 使用thymeleaf模板引擎

  application.yml

  ```yaml
  spring:
    thymeleaf:
      mode: HTML
  ```

+ 数据库连接配置

  application.yml

  ```yaml
  spring:
    datasource:
      driver-class-name: com.mysql.cj.jdbc.Driver
      url: jdbc:mysql://localhost:3306/blog?useUnicode=true&characterEncoding=utf-8
      username: root
      password: 130825
  
    jpa:
      show-sql: true
      hibernate:
        ddl-auto: update
  ```

+ 日志配置

  application.yml

  ```yaml
  logging:
    level:
      root: info
      com.ye: debug
    file:
      name: blog.log
      path: ./log
  ```

  logback-spring.xml

  ```xml
  <?xml version="1.0" encoding="UTF-8" ?>
  <configuration>
      <!--包含Spring boot对logback日志的默认配置-->
      <include resource="org/springframework/boot/logging/logback/defaults.xml" />
      <property name="LOG_FILE" value="${LOG_FILE:-${LOG_PATH:-${LOG_TEMP:-${java.io.tmpdir:-/tmp}}}/spring.log}"/>
      <include resource="org/springframework/boot/logging/logback/console-appender.xml" />
  
      <!--重写了Spring Boot框架 org/springframework/boot/logging/logback/file-appender.xml 配置-->
      <appender name="TIME_FILE"
                class="ch.qos.logback.core.rolling.RollingFileAppender">
          <encoder>
              <pattern>${FILE_LOG_PATTERN}</pattern>
          </encoder>
          <file>${LOG_FILE}</file>
          <rollingPolicy class="ch.qos.logback.core.rolling.TimeBasedRollingPolicy">
              <fileNamePattern>${LOG_FILE}.%d{yyyy-MM-dd}.%i</fileNamePattern>
              <!--保留历史日志一个月的时间-->
              <maxHistory>30</maxHistory>
              <!--
              Spring Boot默认情况下，日志文件10M时，会切分日志文件,这样设置日志文件会在100M时切分日志
              -->
              <timeBasedFileNamingAndTriggeringPolicy class="ch.qos.logback.core.rolling.SizeAndTimeBasedFNATP">
                  <maxFileSize>10MB</maxFileSize>
              </timeBasedFileNamingAndTriggeringPolicy>
  
          </rollingPolicy>
      </appender>
  
      <root level="INFO">
          <appender-ref ref="CONSOLE" />
          <appender-ref ref="TIME_FILE" />
      </root>
  
  </configuration>
  ```

------

### 3.2 异常处理

#### 3.2.1 定义错误页面

+ 404
+ 500
+ error

#### 3.2.2 全局异常处理

统一异常处理：ControllerExceptionHandler

```java
@ControllerAdvice
public class ControllerExceptionHandler {

    private final Logger logger = LoggerFactory.getLogger(this.getClass());

    @ExceptionHandler(Exception.class)
    public ModelAndView exceptionHandler(HttpServletRequest request, Exception e) throws Exception {
        logger.error("Request URL : {}, Exception : {}",request.getRequestURI(),e);
        if (AnnotationUtils.findAnnotation(e.getClass(), ResponseStatus.class) != null){
            throw e;
        }
        ModelAndView mv = new ModelAndView();
        mv.addObject("url",request.getRequestURI());
        mv.addObject("exception", e);
        mv.setViewName("error/error");
        return mv;
    }
}
```

错误页面异常信息显示处理：error.html

```html
<div>
    <div th:utext="'&lt;!--'" th:remove="tag"></div>
    <div th:utext="'Failed Request URL : ' + ${url}" th:remove="tag"></div>
    <div th:utext="'Exception message : ' + ${exception.message}" th:remove="tag"></div>
    <ul th:remove="tag">
        <li th:each="st : ${exception.stackTrace}" th:remove="tag"><span th:utext="${st}" th:remove="tag"></span></li>
    </ul>
    <div th:utext="'--&gt;'" th:remove="tag"></div>
</div>
```

#### 3.2.3 资源找不到异常

NotFoundException：

```java
@ResponseStatus(HttpStatus.NOT_FOUND)
public class NotFoundException extends RuntimeException{

    public NotFoundException() {
    }

    public NotFoundException(String message) {
        super(message);
    }

    public NotFoundException(String message, Throwable cause) {
        super(message, cause);
    }
}
```

------

### 3.3 日志处理

#### 3.3.1 记录日志内容

+ 请求url
+ 访问者ip
+ 调用方法classMethod
+ 参数args

#### 3.3.2 记录日志类

```java
@Aspect
@Component
public class LogAspect {

    private final Logger logger = LoggerFactory.getLogger(this.getClass());

    @Pointcut("execution(* com.ye.controller.*.*(..))")
    public void log() {}

    @Before("log()")
    public void doBefore(JoinPoint joinPoint) {
        ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        HttpServletRequest request = attributes.getRequest();
        String url = request.getRequestURI();
        String ip = request.getRemoteAddr();
        String classMethod = joinPoint.getSignature().getDeclaringTypeName() + "." + joinPoint.getSignature().getName();
        Object[] args = joinPoint.getArgs();
        RequestLog requestLog = new RequestLog(url, ip, classMethod, args);

        logger.info("Request : {}", requestLog);

    }

    @After("log()")
    public void doAfter() {
        //logger.info("-----doAfter-----");
    }

    @AfterReturning(returning = "result", pointcut = "log()")
    public void doAfterReturn(Object result) {
        logger.info("Result : {}", result);
    }

    private class RequestLog {
        private String url;
        private String ip;
        private String classMethod;
        private Object[] args;

        public RequestLog(String url, String ip, String classMethod, Object[] args) {
            this.url = url;
            this.ip = ip;
            this.classMethod = classMethod;
            this.args = args;
        }

        @Override
        public String toString() {
            return "RequestLog{" +
                    "url='" + url + '\'' +
                    ", ip='" + ip + '\'' +
                    ", classMethod='" + classMethod + '\'' +
                    ", args=" + Arrays.toString(args) +
                    '}';
        }
    }
}
```

------

### 3.4 页面处理

#### 3.4.1 静态页面导入project

#### 3.4.2 thymeleaf布局

+ 定义fragment
+ 使用fragment布局

#### 3.4.3 错误页面美化

------

## 4.设计与规范

### 4.1 实体设计

实体类：

+ 博客Blog
+ 博客分类Type
+ 博客标签Tag
+ 博客评论Comment
+ 用户User

### 4.2 应用分层

* 终端显示层：Thymeleaf模板
* 请求处理层：Web层
* 业务逻辑层：Service层
* 持久层：Dao层
* 数据源

### 4.3 命名规范

Service/Dao层命名约定：

+ 获取单个对象的方法用get做前缀
+ 获取多个对象的方法用list做前缀
+ 获取统计值的方法用count做前缀
+ 插入的方法用save（推荐）或insert做前缀
+ 删除的方法用remove（推荐）或delete做前缀
+ 修改的方法用update做前缀

------

## 5.后台管理

### 5.1 登录

1. 构建登录页面和后台管理页面
2. UserService和UserRepository
3. LoginController
4. MD5加密
5. 登录拦截器

### 5.2 分类(标签)管理

1. 分类管理页面

2. 分类列表页面

   ````java
   //分页
   @GetMapping("/types")
   public String list(@PageableDefault(size = 8, sort = {"id"}, direction = 			   							Sort.Direction.DESC)Pageable pageable, Model model){
       model.addAttribute("page",typeService.listType(pageable));
       //typeService.listType(pageable);
       return "admin/types";
   }
   ````

3. 分类新增、修改、删除

### 5.3 博客管理

1. 博客列表页面

2. 博客编辑页面

3. 博客新增、修改、删除

   ```java
   //博客新增和修改公用一个方法
   @PostMapping("/blogs")
   public String post(@Valid Blog blog, BindingResult result, HttpSession session, RedirectAttributes attributes, Model model){
       if (blog.getId() == null){
           Blog existBlog = blogService.getBlogByTitle(blog.getTitle());
           if (existBlog != null){
               result.rejectValue("title","titleError","该博客已存在，请勿重复添加！");
           }
           if (result.hasErrors()){
               model.addAttribute("types",typeService.listType());
               model.addAttribute("tags",tagService.listTag());
               return "admin/blogs-input";
           }
       }
   
       String ids = blog.getTagIds();
       List<Tag> tags = new ArrayList<>();
       List<Long> list = new ArrayList<>();
       if (!"".equals(ids) && ids != null){
           String[] idArray = ids.split(",");
           for (int i=0; i < idArray.length; i++){
               for (int j=0; j < idArray[i].length(); j++){
                   if (!Character.isDigit(idArray[i].charAt(j))) {
                       Tag tag = new Tag();
                       tag.setName(idArray[i]);
                       tagService.saveTag(tag);
                       tags.add(tag);
                       break;
                       //list.add(tagService.getTagByName(idArray[i]).getId());
                   }else {
                       Tag tag = tagService.getTag(Long.valueOf(idArray[i]));
                       tags.add(tag);
                       //list.add(Long.valueOf(idArray[i]));
                   }
               }
           }
       }
       blog.setTags(tags);
       blog.setUser((User) session.getAttribute("user"));
       blog.setType(typeService.getType(blog.getType().getId()));
   
       Blog b = new Blog();
       if (blog.getId() == null){
           b = blogService.saveBlog(blog);
       }else {
           b = blogService.updateBlog(blog.getId(), blog);
       }
   
       if (b == null){
           attributes.addFlashAttribute("message","操作失败");
       }else{
           attributes.addFlashAttribute("message","操作成功");
       }
       return REDIRECT_LIST;
   }
   ```

------

## 6.前端展示

+ 博客列表页面
+ 博客详情（将Markdown文本转为Html显示）
+ 评论功能
  1. 评论信息提交与回复功能
  2. 评论信息列表展示功能
  3. 管理员回复评论功能

### 6.1 博客详情页

1. 博客详情（将Markdown文本转为Html显示）
2. 评论功能
   + 评论信息提交与回复功能
   + 评论信息列表展示功能
   + 管理员回复评论功能

### 6.2 分类页

### 6.3 标签页

### 6.4 关于我

### 6.5 归档页



