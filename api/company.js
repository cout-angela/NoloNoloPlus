
const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const passport = require('passport');
const Company = require('../models/company');
const cout = require('../util/cout');
const SimpleHWman = require('../models/simpleHWman');


/// ** COSA DEVE RICEVERE ** ///
/*
    l'oggetto company con la seguente forma
    {
        name: 'stringa',
        password: 'stringa'
    }
*/
/// ** COSA Ritorna ** ///
/*
    oggetti della stessa forma, tutti elencati qui (ti interessano i 200 che puoi handlare)
    
    //codici 200 che dovrai handlare
    {   //se tutto va bene
        command: 'noCommand',
        msg: oggettoSimpleHWman
    }
    {   // se il field del nome dell'azienda appare empty in req.body
        command: 'displayErr',
        msg: 'nameFieldEmpty'
    }
    {   // se il field della password dell'azienda appare empty in req.body
        command: 'displayErr',
        msg: 'passwordFieldEmpty'
    }
    {   // se il nome dell'azienda che e' stato inserito appartiene ad un'azienda gia' esistente
        command: 'displayErr',
        msg: 'companyNameTaken'
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

router.post('/create', async (req, res) => { //create a new company in the nolonolo db

    //vediamo se l'utente e' autenticato
    if (!req.isAuthenticated() || !req.user) { return res.status(500).json({ command: 'logErr', msg: `user must be authed to create a new company` }); }

    //deve essere un manager
    if (req.user.role !== 'manager') { return res.status(500).json({ command: 'logErr', msg: `user must be a manager to create a new company` }); }

    //la chiamata ha mandato body vuoto
    if (!req.body) { return res.status(500).json({ command: 'logErr', msg: `body is empty` }); }

    //la chiamata manca del nome
    if (!req.body.name || req.body.name == '') { return res.status(200).json({ command: 'displayErr', msg: `nameFieldEmpty` }); }

    //la chiamata manca della password
    if (!req.body.password || req.body.password == '') { return res.status(200).json({ command: 'displayErr', msg: `passwordFieldEmpty` }); }

    //creiamo un oggetto per confrontare variabili e simili date in risposta da mongo e da bcrypt
    var dbAnswer = { err: null, company: null, simpleHWman: req.user };

    //controlliamo se il nome e' gia' preso
    try {
        dbAnswer.company = await Company.findOne({ 'name': req.body.name });
    } catch (err) {
        dbAnswer.err = err;
    }
    //processing the db answer
    if (dbAnswer.err) { return res.status(500).json({ command: 'logErr', msg: `dbFailed:\n${dbAnswer.err}` }) };
    if (dbAnswer.company) { return res.status(200).json({ command: 'displayErr', msg: `companyNameTaken` }) };

    //encryptiamo la password
    var hashedPassword = '';
    try {
        hashedPassword = await bcrypt.hash(req.body.password, 10);
    } catch (e) {
        dbAnswer.err = e;
    }
    //processing hashing answer
    if (dbAnswer.err) return res.status(500).json({ command: 'logErr', msg: `failed to hash password\n${dbAnswer.err}` });


    //salviamo la nuova azienda
    const company = new Company({ name: req.body.name, password: hashedPassword });
    try {
        await company.save();
    } catch (err) {
        dbAnswer.err = err;
    }
    //processing db answer
    if (dbAnswer.err) return res.status(500).json({ command: 'logErr', msg: `failed to save new company\n${dbAnswer.err}` });

    //prendiamo la compagnia dal db
    try {
        dbAnswer.company = await Company.findOne({ 'name': req.body.name });
    } catch (err) {
        dbAnswer.err = err;
    }
    //processing the db answer
    if (dbAnswer.err) return res.status(500).json({ command: 'logErr', msg: dbAnswer.err });
    if (!dbAnswer.company) { return res.status(200).json({ command: 'logErr', msg: `compagnia non trovata subito dopo averla aggiunta al db` }); };

    //adding the company to the simpleHWman object
    if (!dbAnswer.simpleHWman.companies) { dbAnswer.simpleHWman.companies = [] }
    dbAnswer.simpleHWman.companies.push(dbAnswer.company._id);

    //save simpleHWMan
    try {
        dbAnswer.simpleHWman = await SimpleHWman.findOneAndUpdate({ 'username': dbAnswer.simpleHWman.username }, dbAnswer.simpleHWman, { new: true });
    } catch (err) {
        dbAnswer.err = err;
    }
    if (dbAnswer.err) return res.status(500).json({ command: 'logErr', msg: `failed to save new employee or manager\n${dbAnswer.err}` });
    if (!dbAnswer.simpleHWman) { return res.status(500).json({ command: 'logErr', msg: `manager or employee not found somehow` }); }

    if (dbAnswer.simpleHWman.companies && dbAnswer.simpleHWman.companies[0] && typeof dbAnswer.simpleHWman.companies[0] === 'string') {

        try {
            dbAnswer.simpleHWman.companies = await Company.find({ '_id': dbAnswer.simpleHWman.companies });
        } catch (err) {
            dbAnswer.err = err;
        }
        //processing the db answer
        if (dbAnswer.err) return res.status(500).json({ command: 'logErr', msg: dbAnswer.err });
    }

    return res.status(200).json({ command: 'noCommand', msg: dbAnswer.simpleHWman });
    //updated
});


/// ** COSA DEVE RICEVERE ** ///
/*
    l'oggetto company con la seguente forma
    {
        name: 'stringa',
        password: 'stringa'
    }
*/
/// ** COSA Ritorna ** ///
/*
    oggetti della stessa forma, tutti elencati qui (ti interessano i 200 che puoi handlare)
    
    //codici 200 che dovrai handlare
    {   //se tutto va bene
        command: 'noCommand',
        msg: oggettoSimpleHWman
    }
    {   // se il field del nome dell'azienda appare empty in req.body
        command: 'displayErr',
        msg: 'nameFieldEmpty'
    }
    {   // se il field della password dell'azienda appare empty in req.body
        command: 'displayErr',
        msg: 'passwordFieldEmpty'
    }
    {   // se il nome dell'azienda che e' stato inserito non appartiene a nessuna azienda
        command: 'displayErr',
        msg: 'companyNotFound'
    }
    {   // se l'azienda e' giusta ma la password e' sbagliata
        command: 'displayErr',
        msg: 'wrongPass'
    }
    {   // se il simpleHWMan fa gia' parte dell'azienda
        command: 'displayErr',
        msg: 'alreadyPartOfThatCompany'
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

router.post('/addToSelf', async (req, res) => { //add an existing company to your list of companies

    //vediamo se l'utente e' autenticato
    if (!req.isAuthenticated() || !req.user) { return res.status(500).json({ command: 'logErr', msg: `user must be authed to add a company` }); }

    //vediamo se l'utente e' manager o employee
    if (req.user.role !== 'manager' && req.user.role !== 'employee') { return res.status(500).json({ command: 'logErr', msg: `user must be a manager or employee to add a company` }) }

    //la chiamata ha mandato body vuoto
    if (!req.body) { return res.status(500).json({ command: 'logErr', msg: `body is empty` }); }

    //la chiamata manca del nome
    if (!req.body.name || req.body.name == '') { return res.status(200).json({ command: 'displayErr', msg: `nameFieldEmpty` }); }

    //la chiamata manca della password
    if (!req.body.password || req.body.password == '') { return res.status(200).json({ command: 'displayErr', msg: `passwordFieldEmpty` }); }

    //creiamo un oggetto per confrontare variabili e simili date in risposta da mongo e da bcrypt
    var dbAnswer = { err: null, company: null, simpleHWman: req.user };

    //prendiamo la compagnia dal db
    try {
        dbAnswer.company = await Company.findOne({ 'name': req.body.name });
    } catch (err) {
        dbAnswer.err = err;
    }
    //processing the db answer
    if (dbAnswer.err) return res.status(500).json({ command: 'logErr', msg: dbAnswer.err });
    if (!dbAnswer.company) { return res.status(200).json({ command: 'displayErr', msg: `companyNotFound` }); };

    //controllo se la compagnia e' gia' tra quelle del simpleHWman chiamante
    if (dbAnswer.simpleHWman.companies && dbAnswer.simpleHWman.companies.indexOf(dbAnswer.company.name) !== -1) { return res.status(200).json({ command: 'displayErr', msg: `alreadyPartOfThatCompany` }); }

    //compare company password
    try {
        if (!bcrypt.compareSync(req.body.password, dbAnswer.company.password)) { dbAnswer.company = null; }
    } catch (err) {
        dbAnswer.err = err;
    }
    //processing the compare
    if (dbAnswer.err) { return res.status(500).json({ command: 'logErr', msg: `failed to hash password` }); }
    if (!dbAnswer.company) { return res.status(200).json({ command: 'displayErr', msg: `wrongPass` }); }

    //adding the company to the simpleHWman object
    if (!dbAnswer.simpleHWman.companies) { dbAnswer.simpleHWman.companies = [] }
    console.log(dbAnswer.company)
    dbAnswer.simpleHWman.companies.push(dbAnswer.company.name);

    //save simpleHWMan
    try {
        dbAnswer.simpleHWman = await SimpleHWman.findOneAndUpdate({ 'username': dbAnswer.simpleHWman.username }, dbAnswer.simpleHWman, { new: true });
    } catch (err) {
        dbAnswer.err = err;
    }
    if (dbAnswer.err) return res.status(500).json({ command: 'logErr', msg: `failed to save new employee or manager\n${dbAnswer.err}` });
    if (!dbAnswer.simpleHWman) { return res.status(500).json({ command: 'logErr', msg: `manager or employee not found somehow` }); }

    if (dbAnswer.simpleHWman.companies && dbAnswer.simpleHWman.companies[0] && typeof dbAnswer.simpleHWman.companies[0] === 'string') {

        try {
            dbAnswer.simpleHWman.companies = await Company.find({ 'name': dbAnswer.simpleHWman.companies });
        } catch (err) {
            dbAnswer.err = err;
        }
        //processing the db answer
        if (dbAnswer.err) return res.status(500).json({ command: 'logErr', msg: dbAnswer.err });
    }

    return res.status(200).json({ command: 'noCommand', msg: dbAnswer.simpleHWman });
    //updated
});

module.exports = router;