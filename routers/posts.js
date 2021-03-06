const express = require('express');
const router = express.Router();
const mysql = require('mysql')

const connection = mysql.createConnection({
    host: 'localhost',           
    user: 'root',               
    password: '1234',           
    port: '3306',              
    database: 'user',           
    multipleStatements: true    
})

connection.connect();

router.post('/addNews', async (req, res, next) => {
    let addform = req.body;
    let newsTitle = addform.newsTitle
    let newsAuthor = addform.newsAuthor
    let newsMsg = addform.newsMsg
    let newsMsg2 = addform.newsMsg2
    let newsDate = addform.newsDate
    let newsImg = addform.newsImg
    let newsTitleImg = addform.newsTitleImg
    console.log(typeof newsDate)
    console.log(addform)
    let sql = "insert into news(news_title,news_author,news_msg,news_msg2,news_img,news_title_img) values(?,?,?,?,?,?)"
    await connection.query(sql, [newsTitle, newsAuthor, newsMsg, newsMsg2, newsImg, newsTitleImg], (err, result) => {
        if (err) {
            return res.json({ message: err, code: 1, msg: '添加信息失败' });
        }
        res.send({ code: 200, msg: '添加信息成功', data: result });
    });
});


router.post('/addUsers', (req, res, next) => {
    let addform = req.body;
    let user_name = addform.user_name
    let user_password = addform.user_password
    let user_count = addform.user_count
    let user_img = addform.user_img
    console.log(addform)
    let sql = "select * from users where user_count = ? or user_name = ?"
    console.log(sql)
    connection.query(sql, [user_count, user_name], (err, result) => {
        console.log(result)
        console.log(result.length)
        if (err) {
            return res.json({ code: 1, msg: '查询失败' })
        }
        if (result.length > 0) {
            return res.json({ code: 1, msg: '账号或者用户名已存在', data: result })
        } else {
            sql = "insert into users(user_name,user_password,user_count,user_img) values(?,?,?,?)"
            console.log(sql)
            connection.query(sql, [user_name, user_password, user_count,user_img], (err, results2) => {
                console.log(results2)
                if (err) {
                    return res.json({ message: err, code: 1, msg: '添加信息失败' });
                }
                res.json({ code: 200, msg: '添加信息成功', data: results2 })
            })
        }
    })
});
router.post('/login', (req, res, next) => {
    let addform = req.body;
    let user_password = addform.user_password
    let user_count = addform.user_count
    console.log(addform)
    let sql = "select * from users where user_count = ?"
    console.log(sql)
    connection.query(sql, [user_count], (err, result) => {
        console.log(result)
        console.log(result.length)
        if (err) {
            return res.json({ code: 1, msg: '登录失败' })
        }
        if (result.length > 0) {
            if (result[0].user_password === user_password) {
                res.json({ code: 200, msg: '登录成功', data: result })
            }
            else {
                return res.json({ code: 1, msg: '账号不存在或者密码不正确' })
            }
        }
        else {
            return res.json({ code: 1, msg: '账号不存在或者密码不正确' })
        }
    })
});

router.get('/allNews', async (req, res) => {
    const sql = 'SELECT * FROM news'
    await connection.query(sql, (err, results) => {
        if (err) {
            return res.json({ message: err, code: 1, msg: '查询信息失败' });
        }
        res.json({ code: 200, msg: '查询信息成功', data: results });
    })
});
router.post('/changePwdById', async (req, res) => {
    let addform = req.body;
    let user_password = addform.user_password
    let user_id = addform.user_id
    const sql = 'update users set user_password = ? where user_id=?'
    await connection.query(sql, [user_password, user_id], (err, results) => {
        if (err) {
            return res.json({ message: err, code: 1, msg: '修改信息失败' });
        }
        res.json({ code: 200, msg: '修改信息成功', data: results });
    })
});
router.post('/changeNameById', async (req, res) => {
    let addform = req.body;
    let user_name = addform.user_name
    let user_name_before = addform.user_name_before
    let user_id = addform.user_id
    let sql = "select * from users where  user_name = ?"
    console.log(sql)
    connection.query(sql, [user_name], (err, result) => {
        console.log(result)
        console.log(result.length)
        if (err) {
            return res.json({ code: 1, msg: '查询失败' })
        }
        if (result.length > 0) {
            return res.json({ code: 1, msg: '用户名已存在', data: result })
        } else {
            sql = 'update users set user_name = ? where user_id=?'
            connection.query(sql, [user_name, user_id], (err, results) => {
                if (err) {
                    return res.json({ message: err, code: 1, msg: '修改信息失败' });
                }
            })
            sql = 'update message set msg_user_name = ? where msg_user_name=?'
            connection.query(sql, [user_name, user_name_before], (err, results2) => {
                if (err) {
                    return res.json({ message: err, code: 1, msg: '修改信息失败' });
                }
                res.json({ code: 200, msg: '修改信息成功', data: results2 });
            })
        }
    })


});
router.post('/getMsgByNews', async (req, res, next) => {
    let addform = req.body;
    let msg_news_id = addform.msg_news_id
    console.log(msg_news_id)
    console.log(addform)
    let sql = "select * from message where msg_news_id = ? "
    await connection.query(sql, [msg_news_id], (err, result) => {
        if (err) {
            return res.json({ message: err, code: 1, msg: '查询信息失败' });
        }
        res.json({ code: 200, msg: '查询信息成功', data: result });
    });
});
router.post('/delMsgById', async (req, res, next) => {
    let addform = req.body;
    let msg_id = addform.msg_id
    console.log(msg_id)
    console.log(addform)
    let sql = "delete from message where msg_id = ? "
    await connection.query(sql, [msg_id], (err, result) => {
        if (err) {
            return res.json({ message: err, code: 1, msg: '删除信息失败' });
        }
        res.json({ code: 200, msg: '删除信息成功' });
    });
});
router.post('/addMsg', async (req, res, next) => {
    let addform = req.body;
    let msg_news_id = addform.msg_news_id
    let msg_user_name = addform.msg_user_name
    let msg_user_toname = addform.msg_user_toname
    let msg_msg = addform.msg_msg
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var seconds = date.getSeconds();
    let msg_time = year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds;
    console.log(msg_time)
    console.log(addform)
    console.log(msg_news_id)
    let sql = "insert into message(msg_news_id,msg_user_name,msg_user_toname,msg_time,msg_msg) values(?,?,?,?,?) "
    await connection.query(sql, [msg_news_id, msg_user_name, msg_user_toname, msg_time, msg_msg], (err, result) => {
        if (err) {
            return res.json({ message: err, code: 1, msg: '添加信息失败' });
        }
        res.json({ code: 200, msg: '添加信息成功', data: msg_time });
    });
});
module.exports = router;