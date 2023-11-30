const Post=require('../models/post');
const validationSession = require('../util/validation-session');
const validation=require('../util/validation');

function getHome(req,res){
    res.render('welcome');
}
async function getAdmin(req,res){
    const isAuth=req.session.isAuthenticated;
    res.locals.isAuth=isAuth;
    if(!res.locals.isAuth){
        return res.status(401).render('401');
    }
    const posts=await Post.fetchAll();

    sessionErrorData=validationSession.getSessionerrordata(req,{
        title:'',
        content:''
    });
    
    res.render('admin',{
        posts:posts,
        inputData:sessionErrorData
    });
}
async function createPost(req,res){
    const enteredTitle=req.body.title;
    const enteredContent=req.body.content;

    if(
        !validation.postIsvalid(enteredTitle,enteredContent)
    ){
        req.session.inputData={
            hasError:true,
            message:'invalid input - check your data.',
            title: enteredTitle,
            content:enteredContent,
        };
        res.redirect('/admin');
        return;
    }

    const post=new Post(enteredTitle,enteredContent);
    await post.save();

    res.redirect('/admin');
};

async function getSinglepost(req,res){
    const post=new Post(null,null,req.params.id)
     await post.fetch();
      
    if(!post.title||!post.content){
        return res.render('404');
    }

    sessionErrorData=validationSession.getSessionerrordata(req,{
        title:post.title,
        content:post.content
    });

    res.render('single-post',{
        post:post,
        inputData:sessionErrorData,
    })
};

async function updatePost(req,res){
    const enteredTitle=req.body.title;
    const enteredContent=req.body.content;
    

    if(
        !validation.postIsvalid(enteredTitle,enteredContent)
    ){
        req.session.inputData={
            hasError:true,
            message:'invalid input - check your data',
            title: enteredTitle,
            content:enteredContent,
        };

        res.redirect(`/posts/${req.params.id}/edit`);
        return;
    }
    
    const post=new Post(enteredTitle,enteredContent,req.params.id);
    await post.save();

    res.redirect('/admin');
};

async function deletePost(req,res){
    const post=new Post(null,null,req.params.id);
     await post.delete();
     res.redirect('/admin');
 };

 function getProfile(req,res){
    if(!req.session.isAuthenticated){
        return res.status(401).render('401');
    }
    res.render('profile');
}
module.exports={
    getHome:getHome,
    getAdmin:getAdmin,
    createPost:createPost,
    getSinglepost:getSinglepost,
    updatePost:updatePost,
    deletePost:deletePost,
    getProfile:getProfile
};