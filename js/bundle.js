/*jshint browser:true */
/*!
* FitVids 1.1
*
* Copyright 2013, Chris Coyier - http://css-tricks.com + Dave Rupert - http://daverupert.com
* Credit to Thierry Koblentz - http://www.alistapart.com/articles/creating-intrinsic-ratios-for-video/
* Released under the WTFPL license - http://sam.zoy.org/wtfpl/
*
*/

;(function( $ ){

  'use strict';

  $.fn.fitVids = function( options ) {
    var settings = {
      customSelector: null,
      ignore: null
    };

    if(!document.getElementById('fit-vids-style')) {
      // appendStyles: https://github.com/toddmotto/fluidvids/blob/master/dist/fluidvids.js
      var head = document.head || document.getElementsByTagName('head')[0];
      var css = '.fluid-width-video-wrapper{width:100%;position:relative;padding:0;}.fluid-width-video-wrapper iframe,.fluid-width-video-wrapper object,.fluid-width-video-wrapper embed {position:absolute;top:0;left:0;width:100%;height:100%;}';
      var div = document.createElement("div");
      div.innerHTML = '<p>x</p><style id="fit-vids-style">' + css + '</style>';
      head.appendChild(div.childNodes[1]);
    }

    if ( options ) {
      $.extend( settings, options );
    }

    return this.each(function(){
      var selectors = [
        'iframe[src*="player.vimeo.com"]',
        'iframe[src*="youtube.com"]',
        'iframe[src*="youtube-nocookie.com"]',
        'iframe[src*="kickstarter.com"][src*="video.html"]',
        'object',
        'embed'
      ];

      if (settings.customSelector) {
        selectors.push(settings.customSelector);
      }

      var ignoreList = '.fitvidsignore';

      if(settings.ignore) {
        ignoreList = ignoreList + ', ' + settings.ignore;
      }

      var $allVideos = $(this).find(selectors.join(','));
      $allVideos = $allVideos.not('object object'); // SwfObj conflict patch
      $allVideos = $allVideos.not(ignoreList); // Disable FitVids on this video.

      $allVideos.each(function(){
        var $this = $(this);
        if($this.parents(ignoreList).length > 0) {
          return; // Disable FitVids on this video.
        }
        if (this.tagName.toLowerCase() === 'embed' && $this.parent('object').length || $this.parent('.fluid-width-video-wrapper').length) { return; }
        if ((!$this.css('height') && !$this.css('width')) && (isNaN($this.attr('height')) || isNaN($this.attr('width'))))
        {
          $this.attr('height', 9);
          $this.attr('width', 16);
        }
        var height = ( this.tagName.toLowerCase() === 'object' || ($this.attr('height') && !isNaN(parseInt($this.attr('height'), 10))) ) ? parseInt($this.attr('height'), 10) : $this.height(),
            width = !isNaN(parseInt($this.attr('width'), 10)) ? parseInt($this.attr('width'), 10) : $this.width(),
            aspectRatio = height / width;
        if(!$this.attr('name')){
          var videoName = 'fitvid' + $.fn.fitVids._count;
          $this.attr('name', videoName);
          $.fn.fitVids._count++;
        }
        $this.wrap('<div class="fluid-width-video-wrapper"></div>').parent('.fluid-width-video-wrapper').css('padding-top', (aspectRatio * 100)+'%');
        $this.removeAttr('height').removeAttr('width');
      });
    });
  };
  
  // Internal counter for unique video names.
  $.fn.fitVids._count = 0;
  
// Works with either jQuery or Zepto
})( window.jQuery || window.Zepto );
/* eslint-disable */
var SearchService = "";

