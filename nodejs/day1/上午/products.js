
function Product(){
    this.proListData = [
        {
            "name":"怡宝"
        },
        {
            "name":'农夫山泉'
        },
        {
            "name":"康师傅"
        },
        {
            "name":"哇哈哈"
        },
        {
            "name":"长白山"
        },
        {
            "name":"恒大冰泉"
        }
    ]
}
Product.prototype.getProList = function(){
   // console.log(this.proListData)
    return this.proListData
}

module.exports = Product