const { Sequelize, Op } = require('sequelize');
const env = process.env.NODE_ENV || "development";
const config = require("../config/config.json")[env]; 
const MatchModel = require("./match-model.js")

const sequelize = new Sequelize({
    dialect: config.dialect,
    storage: config.storage,
    logging: console.log
});

const Match = MatchModel(sequelize);

async () => { 
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

sequelize.sync({ force: true })
  .then(() => {
    console.log(`Database & tables created!`);
    // Match.create(
    //   { socketId: '900WQ_X25tzSl9LjAAAD', otherSocketId: null, difficulty: 'expert' },
    // ).then(function() {
    //   return Match.findAll();
    // }).then(function(matches) {
    //   console.log(matches);
    // });
});

const findMatch = async(socketId, difficulty) => {
    console.log(socketId);

    const [match, created] = await Match.findOrCreate({
        where: { 
            otherSocketId: {
                [Op.is]: null 
            },
            socketId: {
                [Op.ne]: socketId,
            },
            difficulty: difficulty
        },
        defaults: {
            socketId: socketId,
            otherSocketId: null
        },
    });

    if (!created) {
        console.log(match.otherSocketId);
        match.otherSocketId = socketId;
        await match.save();
    }

    return match;
}

const createMatch = async(match) => {
    return Match.create(match);
}


const deleteMatch = async(socketId) => { 
    await Match.destroy({
        where: {
            socketId: {
                [Op.eq]: socketId,
            }
        }
    });
}

module.exports = { sequelize, createMatch, findMatch, deleteMatch }