(function($) {
  /**
   * A super class of common logics for all search services
   * @param options : (object)
   */
  SearchService = function(options) {
    var self = this;
    
    self.config = $.extend({
      per_page: 10,
      selectors: {
        body: "body",
        form: ".u-search-form",
        input: ".u-search-input",
        container: "#u-search",
        modal: "#u-search .modal",
        modal_body: "#u-search .modal-body",
        modal_footer: "#u-search .modal-footer",
        modal_overlay: "#u-search .modal-overlay",
        modal_results: "#u-search .modal-results",
        modal_metadata: "#u-search .modal-metadata",
        modal_error: "#u-search .modal-error",
        modal_loading_bar: "#u-search .modal-loading-bar",
        modal_ajax_content: "#u-search .modal-ajax-content",
        modal_logo: '#u-search .modal-footer .logo',
        btn_close: "#u-search .btn-close",
        btn_next: "#u-search .btn-next",
        btn_prev: "#u-search .btn-prev"
      },
      brands: {
        'google': {logo: 'google.svg', url: 'https://cse.google.com'},
        'algolia': {logo: 'algolia.svg', url: 'https://www.algolia.com'},
        'hexo': {logo: '', url: ''},
        'azure': {logo: 'azure.svg', url: 'https://azure.microsoft.com/en-us/services/search/'},
        'baidu': {logo: 'baidu.svg', url: 'http://zn.baidu.com/cse/home/index'}
      },
      imagePath: ROOT + "img/"
    }, options);

    self.dom = {};
    self.percentLoaded = 0;
    self.open = false;
    self.queryText = "";
    self.nav = {
      next: -1,
      prev: -1,
      total: 0,
      current: 1
    };

    self.parseSelectors = function() {
      for (var key in self.config.selectors) {
        self.dom[key] = $(self.config.selectors[key]);
      }
    };

    self.beforeQuery = function() {
      if (!self.open) {
        self.dom.container.fadeIn();
        self.dom.body.addClass('modal-active');
      }
      self.dom.input.each(function(index,elem) {
        $(elem).val(self.queryText);
      });
      document.activeElement.blur();
      self.dom.modal_error.hide();
      self.dom.modal_ajax_content.removeClass('loaded');
      self.startLoading();
    };
    
    self.afterQuery = function() {
      self.dom.modal_body.scrollTop(0);
      self.dom.modal_ajax_content.addClass('loaded');
      self.stopLoading();
    };

    /**
     * Perform a complete serach operation including UI updates and query
     * @param startIndex {int} start index or page number
     */
    self.search = function(startIndex, callback) {
      self.beforeQuery();
      if (self.search instanceof Function) {
        self.query(self.queryText, startIndex, function() {
          self.afterQuery();
        });
      }
      else {
        console.log("query() does not exist.");
        self.onQueryError(self.queryText, '');
        self.afterQuery();
      }
    };

    /**
     * Query error handler
     * @param queryText: (string)
     * @param status: (string)
     */
    self.onQueryError = function(queryText, status) {
      var errMsg = "";
      if (status === "success") errMsg = "No result found for \"" +queryText+ "\".";
      else if (status === "timeout") errMsg = "Unfortunate timeout.";
      else errMsg = "Mysterious failure.";
      self.dom.modal_results.html("");
      self.dom.modal_error.html(errMsg);
      self.dom.modal_error.show();
    };
    
    self.nextPage = function() {
      if (self.nav.next !== -1) {
        self.search(self.nav.next);
      }
    };
    
    self.prevPage = function() {
      if (self.nav.prev !== -1) {
        self.search(self.nav.prev);
      }
    };
    
    /**
     * Generate html for one result
     * @param url : (string) url
     * @param title : (string) title
     * @param digest : (string) digest
     */
    self.buildResult = function(url, title, digest) {
      var html = "";
      html = "<li>";
      html +=   "<a class='result' href='" +url+ "'>";
      html +=     "<span class='title'>" +title+ "</span>";
      html +=     "<span class='digest'>" +digest+ "</span>";
      html +=     "<span class='icon fas fa-angle-right'></span>";
      html +=   "</a>";
      html += "</li>";
      return html;
    };
    
    /**
     * Close the modal, resume body scrolling
     * no param
     */
    self.close = function() {
      self.open = false;
      self.dom.container.fadeOut();
      self.dom.body.removeClass('modal-active');
    };
    
    /**
     * Searchform submit event handler
     * @param queryText : (string) the query text
     */
    self.onSubmit = function(event) {
      event.preventDefault();
      self.queryText = $(this).find('.u-search-input').val();
      if (self.queryText) {
        self.search(1);
      }
    };
    
    /**
     * Start loading bar animation
     * no param
     */
    self.startLoading = function() {
      self.dom.modal_loading_bar.show();
      self.loadingTimer = setInterval(function() { 
        self.percentLoaded = Math.min(self.percentLoaded+5,95);
        self.dom.modal_loading_bar.css('width', self.percentLoaded+'%');
      }, 100);
    };
    
    /**
     * Stop loading bar animation
     * no param
     */
    self.stopLoading = function() {
      clearInterval(self.loadingTimer);
      self.dom.modal_loading_bar.css('width', '100%');
      self.dom.modal_loading_bar.fadeOut();
      setTimeout(function() {
        self.percentLoaded = 0;
        self.dom.modal_loading_bar.css('width', '0%');
      }, 300);
    };

    /**
     * Add service branding
     * @param service {String} service name
     */
    self.addLogo = function(service) {
      var html = "";
      if (self.config.brands[service] && self.config.brands[service].logo) {
        html += "<a href='" +self.config.brands[service].url+ "' class='" +service+ "'>";
        html +=    '<img src="' +self.config.imagePath+self.config.brands[service].logo+ '" />';
        html += "</a>";
        self.dom.modal_logo.html(html);
      }
    };

    self.destroy = function() {
      self.dom.form.each(function(index,elem) {
        $(elem).off('submit');
      });
      self.dom.modal_overlay.off('click');
      self.dom.btn_close.off('click');
      self.dom.btn_next.off('click');
      self.dom.btn_prev.off('click');
      self.dom.container.remove();
    };
    
    /**
     * Load template and register event handlers
     * no param
     */
    self.init = function() {
      $('body').append(template);
      self.parseSelectors();
      self.dom.modal_footer.show();
      self.dom.form.each(function(index,elem) {
        $(elem).on('submit', self.onSubmit);
      });
      self.dom.modal_overlay.on('click', self.close);
      self.dom.btn_close.on('click', self.close);
      self.dom.btn_next.on('click', self.nextPage);
      self.dom.btn_prev.on('click', self.prevPage);
    };

    self.init();
  };

  var template = '<div id="u-search"><div class="modal"> <header class="modal-header" class="clearfix"><form id="u-search-modal-form" class="u-search-form" name="uSearchModalForm"> <input type="text" id="u-search-modal-input" class="u-search-input" /> <button type="submit" id="u-search-modal-btn-submit" class="u-search-btn-submit"> <span class="icon fas fa-search"></span> </button></form> <a class="btn-close"> <span class="icon fas fa-times"></span> </a><div class="modal-loading"><div class="modal-loading-bar"></div></div> </header> <main class="modal-body"><ul class="modal-results modal-ajax-content"></ul> </main> <footer class="modal-footer clearfix"><div class="modal-metadata modal-ajax-content"> <strong class="range"></strong> of <strong class="total"></strong></div><div class="modal-error"></div> <div class="logo"></div> <a class="nav btn-next modal-ajax-content"> <span class="text">NEXT</span> <span class="icon fas fa-angle-right"></span> </a> <a class="nav btn-prev modal-ajax-content"> <span class="icon fas fa-angle-left"></span> <span class="text">PREV</span> </a> </footer></div><div class="modal-overlay"></div></div>';
})(jQuery);

