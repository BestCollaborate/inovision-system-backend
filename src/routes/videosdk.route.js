const router = require('express').Router();
const jwt = require('jsonwebtoken');

router.get('/video-sdk', (req, res) => {
    const { permissions } = req.query;                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           
    const options = { 
        expiresIn: '120m', 
        algorithm: 'HS256' 
    };
    const payload = {
        apikey: API_KEY,
        permissions: [`allow_join`], // `ask_join` || `allow_mod` 
    };
    
    const token = jwt.sign(payload, SECRET, options);
    console.log(token);
    
       
});

module.exports = router;