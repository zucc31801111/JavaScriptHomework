const express = require('express');
const router = express.Router();
const mysql = require('mysql')

const connection = mysql.createConnection({
    host:'localhost',           //数据库地址
    user: 'root',               //用户名
    password: '1234',           //密码
    port : '3306',              //端口
    database: 'user',           //库名
    multipleStatements:true     //允许执行多条语句
})

connection.connect();

router.post('/addNews', async (req,res,next) => {
    let addform = req.body;
    let newsTitle = addform.newsTitle
    let newsAuthor = addform.newsAuthor
    let newsMsg = addform.newsMsg
    let newsDate = addform.newsDate
    let newsImg = addform.newsImg
    let newsTitleImg = addform.newsTitleImg
    console.log(typeof newsDate)
    console.log(addform)
    let sql = "insert into news(news_title,news_author,news_msg,news_img,news_title_img) values(?,?,?,?,?)"
        await connection.query(sql, [newsTitle,newsAuthor,newsMsg,newsImg,newsTitleImg] ,(err,result)=>{
            if(err){
                return res.json({message: err,code: 1, msg: '添加信息失败'});
            }
            res.send({code: 200, msg: '添加信息成功',data: result});  
        }); 
});


router.post('/addUsers', async (req,res,next) => {
    let addform = req.body;
    let user_name = addform.user_name
    let user_password = addform.user_password
    let user_count = addform.user_count
    console.log(addform)
        let sql = "select * from user where user_count = ?"
        console.log(sql)
            await connection.query(sql, [user_count],  (err,result)=>{
            console.log(result)
            if(err){
                return  res.json({code: 1, msg: '查询失败'})
            }
            if(result===null){
                  return  res.json({code: 1, msg: 'yicuncai',data: result})
              }
              else{
                sql = "insert into user(user_name,user_password,user_count) values(?,?,?)"
                console.log(sql)
                connection.query(sql,[user_name,user_password,user_count],  (err,results2)=>{
                    console.log(results2)
                    if(err){
                        return res.json({message: err,code: 1, msg: '添加信息失败'});
                    }
                    res.json({code: 200, msg: '添加信息成功',data: results2})
                })  
              }  
            })                  
});

router.get('/allNews', async (req,res) => {   
        const sql = 'SELECT * FROM news' 
        await connection.query(sql,(err,results)=>{
            if(err){
                return res.json({message: err,code: 1, msg: '查询信息失败'});
            }
            res.json({code: 200, msg: '查询信息成功',data: results});
        })
});
module.exports = router;