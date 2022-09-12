
const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const passport = require('passport');
const Customer = require('../models/customer');
const SimpleHWman = require('../models/simpleHWman');
const cout = require('../util/cout');


/// ** COSA Ritorna ** ///
/*
    oggetti della stessa forma, tutti elencati qui (ti interessano i 200 che puoi handlare)
    
    //codici 200 che dovrai handlare
    {
        command: 'displayErr',
        msg: `banned`
    }
    {
        command: 'noCommand',
        msg: oggettoCustomer
    }
    {
        command: 'noCommand',
        msg: 'notLogged'
    }

    //codici 500 di fallimento creati da mongo e anche dal server stesso eccetera che dovrai riparare se vedi, servono per debugging only
    {   
        command: 'logErr',
        msg: `messaggio di errore che verra' loggato in automatico nel front end`
    }
    //codici 200 redirect che dovresti ignorare ma sapere che possono capitare, puoi bloccare i redirect ma se chiami handle sulla risposta del server accadra' tutto in auto
    {
        command: `redirect`,
        msg: '/linkDelRedirect'
    }
*/
router.get('/isLogged', async (req, res) => {
    var dbAnswer = { err: null, customer: null, simpleHWman: null }; //creo una variabile che posso riempire man mano che avanzo nelle chiamate a mongo ecc

    /// --- Controllo se l'utente e' gia' autenticato
    if (req.isAuthenticated()) {
        //se autenticato come customer
        try {
            dbAnswer.customer = await Customer.findOne({ 'username': req.user.username });
        } catch (err) {
            dbAnswer.err = err;
        }
        //processing the db answer
        if (dbAnswer.err) return res.status(500).json({ command: 'logErr', msg: dbAnswer.err });
        if (dbAnswer.customer) {
            if (dbAnswer.customer.banned === true) {
                req.logOut();
                return res.status(200).json({ command: 'displayErr', msg: `banned` });
            }
            return res.status(200).json({ command: 'noCommand', msg: dbAnswer.customer });
        };

        //se autenticato come manager o employee
        try {
            dbAnswer.simpleHWman = await SimpleHWman.findOne({ 'username': req.user.username });
        } catch (err) {
            dbAnswer.err = err;
        }
        //processing the db answer
        if (dbAnswer.err) return res.status(500).json({ command: 'logErr', msg: dbAnswer.err });
        if (dbAnswer.simpleHWman) return res.status(200).json({ command: 'redirect', msg: `/${dbAnswer.simpleHWman.role}` });

        //shouldn't be able to get here
        return res.status(500).json({ command: 'logErr', msg: `user auth'd but not found in db` });
    }

    return res.status(200).json({ command: 'noCommand', msg: 'notLogged' });
});



/// ** COSA DEVE RICEVERE ** ///
/*
    l'oggetto customer con la seguente forma (per ora non supporta immagini)
    {
        username: 'stringa',
        name: 'stringa',
        surname: 'stringa',
        password: 'stringa'
    }
*/

