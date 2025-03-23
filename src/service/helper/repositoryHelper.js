const logger = require('../../setup/logger');

const runQuery = async (query) => {
    if (!query || typeof query !== 'function') {
        logger.warn('repositoryHelper.runQuery -- wrong param');
        return null;
    }

    let result = null;
    try {
        result = await query();
    } catch (error) {
        console.log(error);
        logger.error(`repositoryHelper.runQuery -- ${JSON.stringify(error)}`);
        return null;
    }
    return result;
};

module.exports = {
    runQuery,
};
