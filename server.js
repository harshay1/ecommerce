var express = require('express');
var morgan = require('morgan'); 
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var ejs = require('ejs');
var engine = require('ejs-mate');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var flash = require('express-flash');
var MongoStore = require('connect-mongo')(session);
var passport = require('passport');

var secret = require('./config/secret');
var User = require('./models/user');
var Category = require('./models/category');
var Product = require('./models/product');
var cartLength = require('./middlewares/middleware');
var app = express();

function paginate(req, res, next) {
    var perPage= 9;
            var page = req.params.page;
            Product
            .find()
            .skip(perPage*page)
            .limit(perPage)
            .populate('category')
            .exec(function(err, products) {
                if(err)
                    return next(err);
                Product.count().exec(function(err, count) {
                    if(err)
                        return next(err);
                    res.render('main/product-main', {
                        products: products,
                        pages: count/perPage
                    });
                });
            });
}
/* Middleware */
app.use(express.static(__dirname + '/public'));
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true }));
app.use(cookieParser());
app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: secret.secretKey,
    store: new MongoStore({url: secret.database, autoReconnect: true})
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(function(req, res, next) {
    res.locals.user = req.user;
    next();
});
app.use(function(req, res, next) {
    Category.find({}, function(err, categories) {
        if(err)
            return next(err);
        res.locals.categories = categories;
        next();
    });
});
app.use(cartLength);
app.engine('ejs', engine);
app.set('view engine', 'ejs');
var mainRoutes = require('./routes/main');
var userRoutes = require('./routes/user');
var adminRoutes = require('./routes/admin');
var apiRoutes = require('./api/api');
app.use(mainRoutes);
app.use(userRoutes);
app.use(adminRoutes);
app.use('/api', apiRoutes);

/* Database Connectivity */
mongoose.connect(secret.database, function(err) {
    if(err)
        {
            console.log(err);
        }
    else
        console.log('We are now connected to the database');
});

/* HTTP method calls*/
app.get('/', function(req, res, next) {
    if(req.user)
        {
            paginate(req, res, next);
        }
    else
        res.render('main/home');    
});
app.get('/page/:page', function(req, res, next) {
    paginate(req, res, next);
});

app.get('/about', function(req, res) {
    res.render('main/about');
})


/**/
app.listen(secret.port, function(err) {
    if(err)
        throw err;
    else
        console.log('Server listening on port '+secret.port);
});