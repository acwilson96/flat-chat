const express           = require('express');
const expressGraphQL    = require('express-graphql');
const app               = express();

const schema            = require('./graphql/queries.js');

app.use('/graphql', expressGraphQL({
    schema: schema,
    graphiql: true
}));

app.listen(4000, () => { console.log('Server is running on port:4000'); });