const { Sequelize, Op } = require('sequelize');
const env = process.env.NODE_ENV || "development";
const config = require("../config/config.json")[env]; 
const MatchModel = require("./match-model.js")

const sequelize = new Sequelize({
    dialect: config.dialect,
    storage: config.storage,
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
});

const findMatch = async(socketId, difficulty, categoryTitle) => {
    const [match, created] = await Match.findOrCreate({
        where: {
            otherSocketId: {
                [Op.is]: null 
            },
            socketId: {
                [Op.ne]: socketId,
            },
            difficulty: difficulty,
            categoryTitle: categoryTitle
        },
        defaults: {
            socketId: socketId,
            otherSocketId: null
        },
    });

    if (!created) {
        match.otherSocketId = socketId;
        await match.save();
    }

    return {
        match: match, 
        created: created
    };
}

const deleteMatch = async(socketId) => {
    const match = await Match.findAll({
        where: {
            [Op.or]: [
                { socketId: socketId },
                { otherSocketId: socketId } 
            ]
        }
    }).then((res) => {
        Match.destroy({
            where: {
                [Op.or]: [
                    { socketId: socketId },
                    { otherSocketId: socketId } 
                ]
            }
        });
        return res;
    })
    
    return match[0];
}

module.exports = { sequelize, findMatch, deleteMatch }