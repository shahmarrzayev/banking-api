const cors = require('cors');
const helmet = require('helmet');

const configureCors = (app) => {
    app.set('trust proxy', true);
    app.use(helmet());
    app.use(
        cors({
            origin: true,
            credentials: true,
            methods: ['GET', 'PUT', 'POST', 'DELETE', 'PATCH', 'OPTIONS'],
        }),
    );
};

module.exports = configureCors;
