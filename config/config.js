 const util = require('util');
 var config ={};

var myConfig = process.env.HA_ENV || 'other';

module.exports = function(){
  
  var type =myConfig;
  
  if(type==='openshiftv2')
    {
      config.PORT = parseInt(process.env.OPENSHIFT_NODEJS_PORT) || parseInt(process.env.PORT)|| 8080;
      config.IP   = process.env.OPENSHIFT_NODEJS_IP ||process.env.IP|| '127.0.0.1';
      config.DB_USERNAME = process.env.OPENSHIFT_MONGODB_DB_USERNAME || 'root';
      config.DB_PASSWORD = process.env.OPENSHIFT_MONGODB_DB_PASSWORD || 'root';
      config.DB_HOST = process.env.OPENSHIFT_MONGODB_DB_HOST || 'ds031975.mlab.com';
      config.DB_PORT = parseInt(process.env.OPENSHIFT_MONGODB_DB_PORT) || 31975;
      config.APP_NAME = process.env.OPENSHIFT_APP_NAME || 'amanv';
      config.DB_URL = util.format("mongodb://%s:%s@%s:%d/%s",config.DB_USERNAME,config.DB_PASSWORD,config.DB_HOST,config.DB_PORT,config.APP_NAME);
    }
    else if(type==='openshiftv3')
    {
      var mongoServiceName = process.env.DATABASE_SERVICE_NAME.toUpperCase(),
      mongoHost = process.env[mongoServiceName + '_SERVICE_HOST'],
      mongoPort = process.env[mongoServiceName + '_SERVICE_PORT'],
      mongoDatabase = process.env[mongoServiceName + '_DATABASE'],
      mongoPassword = process.env[mongoServiceName + '_PASSWORD'],
      mongoUser = process.env[mongoServiceName + '_USER'];
      config.DB_HOST =mongoHost;
      config.DB_PORT = mongoPort;
      config.DB_USERNAME =mongoUser;
      config.DB_PASSWORD =mongoPassword;
      config.PORT=  process.env.OPENSHIFT_NODEJS_PORT || process.env.PORT|| 8080;
      config.IP = process.env.OPENSHIFT_NODEJS_IP ||process.env.IP|| '0.0.0.0';
      config.DB_URL ='mongodb://'+mongoUser+':'+mongoPassword+'@'+mongoHost+':'+mongoPort+'/'+mongoDatabase;
      
    }
  else
    {
        config.PORT = process.env.PORT||process.env.OPENSHIFT_NODEJS_PORT||8080;
        config.IP =process.env.IP||process.env.OPENSHIFT_NODEJS_IP||'127.0.0.1';
        config.DB_URL = process.env.DB_URL || 'mongodb://root:root@ds031975.mlab.com:31975/amanv';
    }
    
    
  config.secret = 'TopSecret';
  config.expiresIn = 3600;
  return config;
}