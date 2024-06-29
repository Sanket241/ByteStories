export const test = async (req, res, next) => {
    console.log('test route user');
    res.send('Test route user');
}

export const updateUser = async(req,resp,next)=>{
    console.log('update user');
    resp.send('update user');
    console.log(req.user)
}