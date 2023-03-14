import DataTypes from 'sequelize';
import _meeting from './meeting';
import _meeting_message from './meeting_message';
import _user from './user';

function initModels(sequelize) {
  const meeting = _meeting(sequelize, DataTypes);
  const meeting_message = _meeting_message(sequelize, DataTypes);
  const user = _user(sequelize, DataTypes);

  return {
    meeting,
    meeting_message,
    user,
  };
}

export default initModels;
