
//通知提示框
//通知提示框
function ShowTip(options){
    this.elem = options.elem;
    this.content = options.content;
    this.title = options.title;
}

ShowTip.prototype={
    inite:function(callbacks){
        $(this.elem).show();
        $(this.elem).find('.toast_title').text(this.title);
        $(this.elem).find('.showtoastcontent').text(this.content);
        this.timeOutHide();
    },
    timeOutHide:function(){
        var that = this;
        var $this = $(this.elem);
        this.time = setTimeout(function(){
            $this.hide();
            that.clearTimeOut();
        },5000)
    },
    clearTimeOut:function(){
        this.time = null;
    }
}


