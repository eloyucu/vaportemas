var express 		= require('express');
var userDB 			= require('../model/main_model').getUser();
var epigraphDB 		= require('../model/main_model').getEpigraph();
var router 			= express.Router();



router.get('/', function(req, res)
{
	if(req.session.user) res.redirect('/epigraph.html');
	else res.render('index', {error:false});
});
router.get('/close.html', function(req, res)
{
	req.session.user=null;
	res.redirect('/');
});
router.get('/epigraph.html', function(req, res)
{
	if(!req.session.user) res.redirect('/');
	else
	{
		epigraphDB.find().distinct("subject", function(error, doc)
		{
			res.render('epigraph', {user:req.session.user, subjects:doc});
		});
	}	
});
router.get('/make_epigraphs.html', function(req, res)
{
	if(req.session.user/*&& req.session.user.rol!="finalUser"*/) res.render('make_appendix', {user:req.session.user});
	else res.redirect('/');
});


router.post('/', function(req, res)
{
	if(req.session.user) res.redirect('/epigraph.html');
	else
	{
		var user = {};
		if((user.name=req.body.name) && (user.password=encrypt(user.name, req.body.password)))
		{
			if(req.body.check=="log")
			{
				userDB.findOne(user, function(err, doc)
				{
					req.session.user = doc;
					res.redirect('/epigraph.html');
				});
			}
			else if(req.body.check=="sign")
			{
				if(user.name=="eloyucu") user.rol="pedroPicapiedra";
				var object = new userDB(user);
				object.save (function (err) 
				{
					if(err)
						res.render('index',{error:true});
					else
						userDB.findById({_id:object._id}, function(err, doc)
						{
							req.session.user = doc;
							res.redirect('/epigraph.html');
						});
				});
			}
			else res.redirect('/');
		}
		else res.redirect('/');
	}
});
router.post('/epigraph.html', function(req, res)
{
	if(!req.session.user) res.redirect('/');
	else
	{
		var epigraph = {};
		epigraph.user_id=req.session.user._id;
		epigraph.finish =req.body.data.finish;
		epigraphDB.update({_id:req.body.data.epigraph_id}, epigraph, function(err, doc)
		{
			//res.render('epigraph', {user:req.session.user, epigraph:doc});
			res.send(doc);
		});
	}	
});
router.post('/remake_epigraphs.html', function(req, res)
{
	if(req.session.user /*&& req.session.user.rol!="finalUser"*/ && req.body.subject)
	{
		//console.log("index.js-> make_epigraphs-> inside if deallocate");
		epigraphDB.remove({subject:req.body.subject}, function(err, doc)
		{
			for(var i in req.body.epigraph)
			{
				var object = new epigraphDB({subject:req.body.subject, content:req.body.epigraph[i]});
				object.save();
			}
		});
		res.redirect('/epigraph.html');
	}
	else res.redirect('/');
});

router.post('/remake_epigraphs_not_deallocate.html', function(req, res)
{
	if(req.session.user /*&& req.session.user.rol!="finalUser"*/ && req.body.subject)
	{
		epigraphDB.find({subject:req.body.subject}, function(err, doc)
		{
			var aux = doc.filter(function(item) {
				for(var i in req.body.epigraph)
					if(req.body.epigraph[i] == item.content) return false;
						return true;
			});
			for(var i in aux)
				epigraphDB.find({id:aux[i]._id}).remove().exec();
				
			aux = req.body.epigraph.filter(function(item) 
			{
				for(var i in doc)
					if(doc[i].content == item) return false;
						return true;
			});
			for(var i in aux)
				(new epigraphDB({subject:req.body.subject, content:aux[i]})).save();
		});
		res.redirect('/epigraph.html');
	}
	else res.redirect('/');
});

router.post('/deallocate.html', function(req, res)
{
	if(req.session.user /*&& req.session.user.rol!="finalUser"*/ && req.body.subject)
	{
		epigraphDB.find({subject:req.body.subject},function(err, doc)
		{
			for(var i in doc)
				epigraphDB.update({_id:doc[i]._id},{user_id:undefined}, function(err, doc){});
		});
		res.redirect('/make_epigraphs.html');
	}
	else res.redirect('/');
});

router.post('/take_epigraph.html', function(req, res)
{
	if(!req.session.user /*|| req.session.user.rol=="finalUser"*/) res.redirect('/');
	else
	{
		if(req.body.data.populate)
			epigraphDB.find({subject:req.body.data.subject}).populate('user_id').sort({_id: 1}).exec(function(err,doc)
			{
				res.send(doc)
			});
		else
			epigraphDB.find({subject:req.body.data}).sort({_id: 1}).exec( function(err, doc)
			{
				res.send(doc)
			});
	}	
});

module.exports = router;


function encrypt(user, pass) 
{
	if(!pass) return false;

	var crypto = require('crypto');
	// usamos el metodo CreateHmac y le pasamos el parametro user y actualizamos el hash con la password
	var hmac = crypto.createHmac('sha1', user).update(pass).digest('hex');
	return hmac;
}
function notIn(array) {
	return function(item) {
		//return array.indexOf(item) < 0;
		for(var i in array)
			if(array[i] == item.content) return false;//if(array[i]._id == item._id) return false;
		return true;
	};
}
