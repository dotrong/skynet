module.exports = function(sequelize, DataTypes) {
    var User = sequelize.define("User", {
      // Giving the Author model a name of type STRING
      firstname: { type: DataTypes.STRING,
            allowNull: false      
        },
      lastname: {type: DataTypes.STRING,
        allowNull: false},
      email:{type: DataTypes.STRING,
        allowNull: false
        }, 
        password:{type: DataTypes.STRING,
            allowNull: false
        },
    
    },
      // Here we'll pass a second "classMethods" object into the define method
      // This is for any additional configuration we want to give our models
      {

        classMethods: {
          associate: function(models) {
            // Associating User with Locations
            // When an User is deleted, also delete any associated Locations
            User.hasMany(models.Location, {
              onDelete: "cascade"
            });
          }
        }
      }
    );
    return User;
  };
  