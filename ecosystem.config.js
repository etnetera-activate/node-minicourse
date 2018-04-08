module.exports = {
    /**
     * Application configuration section
     * http://pm2.keymetrics.io/docs/usage/application-declaration/
     */
    apps: [

        // First application
        {
            name: 'SLACK API',
            script: './examples/02-Project/index.js',
            env: {
                DEBUG: 'activate*'
            },
            env_production: {
                NODE_ENV: 'production',
                PORT: 30009
            }
        }
    ],

    /**
     * Deployment section
     * http://pm2.keymetrics.io/docs/usage/deployment/
     */
    deploy: {
        production: {
            user: 'node',
            host: 'secure.activate.cz',
            ref: 'origin/master',
            repo: 'git@github.com:etnetera-activate/node-minicourse.git',
            path: '/home/node/skolenicko',
            'pre-deploy-local': 'scp examples/02-Project/config.js node@secure.activate.cz:skolenicko/current/examples/02-Project',
            'post-deploy': 'cd examples/02-Project/ && npm install && cd ../../ && pm2 startOrRestart ecosystem.config.js --env production'
        },
    }
};