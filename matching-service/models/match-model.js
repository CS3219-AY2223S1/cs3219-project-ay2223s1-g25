const { Model, DataTypes } = require('sequelize');

const Match = sequelize => {
    class Match extends Model {}
    
    Match.init({
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true,
        },
        socketId: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        otherSocketId: {
            type: DataTypes.STRING,
            allowNull: true,
            },
        difficulty: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    }, { 
        sequelize, 
        modelName: 'Match' 
    })
    
    return Match
}

module.exports = Match;