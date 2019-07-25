const express = require('express');
const PORT = process.env.PORT || 5000;
var fs = require("fs");
var userService = require('./user');
var propertyService = require('./property')

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: false}));


// Cross-Origin Middleware
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
const logger = (req,res,next) => {
    console.log(req.protocol, req.get('host'), req.originalUrl);
    next();
}
app.use(logger);

app.get('/api/user/:email', (req,res) => {
    //by requestion this path, the API will send this response 
    // req = request, res = response
    // define route with '/', could do '/users'

    //send a JSON array of all the users
    // res.send('<h1> Hello World!</h1>');
    let email = req.params.email;
    userService.findUserByEmail(email, (db_err, db_res) => {
        console.log(db_res, "hey")
        if(db_err){
            console.log('error from db' + db_err);
            res.json('error connecting to db');
        }
        else{
            console.log("made it")
            res.json({
                success: true,
                message: "displaying profile",
                data: db_res
            });
        }
    })
});

app.get('/api/properties', (req,res) => {
    //send a JSON array of all the properties
    propertyService.findAllProperties((db_err, db_res) => {
        if(db_err){
            console.log('error from db' + db_err);
            res.json('error connecting to db');
        }
        else{
            console.log(db_res);
            res.json(db_res);
        
        }
    })
});



// app.get('/api/properties/:propertyId', (req,res) => {
//     //send a JSON array of all the properties belonging to the user with the gien userId
//     //get all of the properties, make sure user id is stored, filter the properties to only look at those that have the userId given
//     let id = req.params.propertyId;
//     console.log("this is it", id)
//     propertyService.findPropertyById(id, (db_err,db_res)=>{
//         if(db_err){
//             console.log('error from db' + db_err);
//             res.json('error connecting to db');
//         }
//         else{
//             console.log("page found")
//             res.json({
//                 success: true,
//                 message: "displaying property",
//                 data: db_res
//             });
//         }
//     })
   
// });


app.post('/api/register', (req,res) => {
   
    const userPostData = req.body;
    
    userService.findUserByEmail(userPostData.email, (db_err, db_res) => {
        if(db_err){
            res.json({
                success: false,
                message: "error",
                data: db_err
            })
        }
        else if(db_res.length === 0){       
            userService.createUser(userPostData, (error, result) => {
                if(error){
                    res.json({
                        success: false,
                        message: "error",
                        data: error
                    })
                }
                else{
                    if(userPostData.role == "user" || userPostData.role == "provider"){
                        res.json({
                            success: true,
                            message: "new user created",
                            data: result
                        });
                    }
                    else{
                        res.json({
                            success: false,
                            message: "error",
                            data: error
                        })
                    }
                }
            });

        }
        else{
            res.status(400).send({db_err: "incorrect role or email already exists"})
        }
            
    });
});




app.post('/api/', (req,res) => {
    //request brings information
    const userPostData = req.body;
    userService.findUserByEmailandPassword([userPostData.email, userPostData.password], (db_err, db_res) => {
        if(db_err){
            res.json({
                success: false,
                message: "error",
                data: db_err
            })
        }
        else if(db_res.length < 1){
            res.json({
                success: false,
                message: "email or password incorrect",
                data: db_err
            })
        }
        else{
            res.json({
                success: true,
                message: "signed in",
                data: db_res
            });
        }
            
    });


    //(now) check wherether authentication is correct and send back authenticated user
    //(later) update the user to have logged in status
   
        // if(foundUser){
        //     res.send(foundUser);
        // }
        // else{
        //     //HTTP response codes
        //     // 200 = ok (no error, ur good)
        //     // 300 = redirect (your being taken somewhere else)
        //     // 400 = user error (you made a mistake)
        //     // 500 = server error (we made a mistake)
        //     res.status(400).send({error: "username or password incorrect"});
        // }

});



// app.post('/users', (req, res) => {
//     console.log(req.body);
//     var newUser = {firstname: req.body.firstname, lastname: req.body.lastname};
//     userService.register(newUser, (db_err, db_res) => {
//         if (db_err) {
//             console.log("error from db: " + db_err);
//             res.json('error connecting to db');
//         } else {
//             console.log(db_res);
//             res.json(db_res);
//         }
//     });
// });

// app.get('/users', (req, res) => {
//     userService.register((db_err, db_res) => {
//         if (db_err) {
//             console.log("error from db: " + db_err);
//             res.json('error connecting to db');
//         } else {
//             console.log(db_res);
//             res.json(db_res);
//         }
//     });
// });

app.listen(PORT,()=>console.log(`Server running on port ${PORT}`));