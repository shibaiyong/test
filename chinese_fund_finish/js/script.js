var index;
$(".header .list-nav li").mouseover(function(){
   index=$(this).index()+1;
   $(".dropdown"+index).show();
   $(this).addClass('list-nav-hover-bacground')
})
$(".header .list-nav li").mouseout(function(){
    var index=$(this).index()+1;
    $(".dropdown"+index).hide();
    $(this).removeClass('list-nav-hover-bacground');
 })
 $(".dropdown-container").children().mouseover(function(){
     $(this).show();
     $(".header .list-nav li").eq(index-1).addClass("list-nav-hover-bacground")
 }).mouseout(function(){
     $(this).hide();
     $(".header .list-nav li").eq(index-1).removeClass("list-nav-hover-bacground")
 })