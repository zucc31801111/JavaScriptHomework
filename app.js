const express = require('express');
const app = express();
// const mongoose = require('mongoose');
require('dotenv/config');
// const postRoute = require('./routers/posts');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql')

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended:false}));
// app.use('/posts',postRoute);

const connection = mysql.createConnection({
    host:'localhost',           //数据库地址
    user: 'root',               //用户名
    password: '1234',           //密码
    port : '3306',              //端口
    database: 'user',           //库名
    multipleStatements:true     //允许执行多条语句
})
app.get('/',(req,res) => {
    // res.send('we are on home');
    const sql ='SELECT * FROM user' //user为表名
    connection.query(sql,(err,results) =>{
        if(err){
            return res.json({
                code: 1,
                message: '用户不存在',
                affextedRows: 0
            })
        }
        res.json ({
            code : 200,
            data: results,
            affextedRows:results.affextedRows
        })
    })
});


app.listen(3000);