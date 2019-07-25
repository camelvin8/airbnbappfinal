var mysqlConn = require("./database");


//User object constructor
var Property = (property) => {
    this.propertyId = property.propertyId;
    this.name = property.name;
    this.price = property.price;
    this.location = property.location;
    this.imageUrl = property.imageUrl;
    this.bio = property.bio;
    this.ppl = property.ppl;
  
};

Property.findAllProperties = (result) => {
    mysqlConn.query("Select * from property", (err, res) => {
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

Property.findPropertyById = (id, result) => {
    mysqlConn.query("Select * from property where propertyId = ?", id, (err, res) => {
        console.log(id,)
        if (err) {
            console.log("error: ", err);
            result(err, null);
        } else {
            console.log(res);
            result(null, res);
        }
    }); 
};

module.exports = Property;