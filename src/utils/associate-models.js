const setupAssociations = (models) => {
    Object.values(models).forEach((model) => {
        if (model.associate) {
            model.associate(models);
        }
    });
};

export default setupAssociations;
