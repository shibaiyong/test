/**
 * Created by hasee on 2017/8/15.
 */
var mysql = require('mysql');
//1、创建一个池子
var pool = mysql.createPool({
    host:"localhost",
    port:"3306",
    user:'root',
    password:"root",
    database:'my1709',
    connectionLimit:10
});
module.exports = pool;