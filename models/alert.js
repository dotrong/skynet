module.exports = function(sequelize, DataTypes) {
    var Alert = sequelize.define("Alert", {

      alert_status: { type: DataTypes.STRING,
            allowNull: false
      
        },
        alert_descr: {
            type:DataTypes.STRING,
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
            Alert.belongsTo(models.Watch);

          }
        }
      }
    );
    return Alert;
  };
  