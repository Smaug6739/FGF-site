module.exports = {
  apps: [{
    name: "fgf-server",
    script: "./backend/server.js",
    instances: 2,
    exec_mode: "cluster",
    env: {
      "NODE_ENV": "development",
    },
    env_production: {
      "NODE_ENV": "production"
    }
  }, {
    name: "fgf-frontend",
    script: "./__frontend/app.js",
    //watch       : true,
    //ignore_watch: ['uploads'],
    instances: 2,
    exec_mode: "cluster",
    /*error_file: './logs',
     out_file: './logs',
     log_file: './logs',
     time : true,*/
    env: {
      "NODE_ENV": "development",
    },
    env_production: {
      "NODE_ENV": "production"
    }
  }]

  /*deploy : {
    production : {
      user : 'fgf',
      host : '161.97.66.77',
      ref  : 'origin/master',
      repo : 'https://github.com/Smaug6739/FGF-Site',
      path : '/home/fgf-site/prod',
      'pre-deploy-local': '',
      'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production',
      'pre-setup': ''
    }
  }*/
};
