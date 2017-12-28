---
title: CSS浮动的问题
date: 2017.12.28
tag: [css,html]
---
最近在写主题的样式时遇到了一个问题，由于我html和css理解很浅，这个问题起初让我感到困惑，但最后通过学习使问题得到了解决。<!--more-->以下是研究的过程。  

一般来说，文章底部会有一个上一篇和下一篇的导航栏，正常情况下显示是这样的。即在`article-nav`下会有两个子元素`prev`和`next`，并且`next`右浮动。如下：  
<script async src="//jsfiddle.net/lchord/LLg2744v/embed/result,html,css/?menuColor=eee"></script>
一般来说，一篇文章之前之后都会存在文章。但是对于文章列表的第一篇文章，之前就没有文章了。也就是说`prev`这一元素不存在，根据模板生成时，页面也不会包含该元素。但是这样一来出现了令人费解的现象，如下：  
<script async src="//jsfiddle.net/lchord/4fob2fqy/embed/result,html,css/?menuColor=eee"></script>
可以发现，父元素的高度变成了0。并且文字内容的位置也变得奇怪。  

实际上，这种问题在我之前移植wp双栏主题的时候也出现过，当时使用`clear: both;`清除浮动后可以正常显示。这里实际上也是浮动脱离文档流的问题，我看到有的网站使用的是`display: table-cell;`这一方式，但是这样有一个明显的问题，就是鼠标还没到字上，就变成pointer了，有点违和。还有就是给父元素加上高度，但我感觉这样对长标题可能不友好。最后，我采用的是触发BFC的方式，这样可以让浮动元素被父级计算高度，方法也很简单，在父元素上加上`overflow: hidden;`即可，具体如下:  
<script async src="//jsfiddle.net/lchord/x66rfca3/1/embed/result,html,css/?menuColor=eee"></script>
这样，当只有右浮动元素的时候，父元素的高度也不会为0了。