import { Model } from 'sequelize'
import moment from 'moment'

const loadModel = (sequelize, DataTypes) => {
  class Restaurant extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      // define association here
      Restaurant.belongsTo(models.RestaurantCategory, { foreignKey: 'restaurantCategoryId', as: 'restaurantCategory' })
      Restaurant.belongsTo(models.User, { foreignKey: 'userId', as: 'user' })
      Restaurant.hasMany(models.Product, { foreignKey: 'restaurantId', as: 'products' })
      Restaurant.hasMany(models.Order, { foreignKey: 'restaurantId', as: 'orders' })
    }

    async getAverageServiceTime () {
      try {
        const orders = await this.getOrders()
        const serviceTimes = orders.filter(o => o.deliveredAt).map(o => moment(o.deliveredAt).diff(moment(o.createdAt), 'minutes'))
        return serviceTimes.reduce((acc, serviceTime) => acc + serviceTime, 0) / serviceTimes.length
      } catch (err) {
        return err
      }
    }
  }
  Restaurant.init({
    name: {
      allowNull: false,
      type: DataTypes.STRING
    },
    description: DataTypes.STRING,
    address: {
      allowNull: false,
      type: DataTypes.STRING
    },
    postalCode: {
      allowNull: false,
      type: DataTypes.STRING
    },
    url: DataTypes.STRING,
    restaurantCategoryId: {
      type: DataTypes.INTEGER,
      references: {
        model: {
          tableName: 'RestaurantCategories'
        },
        key: 'id'
      }
    },
    shippingCosts: {
      allowNull: false,
      type: DataTypes.DOUBLE
    },
    averageServiceMinutes: DataTypes.DOUBLE,
    email: DataTypes.STRING,
    logo: DataTypes.STRING,
    phone: DataTypes.STRING,
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: new Date()
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: new Date()
    },
    userId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      onDelete: 'CASCADE',
      references: {
        model: {
          tableName: 'Users'
        },
        key: 'id'
      }
    },
    heroImage: DataTypes.STRING,
    status: {
      allowNull: false,
      type: DataTypes.ENUM,
      values: ['online', 'offline', 'closed', 'temporarily closed']
    }

    // TODO: Include the rest of the properties of the Restaurant model

  }, {
    sequelize,
    modelName: 'Restaurant'
  })
  return Restaurant
}
export default loadModel
