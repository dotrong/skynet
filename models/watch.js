module.exports = function(sequelize, DataTypes) {
    var Watch = sequelize.define("Watch", {

      type: { type: DataTypes.STRING,
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
            Watch.belongsTo(models.Location);
            Watch.hasOne(models.Alert, {

                onDelete: "cascade"
                
            })
          }
        }
      }
    );
    return Watch;
  };
  