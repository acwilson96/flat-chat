var mongoose        = require('mongoose');
var Schema          = mongoose.Schema;

var messageSchema = mongoose.Schema ({
    sender: String,
    message: String,
    timestamp: String
});


var Message = mongoose.model('Message', messageSchema);

module.exports = Message;