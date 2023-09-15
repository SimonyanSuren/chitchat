import * as dotenv from 'dotenv';
dotenv.config();

const constants = {
  //APP DOMAIN
  CHITCHAT_DOMAIN: process.env.CHITCHAT_DOMAIN || '',

  //SERVER IP
  CHITCHAT_SERVER_IP: process.env.CURRENT_SERVER_IP || '',
  CHITCHAT_SERVER_URL: process.env.CURRENT_SERVER_URL || '',

  //IMAGE FOLDERS
  //  PATH_TO_USERS_IMAGE_FOLDER:
  //    process.env.NODE_ENV === 'development'
  //      ? process.env.DEV_PATH_TO_USERS_IMAGE_FOLDER || 'assets/dev/images/profile'
  //      : process.env.PROD_PATH_TO_USERS_IMAGE_FOLDER || 'assets/prod/images/profile',
};

export default constants;
