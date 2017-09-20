const mongoose = require('mongoose');

const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLSchema,
    GraphQLList,
    GraphQLNonNull
} = require('graphql');

mongoose.Promise = require('bluebird');
mongoose.connect('mongodb://localhost:27017/flat-chat', {useMongoClient: true});

/* Import Models */
const User      = require('./models/user.js');
const Message  = require('./models/message.js');

// Message Type
const MessageType = new GraphQLObjectType({
    name: 'Message',
    fields: () => ({
        sender: { type: GraphQLString },
        message: { type: GraphQLString },
        timestamp: { type: GraphQLString }
    })
});

// User Type
const UserType = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
        username: { type: GraphQLString },
        authToken: { type: GraphQLString },
        registerDate: { type: GraphQLString }
    }) 
});

// Root Query
const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        user: {
            type: UserType,
            args: {
                id: { type: GraphQLString }
            },
            resolve(parentValue, args) {
                return User.findOne(args).then(user => user);
            }
        },
        users: {
            type: new GraphQLList(UserType),
            resolve(parentValue, args) {
                return User.find().then(users => users);
            }
        },
        message: {
            type: MessageType,
            args: {
                id: { type: GraphQLString }
            },
            resolve(parentValue, args) {
                return Message.find(args).then(message => message);
            }
        },
        messages: {
            type: new GraphQLList(MessageType),
            resolve(parentValue, args) {
                return Message.find().then(messages => messages);
            }
        },
    }
});

// Mutations
const mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addUser: {
            type: UserType,
            args: {
                username: { type: new GraphQLNonNull(GraphQLString) },
                password: { type: new GraphQLNonNull(GraphQLString) }
            },
            resolve(parentValue, args) {
                return new Promise((resolve, reject) => {
                    User.createUserJSON(args.username, args.password, (user) => {
                        var newUser = new User(user);
                        newUser.save();
                        resolve(user);
                    });
                });
            }
        },
        addMessage: {
            type: MessageType,
            args: {
                authToken: { type: new GraphQLNonNull(GraphQLString) },
                message: { type: new GraphQLNonNull(GraphQLString) }
            },
            resolve(parentValue, args) {
                return new Promise((resolve, reject) => {
                    User.findOne({authToken: args.authToken}).exec((err, user) => {
                        User.generateTimeString((date) => {
                            var newMessage = new Message({
                                message: args.message,
                                sender: user.id,
                                timestamp: date
                            });
                            newMessage.save();
                            resolve(newMessage);
                        });
                    });
                });
                
            }
        }
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation
});