var AlgoliaSearch;

(function($) {
  'use strict';

  /**
   * Search by Algolia Search
   * @param options : (object)
   */
  AlgoliaSearch = function(options) {
    SearchService.apply(this, arguments);
    var self = this;
    var endpoint = "https://" +self.config.appId+ "-dsn.algolia.net/1/indexes/" +self.config.indexName;
    self.addLogo('algolia');
    
    /**
     * Generate result list html
     * @param data : (array) result items
     */
    self.buildResultList = function(data) {
      var html = "";
      $.each(data, function(index, row) {
        var url = row.permalink || row.path || "";
        if (!row.permalink && row.path) {
          url = ROOT + url;
        }
        var title = row.title;
        var digest = row._highlightResult.excerptStrip.value || "";
        html += self.buildResult(url, title, digest);
      });
      return html;
    };
    
    /**
     * Generate metadata after a successful query
     * @param data : (object) the raw search response data
     */
    self.buildMetadata = function(data) {
      self.nav.current = data.page * data.hitsPerPage + 1;
      self.nav.currentCount = data.hits.length;
      self.nav.total = parseInt(data.nbHits);
      self.dom.modal_metadata.children('.total').html(self.nav.total);
      self.dom.modal_metadata.children('.range').html(self.nav.current + "-" + (self.nav.current+self.nav.currentCount-1));
      if (self.nav.total > 0) {
        self.dom.modal_metadata.show();
      }
      else {
        self.dom.modal_metadata.hide();
      }

      if (data.page < data.nbPages-1) {
        self.nav.next = (data.page+1)+1;
        self.dom.btn_next.show();
      }
      else {
        self.nav.next = -1;
        self.dom.btn_next.hide();
      }
      if (data.page > 0) {
        self.nav.prev = (data.page+1)-1;
        self.dom.btn_prev.show();
      }
      else {
        self.nav.prev = -1;
        self.dom.btn_prev.hide();
      }
    };
    
    /**
     * Send a GET request
     * @param queryText : (string) the query text
     * @param page : (int) the current page (start from 1)
     * @param callback : (function)
     */
    self.query = function(queryText, page, callback) {
      $.get(endpoint, {
        query: queryText,
        page: page-1,
        hitsPerPage: self.config.per_page,
        "x-algolia-application-id": self.config.appId,
        "x-algolia-api-key": self.config.apiKey
      }, function(data, status) {
        if (status === 'success' && data.hits && data.hits.length > 0) {
          var results = self.buildResultList(data.hits); 
          self.dom.modal_results.html(results);
        }
        else {
          self.onQueryError(queryText, status);
        }
        self.buildMetadata(data);
        if (callback) {
          callback(data);
        }
      });
    };
    
    return self;
  };

})(jQuery);
var AzureSearch;

