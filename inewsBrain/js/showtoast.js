
//通知提示框
function ShowToast(options){
    this.elem = options.elem;
    this.content = options.content;
    this.comfirmButton = options.comfirmText;
    this.cancelButton = options.cancelText;
}

ShowToast.prototype={
    inite:function(callbacks){
        $(this.elem).show();
        $(this.elem).find('.showtoastcontent').text(this.content);
        $(this.elem).find('.confirm').text(this.comfirmButton);
        $(this.elem).find('.cancel').text(this.cancelButton);
        this.confirmCallback(callbacks.confirmfun);
        this.cancelCallback(callbacks.cancelfun);
    },
    confirmCallback:function(confirmcallback){
        var elem = $(this.elem);
        if(!this.comfirmButton){
            return false;
        }
        $(this.elem).find('.confirm').unbind();
        $(this.elem).find('.confirm').click(function(){
            elem.hide();
            if(confirmcallback){
                confirmcallback();
            }
        })
    },
    cancelCallback:function(cancelcallback){
        var elem = $(this.elem);
        if(!this.cancelButton){
            return false;
        }
        $(this.elem).find('.cancel').unbind();
        $(this.elem).find('.cancel').click(function(){
            elem.hide();
            if(cancelcallback){
                cancelcallback();
            }
        })
    }
}











