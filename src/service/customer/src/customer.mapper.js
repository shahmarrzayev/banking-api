const { pick } = require('lodash');

const mapCustomerEntityToPublicDto = (entity) => {
    if (!entity) return null;
    const dto = pick(entity, ['firstName', 'lastName', 'phoneNumber', 'balance', 'birthDate']);
    return dto;
};

const mapSaveCustomerToEntity = (saveDto) => {
    if (!saveDto) return null;
    return pick(saveDto, ['firstName', 'lastName', 'phoneNumber', 'birthDate']);
};

module.exports = {
    mapCustomerEntityToPublicDto,
    mapSaveCustomerToEntity,
};
