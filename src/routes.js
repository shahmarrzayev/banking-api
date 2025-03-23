const httpProxy = require('express-http-proxy');

const customerServiceProxy = httpProxy('http://127.0.0.1:3001/api/customers');
const transactionServiceProxy = httpProxy('http://127.0.0.1:3002/api/transactions');

const customerCallback = (req, res) => {
    customerServiceProxy(req, res);
};

const transactionCallback = (req, res) => {
    transactionServiceProxy(req, res);
};

const applyRoutes = (app) => {
    app.get('/api/customers', customerCallback);
    app.get('/api/customers/:id', customerCallback);
    app.post('/api/customers', customerCallback);
    app.put('/api/customers/:id', customerCallback);

    app.get('/api/transactions/payment', transactionCallback);
    app.post('/api/transactions/deposit', transactionCallback);
    app.post('/api/transactions/refund', transactionCallback);
    app.post('/api/transactions/transfer', transactionCallback);
    app.post('/api/transactions/payment', transactionCallback);
};
//     app.get('/api/customers/:id', (req, res) => {
//         customerServiceProxy(req, res);
//     });
//     app.post('/api/customers', (req, res) => {
//         customerServiceProxy(req, res);
//     });
//     app.put('/api/customers/:id', (req, res) => {
//         customerServiceProxy(req, res);
//     });
// };

module.exports = applyRoutes;
