exports.requireAuth = (req, res, next) => {
  if (req.session && req.session.user) {
    next();
  } else {
    req.flash('message', 'Please login to view that page');
    res.redirect('/login');
  }
};
