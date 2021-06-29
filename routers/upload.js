const express = require('express');
const router = express.Router();
const fs = require('fs');
const multer = require('multer');
const console = require('console');
//生成的图片放入uploads文件夹下
const upload = multer({ dest: 'uploads/' })

router.post('/img', upload.single("head"), function(req, res, next) {
    console.log(req.file);
    console.log(req.file.originalname);
    let file = req.file;
//文件改名保存
    fs.renameSync('uploads/' + file.filename, 'uploads/' + file.originalname);//这里修改文件名字
    res.send({msg:"上传成功",data:file.originalname});
});

//获得用户头像src
router.get('/download/:picture',function (req,res) {
    console.log(req.params.picture);
    res.sendFile(process.cwd()+"/uploads/"+req.params.picture)
});


module.exports = router;
