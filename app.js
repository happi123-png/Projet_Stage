const db = require('./models');
db.sequelize.sync({ force: false })
    .then(() => console.log('Base de données et relations synchronisées'))
    .catch(err => console.log('Erreur sync : ', err));