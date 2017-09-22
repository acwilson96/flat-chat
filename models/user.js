var mongoose = require('mongoose');
var bcrypt   = require('bcrypt');
var crypto   = require('crypto');
var Schema   = mongoose.Schema;

/*********************************************\
               Mongoose Schema
\*********************************************/

var userSchema = mongoose.Schema ({
    username: {
        type: String,
        unique: true
    },
    password: String,
    authToken: String,
    registerDate: String
});

// Checks if a password and a hash match.
userSchema.statics.checkPassword = (password, hash, cb) => {
    bcrypt.compare(password, hash, (err, res) => {
        cb(err, res)
    });
}

// Hashes a password.
userSchema.statics.hashPassword = (password, cb) => {
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(password, salt, (err, hash) => {
            cb(null, hash);
        });
    });
}

// Generates an authToken.
userSchema.statics.generateToken = (cb) => {
    crypto.randomBytes(256, (err, buf) => {
        if (err) cb(err);
        else cb(null, buf.toString('hex'));
    });
}

// Generates a string of current time.
userSchema.statics.generateTimeString = (cb) => {
    var now = new Date();
    var dd = now.getDate();
    var mm = now.getMonth()+1; //January is 0!
    var yyyy = now.getFullYear();
    if(dd<10) {
        dd = '0'+dd
    } 
    if(mm<10) {
        mm = '0'+mm
    } 
    var output = dd + '/' + mm + '/' + yyyy
    cb(output);
}

// Generates a User model.
userSchema.statics.createUserJSON = (username, password, cb) => {
    User.hashPassword(password, (err, hash) => {
        User.generateToken((err, authToken) => {
            User.generateTimeString((date) => {
                cb({
                    username: username,
                    password: hash,
                    authToken: authToken,
                    registerDate: date
                });
            });
        });
    });
}

var User = mongoose.model('User', userSchema);

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

const UserType = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
        username: { type: GraphQLString },
        password: { type: GraphQLString },
        authToken: { type: GraphQLString },
        registerDate: { type: GraphQLString }
    }) 
});

module.exports = { User, UserType };