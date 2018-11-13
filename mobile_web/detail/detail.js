//全局变量
var window_w = $(window).width();
var mobilenav_screen_size = 820;
var $body = $('body');

(function (D) {

  var self = {};
  self.resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize';
  self.Html = D.getElementsByTagName("html")[0];

  self.changePage = function () {

    var p = Number((D.body && D.body.clientWidth || self.Html.offsetWidth) / 720).toFixed(3);
    var pp = p > 1.067 ? 1.067 : p < 0.444 ? 0.444 : p;

    window_w = $(window).width();

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

    if (!clientWidth || clientWidth > 768) return;

    var div = document.createElement('div');
    div.style.width = '1.4rem';
    div.style.height = '0';
    document.body.appendChild(div);
    var ideal = 140 * clientWidth / 720;
    var rmd = (div.clientWidth / ideal);

    if (rmd > 1.2 || rmd < 0.8) {

      docEl.style.fontSize = 100 * (clientWidth / 720) / rmd + 'px';
      document.body.removeChild(div);

    }
  };

  self.changePage();
  if (!document.addEventListener) return;

  window.addEventListener(self.resizeEvt, self.changePage, false);
  document.addEventListener('DOMContentLoaded', self.changePage, false);
  //window.addEventListener('load', self.changePage, false);

})(document);
//头部导航的效果
function enableStickyHeader() {

  $(window).scroll(function () {

    window_s = $(this).scrollTop();
    window_w = $(this).width();
    if (window_s > 130 && window_w > 991) {

      // Prevent Header Top Animation Flash Effect
      if ($('body').hasClass('headerstyle9') && !$('body').hasClass('sticky-header-on')) {
        $('#header').hide();
        setTimeout(function () {
          $('#header').show();
        }, 300);
      }

      $('#header').addClass('sticky-header');
      $('body').addClass('sticky-header-on');

    } else {

      $('#header').removeClass('sticky-header');
      $('body').removeClass('sticky-header-on');

    }

  });

  // Initialize Body Padding for Header
  initMarineHeader();
  $(window).bind('load resize', function () {
    initMarineHeader();
  });

}

function initMarineHeader() {
  if (window_w > parseInt(mobilenav_screen_size) && !$body.hasClass('headerstyle7') && !$body.hasClass('headerstyle8')) {

    var $header = $('#header'),
      header_h;

    if (!$header.hasClass('sticky-header')) {
      header_h = $header.height();
      $body.css('padding-top', header_h);
    } else {
      $header.removeClass('sticky-header');
      header_h = $header.height();
      $body.css('padding-top', header_h);
      $header.addClass('sticky-header');
    }

  } else {
    $body.css('padding-top', '');
  }
}

enableStickyHeader();

//移动端 点击按钮出现导航
// Menu Button



function initMenuFeatures() {

  // navigation
  if ($('#sidemenu').length == 0) {
    var navigation = $('#main-nav');
    if (!navigation.length) {
      navigation = $('#header div.menu>ul');
    }
  } else {
    var navigation = $('#side-nav>ul');
  }

  var sidemenu = $('#sidemenu');
  if (sidemenu.length) {

    // Sidemenu Overlaping Elements
    var sidenav = sidemenu.find('#side-nav');

    // Sidemenu Dropdown
    sidenav.find('>ul li').hover(function () {
      var li = $(this);
      if (!li.parents('.mega-menu').length && window_w > parseInt(mobilenav_screen_size)) {
        li.addClass('item-hovered');
        li.find('>ul').slideDown(800, function () {
          fixSidemenu('fade');
        });
      }
    }, function () {
      var li = $(this);
      if (!li.parents('.mega-menu').length) {
        li.removeClass('item-hovered');
        setTimeout(function () {
          if (!li.hasClass('item-hovered') && window_w > parseInt(mobilenav_screen_size)) {
            li.find('>ul').slideUp(800, function () {
              fixSidemenu('fade');
            });
          }
        }, 1200);
      }
    });

  }


  // Fix Mega Menu
  fixMegaMenu();
  fixSidemenu();

  /* Dropdowns */
  $('li', navigation).each(function () {

    if ($(this).find('ul').length > 0) {
      $(this).append('<div class="dropdown-button"></div>');
    }

  });

  $('.dropdown-button', navigation).click(function () {

    $(this).parent().toggleClass('dropdown-opened').find('>ul').slideToggle(300);

  });




  // Menu Button
  $('#main-nav-button').click(function () {

    if ($(navigation).hasClass('nav-opened')) {

      $(navigation).slideUp(300).removeClass('nav-opened');

    } else {

      $(navigation).slideDown(300).addClass('nav-opened');

    }

  });


  // Sidenav Init
  $('#sidemenu-button').click(function () {
    var sidemenu = $('#sidemenu');
    var wrapper = $('#sidemenu-wrapper');

    sidemenu.toggleClass('menu-opened');
    wrapper.addClass('menu-mouse-out');
    setTimeout(function () {
      if (wrapper.hasClass('menu-mouse-out')) {
        sidemenu.removeClass('menu-opened');
      }
    }, 1000);

  });

  $('#sidemenu-wrapper').hover(function () {
    var wrapper = $(this);
    wrapper.addClass('menu-mouse-hover');
    wrapper.removeClass('menu-mouse-out');
  }, function () {
    var wrapper = $(this);
    wrapper.addClass('menu-mouse-out');
    wrapper.removeClass('menu-mouse-hover');
    if (wrapper.parent().hasClass('hidden-menu')) {
      setTimeout(function () {
        if (wrapper.hasClass('menu-mouse-out')) {
          wrapper.parent().removeClass('menu-opened');
        }
      }, 600);
    }
  });
}
//调用
initMenuFeatures();

