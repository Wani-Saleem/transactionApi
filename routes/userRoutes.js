const express = require('express');
const UserProfile = require('../models/userSchema');
const {jwtAuthMiddleware, generateToken} = require('../jtwAuth');
const router = express.Router();

router.get('/profile',jwtAuthMiddleware, async(req,res) => {
    try{
        const userData = req.user;
        const userId = userData.id;
        const user = await UserProfile.findById(userId);
        res.status(200).json({user});
    }catch(err){
        res.status(500).json({
            message: err
        })
    }
});

router.put('/credit', jwtAuthMiddleware, async (req, res) => {
    try{
        const userData = req.user;
        const userId = userData.id;
        const addAmont = parseFloat(req.body.amount);
        const user = await UserProfile.findById(userId);
        
        if(user.activationStatus === 'inactive') return res.status(402).json({
            text: 'Account is inactive',
            message: 'Can\'t proceed with transactions' 
        })

        if(!user) return res.status(401).json({message: "user not found"});
        
        const newAmount = addAmont + user.accountMoney;
        
        user.accountMoney = newAmount;
        await user.save();
        res.status(200).json({
            message: 'Amount credited',
            text: "Successful transaction"
        })
    }catch(err){
        res.status(500).json({
            message: err,
            text: "Some error occured"
        })
    }
})

router.put('/debit', jwtAuthMiddleware, async (req, res) => {
    try{
        const userData = req.user;
        const userId = userData.id;
        const withdrawAmount = parseFloat(req.body.amount);
        const user = await UserProfile.findById(userId);
        
        if(user.activationStatus === 'inactive') return res.status(402).json({
            text: 'Account is inactive',
            message: 'Can\'t proceed with transactions' 
        })

        if(!user) return res.status(401).json({message: "user not found"});
        
        if(user.accountMoney < withdrawAmount) return res.status(401).json({
            text: 'Bad Request',
            message: "Withdrawing amount is greater than money in account"
        })

        const newAmount = user.accountMoney - withdrawAmount;
        
        user.accountMoney = newAmount;
        await user.save();
        res.status(200).json({
            message: 'Amount Debited',
            text: "Successful transaction"
        })
    }catch(err){
        res.status(500).json({
            message: err,
            text: "Some error occured"
        })
    }
})


router.post('/signup', async (req,res) => {
    try{
        const data = req.body;
        const newUserProfile = new UserProfile(data);
        const response = await newUserProfile.save();

        const payload = {
            id : response.id,
            userName : response.userName
        }

        const token = generateToken(payload);

        res.status(200).json({
            response: response,
            token: token
        })
    }catch(err){
        res.status(500).json({
            message : err,
            text: "some error occured"
        })
    }
});


router.post('/signin', async (req,res) => {
    try{
        const {userName, passWord} = req.body;
        const user = await UserProfile.findOne({userName: userName});

        if(!user || !(await user.comparePassword(passWord))){
            return res.status(401).json({
                message: 'user or password is incorrect'
            })
        }

        const payload = {
            id : user.id,
            username : user.userName
        }

        const token = generateToken(payload);

        res.status(200).json({token});
    }catch(err){
        res.status(500).json({
            message: err
        })
    }
})

module.exports = router;