/// ** COSA Ritorna ** ///
/*
    oggetti della stessa forma, tutti elencati qui (ti interessano i 200 che puoi handlare)
    
    //codici 200 che dovrai handlare
    {
        command: 'displayErr',
        msg: `banned`
    }
    {
        command: 'displayErr',
        msg: `alreadyLogged`
    }
    {
        command: 'displayErr',
        msg: `usernameAlreadyInUse`
    }
    {
        command: 'noCommand',
        msg: `regged`
    }

    //codici 500 di fallimento creati da mongo e anche dal server stesso eccetera che dovrai riparare se vedi, servono per debugging only
    {   
        command: 'logErr',
        msg: `messaggio di errore che verra' loggato in automatico nel front end`
    }
    //codici 200 redirect che dovresti ignorare ma sapere che possono capitare, puoi bloccare i redirect ma se chiami handle sulla risposta del server accadra' tutto in auto
    {
        command: `redirect`,
        msg: '/linkDelRedirect'
    }
*/
router.post('/reg', async (req, res) => {
    
    var dbAnswer = { err: null, customer: null, simpleHWman: null }; //creo una variabile che posso riempire man mano che avanzo nelle chiamate al db ecc
    /// --- Controllo che non sia gia' loggato
    if (req.isAuthenticated()) {
        //se autenticato come customer
        try {
            dbAnswer.customer = await Customer.findOne({ 'username': req.user.username });
        } catch (err) {
            dbAnswer.err = err;
        }

        //processing the db answer
        if (dbAnswer.err) return res.status(500).json({ command: 'logErr', msg: dbAnswer.err });
        if (dbAnswer.customer) {
            if (dbAnswer.customer.banned === true) {
                req.logOut();
                return res.status(200).json({ command: 'displayErr', msg: `banned` });
            }
            return res.status(200).json({ command: 'displayErr', msg: `alreadyLogged` });
        };

        //se autenticato come manager o employee
        try {
            dbAnswer.simpleHWman = await SimpleHWman.findOne({ 'username': req.user.username });
        } catch (err) {
            dbAnswer.err = err;
        }

        //processing the db answer
        if (dbAnswer.err) return res.status(500).json({ command: 'logErr', msg: dbAnswer.err });
        if (dbAnswer.simpleHWman) return res.status(200).json({ command: 'redirect', msg: `/${dbAnswer.simpleHWman.role}` });

        //should never get to this point
        return res.status(500).json({ command: 'logErr', msg: `user auth'd but not found in db` });
    }


    /// --- controllo che l'username non sia gia' in uso
    //controllo tra i customer
    try {
        dbAnswer.customer = await Customer.findOne({ 'username': req.body.username });
    } catch (err) {
        dbAnswer.err = err;
    }
    //processing the db answer
    if (dbAnswer.err) return res.status(500).json({ command: 'logErr', msg: dbAnswer.err });
    if (dbAnswer.customer) return res.status(200).json({ command: 'displayErr', msg: 'usernameAlreadyInUse' });

    //controllo tra i manager e employee
    try {
        dbAnswer.simpleHWman = await SimpleHWman.findOne({ 'username': req.body.username });
    } catch (err) {
        dbAnswer.err = err;
    }
    //processing the db answer
    if (dbAnswer.err) return res.status(500).json({ command: 'logErr', msg: dbAnswer.err });
    if (dbAnswer.simpleHWman) { return res.status(200).json({ command: 'displayErr', msg: 'usernameAlreadyInUse' }) };

    /// --- procedo con l'encryption della password e la registrazione
    var hashedPassword = '';
    try {
        hashedPassword = await bcrypt.hash(req.body.password, 10);
    } catch (e) {
        dbAnswer.err = e;
    }
    if (dbAnswer.err) return res.status(500).json({ command: 'logErr', msg: `failed to hash password\n${dbAnswer.err}` });


    //creo un json di base sensato, inserisco i dati ricevuti dal client
    var data = {
        avatar: req.body.avatar,
        username: req.body.username,
        name: req.body.name,
        surname: req.body.surname,
        password: hashedPassword,
        rentals: [],
        notes: [],
        broken: 0,
        late_Pays: 0,
        banned: false,
        fidelity: 0
    }

    //registro
    const customer = new Customer(data);
    try {
        await customer.save();
    } catch (err) {
        dbAnswer.err = err;
    }
    if (dbAnswer.err) return res.status(500).json({ command: 'logErr', msg: `failed to save new customer\n${dbAnswer.err}` });

    return res.status(200).json({ command: 'noCommand', msg: 'regged' });
});



/// ** COSA DEVE RICEVERE ** ///
/*
    l'oggetto customer con la seguente forma (per ora non supporta immagini)
    { username: 'stringa', password: 'stringa' }
*/

