var express = require('express');
var cors = require('cors');
const mysql  = require('mysql2');
 
const Connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'mydb'
});
 
var app = express();
app.use(cors());
app.use(express.json());
 
app.listen(5000,function(){
    console.log('CORS-enbled wab server port 5000');
}
 
); //connect port
 
app.get('/user', function(req,res,next){
    Connection.query(
        'SELECT * FROM user',
        function(err,results,fields){
            res.status(200).json(results);
        }
    );
}
   
); //แสดงรายชื่อทั้งหมด

app.get('/user/:id', function(req, res) {
    const id = req.params.id;
    Connection.query(
        'SELECT * FROM user WHERE id = ?',
        [id],
        function(err, results) {
            if (err) {
                console.error("Database error:", err);
                res.status(500).json({ error: "Database error" });
                return;
            }
            if (results.length === 0) {
                res.status(404).json({ error: "User not found" });
                return;
            }
            console.log("User Data Sent:", results[0]); // ✅ ตรวจสอบค่าก่อนส่ง
            res.status(200).json(results);
        }
    );
}); //แสดงรายชื่อทั้งหมด

app.post('/user/create', function(req,res,next){
    const fname = req.body.fname;
    const lname = req.body.lname;
    const username = req.body.username;
    const password = req.body.password;
    const avatar = req.body.avatar;
    Connection.query(
        'INSERT INTO user(fname, lname, username, password, avatar) VALUES (?, ?, ?, ?, ?)',
        [fname, lname, username, password, avatar],
        function(err, results, fields){
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.status(200).json(results);
        }
    );
}); //สร้างรายชื่อใหม่

app.put('/user/update', function(req,res,next){
    const fname = req.body.fname;
    const lname = req.body.lname;
    const username = req.body.username;
    const password = req.body.password;
    const avatar = req.body.avatar;
    const id = req.body.id;
    Connection.query(
        'UPDATE user SET fname=?, lname=?, username=?, password=?, avatar=? WHERE id=? ',
        [fname,lname,username,password,avatar,id],
        function(err,results,fields){
            res.status(200).json(results);
            
        }
    );
}
); //อัพเดทรายชื่อ

app.delete('/user/delete', function(req,res,next){
    const id = req.body.id;
    Connection.query(
        'DELETE FROM user WHERE id= ?',
        [id],
        function(err, results, fields){
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.status(200).json(results);
        }
    );
}); //ลบรายชื่อ