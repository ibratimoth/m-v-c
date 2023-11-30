const bcrypt=require('bcryptjs');
const db=require('../data/database');

class User{
    constructor(email,password){
        this.email=email;
        this.password=password;
    }
    
}