// FixSidemenu
function fixSidemenu($animate) {

  var animation = 0;
  if ($animate == 'fade') animation = 300;
  var sidemenu = $('#sidemenu');
  if (sidemenu.length) {

    // Sidemenu Overlaping Elements
    var sidenav = sidemenu.find('#side-nav');
    var sidetweets = sidemenu.find('.sidemenu-tweets');
    var sidefooter = sidemenu.find('.sidemenu-footer');

    var tweetsVisible = sidetweets.is(':visible');
    var footerVisible = sidefooter.is(':visible');

    var tAnimation = animation;
    var fAnimation = animation;

    if (!tweetsVisible) tAnimation = 0;
    if (!footerVisible) fAnimation = 0;

    // Reset Styles
    sidetweets.show();
    sidefooter.show();

    // Fix Overlaping
    if (sidetweets.length && sidefooter.length) {

      if ((sidenav.position().top + sidenav.outerHeight()) > sidefooter.position().top) {
        sidetweets.fadeOut(tAnimation);
        sidefooter.fadeOut(fAnimation);
      } else if ((sidetweets.position().top + sidetweets.outerHeight()) > sidefooter.position().top) {
        sidetweets.fadeOut(tAnimation);
        if (!footerVisible)
          sidefooter.hide().fadeIn(300);
      }

    } else if (sidetweets.length) {

      if ((sidetweets.position().top + sidetweets.outerHeight()) > window_h) {
        sidetweets.fadeOut(tAnimation);
        if (!footerVisible)
          sidefooter.hide().fadeIn(300);
      }

    } else if (sidefooter.length) {

      if ((sidenav.position().top + sidenav.outerHeight()) > sidefooter.position().top) {
        sidefooter.fadeOut(fAnimation);
        if (!tweetsVisible)
          sidetweets.hide().fadeIn(300);
      }

    } else {
      if (!tweetsVisible)
        sidetweets.hide().fadeIn(300);
      if (!footerVisible)
        sidefooter.hide().fadeIn(300);
    }
  }

}

function fixMegaMenu() {
  // fix megamenu
  if ($('#header .mega-menu').length != 0) {
    $('#header .mega-menu').each(function () {

      var el = $(this);

      // Reset Styles
      el.removeClass('mega-menu-too-big');
      el.css('display', 'block');

      // Calculate Width And Offset
      var el_w = el.width();
      var el_x = el.offset().left;

      var container = $('#header .container');
      var container_w = container.width();
      var container_x = container.offset().left;

      // Reset Positioning
      el.css('left', '').css('right', '').css('margin-left', '').css('display', '');

      // Fix Mega Menu Position
      if (window_w > 768) {

        if ((el_x + el_w) > (container_x + container_w))
          el.css('right', 0).css('margin-left', '0px');
        else if (el_x < container_x)
          el.css('left', 0).css('margin-left', '0px');

        if (el_w > container_w)
          el.addClass('mega-menu-too-big');

      }

    });
  }
}
