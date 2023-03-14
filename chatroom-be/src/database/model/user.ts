export default function (sequelize, DataTypes) {
  return sequelize.define(
    'user',
    {
      _id: {
        type: DataTypes.STRING(255),
        primaryKey: true,
        allowNull: true,
      },
      username: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      password: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      user_status: {
        type: DataTypes.TINYINT,
        allowNull: true,
      },
      password_salt: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      socket_id: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: 'user',
      timestamps: false,
    },
  );
}
