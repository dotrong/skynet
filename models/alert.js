module.exports = function(sequelize, DataTypes) {
    var Alert = sequelize.define("Alert", {

      //1 is active, 0 is NOT active (user already acknowlege this alert)

      alert_status: { type: DataTypes.INTEGER,
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

            Alert.belongsTo(models.Watch);

          }
        }
      }
    );
    return Alert;
  };
  
