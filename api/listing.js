
const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const passport = require('passport');
const Listing = require('../models/listing');
const cout = require('../util/cout');
const SimpleHWman = require('../models/simpleHWman');
const multer = require('multer')
const path = require('path')

/// ** COSA DEVE RICEVERE ** ///
/*
    {   //oggetto listing
        products: [vedi sotto],
        disabled: bool,
        name: 'string',
        description: 'string',
        type: 'string',
        brand: 'string',
        company: 'string' // nome della company
    }

    {   //oggetto product
        imgs: ['string'],
        price: {vedi sotto},
        condition: 'string,
        disabled: bool,
        maintenance: date
    }
    
    {   //oggetto price
        base: number
        modifiers: [vedi sotto],
        fidelity: number
    }
*/
/// ** COSA Ritorna ** ///
/*
    oggetti della stessa forma, tutti elencati qui (ti interessano i 200 che puoi handlare)
    
    //codici 200 che dovrai handlare
    {   //literally the listing
        command: 'noCommand',
        msg: listingObj 
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

router.post('/create', async (req, res, next) => { //create a new listing in the nolonolo db
    var listingg = req.body;

    //vediamo se l'utente e' autenticato
    if (!req.isAuthenticated() || !req.user) { return res.status(500).json({ command: 'logErr', msg: `user must be authed to create a new listing` }); }

    //deve essere un manager o funzionario
    if (req.user.role !== 'manager' && req.user.role !== 'employee') { return res.status(500).json({ command: 'logErr', msg: `user must be a manager or employee to create a new listing` }); }

    //la chiamata ha mandato body vuoto
    if (!req.body) { return res.status(500).json({ command: 'logErr', msg: `body is empty` }); }

    //creiamo un oggetto per confrontare variabili e simili date in risposta da mongo
    var dbAnswer = { err: null, listing: listingg, simpleHWman: req.user };

    //salviamo il nuovo listing

    const listing = new Listing(dbAnswer.listing);
    try {
        await listing.save();
    } catch (err) {
        dbAnswer.err = err;
    }
    //processing db answer
    if (dbAnswer.err) return res.status(500).json({ command: 'logErr', msg: `failed to save new listing\n${dbAnswer.err}` });

    return res.status(200).json({ command: 'noCommand', msg: dbAnswer.listing });
    //added listing
});

/// ** COSA DEVE RICEVERE ** ///
/*
    niente
*/
/// ** COSA Ritorna ** ///
/*
    oggetti della stessa forma, tutti elencati qui (ti interessano i 200 che puoi handlare)
    
    //codici 200 che dovrai handlare
    {   //literally the listing array
        command: 'noCommand',
        msg: listingsArray
    }
    {   //must be logged as SimpleHWMan to get all listings and not only the !disabled ones
        command: 'displayErr',
        msg: `mustBeLoggedAsSimpleHWMan`
    }
    {   //can only see the listings of the company you are a part of
        command: 'noCommand',
        msg: `noCompanies`
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

router.get('/allForThisSimpleHWMan', async (req, res, next) => { //get all listings related to you from the nolonolo db

    //vediamo se l'utente e' autenticato
    if (!req.isAuthenticated() || !req.user) { return res.status(500).json({ command: 'logErr', msg: `user must be authed to get the complete listings list` }); }

    //deve essere un manager o funzionario
    if (req.user.role !== 'manager' && req.user.role !== 'employee') { return res.status(200).json({ command: 'displayErr', msg: `mustBeLoggedAsSimpleHWMan` }); }

    //deve avere delle compagnie
    if (!req.user.companies || req.user.companies.length <= 0) { return res.status(200).json({ command: 'noCommand', msg: `noCompanies` }); }

    //creiamo un oggetto per confrontare variabili e simili date in risposta da mongo
    var dbAnswer = { err: null, listings: null, simpleHWman: req.user };
    //gettiamo i listing
    try {
        dbAnswer.listings = await Listing.find({ 'company': req.user.companies });
    } catch (err) {
        dbAnswer.err = err;
    }
    //processing db answer
    if (dbAnswer.err) return res.status(500).json({ command: 'logErr', msg: `failed to get listings list\n${dbAnswer.err}`});

    return res.status(200).json({ command: 'noCommand', msg: dbAnswer.listings });
    //sent listings
});

/// ** COSA DEVE RICEVERE ** ///
/*
    {   //oggetto listing
        _id: string,
        products: [vedi sotto],
        disabled: bool,
        name: 'string',
        description: 'string',
        type: 'string',
        brand: 'string',
        company: 'string' // nome della company
    }

    {   //oggetto product
        imgs: ['string'],
        price: {vedi sotto},
        condition: 'string,
        disabled: bool,
        maintenance: date
    }
    
    {   //oggetto price
        base: number
        modifiers: [vedi sotto],
        fidelity: number
    }
*/
/// ** COSA Ritorna ** ///
/*
    oggetti della stessa forma, tutti elencati qui (ti interessano i 200 che puoi handlare)
    
    //codici 200 che dovrai handlare
    {   //literally the listing
        command: 'noCommand',
        msg: listingObj 
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

router.post('/update', async (req, res, next) => { //update an existing listing in the nolonolo db
    var listingg = req.body;
    
    //vediamo se l'utente e' autenticato
    if (!req.isAuthenticated() || !req.user) { return res.status(500).json({ command: 'logErr', msg: `user must be authed to modify a listing` }); }

    //deve essere un manager o funzionario
    if (req.user.role !== 'manager' && req.user.role !== 'employee') { return res.status(500).json({ command: 'logErr', msg: `user must be a manager or employee to modify a listing` }); }

    //la chiamata ha mandato body vuoto
    if (!req.body) { return res.status(500).json({ command: 'logErr', msg: `body is empty` }); }

    //creiamo un oggetto per confrontare variabili e simili date in risposta da mongo
    var dbAnswer = { err: null, listing: listingg, simpleHWman: req.user };

    //modifichiamo il listing gia' esistente

    try {
        dbAnswer.listing = await Listing.findOneAndUpdate({'_id' : dbAnswer.listing._id}, dbAnswer.listing, { new: true });
    } catch (err) {
        dbAnswer.err = err;
    }
    //processing db answer
    if (dbAnswer.err) return res.status(500).json({ command: 'logErr', msg: `failed to modify listing\n${dbAnswer.err}` });

    return res.status(200).json({ command: 'noCommand', msg: dbAnswer.listing });
    //modified listing
});


/// ** COSA DEVE RICEVERE ** ///
/*
    niente
*/
/// ** COSA Ritorna ** ///
/*
    oggetti della stessa forma, tutti elencati qui (ti interessano i 200 che puoi handlare)
    
    //codici 200 che dovrai handlare
    {   //literally the listing array
        command: 'noCommand',
        msg: listingsArray
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

router.get('/allForCustomer', async (req, res, next) => { //create a new listing in the nolonolo db

    //creiamo un oggetto per confrontare variabili e simili date in risposta da mongo
    var dbAnswer = { err: null, listings: null, customer: req.user };
    //gettiamo i listing
    try {
        dbAnswer.listings = await Listing.find({ 'disabled': false });
    } catch (err) {
        dbAnswer.err = err;
    }
    //processing db answer
    if (dbAnswer.err) return res.status(500).json({ command: 'logErr', msg: `failed to get listings list\n${dbAnswer.err}`});

    return res.status(200).json({ command: 'noCommand', msg: dbAnswer.listings });
    //sent listings
});


module.exports = router;