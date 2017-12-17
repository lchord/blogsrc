---
title: 添加valine评论
date: 2017.12.17
---
添加valine评论系统。  
<!-- more -->
## 评论系统
对我而言，评论系统一直是可有可无的存在。之前一直使用多说和Disqus，并且我挺喜欢Disqus的，但是由于某些原因目前不能很好的使用。当然，也有使用Disqus PHP API的方法，但是配置较为复杂，需要服务器资源。对于其他的一些社会化评论系统我也不想过多尝试。正好，之前在Github上偶然看到了Valine项目[\[1\]][1]，感觉很简单实用，决定采用之。  
## 添加到主题
可以去项目主页查看hexo主题使用Valine的情况[\[2\]][2]。当前我使用的主题是even[\[3\]][3]，其实项目作者已经提交了PR[\[4\]][4]想将Valine加入到主题的评论选项中，并且给出了具体的修改方法。不过好像还没合并。那就自己添加好了，如果不行大不了再git clone一遍原主题。  
接下来是具体过程。首先在leancloud[\[5\]][5]里面新建一个应用，得到appid和appkey备用。  
### _config.yml
在主题_config.yml文件Third Party Services Settings这一大项最后添加上下面的代码，注意将相应的内容换成自己的信息。  
```
# Valine comment https://valine.js.org
valine:
  appid:  # your leancloud appid
  appkey:  # your leancloud appkey
  notify: false # true/false:mail notify !!!Test,Caution. https://github.com/xCss/Valine/wiki/Valine-%E8%AF%84%E8%AE%BA%E7%B3%BB%E7%BB%9F%E4%B8%AD%E7%9A%84%E9%82%AE%E4%BB%B6%E6%8F%90%E9%86%92%E8%AE%BE%E7%BD%AE
  verify: false # true/false:verify code
  avatar: mm # avatar style https://github.com/xCss/Valine/wiki/avatar-setting-for-valine
  placeholder: Just go go # comment box placeholder
```
### layout/_partial/comments.swig
下面这一段替换掉原来的文件内容。  
```
{% if page.comments and not is_home() %}
  <div class="comments" id="comments">
    {% if theme.disqus_shortname %}
      <div id="disqus_thread">
        <noscript>
          Please enable JavaScript to view the
          <a href="//disqus.com/?ref_noscript">comments powered by Disqus.</a>
        </noscript>
      </div>
    {% elseif theme.valine.appid and theme.valine.appkey %}
    <div id="vcomments"></div>
    {% endif %}
  </div>
{% endif %}
```
### layout/\_script/\_comments/valine.swig
这里在对应的目录先新建一个文件。内容如下：  
```
{% if theme.valine.appid and theme.valine.appkey %}
<!-- valine Comments -->
<script src="//cdn1.lncld.net/static/js/3.0.4/av-min.js"></script>
<script src="//cdn.jsdelivr.net/gh/xcss/valine@v1.1.7/dist/Valine.min.js"></script>
<script type="text/javascript">
    new Valine({
        el: '#vcomments',
        notify: {{ theme.valine.notify }},
        verify: {{ theme.valine.verify }},
        app_id: "{{ theme.valine.appid }}",
        app_key: "{{ theme.valine.appkey }}",
        placeholder: "{{ theme.valine.placeholder }}",
        avatar: '{{ theme.valine.avatar }}'
    });
</script>
{% endif %}
```
### layout/_script/comments.swig
替换如下：  
```
{% if !is_home() and !is_archive() %}
    {% if theme.disqus_shortname %}
    {% include "_comments/disqus.swig" %}
  {% elseif theme.changyan and theme.changyan.appid and theme.changyan.appkey %}
    {% include "_comments/changyan.swig" %}
  {% elseif theme.valine.appid and theme.valine.appkey %}
    {% include "_comments/valine.swig" %}
  {% endif %}
{% endif %}
```
所做的修改就是这些，之后hexo s可以开到效果，然后生成、部署就可以了。  
## 参考
\[1\] https://github.com/xCss/Valine  
\[2\] https://valine.js.org/#/hexo  
\[3\] https://github.com/ahonn/hexo-theme-even  
\[4\] https://github.com/ahonn/hexo-theme-even/pull/179  
\[5\] https://leancloud.cn/  

[1]: https://github.com/xCss/Valine
[2]: https://valine.js.org/#/hexo
[3]: https://github.com/ahonn/hexo-theme-even
[4]: https://github.com/ahonn/hexo-theme-even/pull/179
[5]: https://leancloud.cn/
