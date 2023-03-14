export default function (sequelize, DataTypes) {
  return sequelize.define(
    'meeting_message',
    {
      meeting_id: {
        type: DataTypes.CHAR(255),
        allowNull: false,
      },
      message_id: {
        type: DataTypes.CHAR(255),
        primaryKey: true,
        allowNull: false,
      },
      sender_id: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      receiver_id: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      is_msg_read: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      msg: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      create_timestamp: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: 'meeting_message',
      timestamps: false,
    },
  );
}
