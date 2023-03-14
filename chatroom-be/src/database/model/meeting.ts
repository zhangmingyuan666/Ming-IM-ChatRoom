export default function (sequelize, DataTypes) {
  return sequelize.define(
    'meeting',
    {
      meeting_id: {
        type: DataTypes.CHAR(255),
        primaryKey: true,
        allowNull: false,
      },
      create_timestamp: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      meeting_person_id_1: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      meeting_person_id_2: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: 'meeting',
      timestamps: false,
    },
  );
}
