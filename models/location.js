module.exports = function(sequelize, DataTypes) {
    var Location = sequelize.define("Location", {

      picture: { type: DataTypes.STRING,
            allowNull: true
      
        },
      state: {type: DataTypes.STRING,
        allowNull: false},
      city:{type: DataTypes.STRING,
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
            Location.hasMany(models.Watch, {
              onDelete: "cascade"

            });

            Location.belongsTo(models.User);
          }
        }
      }
    );
    return Location;
  };
  