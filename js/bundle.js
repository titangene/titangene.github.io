!function(t){"use strict";t.fn.fitVids=function(e){var i={customSelector:null,ignore:null};if(!document.getElementById("fit-vids-style")){var r=document.head||document.getElementsByTagName("head")[0],a=document.createElement("div");a.innerHTML='<p>x</p><style id="fit-vids-style">.fluid-width-video-wrapper{width:100%;position:relative;padding:0;}.fluid-width-video-wrapper iframe,.fluid-width-video-wrapper object,.fluid-width-video-wrapper embed {position:absolute;top:0;left:0;width:100%;height:100%;}</style>',r.appendChild(a.childNodes[1])}return e&&t.extend(i,e),this.each(function(){var e=['iframe[src*="player.vimeo.com"]','iframe[src*="youtube.com"]','iframe[src*="youtube-nocookie.com"]','iframe[src*="kickstarter.com"][src*="video.html"]',"object","embed"];i.customSelector&&e.push(i.customSelector);var r=".fitvidsignore";i.ignore&&(r=r+", "+i.ignore);var a=t(this).find(e.join(","));(a=(a=a.not("object object")).not(r)).each(function(){var e=t(this);if(!(e.parents(r).length>0||"embed"===this.tagName.toLowerCase()&&e.parent("object").length||e.parent(".fluid-width-video-wrapper").length)){e.css("height")||e.css("width")||!isNaN(e.attr("height"))&&!isNaN(e.attr("width"))||(e.attr("height",9),e.attr("width",16));var i=("object"===this.tagName.toLowerCase()||e.attr("height")&&!isNaN(parseInt(e.attr("height"),10))?parseInt(e.attr("height"),10):e.height())/(isNaN(parseInt(e.attr("width"),10))?e.width():parseInt(e.attr("width"),10));if(!e.attr("name")){var a="fitvid"+t.fn.fitVids._count;e.attr("name",a),t.fn.fitVids._count++}e.wrap('<div class="fluid-width-video-wrapper"></div>').parent(".fluid-width-video-wrapper").css("padding-top",100*i+"%"),e.removeAttr("height").removeAttr("width")}})})},t.fn.fitVids._count=0}(window.jQuery||window.Zepto);var AlgoliaSearch,AzureSearch,BaiduSearch,SearchService="";!function(e){SearchService=function(t){var o=this;o.config=e.extend({per_page:10,selectors:{body:"body",form:".u-search-form",input:".u-search-input",container:"#u-search",modal:"#u-search .modal",modal_body:"#u-search .modal-body",modal_footer:"#u-search .modal-footer",modal_overlay:"#u-search .modal-overlay",modal_results:"#u-search .modal-results",modal_metadata:"#u-search .modal-metadata",modal_error:"#u-search .modal-error",modal_loading_bar:"#u-search .modal-loading-bar",modal_ajax_content:"#u-search .modal-ajax-content",modal_logo:"#u-search .modal-footer .logo",btn_close:"#u-search .btn-close",btn_next:"#u-search .btn-next",btn_prev:"#u-search .btn-prev"},brands:{google:{logo:"google.svg",url:"https://cse.google.com"},algolia:{logo:"algolia.svg",url:"https://www.algolia.com"},hexo:{logo:"",url:""},azure:{logo:"azure.svg",url:"https://azure.microsoft.com/en-us/services/search/"},baidu:{logo:"baidu.svg",url:"http://zn.baidu.com/cse/home/index"}},imagePath:ROOT+"img/"},t),o.dom={},o.percentLoaded=0,o.open=!1,o.queryText="",o.nav={next:-1,prev:-1,total:0,current:1},o.parseSelectors=function(){for(var a in o.config.selectors)o.dom[a]=e(o.config.selectors[a])},o.beforeQuery=function(){o.open||(o.dom.container.fadeIn(),o.dom.body.addClass("modal-active")),o.dom.input.each(function(a,t){e(t).val(o.queryText)}),document.activeElement.blur(),o.dom.modal_error.hide(),o.dom.modal_ajax_content.removeClass("loaded"),o.startLoading()},o.afterQuery=function(){o.dom.modal_body.scrollTop(0),o.dom.modal_ajax_content.addClass("loaded"),o.stopLoading()},o.search=function(e,a){o.beforeQuery(),o.search instanceof Function?o.query(o.queryText,e,function(){o.afterQuery()}):(console.log("query() does not exist."),o.onQueryError(o.queryText,""),o.afterQuery())},o.onQueryError=function(e,a){var t="";t="success"===a?'No result found for "'+e+'".':"timeout"===a?"Unfortunate timeout.":"Mysterious failure.",o.dom.modal_results.html(""),o.dom.modal_error.html(t),o.dom.modal_error.show()},o.nextPage=function(){-1!==o.nav.next&&o.search(o.nav.next)},o.prevPage=function(){-1!==o.nav.prev&&o.search(o.nav.prev)},o.buildResult=function(e,a,t){var o="";return o="<li>",o+="<a class='result' href='"+e+"'>",o+="<span class='title'>"+a+"</span>",o+="<span class='digest'>"+t+"</span>",o+="<span class='icon icon-chevron-thin-right'></span>",o+="</a>",o+="</li>"},o.close=function(){o.open=!1,o.dom.container.fadeOut(),o.dom.body.removeClass("modal-active")},o.onSubmit=function(a){a.preventDefault(),o.queryText=e(this).find(".u-search-input").val(),o.queryText&&o.search(1)},o.startLoading=function(){o.dom.modal_loading_bar.show(),o.loadingTimer=setInterval(function(){o.percentLoaded=Math.min(o.percentLoaded+5,95),o.dom.modal_loading_bar.css("width",o.percentLoaded+"%")},100)},o.stopLoading=function(){clearInterval(o.loadingTimer),o.dom.modal_loading_bar.css("width","100%"),o.dom.modal_loading_bar.fadeOut(),setTimeout(function(){o.percentLoaded=0,o.dom.modal_loading_bar.css("width","0%")},300)},o.addLogo=function(e){var a="";o.config.brands[e]&&o.config.brands[e].logo&&(a+="<a href='"+o.config.brands[e].url+"' class='"+e+"'>",a+='<img src="'+o.config.imagePath+o.config.brands[e].logo+'" />',a+="</a>",o.dom.modal_logo.html(a))},o.destroy=function(){o.dom.form.each(function(a,t){e(t).off("submit")}),o.dom.modal_overlay.off("click"),o.dom.btn_close.off("click"),o.dom.btn_next.off("click"),o.dom.btn_prev.off("click"),o.dom.container.remove()},o.init=function(){e("body").append(a),o.parseSelectors(),o.dom.modal_footer.show(),o.dom.form.each(function(a,t){e(t).on("submit",o.onSubmit)}),o.dom.modal_overlay.on("click",o.close),o.dom.btn_close.on("click",o.close),o.dom.btn_next.on("click",o.nextPage),o.dom.btn_prev.on("click",o.prevPage)},o.init()};var a='<div id="u-search"><div class="modal"> <header class="modal-header" class="clearfix"><form id="u-search-modal-form" class="u-search-form" name="uSearchModalForm"> <input type="text" id="u-search-modal-input" class="u-search-input" /> <button type="submit" id="u-search-modal-btn-submit" class="u-search-btn-submit"> <span class="icon icon-search"></span> </button></form> <a class="btn-close"> <span class="icon icon-close"></span> </a><div class="modal-loading"><div class="modal-loading-bar"></div></div> </header> <main class="modal-body"><ul class="modal-results modal-ajax-content"></ul> </main> <footer class="modal-footer clearfix"><div class="modal-metadata modal-ajax-content"> <strong class="range"></strong> of <strong class="total"></strong></div><div class="modal-error"></div> <div class="logo"></div> <a class="nav btn-next modal-ajax-content"> <span class="text">NEXT</span> <span class="icon icon-chevron-right"></span> </a> <a class="nav btn-prev modal-ajax-content"> <span class="icon icon-chevron-left"></span> <span class="text">PREV</span> </a> </footer></div><div class="modal-overlay"></div></div>'}(jQuery),function(e){"use strict";AlgoliaSearch=function(a){SearchService.apply(this,arguments);var t=this,o="https://"+t.config.appId+"-dsn.algolia.net/1/indexes/"+t.config.indexName;return t.addLogo("algolia"),t.buildResultList=function(a){var o="";return e.each(a,function(e,a){var n=a.permalink||a.path||"";!a.permalink&&a.path&&(n=ROOT+n);var r=a.title,i=a._highlightResult.excerptStrip.value||"";o+=t.buildResult(n,r,i)}),o},t.buildMetadata=function(e){t.nav.current=e.page*e.hitsPerPage+1,t.nav.currentCount=e.hits.length,t.nav.total=parseInt(e.nbHits),t.dom.modal_metadata.children(".total").html(t.nav.total),t.dom.modal_metadata.children(".range").html(t.nav.current+"-"+(t.nav.current+t.nav.currentCount-1)),t.nav.total>0?t.dom.modal_metadata.show():t.dom.modal_metadata.hide(),e.page<e.nbPages-1?(t.nav.next=e.page+1+1,t.dom.btn_next.show()):(t.nav.next=-1,t.dom.btn_next.hide()),e.page>0?(t.nav.prev=e.page+1-1,t.dom.btn_prev.show()):(t.nav.prev=-1,t.dom.btn_prev.hide())},t.query=function(a,n,r){e.get(o,{query:a,page:n-1,hitsPerPage:t.config.per_page,"x-algolia-application-id":t.config.appId,"x-algolia-api-key":t.config.apiKey},function(e,o){if("success"===o&&e.hits&&e.hits.length>0){var n=t.buildResultList(e.hits);t.dom.modal_results.html(n)}else t.onQueryError(a,o);t.buildMetadata(e),r&&r(e)})},t}}(jQuery),function(e){"use strict";AzureSearch=function(a){SearchService.apply(this,arguments);var t=this,o="https://"+t.config.serviceName+".search.windows.net/indexes/"+t.config.indexName+"/docs?api-version=2015-02-28";return t.nav.current=1,t.addLogo("azure"),t.buildResultList=function(a){var o="";return e.each(a,function(e,a){var n=a.permalink||a.path||"";!a.permalink&&a.path&&(n="/"+n);var r=a.title,i=a.excerpt||"";o+=t.buildResult(n,r,i)}),o},t.buildMetadata=function(e,a){t.nav.current=a,t.nav.currentCount=e.value.length,t.nav.total=parseInt(e["@odata.count"]),t.dom.modal_metadata.children(".total").html(t.nav.total),t.dom.modal_metadata.children(".range").html(t.nav.current+"-"+(t.nav.current+t.nav.currentCount-1)),t.nav.total>0?t.dom.modal_metadata.show():t.dom.modal_metadata.hide(),t.nav.current+t.nav.currentCount<=t.nav.total?(t.nav.next=t.nav.current+t.nav.currentCount,t.dom.btn_next.show()):(t.nav.next=-1,t.dom.btn_next.hide()),t.nav.current>1?(t.nav.prev=t.nav.current-t.config.per_page,t.dom.btn_prev.show()):(t.nav.prev=-1,t.dom.btn_prev.hide())},t.query=function(a,n,r){e.ajax({url:o,headers:{Accept:"application/json","api-key":t.config.queryKey},data:{search:a,$orderby:"date desc",$skip:n-1,$top:t.config.per_page,$count:!0},type:"GET",success:function(e,o){if("success"===o&&e.value&&e.value.length>0){var i=t.buildResultList(e.value);t.dom.modal_results.html(i)}else t.onQueryError(a,o);t.buildMetadata(e,n),r&&r(e)}})},t}}(jQuery),function(e){"use strict";BaiduSearch=function(a){SearchService.apply(this,arguments);var t=this;return t.addLogo("baidu"),t.buildResultList=function(a,o){var n="";return e.each(a,function(e,a){t.contentSearch(a,o)&&(n+=t.buildResult(a.linkUrl,a.title,a.abstract))}),n},t.buildMetadata=function(e){},t.loadScript=function(){t.dom.input.each(function(a,t){e(t).attr("disabled",!0)});var a="<script src='http://zhannei.baidu.com/api/customsearch/apiaccept?sid="+t.config.apiId+"&v=2.0&callback=customSearch.initBaidu' type='text/javascript' charset='utf-8'><\/script>";t.dom.body.append(a)},t.initBaidu=function(){t.cse=new BCse.Search(t.config.apiId),t.dom.input.each(function(a,t){e(t).attr("disabled",!1)})},t.query=function(e,a,o){t.cse.getResult(e,function(a){console.log("Searching: "+e),console.log(a),t.cse.getError(function(e){console.log(e)}),a.length>0?(t.buildResultList(a,e),t.cse.getSearchInfo(e,function(e){console.log(e),t.buildMetadata(e)})):(t.nav.total=0,t.nav.next=-1,t.nav.prev=-1,t.dom.modal_metadata.hide(),t.dom.btn_next.hide(),t.dom.btn_prev.hide(),t.onQueryError(e,"success")),o instanceof Function&&o()})},t.loadScript(),t}}(jQuery);var HexoSearch,GoogleCustomSearch="";!function(e){"use strict";GoogleCustomSearch=function(a){SearchService.apply(this,arguments);var t=this;return t.addLogo("google"),t.buildResultList=function(a){var o="";return e.each(a,function(e,a){var n=a.link,r=a.title,i=(a.htmlSnippet||"").replace("<br>","");o+=t.buildResult(n,r,i)}),o},t.buildMetadata=function(e){e.queries&&e.queries.request&&"0"!==e.queries.request[0].totalResults?(t.nav.current=e.queries.request[0].startIndex,t.nav.currentCount=e.queries.request[0].count,t.nav.total=parseInt(e.queries.request[0].totalResults),t.dom.modal_metadata.children(".total").html(t.nav.total),t.dom.modal_metadata.children(".range").html(t.nav.current+"-"+(t.nav.current+t.nav.currentCount-1)),t.dom.modal_metadata.show()):t.dom.modal_metadata.hide(),e.queries&&e.queries.nextPage?(t.nav.next=e.queries.nextPage[0].startIndex,t.dom.btn_next.show()):(t.nav.next=-1,t.dom.btn_next.hide()),e.queries&&e.queries.previousPage?(t.nav.prev=e.queries.previousPage[0].startIndex,t.dom.btn_prev.show()):(t.nav.prev=-1,t.dom.btn_prev.hide())},t.query=function(a,o,n){e.get("https://www.googleapis.com/customsearch/v1",{key:t.config.apiKey,cx:t.config.engineId,q:a,start:o,num:t.config.per_page},function(e,o){if("success"===o&&e.items&&e.items.length>0){var r=t.buildResultList(e.items);t.dom.modal_results.html(r)}else t.onQueryError(a,o);t.buildMetadata(e),n&&n()})},t}}(jQuery),function(e){"use strict";HexoSearch=function(a){SearchService.apply(this,arguments);var t=this;return t.config.endpoint=ROOT+((a||{}).endpoint||"content.json"),t.config.endpoint=t.config.endpoint.replace("//","/"),t.cache="",t.contentSearch=function(a,t){var o=a.title.trim().toLowerCase(),n=a.text.trim().toLowerCase(),r=t.trim().toLowerCase().split(" "),i=!1,s=-1,c=-1,l=-1;return""!==o&&""!==n&&e.each(r,function(e,t){if(s=o.indexOf(t),c=n.indexOf(t),s<0&&c<0?i=!1:(i=!0,c<0&&(c=0),0===e&&(l=c)),i){n=a.text.trim();var d=0,u=0;if(l>=0){u=0===(d=Math.max(l-30,0))?Math.min(200,n.length):Math.min(l+170,n.length);var m=n.substring(d,u);r.forEach(function(e){var a=new RegExp(e,"gi");m=m.replace(a,"<b>"+e+"</b>")}),a.digest=m}else u=Math.min(200,n.length),a.digest=n.trim().substring(0,u)}}),i},t.buildResultList=function(a,o){var n="";return e.each(a,function(e,a){t.contentSearch(a,o)&&(n+=t.buildResult(a.permalink,a.title,a.digest))}),n},t.buildMetadata=function(e){t.dom.modal_footer.hide()},t.query=function(a,o,n){if(t.cache){var r="";r+=t.buildResultList(t.cache.pages,a),r+=t.buildResultList(t.cache.posts,a),t.dom.modal_results.html(r),t.buildMetadata(t.cache),n&&n(t.cache)}else e.get(t.config.endpoint,{key:t.config.apiKey,cx:t.config.engineId,q:a,start:o,num:t.config.per_page},function(e,o){if("success"!==o||!e||!e.posts&&!e.pages||e.posts.length<1&&e.pages.length<1)t.onQueryError(a,o);else{t.cache=e;var r="";r+=t.buildResultList(e.pages,a),r+=t.buildResultList(e.posts,a),t.dom.modal_results.html(r)}t.buildMetadata(e),n&&n(e)})},t}}(jQuery);var customSearch;!function(e){"use strict";const t=70;function a(a,o){o=o||t;const n=a.href?e(a.getAttribute("href")):e(a);e("html, body").animate({scrollTop:n.offset().top-o},400)}e(function(){var o;!function(){if(!window.subData)return;const t=e("header .wrapper"),o=e(".s-comment",t),n=e(".s-toc",t),s=e(".s-top",t);let c=document.body.scrollTop;e(document,window).scroll(()=>{const a=e(window).scrollTop(),o=a-c;o>=20?(c=a,t.addClass("sub")):o<=-20&&(c=a,t.removeClass("sub"))});const i=e("#comments");i.length?o.click(e=>{e.preventDefault(),e.stopPropagation(),a(i)}):o.remove();const l=e(".toc-wrapper");l.length&&l.children().length?n.click(e=>{e.stopPropagation(),l.toggleClass("active")}):n.remove(),s.click(()=>a(document.body))}(),function(){var t=e("header .menu"),a=t.find(".underline");function o(e,o){e=e||t.find("li a.active"),(o=void 0===o||!!o)||a.addClass("disable-trans"),e&&e.length?(e.addClass("active").siblings().removeClass("active"),a.css({left:e.position().left,width:e.innerWidth()})):a.css({left:0,width:0}),o||setTimeout(function(){a.removeClass("disable-trans")},0)}t.on("mouseenter","li",function(t){o(e(t.currentTarget))}),t.on("mouseout",function(){o()});var n=null;if("/"===location.pathname||location.pathname.startsWith("/page/"))n=e(".nav-home",t);else{var s=location.pathname.match(/\/(.*?)\//);s.length>1&&(n=e(".nav-"+s[1],t))}o(n,!1)}(),(o=e(".l_header .switcher .s-menu")).click(function(t){t.stopPropagation(),e("body").toggleClass("z_menu-open"),o.toggleClass("active")}),e(document).click(function(t){e("body").removeClass("z_menu-open"),o.removeClass("active")}),function(){var t=e(".l_header .switcher .s-search"),a=e(".l_header"),o=e(".l_header .m_search");0!==t.length&&(t.click(function(e){e.stopPropagation(),a.toggleClass("z_search-open"),o.find("input").focus()}),e(document).click(function(e){a.removeClass("z_search-open")}),o.click(function(e){e.stopPropagation()}))}(),Waves.attach(".flat-btn",["waves-button"]),Waves.attach(".float-btn",["waves-button","waves-float"]),Waves.attach(".float-btn-light",["waves-button","waves-float","waves-light"]),Waves.attach(".flat-box",["waves-block"]),Waves.attach(".float-box",["waves-block","waves-float"]),Waves.attach(".waves-image"),Waves.init(),0!==e(".reveal").length&&ScrollReveal().reveal(".reveal",{duration:300}),function(){const o=e(".toc-wrapper");if(0===o.length)return;o.click(e=>{e.stopPropagation(),o.addClass("active")}),e(document).click(()=>o.removeClass("active")),o.on("click","a",e=>{e.preventDefault(),e.stopPropagation(),a("a"===e.target.tagName.toLowerCase?e.target:e.target.parentElement)});const n=Array.from(o.find("li a")),s=()=>n.map(a=>Math.floor(e(a.getAttribute("href")).offset().top-t));let c=s();const i=()=>{const t=e("html").scrollTop()||e("body").scrollTop();if(!c)return;let a,o=0,s=c.length-1;for(;o<s;)c[a=o+s+1>>1]===t?o=s=a:c[a]<t?o=a:s=a-1;e(n).removeClass("active").eq(o).addClass("active")};e(window).resize(()=>{c=s(),i()}).scroll(()=>{i()}),i()}(),e(".article .video-container").fitVids(),setTimeout(function(){e("#loading-bar-wrapper").fadeOut(500)},300),"google"===SEARCH_SERVICE?customSearch=new GoogleCustomSearch({apiKey:GOOGLE_CUSTOM_SEARCH_API_KEY,engineId:GOOGLE_CUSTOM_SEARCH_ENGINE_ID,imagePath:"/images/"}):"algolia"===SEARCH_SERVICE?customSearch=new AlgoliaSearch({apiKey:ALGOLIA_API_KEY,appId:ALGOLIA_APP_ID,indexName:ALGOLIA_INDEX_NAME,imagePath:"/images/"}):"hexo"===SEARCH_SERVICE?customSearch=new HexoSearch({imagePath:"/images/"}):"azure"===SEARCH_SERVICE?customSearch=new AzureSearch({serviceName:AZURE_SERVICE_NAME,indexName:AZURE_INDEX_NAME,queryKey:AZURE_QUERY_KEY,imagePath:"/images/"}):"baidu"===SEARCH_SERVICE&&(customSearch=new BaiduSearch({apiId:BAIDU_API_ID,imagePath:"/images/"}))})}(jQuery);