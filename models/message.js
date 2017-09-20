var mongoose        = require('mongoose');
var Schema          = mongoose.Schema;

/*********************************************\
               Mongoose Schema
\*********************************************/

var messageSchema = mongoose.Schema ({
    sender: String,
    message: String,
    timestamp: String
});


var Message = mongoose.model('Message', messageSchema);

/*********************************************\
                GraphQL Schema
\*********************************************/

const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLSchema,
    GraphQLList,
    GraphQLNonNull
} = require('graphql');

// Message Type
const MessageType = new GraphQLObjectType({
    name: 'Message',
    fields: () => ({
        sender: { type: GraphQLString },
        message: { type: GraphQLString },
        timestamp: { type: GraphQLString }
    })
});

module.exports = { Message, MessageType };