/// ** COSA Ritorna ** ///
/*
    oggetti della stessa forma, tutti elencati qui (ti interessano i 200 che puoi handlare)
    
    //codici 200 che dovrai handlare
    {
        command: 'displayErr',
        msg: `userNotFound`
    }
    {
        command: 'displayErr',
        msg: `wrongPass`
    }

    //codici 500 di fallimento creati da mongo e anche dal server stesso eccetera che dovrai riparare se vedi, servono per debugging only
    {   
        command: 'logErr',
        msg: `messaggio di errore che verra' loggato in automatico nel front end`
    }
    //codici 200 redirect che dovresti ignorare ma sapere che possono capitare, puoi bloccare i redirect ma se chiami handle sulla risposta del server accadra' tutto in auto
    {
        command: `redirect`,
        msg: '/linkDelRedirect'
    }
*/
router.post('/login', async function (req, res, next) {
    var dbAnswer = { err: null, customer: null, simpleHWman: null }; //creo una variabile che posso riempire man mano che avanzo nelle chiamate al db ecc
    //controllo che non abbia inserito le credenziali di un simpleHWman
    try {
        dbAnswer.customer = await SimpleHWman.findOne({ 'username': req.body.username });
    } catch (err) {
        dbAnswer.err = err;
    }
    //processing the db answer
    if (dbAnswer.err) return res.status(500).json({ command: 'logErr', msg: dbAnswer.err });
    if (dbAnswer.customer) return res.status(200).json({ command: 'displayErr', msg: 'notACustomerUsername' });

    passport.authenticate('local', function (err, user, info) {
        if (err) { return next(err); }
        if (!user) {
            return res.status(200).json({ command: 'displayErr', msg: info.msg });
        }
        req.logIn(user, function (err) {
            if (err) { return next(err); }
            return res.status(200).json({ command: 'redirect', msg: '/' });
        });
    })(req, res, next);
});



router.post('/update', async (req, res) => {
    var dbAnswer = { err: null, customer: req.body, oldCustomer: null, simpleHWman: null };
    var changedUsername = false;

    //controlliamo se è loggato 
    if (!req.isAuthenticated() || !req.user) { return res.status(500).json({ command: 'logErr', msg: `user must be authed to edit profile` }); }
    //controlliamo se req.body tutto è vuoto o undefined
    if (!req.body) { return res.status(500).json({ command: 'logErr', msg: `body is empty` }); }
    //controlliamo se lo username è vuoto
    if (!req.body.username || req.body.username === '') {
       dbAnswer.customer.username = req.user.username;
    }
    //controlliamo che non sia bannato
    try {
        dbAnswer.oldCustomer = await Customer.findOne({ 'username': req.user.username });
    } catch (err) {
        dbAnswer.err = err;
    }
    //processing the db answer
    if (dbAnswer.err) return res.status(500).json({ command: 'logErr', msg: dbAnswer.err });
    if (dbAnswer.oldCustomer) {
        if (dbAnswer.oldCustomer.banned === true) {
            req.logOut();
            return res.status(200).json({ command: 'displayErr', msg: `banned` });
        }
    };

    //controlliamo se lo username è uguale tra req.body e req.user
    if(dbAnswer.customer.username !== req.user.username){
        changedUsername = true;

        /// --- controllo che l'username non sia gia' in uso
        //controllo tra i customer
        try {
            dbAnswer.oldCustomer = await Customer.findOne({ 'username': dbAnswer.customer.username });
        } catch (err) {
            dbAnswer.err = err;
        }
        //processing the db answer
        if (dbAnswer.err) return res.status(500).json({ command: 'logErr', msg: dbAnswer.err });
        if (dbAnswer.oldCustomer) return res.status(200).json({ command: 'displayErr', msg: 'usernameAlreadyInUse' });

        //controllo tra i manager e employee
        try {
            dbAnswer.simpleHWman = await SimpleHWman.findOne({ 'username': dbAnswer.customer.username });
        } catch (err) {
            dbAnswer.err = err;
        }
        //processing the db answer
        if (dbAnswer.err) return res.status(500).json({ command: 'logErr', msg: dbAnswer.err });
        if (dbAnswer.simpleHWman) { return res.status(200).json({ command: 'displayErr', msg: 'usernameAlreadyInUse' }) }; 
    }
    //chiamare findoneandupdate 
    try {
        dbAnswer.customer = await Customer.findOneAndUpdate({ 'username': req.user.username }, dbAnswer.customer, {new:true});
    } catch (err) {
        dbAnswer.err = err;
    }
    
    if (dbAnswer.err) return res.status(500).json({ command: 'logErr', msg: dbAnswer.err });
    //should not have the next error ever just not
    if (!dbAnswer.customer) return res.status(200).json({ command: 'logErr', msg: 'cutomer not found even if is actually in session lol' });

    
    //se username e' stato cambiato
    if(changedUsername){
        req.logOut();
        return res.status(200).json({ command: 'noCommand', msg: 'loggedOut' });
    }else{
        return res.status(200).json({ command: 'noCommand', msg: dbAnswer.customer });
    }
});