(function($) {
  'use strict';

  /**
   * Search by Azure Search API
   * @param options : (object)
   */
  AzureSearch = function(options) {
    SearchService.apply(this, arguments);
    var self = this;
    var endpoint = "https://" +self.config.serviceName+ ".search.windows.net/indexes/" +self.config.indexName+ "/docs?api-version=2015-02-28";
    self.nav.current = 1;
    self.addLogo('azure');
    
    /**
     * Generate result list html
     * @param data : (array) result items
     */
    self.buildResultList = function(data) {
      var html = "";
      $.each(data, function(index, row) {
        var url = row.permalink || row.path || "";
        if (!row.permalink && row.path) {
          url = "/" + url;
        }
        var title = row.title;
        var digest = row.excerpt || "";
        html += self.buildResult(url, title, digest);
      });
      return html;
    };
    
    /**
     * Generate metadata after a successful query
     * @param data : (object) the raw response data
     * @param startIndex : (int) requested start index of current query
     */
    self.buildMetadata = function(data, startIndex) {
      self.nav.current = startIndex;
      self.nav.currentCount = data.value.length;
      self.nav.total = parseInt(data['@odata.count']);
      self.dom.modal_metadata.children('.total').html(self.nav.total);
      self.dom.modal_metadata.children('.range').html(self.nav.current + "-" + (self.nav.current+self.nav.currentCount-1));
      if (self.nav.total > 0) {
        self.dom.modal_metadata.show();
      }
      else {
        self.dom.modal_metadata.hide();
      }

      if (self.nav.current+self.nav.currentCount <= self.nav.total) {
        self.nav.next = self.nav.current+self.nav.currentCount;
        self.dom.btn_next.show();
      }
      else {
        self.nav.next = -1;
        self.dom.btn_next.hide();
      }
      if (self.nav.current > 1) {
        self.nav.prev = self.nav.current-self.config.per_page;
        self.dom.btn_prev.show();
      }
      else {
        self.nav.prev = -1;
        self.dom.btn_prev.hide();
      }
    };
    
    /**
     * Send a GET request
     * @param queryText : (string) the query text
     * @param page : (int) the current page (start from 1)
     * @param callback : (function)
     */
    self.query = function(queryText, startIndex, callback) {
      $.ajax({
        url: endpoint,
        headers: {
          "Accept": "application/json",
          "api-key": self.config.queryKey
        },
        data: {
          search: queryText,
          $orderby: "date desc",
          $skip: startIndex-1,
          $top: self.config.per_page,
          $count: true
        },
        type: "GET",
        success: function(data, status) {
          if (status === 'success' && data.value && data.value.length > 0) {
            var results = self.buildResultList(data.value);
            self.dom.modal_results.html(results);
          }
          else {
            self.onQueryError(queryText, status);
          }
          self.buildMetadata(data, startIndex);
          if (callback) {
            callback(data);
          }
        }
      });
    };

    return self;
  };

})(jQuery);
var BaiduSearch;

