const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLSchema,
    GraphQLList,
    GraphQLNonNull
} = require('graphql');

const mongoose = require('mongoose');

// Connect to Mongoose.
mongoose.Promise = require('bluebird');
mongoose.connect('mongodb://localhost:27017/flat-chat', {useMongoClient: true});

const { User, UserType }        = require('../models/user.js');
const { Message, MessageType }  = require('../models/message.js');

// Root Query
const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {

        // Get a specific User.
        user: {
            type: UserType,
            args: {
                id: { type: GraphQLString },
                username: { type: GraphQLString },
                password: { type: GraphQLString },
                authToken: { type: GraphQLString }
            },
            resolve(parentValue, args) {
                return new Promise((resolve, reject) => {
                    // If this is a login request.
                    if (args.username && args.password) {
                        User.login(args.username, args.password, (err, user) => {
                            resolve(user);
                        });
                    }
                    // Checking if authToken is valid.
                    else if (args.authToken) {
                        // Find the User with this authToken
                        User.findOne({
                            authToken: args.authToken
                        }).then(user => {
                            // If a User exists, return the User without the password field.
                            if (user) {
                                user.password = null;
                                resolve(user);
                            }
                            else {
                                resolve(null);
                            }
                        })
                    }
                });
            }
        },
        // Get all Users.
        users: {
            type: new GraphQLList(UserType),
            resolve(parentValue, args) {
                return new Promise((resolve, reject) => {
                    User.find().then(users => {
                        users.forEach((user) => {
                            user.authToken = null;
                            user.password  = null;
                        });
                        resolve(users);
                    });
                }).then(users => users);
            }
        },
        // Get a specific Message.
        message: {
            type: MessageType,
            args: {
                id: { type: GraphQLString }
            },
            resolve(parentValue, args) {
                return Message.find(args).then(message => message);
            }
        },
        // Get all Messages.
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
        // Create a User Model.
        addUser: {
            type: UserType,
            args: {
                // Requires a Username and Password field.
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
        // Create a Message Model.
        addMessage: {
            type: MessageType,
            args: {
                // Requires a message and an authToken (to ID a Sender).
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