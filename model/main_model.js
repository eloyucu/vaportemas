var mongoose	= require('mongoose');

mongoose.connect('mongodb://localhost/vaportema', function(err, res) 
//mongoose.connect('mongodb://heroku_app35925231:jk7mmcolav07u7d0ihcdpgadn3@ds061711.mongolab.com:61711/heroku_app35925231?replicaSet=rs-ds061711', function(err, res) 
{
	if(err) {console.log('ERROR: connecting to Database. ' + err);} 
	else 	{console.log('Connected to Database');}
});
var Schema 		= mongoose.Schema;
var ObjectId 	= Schema.ObjectId;

var UserModel	= new Schema({
	name:{ type: String, required: true, index:{unique:true}},
	password:{type:String},
	rol: {type:String,  enum: ['pedroPicapiedra', 'manager', 'finalUser'] , required: true,  default:'finalUser'},
});

var EpigraphModel 	= new Schema({
	subject:{ type: String,  required: true, index:true},
	content:{ type: String,  required: true},
	finish:{  type: Boolean, default:false},
	user_id:{ type: Schema.Types.ObjectId, ref:'User'}
});

var User			= mongoose.model('User', UserModel);
var Epigraph	 	= mongoose.model('Epigraph', EpigraphModel);

exports.getUser = function()
{
	return User;
}
exports.getEpigraph = function()
{
	return Epigraph;
}