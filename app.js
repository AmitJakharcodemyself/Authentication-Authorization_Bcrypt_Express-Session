const express=require('express');
const mongoose=require('mongoose');
const ejsMate=require('ejs-mate');
const path=require('path');
const User=require('./models/users');
const bcrypt=require('bcrypt');
const session=require('express-session')
const app=express();
//Connect to Cloud MongoDB
const MONGOURI = "mongodb+srv://Amit123:Amit123@cluster0.6shrj.mongodb.net/bcryptUser?retryWrites=true&w=majority";
mongoose.connect(MONGOURI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify:false
});
const db=mongoose.connection;
db.on('error',error=>{
    console.log('Oh NO!!!! can\'t connect to databse');
});
db.once('open',()=>{
    console.log("database Connectec");
});

const sessionConfig={
    secret:'thisshouldbeabettersecret!',
    resave:false,
    saveUninitialized:true,
}
const requireLogin=(req,res,next)=>{
    if(!req.session.user_id)
    return res.redirect('/login');
    next();
}
//Template Engine
app.engine('ejs', ejsMate)
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));

app.use(express.urlencoded({extended:true}));
app.use(session(sessionConfig));
//Routes
app.get('/',(req,res)=>{
    res.send('Home Page !!SeccessFully Registered.')
})
app.get('/register',(req,res)=>{
    res.render('register');
})
app.get('/secret',requireLogin,(req,res)=>{
    //or can send flash message along with
   // res.send("This is Top Secret You cannot see it without Authenticated");
   res.render('secret');
})
app.get('/login',(req,res)=>{
    res.render('login');
})
app.post('/logout',(req,res)=>{
    req.session.user_id=null;
    req.session.destroy();
    res.render('login');
})
app.post('/login',async(req,res)=>{
    const {username,password}=req.body;
    //search for username
   const foundUser=await User.findAndValidate(username,password);//don't forget to use await
    if(foundUser){
    //res.send("SuccessFully Logged in");
    req.session.user_id=foundUser._id;//Dont do {res.session.user_id}
    res.redirect('/secret');//or to any rout bcoz now to all routes asscoited with app  user will have access
    //As Cookies Give Restfulness to HTTP or connect all request of that domain (Here LocalHost);
    }
    else
    res.send("Try Again");

})
app.post('/register',async(req,res)=>{
    const{username,password}=req.body;
    const user =await new User({username,password})
    await user.save();//save to new created user document object in User model/collection
    req.session.user_id=user._id;
    res.redirect('/');
})

app.listen(3000,()=>{
    console.log("Serving My App @ 3500");
})