const User = require("../models/User");

// show or render registration form
exports.showRegistForm = (req , res) => {
    
    res.render('register' , {message  : req.flash('message')})
    // res.send('show form')
}

// handling the registraion form
exports.registerUser = async (req, res, next) => {
    
    const {username , email , password} = req.body;

    try {
        const userExist = await User.findOne({$or : [{username} , {email}]});

        if(userExist) {
            req.flash('message' , 'User or email already exists');
            return res.redirect('/register')
        }

    const newUser = new User({ username, email, password});
    await newUser.save();

    req.flash('message', 'Registration successful!.');
    res.redirect('/login');


    } catch (err) {
        next(err)
    }
    // console.log('handle register')
    // res.send('handle registers')
};

// show or render login form for user to login
exports.showLoginForm = (req, res) => {
  res.render('login', { message: req.flash('message') });
};


// handling the login when user input details
exports.login = async (req , res , next) => {
  const {username , password} = req.body;

  try {
    const user = await User.findOne({username});

   if (!user) {
      req.flash('message', 'User not found');
      return res.redirect('/login');
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      req.flash('message', 'Incorrect password');
      return res.redirect('/login');
    }

    req.session.user = user;
    res.redirect('/dashboard');

  } catch (err) {
     next(err);
  }
// console.log('Login attempt:', username, password);
// console.log('Found user:', {username , password});
// console.log('User logged in, redirecting...');
}



// login user out
exports.logout = (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
};