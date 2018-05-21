(function(){//立即执行函数
    let imgList = [],time = 250,offset = 0,canRun = true;
    function _throttle() { //函数节流
        if(!canRun) {
            return;
        }
        canRun = false;
        setTimeout(() => {
            console.log('函数节流')
            _loadImg();
            canRun = true;
        },time || 500)
    }

    function _loadImg(){//执行图片加载
        for(let i = 0; i < imgList.length; i++){
            if(_isShow(imgList[i])){
                imgList[i].src = imgList[i].getAttribute('data-imgurl');
                imgList.splice(i,1);
            }
        }
    };
    function _isShow(el){//判断img是否出现在可视窗口
        let coords = el.getBoundingClientRect();
        return (coords.left >= 0 && coords.left >= 0 && coords.top) <= (document.documentElement.clientHeight || window.innerHeight) + parseInt(offset);
    };
    function imgLoad(selector){//获取所有需要实现懒加载图片对象引用并设置window监听事件scroll
        _selector = selector || '.imgLazyLoad';
        let nodes = document.querySelectorAll(selector);
        imgList = Array.apply(null,nodes);
        window.addEventListener('scroll',_throttle,false)
    };
    imgLoad('.imgLazyLoad')
})()