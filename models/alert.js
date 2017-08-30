module.exports = function(sequelize, DataTypes) {
    var Alert = sequelize.define("Alert", {

      //1 is active, 0 is NOT active (user already acknowlege this alert)
      status: { type: DataTypes.INTEGER,
            allowNull: false    
      },
      description: {
            type:DataTypes.STRING,
            allowNull: true
      },
      title: {
        type:DataTypes.STRING,
        allowNull: true
      },
      severity: {
        type:DataTypes.STRING,
        allowNull: true
      },
      external: {
        type:DataTypes.STRING,
        allowNull: true
      },
      dateTime: {
        type: DataTypes.DATE,
        allowNull: true
      }
   
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
  
