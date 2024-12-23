const router = require('express').Router();
const jwt = require('jsonwebtoken');

router.get('/:role', (req, res) => {
    const SECRET = process.env.VIDEOSDK_SECRET_KEY;

    const { role } = req.params;                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           
    const options = { 
        expiresIn: '120m', 
        algorithm: 'HS256' 
    };
    const permissions = [];
    console.log(req.params)
    if (role === "student") permissions.push(`allow_join`);
    if (role === "teacher") permissions.push(`allow_join`, `allow_mod`);
    console.log(permissions);
    const payload = {
        apikey: process.env.VIDEOSDK_API_KEY,
        version: 2,
        permissions
    };
    
    const token = jwt.sign(payload, SECRET, options);
    res.json({ apiToken: token });       
});

module.exports = router;