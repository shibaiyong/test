(function (D,screenwidth) {
    
    var self = {};
    self.resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize';
    self.Html = D.getElementsByTagName("html")[0];
  
    self.changePage = function () {
  
      var p = Number((D.body && D.body.clientWidth || self.Html.offsetWidth) / screenwidth).toFixed(3);
      var pp = p > 1.067 ? 1.067 : p < 0.444 ? 0.444 : p;
      if (p > 1.067) {
  
        self.Html.setAttribute("style", "font-size:" + "100" + "px");
      } else {
  
        self.Html.setAttribute("style", "font-size:" + pp * 100 + "px");
      }
      self.correctPx();
    };
    self.correctPx = function () {
  
      var docEl = document.documentElement;
      var clientWidth = docEl.clientWidth;
  
      if (!clientWidth || clientWidth > screenwidth) return;
  
      var div = document.createElement('div');
      div.style.width = '1.4rem';
      div.style.height = '0';
      document.body.appendChild(div);
      var ideal = 140 * clientWidth / screenwidth;
      var rmd = (div.clientWidth / ideal);
      if (rmd > 1.2 || rmd < 0.8) {
        docEl.style.fontSize = 100 * (clientWidth / screenwidth) / rmd + 'px';
        document.body.removeChild(div);
      }
    };
  
    self.changePage();
    if (!document.addEventListener) return;
  
    window.addEventListener(self.resizeEvt, self.changePage, false);
    //document.addEventListener('DOMContentLoaded', self.changePage, false);
    window.addEventListener('load', self.changePage, false);
  
})(document,360);