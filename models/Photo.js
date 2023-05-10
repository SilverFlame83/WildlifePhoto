const { Schema, model } = require('mongoose');

const schema = new Schema({
    title: { type: String,minLength:6, required: [true, 'Title is required and should be at least 6 characters long'] },
    keyword: { type: String,maxLength:15,  required: [true, 'Location shouldn\'t be longer than 15 characters long'] },
    location: { type: String, required:[true, 'Location is required'] },
    dateOfCreation: { type: Date, default:  new Date()},
    imageUrl: {type: String, required: true},
    description: {type: String, required: true},
    owner: {type: Schema.Types.ObjectId, ref: 'User'},
    votes: [{ type: Schema.Types.ObjectId, ref: 'User', default: [] }],

});

module.exports = model('Photo', schema);