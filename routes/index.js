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
router.get('/make_epigraph.html', function(req, res)
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
router.post('/make_epigraph.html', function(req, res)
{
	if(req.session.user /*&& req.session.user.rol!="finalUser"*/ && req.body.subject)
	{
		epigraphDB.remove({subject:req.body.subject}, function(err, doc)
		{
			for(var i in req.body.epigraph)
			{
				var object = new epigraphDB({subject:req.body.subject, content:req.body.epigraph[i]});
				object.save();
			}
			setTimeout(function()
			{
				res.redirect('/epigraph.html');
			}, 300);
		});
	}
	else res.redirect('/');
});

router.post('/take_epigraph.html', function(req, res)
{
	if(!req.session.user /*|| req.session.user.rol=="finalUser"*/) res.redirect('/');
	else
	{
		if(req.body.data.populate)
			epigraphDB.find({subject:req.body.data.subject}).populate('user_id').exec(function(err,doc)
			{
				res.send(doc)
			});
		else
			epigraphDB.find({subject:req.body.data}, function(err, doc)
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