router.post('/updatePassword', async (req, res) => {
    var dbAnswer = { err: null, customer: req.body, oldCustomer: null, simpleHWman: null };

     //controlliamo se è loggato 
     if (!req.isAuthenticated() || !req.user) { return res.status(500).json({ command: 'logErr', msg: `user must be authed to edit profile` }); }
     //controlliamo se req.body tutto è vuoto o undefined
     if (!req.body) { return res.status(500).json({ command: 'logErr', msg: `body is empty` }); }

    //controlliamo se lo username è vuoto
    if (!req.body.username || req.body.username === '') {
        dbAnswer.customer.username = req.user.username;
    }
    //controlliamo che non sia bannato
    try {
        dbAnswer.oldCustomer = await Customer.findOne({ 'username': req.user.username });
    } catch (err) {
        dbAnswer.err = err;
    }

    //processing the db answer
    if (dbAnswer.err) return res.status(500).json({ command: 'logErr', msg: dbAnswer.err });
    if (dbAnswer.oldCustomer) {
        if (dbAnswer.oldCustomer.banned === true) {
            req.logOut();
            return res.status(200).json({ command: 'displayErr', msg: `banned` });
        }
    };

    //compare company password
    try {
        if (!bcrypt.compareSync(req.body.oldPassword, req.user.password)) { dbAnswer.customer = null }
    } catch (err) {
        dbAnswer.err = err;
    }
    //processing the compare
    if (dbAnswer.err) { return res.status(500).json({ command: 'logErr', msg: `failed to hash password` }); }
    if (!dbAnswer.customer) { return res.status(200).json({ command: 'displayErr', msg: `wrongPass` }); }


    if(req.body.newPassword === req.body.oldPassword){return res.status(200).json({ command: 'displayErr', msg: `samePass` });}

    //hashing the password
    var hashedPassword = '';
    try {
        hashedPassword = await bcrypt.hash(req.body.newPassword, 10);
    } catch (e) {
        dbAnswer.err = e;
    }
    if (dbAnswer.err) return res.status(500).json({ command: 'logErr', msg: `failed to hash password\n${dbAnswer.err}` });

    //updating the customer's password
    try {
        dbAnswer.customer = await Customer.findOneAndUpdate({ 'username': req.user.username }, {password: hashedPassword}, {new:true});
    } catch (err) {
        dbAnswer.err = err;
    }

    if (dbAnswer.err) return res.status(500).json({ command: 'logErr', msg: dbAnswer.err });
    //should not have the next error ever just not
    if (!dbAnswer.customer) return res.status(200).json({ command: 'logErr', msg: 'cutomer not found even if is actually in session lol' });

    //logging cutomer out 
    req.logOut();
    return res.status(200).json({ command: 'noCommand', msg: 'loggedOut' });

});

/// ** COSA Ritorna ** ///
/*
    //codici 200 redirect che dovresti ignorare ma sapere che possono capitare, puoi bloccare i redirect ma se chiami handle sulla risposta del server accadra' tutto in auto
    {
        command: `redirect`,
        msg: '/linkDelRedirect'
    }
*/
router.delete('/logout', (req, res) => {
    req.logOut();
    res.status(200).json({ command: 'redirect', msg: '/' });
});

module.exports = router;
