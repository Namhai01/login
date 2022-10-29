require('dotenv').config();
var express = require('express');
var router = express.Router();
const db = require('../public/database/db.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
router.use(express.json());
// Login page
router.get('/login', function(req, res, next) {
  res.render('login');
});

router.get('/admin' , function(req, res, next) {
	res.render('admin');
  });

// Regis page
router.get('/register', function(req, res, next) {
  res.render('register');
});

// Get_list_user
router.get('/' , authUser , function(req, res) {
	console.log('test');
});

function authUser(req, res, next) {
	const auth = req.headers['authorization'];
	const token = auth.split(' ')[1];
	if(!token) res.sendstatus(401);
	jwt.verify(token, process.env.JWT_SECRET, (err, data) => {
		res.json(data);
		console.log(err);    
	});
}


// register
router.post('/register' ,async function(req, res, next) {
  const { name, password: plainTextPassword } = req.body;
	if (!name || typeof name !== 'string') {
		return res.json({ status: 'error', error: 'Invalid username' })
	}

	if (!plainTextPassword || typeof plainTextPassword !== 'string') {
		return res.json({ status: 'error', error: 'Invalid password' })
	}

	const password = await bcrypt.hash(plainTextPassword, 10)

	try {
		const response = await db.create({
			name,
			password
		})
		res.json({ status: 'ok', data: 'Success' })
		// console.log('User created successfully: ', response)
	} catch (error) {
		if (error.code === 11000) {
			// duplicate key
			return res.json({ status: 'error', error: 'Username already in use' })
		}
		throw error
	}

	return res.redirect('/users/login');
})
// Login
router.post('/login', async function(req, res) { 
  const { name, password } = req.body
	const user = await db.findOne({ name }).lean()
	if (!user) {
		return res.json({ status: 'error', error: 'Invalid username/password' })		
	}

	if (await bcrypt.compare(password, user.password)) {
		// the username, password combination is successful
		const data = {
				id: user._id,
				username: user.name,
				role: user.role
		}
		const token = jwt.sign(data,process.env.JWT_SECRET,{ expiresIn: '30s'})	
		return res.json({ status: 'ok', data: token }) 
	}
	res.json({ status: 'error', error: 'Invalid username/password' })
})

module.exports = router;
