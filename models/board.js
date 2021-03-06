const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BoardSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    lists: [{
        type: Schema.Types.ObjectId,
        ref: 'List'
    }],
    labels: [{
        type: Schema.Types.ObjectId,
        ref: 'Label'
    }],
    visibility: {
        type: String,
        enum: ['public', 'private', 'team']
    },
    members: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    teams: [{
        type: Schema.Types.ObjectId,
        ref: 'Team'
    }]
}, 
{ timestamps: true });

BoardSchema.options.toJSON = {
    transform: function(doc, ret, options) {
        ret.id = ret._id
        delete ret._id
        delete ret.createdAt
        delete ret.updatedAt
        delete ret.__v
        return ret
    }
}

let Board
try {
    Board = mongoose.model('Board', BoardSchema)
}
catch(e) {
    Board = mongoose.model('Board')
}
module.exports = Board;