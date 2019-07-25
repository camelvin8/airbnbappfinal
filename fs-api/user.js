var mysqlConn = require("./database");



//User object constructor
var User = (user) => {
    this.id = user.id;
    this.first = user.first;
    this.last = user.last;
    this.email = user.email;
    this.password = user.password;
    this.cell = user.cell;
    this.role = user.role
    this.img = user.img
  
};

User.createUser = (newUser, result) => {
    mysqlConn.query("INSERT INTO user set ?", newUser, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
        } else {
            console.log(res);
            result(null, res);
        }
    });
    
};

User.findAllUsers = (result) => {
    mysqlConn.query("Select * from user", (err, res) => {
        if (err){
            console.log("error", err);
            result(err, null);
        }
        else {
            console.log(res);
            result(null, res);
        }
    })
}

User.findUserByEmail = (email, result) => {
    mysqlConn.query("Select * from user where email = ?", email, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
        } else {
            console.log(res);
            result(null, res);
        }
    }); 
};

User.findUserByEmailandPassword = (newUser, result) =>{
    mysqlConn.query("Select * from user where email =? and password =?", newUser, (err, res)=> {
        if(err){
            console.log("error", err);
            result(err, null);
        }
        else {
            console.log(res);
            result(null,res);
        }
    });
}


module.exports = User;