(function($) {
  'use strict';

  /**
   * TODO
   * Search by Baidu Search API
   * @param options : (object)
   */
  BaiduSearch = function(options) {
    SearchService.apply(this, arguments);
    var self = this;
    var endpoint = "";
    self.addLogo('baidu');

    /**
     * Generate result list html
     * @param data : (array) result items
     */
    self.buildResultList = function(data, queryText) {
      var results = [],
          html = "";
      $.each(data, function(index, post) {
        if (self.contentSearch(post, queryText))
          html += self.buildResult(post.linkUrl, post.title, post.abstract);
      });
      return html;
    };
    
    /**
     * Generate metadata after a successful query
     * @param data : (object) the raw google custom search response data
     */
    self.buildMetadata = function(data) {

    };

    self.loadScript = function() {
      self.dom.input.each(function(index,elem) {
        $(elem).attr('disabled', true);
      });
      var script = "<script src='http://zhannei.baidu.com/api/customsearch/apiaccept?sid=" +self.config.apiId+ "&v=2.0&callback=customSearch.initBaidu' type='text/javascript' charset='utf-8'></script>";
      self.dom.body.append(script);
    };

    self.initBaidu = function() {
      self.cse = new BCse.Search(self.config.apiId);
      //self.cse.setPageNum(self.config.per_page);
      self.dom.input.each(function(index,elem) {
        $(elem).attr('disabled', false);
      });
    };

    /**
     * Get search results
     * @param queryText {String}
     * @param page {Integer}
     * @param callback {Function}
     */
    self.query = function(queryText, page, callback) {
      self.cse.getResult(queryText, function(data) {
        console.log("Searching: " + queryText);
        console.log(data);
        self.cse.getError(function(data) {
          console.log(data);
        });
        if (data.length > 0) {
          self.buildResultList(data, queryText);
          self.cse.getSearchInfo(queryText, function(data) {
            console.log(data);
            self.buildMetadata(data);
          });
        }
        else {
          self.nav.total = 0;
          self.nav.next = -1;
          self.nav.prev = -1;
          self.dom.modal_metadata.hide();
          self.dom.btn_next.hide();
          self.dom.btn_prev.hide();
          self.onQueryError(queryText, "success");
        }
        if (callback instanceof Function) {
          callback();
        }
      });
    };

    self.loadScript();
    
    return self;
  };

})(jQuery);
var GoogleCustomSearch = "";

(function($) {
  'use strict';
  
  /**
   * Search by Google Custom Search Engine JSON API
   * @param options : (object)
   */
  GoogleCustomSearch = function(options) {
    SearchService.apply(this, arguments);
    var self = this;
    var endpoint = "https://www.googleapis.com/customsearch/v1";
    self.addLogo('google');

    /**
     * Generate result list html
     * @param data : (array) result items
     */
    self.buildResultList = function(data) {
      var html = "";
      $.each(data, function(index, row) {
        var url = row.link;
        var title = row.title;
        var digest = (row.htmlSnippet || "").replace('<br>','');
        html += self.buildResult(url, title, digest);
      });
      return html;
    };
    
    /**
     * Generate metadata after a successful query
     * @param data : (object) the raw google custom search response data
     */
    self.buildMetadata = function(data) {
      if (data.queries && data.queries.request && data.queries.request[0].totalResults !== '0') {
        self.nav.current = data.queries.request[0].startIndex;
        self.nav.currentCount = data.queries.request[0].count;
        self.nav.total = parseInt(data.queries.request[0].totalResults);
        self.dom.modal_metadata.children('.total').html(self.nav.total);
        self.dom.modal_metadata.children('.range').html(self.nav.current + "-" + (self.nav.current+self.nav.currentCount-1));
        self.dom.modal_metadata.show();
      }
      else {
        self.dom.modal_metadata.hide();
      }
      if (data.queries && data.queries.nextPage) {
        self.nav.next = data.queries.nextPage[0].startIndex;
        self.dom.btn_next.show();
      }
      else {
        self.nav.next = -1;
        self.dom.btn_next.hide();
      }
      if (data.queries && data.queries.previousPage) {
        self.nav.prev = data.queries.previousPage[0].startIndex;
        self.dom.btn_prev.show();
      }
      else {
        self.nav.prev = -1;
        self.dom.btn_prev.hide();
      }
    };
    
    /**
     * Send a GET request
     * @param queryText : (string) the query text
     * @param startIndex : (int) the index of first item (start from 1)
     * @param callback : (function)
     */
    self.query = function(queryText, startIndex, callback) {
      $.get(endpoint, {
        key: self.config.apiKey,
        cx: self.config.engineId,
        q: queryText,
        start: startIndex,
        num: self.config.per_page
      }, function(data, status) {
        if (status === 'success' && data.items && data.items.length > 0) {
          var results = self.buildResultList(data.items); 
          self.dom.modal_results.html(results);       
        }
        else {
          self.onQueryError(queryText, status);
        }
        self.buildMetadata(data);
        if (callback) {
          callback();
        }
      });
    };
    
    return self;
  };
})(jQuery);
var HexoSearch;

