const { pick } = require('lodash');

const mapTransactionEntityToPublicDto = (entity) => {
    if (!entity) return null;
    const dto = pick(entity, ['_id', 'relatedTransactionId', 'customerId', 'toCustomerId', 'amount', 'type', 'status']);
    return dto;
};

const mapSaveTransactionToEntity = (saveDto) => {
    if (!saveDto) return null;
    return pick(saveDto, ['amount', 'customerId']);
};

module.exports = {
    mapTransactionEntityToPublicDto,
    mapSaveTransactionToEntity,
};
