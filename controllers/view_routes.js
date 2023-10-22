const router = require('express').Router();
const User = require('../models/User');
const Post = require('../models/Post');
const { authenticate, isLoggedIn, isAuthenticated } = require('../middleware/authenticate');

/* / routes */

// Root page to show Musik posts
router.get('/', authenticate, async (req, res) => {
    // Find all of the Posts
    const posts = await Post.findAll({
        include: {
            model: User,
            as: 'author'
        }
    });

    res.render('home', { 
        user: req.user,
        // Send back only the plain objects for the posts array
        posts: posts.map(p => p.get({ plain: true }))
    });
});

// Show the register form if the user is not logged in
router.get('/register', isLoggedIn, authenticate, (req, res) => {
    res.render('register', {
        // If there are any session errors from them trying to register then they will be sent through to this page for us to use
        errors: req.session.errors,
        user: req.user
    });

    // Clear the error array after you render them
    req.session.errors = [];
});

// Show the login form if the user is not logged in
router.get('/login', isLoggedIn, authenticate, (req, res) => {
    res.render('login', {
        errors: req.session.errors,
        user: req.user
    });

    req.session.errors = [];
});

// Show profile only if the user is authenticated
router.get('/profile', isAuthenticated, authenticate, async (req, res) => {    
    const user_id = req.session.user_id;
    // Find all of the Posts by the user
    const posts = await Post.findAll({
        where: {
            author_id: user_id
        },
        include: {
            model: User,
            as: 'author'
        }
    });
    
    res.render('profile', {
        user: req.user,
        posts: posts.map(p => p.get({ plain: true }))
    });

    req.session.errors = [];
});

router.get('/search', (req, res) => {
    res.render('search_form', {
        user: req.user
    })
});

// Export the router
module.exports = router;