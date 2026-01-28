module.exports = {
    apps: [
        {
            name: 'tvm-expenses',
            script: 'node_modules/next/dist/bin/next',
            args: 'start -p 3000', // Running on port 3000
            instances: 1,
            autorestart: true,
            watch: false,
            max_memory_restart: '1G',
            env: {
                NODE_ENV: 'production',
                // Add other env vars here if not loading from .env
            },
        },
    ],
};
