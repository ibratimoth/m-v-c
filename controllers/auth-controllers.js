const validationSession=require('../util/validation-session');
const db=require('../data/database');
const bcrypt=require('bcryptjs');

function getLogin(req,res){
   sessionErrordata=validationSession.getSessionerrordata(req,{
    email:'',
    password:''
   });
    res.render('login',{inputData:sessionErrordata});
};

function getSignup(req,res){
    
    sessionErrordata=validationSession.getSessionerrordata(req,{
        email:'',
        confirmEmail:'',
        password:''
       });
    res.render('signup',
    {inputData:sessionErrordata
    });
};

async function postSignup(req,res){
    const userData=req.body;
    const enteredEmail=userData.email;
    const enteredConfirmEmail=userData ['confirm-email'];
    const enteredPassword=userData.password;
    const hashedPassword= await bcrypt.hash(enteredPassword,12);

    if(
        !enteredEmail||
        !enteredConfirmEmail||
        !enteredPassword||
        enteredPassword.trim()< 6||
        enteredEmail !==enteredConfirmEmail||
        !enteredEmail.includes('@')
    ){
        req.session.inputData={
            hasError:true,
            message:'Invalid input - please check your data',
            email: enteredEmail,
            confirmEnail:enteredConfirmEmail,
            password:enteredPassword,
        };
        req.session.save(function(){
            res.redirect('/signupform')
        });
        return;
    }

    const existingUser= await db.getDb().collection('users').findOne({email:enteredEmail});

    if(existingUser){
        req.session.inputData={
            hasError:true,
            message:'user exists already!!',
            email: enteredEmail,
            confirmEnail:enteredConfirmEmail,
            password:enteredPassword,
        };
        req.session.save(function(){
            res.redirect('/signupform')
        });
        return;
    }

    const user={
        email:enteredEmail,
        password:hashedPassword
    };

    await db.getDb().collection('users').insertOne(user);

    res.redirect('/login')
};

async function postLogin(req,res){
    const userData=req.body;
    const enteredEmail=userData.email;
    const enteredPassword=userData.password;

    const existingUser= await db.getDb().collection('users').findOne({email:enteredEmail});

    if(!existingUser){
        req.session.inputData={
            hasError:true,
            message:'could not log you in - check your credentials',
            email: enteredEmail,
            password:enteredPassword,
        };
        req.session.save(function(){
            res.redirect('/login')
        });
        return;
    }

    const passwordAreEqual=await bcrypt.compare(enteredPassword,existingUser.password);

    if(!passwordAreEqual){
        req.session.inputData={
            hasError:true,
            message:'could not log you in - check your credentials.',
            email: enteredEmail,
            password:enteredPassword,
        };
        req.session.save(function(){
            res.redirect('/login')
        });
        return;
    }

    req.session.user={id:existingUser._id,email:existingUser.email};
    req.session.isAuthenticated=true;
    req.session.save(function(){ 
        res.redirect('/admin');
    });
};

function postLogout(req,res){
    req.session.user=null;
    req.session.isAuthenticated=false;
    res.redirect('/');
}
module.exports={
    getLogin:getLogin,
    getSignup:getSignup,
    postSignup:postSignup,
    postLogin:postLogin,
    postLogout:postLogout
}