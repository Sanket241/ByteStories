

export const signup = async (req, res, next) => {
    res.send('Signup route');
    console.log('Signup route');
};

export const signin = async (req, res, next) => {
    res.send('Signin route');
    console.log('Signin route');
};

export const google = async (req, res, next) => {
    res.send('Google route');
    console.log('Google route');
};


export const test = async (req, res, next) => {
    console.log('test route auth');
    res.send('Test route');
};