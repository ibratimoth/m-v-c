function getSessionerrordata(req,defaultValues){
    let sessionInputData=req.session.inputData;

    if(!sessionInputData){
        sessionInputData={
            hasError:false,
            ...defaultValues
        };
    }

    req.session.inputData=null;

    return sessionInputData;
};

module.exports={
    getSessionerrordata:getSessionerrordata,
}