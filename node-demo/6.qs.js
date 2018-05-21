
const qs = require("querystring")

var str="wd=nodejs文档%20极客&rsv_spt=1&rsv_iqid=0xa21ca4f300001119&issp=1&f=8&rsv_bp=1&rsv_idx=2&ie=utf-8&rqlang=cn&tn=baiduhome_pg&rsv_enter=1&oq=nodejs%25E6%2596%2587%25E6%25A1%25A3&rsv_t=0020gSCSxKSUizbJ9IE0Py0pudeAoFAw4Ja4KifFADHcQLFuyjb%2F9WBTzo6vhwsZ%2FCu8&inputT=33331&rsv_pq=ce2d601e0003b9a4&rsv_sug3=100&rsv_sug1=67&rsv_sug7=100&rsv_sug2=0&rsv_sug4=33331"

var str = 'a:1;b:2'

let obj = qs.parse(str,';',':')

let str1= qs.stringify(obj,'--',':')

console.log(str1)

