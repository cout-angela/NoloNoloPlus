
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
        command: 'noCommand',
        msg: oggettoManager
    }
    {   //se e' autenticato come customer, ma un customer bannato
        command: 'displayErr',
        msg: 'banned'
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
            return res.status(200).json({ command: 'redirect', msg: '/customer' });
        };

        //se autenticato come manager o employee
        try {
            dbAnswer.simpleHWman = await SimpleHWman.findOne({ 'username': req.user.username }).populate('companies');
        } catch (err) {
            dbAnswer.err = err;
        }
        //processing the db answer
        if (dbAnswer.err) return res.status(500).json({ command: 'logErr', msg: dbAnswer.err });
        if (dbAnswer.simpleHWman){
            if(dbAnswer.simpleHWman.role === 'employee') {return res.status(200).json({ command: 'redirect', msg: `/employee` });}
            if(dbAnswer.simpleHWman.role === 'manager') {return res.status(200).json({ command: 'noCommand', msg: dbAnswer.simpleHWman });}
        }

        //shouldn't be able to get here
        return res.status(500).json({ command: 'logErr', msg: `user auth'd but not found in db or role not within the set={'employee', 'manager'}` });
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
            return res.status(200).json({ command: 'redirect', msg: `/customer` });
        };

        //se autenticato come manager o employee
        try {
            dbAnswer.simpleHWman = await SimpleHWman.findOne({ 'username': req.user.username });
        } catch (err) {
            dbAnswer.err = err;
        }

        //processing the db answer
        if (dbAnswer.err) return res.status(500).json({ command: 'logErr', msg: dbAnswer.err });
        if (dbAnswer.simpleHWman){
            if(dbAnswer.simpleHWman.role === 'employee') {return res.status(200).json({ command: 'redirect', msg: `/employee` });}
            if(dbAnswer.simpleHWman.role === 'manager') {return res.status(200).json({ command: 'displayErr', msg: 'alreadyLogged' });}
        }

        //should never get to this point
        return res.status(500).json({ command: 'logErr', msg: `user auth'd but not found in db or role not within the set={'employee', 'manager'}` });
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
        username: req.body.username,
        name: req.body.name,
        surname: req.body.surname,
        role: 'manager',
        password: hashedPassword,
        companies: [],
        rentals: []
    }

    //registro
    const simpleHWman = new SimpleHWman(data);
    try {
        await simpleHWman.save();
    } catch (err) {
        dbAnswer.err = err;
    }
    if (dbAnswer.err) return res.status(500).json({ command: 'logErr', msg: `failed to save new manager\n${dbAnswer.err}` });

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
    {
        command: 'displayErr',
        msg: `notAsimpleHWmanUsername`
    }
    {
        command: 'displayErr',
        msg: `notAManagerUsername`
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
    //controllo che non abbia inserito le credenziali di un customer
    try {
        dbAnswer.customer = await Customer.findOne({ 'username': req.body.username });
    } catch (err) {
        dbAnswer.err = err;
    }
    //processing the db answer
    if (dbAnswer.err) return res.status(500).json({ command: 'logErr', msg: dbAnswer.err });
    if (dbAnswer.customer) return res.status(200).json({ command: 'displayErr', msg: 'notAsimpleHWmanUsername' });


    //controllo che non abbia inserito le credenziali di un customer
    try {
        dbAnswer.simpleHWman = await SimpleHWman.findOne({ 'username': req.body.username });
    } catch (err) {
        dbAnswer.err = err;
    }
    //processing the db answer
    if (dbAnswer.err) return res.status(500).json({ command: 'logErr', msg: dbAnswer.err });
    if (dbAnswer.simpleHWman && dbAnswer.simpleHWman.role === 'employee') return res.status(200).json({ command: 'displayErr', msg: 'notAManagerUsername' });


    passport.authenticate('local', function (err, user, info) {
        if (err) { return next(err); }
        if (!user) {
            return res.status(200).json({ command: 'displayErr', msg: info.msg });
        }
        req.logIn(user, function (err) {
            if (err) { return next(err); }
            return res.status(200).json({ command: 'redirect', msg: '/manager' });
        });
    })(req, res, next);
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
    res.status(200).json({ command: 'redirect', msg: '/manager' });
});

module.exports = router;