(function($) {
  'use strict';
  
  /**
  * Search by Hexo generator json content
  * @param options : (object)
  */
  HexoSearch = function(options) {
    SearchService.apply(this, arguments);
    var self = this;
    self.config.endpoint = ROOT + ((options||{}).endpoint || "content.json");
    self.config.endpoint = self.config.endpoint.replace("//","/"); //make sure the url is correct
    self.cache = "";
    
    /**
     * Search queryText in title and content of a post
     * Credit to: http://hahack.com/codes/local-search-engine-for-hexo/
     * @param post : the post object
     * @param queryText : the search query
     */
    self.contentSearch = function(post, queryText) {
      var post_title = post.title.trim().toLowerCase(),
          post_content = post.text.trim().toLowerCase(),
          keywords = queryText.trim().toLowerCase().split(" "),
          foundMatch = false,
          index_title = -1,
          index_content = -1,
          first_occur = -1;
      if (post_title !== '' && post_content !== '') {
        $.each(keywords, function(index, word) {
          index_title = post_title.indexOf(word);
          index_content = post_content.indexOf(word);
          if (index_title < 0 && index_content < 0) {
            foundMatch = false;
          }
          else {
            foundMatch = true;
            if (index_content < 0) {
              index_content = 0;
            }
            if (index === 0) {
              first_occur = index_content;
            }
          }
          if (foundMatch) {
            post_content = post.text.trim();
            var start = 0, end = 0;
            if (first_occur >= 0) {
              start = Math.max(first_occur-30, 0);
              end = (start === 0) ? Math.min(200, post_content.length) : Math.min(first_occur+170, post_content.length);
              var match_content = post_content.substring(start, end);
              keywords.forEach(function(keyword) {
                var regS = new RegExp(keyword, "gi");
                match_content = match_content.replace(regS, "<b>"+keyword+"</b>");
              });
              post.digest = match_content;
            }
            else {
              end = Math.min(200, post_content.length);
              post.digest = post_content.trim().substring(0, end);
            }
          }
        });
      }
      return foundMatch;
    };
    
    /**
     * Generate result list html
     * @param data : (array) result items
     */
    self.buildResultList = function(data, queryText) {
      var results = [],
          html = "";
      $.each(data, function(index, post) {
        if (self.contentSearch(post, queryText))
          html += self.buildResult(post.permalink, post.title, post.digest);
      });
      return html;
    };
    
    /**
     * Generate metadata after a successful query
     * @param data : (object) the raw google custom search response data
     */
    self.buildMetadata = function(data) {
      self.dom.modal_footer.hide();
    };
    
    /**
     * Send a GET request
     * @param queryText : (string) the query text
     * @param startIndex : (int) the index of first item (start from 1)
     * @param callback : (function)
     */
    self.query = function(queryText, startIndex, callback) {
      if (!self.cache) {
        $.get(self.config.endpoint, {
          key: self.config.apiKey,
          cx: self.config.engineId,
          q: queryText,
          start: startIndex,
          num: self.config.per_page
        }, function(data, status) {
          if (status !== 'success' || 
              !data || 
              (!data.posts && !data.pages) || 
              (data.posts.length < 1 && data.pages.length < 1)
            ) {
            self.onQueryError(queryText, status);
          }
          else {
            self.cache = data;
            var results = ""; 
            results += self.buildResultList(data.pages, queryText);
            results += self.buildResultList(data.posts, queryText);
            self.dom.modal_results.html(results);
          }
          self.buildMetadata(data);
          if (callback) {
            callback(data);
          }
        });
      }
      else {
        var results = ""; 
        results += self.buildResultList(self.cache.pages, queryText);
        results += self.buildResultList(self.cache.posts, queryText);
        self.dom.modal_results.html(results);
        self.buildMetadata(self.cache);
        if (callback) {
          callback(self.cache);
        }
      }
    };
    
    return self;
  };

})(jQuery);/* eslint-disable */
var customSearch;
(function ($) {

	"use strict";
	const scrollCorrection = 70; // (header height = 50px) + (gap = 20px)
	function scrolltoElement(elem, correction) {
		correction = correction || scrollCorrection;
		const $elem = elem.href ? $(elem.getAttribute('href')) : $(elem);
		$('html, body').animate({ 'scrollTop': $elem.offset().top - correction }, 400);
	};

	function setHeader() {
		if (!window.subData) return;
		const $wrapper = $('header .wrapper');
		const $comment = $('.s-comment', $wrapper);
		const $toc = $('.s-toc', $wrapper);
		const $top = $('.s-top',$wrapper);

		// $wrapper.find('.nav-sub .logo').text(window.subData.title);
		let pos = document.body.scrollTop;
		$(document, window).scroll(() => {
			const scrollTop = $(window).scrollTop();
			const del = scrollTop - pos;
			if (del >= 20) {
				pos = scrollTop;
				$wrapper.addClass('sub');
			} else if (del <= -20) {
				pos = scrollTop;
				$wrapper.removeClass('sub');
			}
		});
		// bind events to every btn
		const $commentTarget = $('#comments');
		if ($commentTarget.length) {
			$comment.click(e => { e.preventDefault(); e.stopPropagation(); scrolltoElement($commentTarget); });
		} else $comment.remove();

		const $tocTarget = $('.toc-wrapper');
		if ($tocTarget.length && $tocTarget.children().length) {
			$toc.click((e) => { e.stopPropagation(); $tocTarget.toggleClass('active'); });
		} else $toc.remove();

		$top.click(()=>scrolltoElement(document.body));

	}
	function setHeaderMenu() {
		var $headerMenu = $('header .menu');
		var $underline = $headerMenu.find('.underline');
		function setUnderline($item, transition) {
			$item = $item || $headerMenu.find('li a.active');//get instant
			transition = transition === undefined ? true : !!transition;
			if (!transition) $underline.addClass('disable-trans');
			if ($item && $item.length) {
				$item.addClass('active').siblings().removeClass('active');
				$underline.css({
					left: $item.position().left,
					width: $item.innerWidth()
				});
			} else {
				$underline.css({
					left: 0,
					width: 0
				});
			}
			if (!transition) {
				setTimeout(function () { $underline.removeClass('disable-trans') }, 0);//get into the queue.
			}
		}
		$headerMenu.on('mouseenter', 'li', function (e) {
			setUnderline($(e.currentTarget));
		});
		$headerMenu.on('mouseout', function () {
			setUnderline();
		});
		//set current active nav
		var $active_link = null;
		if (location.pathname === '/' || location.pathname.startsWith('/page/')) {
			$active_link = $('.nav-home', $headerMenu);
		} else {
			var name = location.pathname.match(/\/(.*?)\//);
			if (name.length > 1) {
				$active_link = $('.nav-' + name[1], $headerMenu);
			}
		}
		setUnderline($active_link, false);
	}
	function setHeaderMenuPhone() {
		var $switcher = $('.l_header .switcher .s-menu');
		$switcher.click(function (e) {
			e.stopPropagation();
			$('body').toggleClass('z_menu-open');
			$switcher.toggleClass('active');
		});
		$(document).click(function (e) {
			$('body').removeClass('z_menu-open');
			$switcher.removeClass('active');
		});
	}
	function setHeaderSearch() {
		var $switcher = $('.l_header .switcher .s-search');
		var $header = $('.l_header');
		var $search = $('.l_header .m_search');
		if ($switcher.length === 0) return;
		$switcher.click(function (e) {
			e.stopPropagation();
			$header.toggleClass('z_search-open');
			$search.find('input').focus();
		});
		$(document).click(function (e) {
			$header.removeClass('z_search-open');
		});
		$search.click(function (e) {
			e.stopPropagation();
		})
	}
	function setTocToggle() {
		const $toc = $('.toc-wrapper');
		if ($toc.length === 0) return;
		$toc.click((e) => { e.stopPropagation(); $toc.addClass('active'); });
		$(document).click(() => $toc.removeClass('active'));

		$toc.on('click', 'a', (e) => {
			e.preventDefault();
			e.stopPropagation();
			scrolltoElement(e.target.tagName.toLowerCase === 'a' ? e.target : e.target.parentElement);
		});

		const liElements = Array.from($toc.find('li a'));
		//function animate above will convert float to int.
		const getAnchor = function () {
			liElements.map(elem => {
				Math.floor($(elem.getAttribute('href')).offset().top - scrollCorrection);
			});
		};

		let anchor = getAnchor();
		const scrollListener = () => {
			const scrollTop = $('html').scrollTop() || $('body').scrollTop();
			if (!anchor) return;
			//binary search.
			let l = 0, r = anchor.length - 1, mid;
			while (l < r) {
				mid = (l + r + 1) >> 1;
				if (anchor[mid] === scrollTop) l = r = mid;
				else if (anchor[mid] < scrollTop) l = mid;
				else r = mid - 1;
			}
			$(liElements).removeClass('active').eq(l).addClass('active');
		}
		$(window)
			.resize(() => {
				anchor = getAnchor();
				scrollListener();
			})
			.scroll(() => {
				scrollListener()
			});
		scrollListener();
	}

	$(function () {
		//set header
		setHeader();
		setHeaderMenu();
		setHeaderMenuPhone();
		setHeaderSearch();
		setTocToggle();

		$(".article .video-container").fitVids();

		setTimeout(function () {
			$('#loading-bar-wrapper').fadeOut(500);
		}, 300);

		if (SEARCH_SERVICE === 'hexo') {
			customSearch = new HexoSearch({
				imagePath: "/images/"
			});
		} else if (SEARCH_SERVICE === 'google') {
			customSearch = new GoogleCustomSearch({
				apiKey: GOOGLE_CUSTOM_SEARCH_API_KEY,
				engineId: GOOGLE_CUSTOM_SEARCH_ENGINE_ID,
				imagePath: "/images/"
			});
		} else if (SEARCH_SERVICE === 'algolia') {
			customSearch = new AlgoliaSearch({
				apiKey: ALGOLIA_API_KEY,
				appId: ALGOLIA_APP_ID,
				indexName: ALGOLIA_INDEX_NAME,
				imagePath: "/images/"
			});
		} else if (SEARCH_SERVICE === 'azure') {
			customSearch = new AzureSearch({
				serviceName: AZURE_SERVICE_NAME,
				indexName: AZURE_INDEX_NAME,
				queryKey: AZURE_QUERY_KEY,
				imagePath: "/images/"
			});
		} else if (SEARCH_SERVICE === 'baidu') {
			customSearch = new BaiduSearch({
				apiId: BAIDU_API_ID,
				imagePath: "/images/"
			});
		}
	});

})(jQuery);$(function () {
  // ref: https://github.com/zenorocha/codecopy/blob/master/src/scripts/main.js
  var snippets = document.querySelectorAll('figure.highlight');
  var htmlCopyButton = `
  <button class="codecopy-btn tooltipped tooltipped-sw" aria-label="Copy to clipboard">
    <i class="far fa-copy" aria-hidden="true"></i>
  </button>`;

  snippets.forEach((snippet) => {
    var parent = snippet.parentNode;
    var wrapper = document.createElement('div');

    parent.replaceChild(wrapper, snippet);
    wrapper.appendChild(snippet);

    wrapper.classList.add('code-highlight');
    wrapper.firstChild.insertAdjacentHTML('beforebegin', htmlCopyButton);

    var lang = (snippet.classList[1] || 'code').toUpperCase();
    wrapper.setAttribute('data-lang', lang);
  });

  // Add copy to clipboard functionality and user feedback
  var clipboard = new ClipboardJS('.codecopy-btn', {
    target: (trigger) => {
      return trigger.nextSibling;
    }
  });

  clipboard.on('success', (e) => {
    e.trigger.setAttribute('aria-label', 'Copied!');
    e.clearSelection();
  });

  // Replace tooltip message when mouse leaves button
  // and prevent page refresh after click button
  var btns = document.querySelectorAll('.codecopy-btn');

  btns.forEach((btn) => {
    btn.addEventListener('mouseleave', (e) => {
      e.target.setAttribute('aria-label', 'Copy to clipboard');
      e.target.blur();
    });

    btn.addEventListener('click', (e) => {
      e.preventDefault()
    });
  });
});