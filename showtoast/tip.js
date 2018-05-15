
//通知提示框
//通知提示框
function ShowTip(options){
    this.elem = options.elem;
    this.content = options.content;
}

ShowTip.prototype={
    inite:function(callbacks){
        $(this.elem).show();
        $(this.elem).find('.showtoastcontent').text(this.content);
        this.timeOutHide();
        this.clearTimeOut();
    },
    timeOutHide:function(){
        var $this = $(this.elem);
        this.time = setTimeout(function(){
            $this.hide();
        },5000)
    },
    clearTimeOut:function(){
        this.time = null;
    }
}


