var config ={};

var myConfig = 'other';

module.exports = function(){
  
  var type =myConfig;
  
  if(type==='C9')
    {
      config.PORT = process.env.PORT;
      config.IP =process.env.IP;
      config.DB_URL = 'mongodb://'+process.env.IP+'/';
      config.DB_USERNAME = '';
      config.DB_PASSWORD = '';
      config.DB_HOST = process.env.IP;
      config.DB_PORT = '';
    }
    else if(type==='heroku'){
      config.PORT = process.env.PORT;
      config.IP =process.env.IP;
      config.DB_URL = '';
      config.DB_USERNAME = '';
      config.DB_PASSWORD = '';
      config.DB_HOST = process.env.IP;
      config.DB_PORT = '';
    }
  else if(type==='openshift')
    {
      config.PORT = process.env.PORT;
      config.IP =process.env.HOST || process.env.HOSTNAME;
      config.DB_URL = process.env.MONGOHQ_URL;
      config.DB_USERNAME = process.env.OPENSHIFT_MONGODB_DB_USERNAME;
      config.DB_PASSWORD = process.env.OPENSHIFT_MONGODB_DB_PASSWORD;
      config.DB_HOST = process.env.OPENSHIFT_MONGODB_DB_HOST;
      config.DB_PORT = process.env.OPENSHIFT_MONGODB_DB_PORT;
      config.APP_NAME = process.env.OPENSHIFT_APP_NAME;
    }
  else if(type==='codeanywhere' || type==='nitrous')
    {
      config.PORT = process.env.PORT||8080;
      config.IP =process.env.HOST || process.env.HOSTNAME||'127.0.0.1';
      config.DB_URL = process.env.MONGOHQ_URL;
      config.DB_USERNAME = '';
      config.DB_PASSWORD = '';
      config.DB_HOST = process.env.HOST || process.env.HOSTNAME;
      config.DB_PORT = '';
    }
  else
    {
      config.PORT = process.env.PORT||8080;
      config.IP =process.env.IP||'127.0.0.1';
      config.DB_URL = 'mongodb://root:root@ds031975.mlab.com:31975/amanv';
    }
  return config;
}