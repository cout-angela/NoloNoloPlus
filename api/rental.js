
const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const passport = require('passport');
const Rental = require('../models/rental');
const cout = require('../util/cout');
const SimpleHWman = require('../models/simpleHWman');
const multer = require('multer');
const path = require('path');

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

// router.post('/create', async (req, res, next) => { //create a new listing in the nolonolo db
//     var listingg = req.body;

//     //vediamo se l'utente e' autenticato
//     if (!req.isAuthenticated() || !req.user) { return res.status(500).json({ command: 'logErr', msg: `user must be authed to create a new listing` }); }

//     //deve essere un manager o funzionario
//     if (req.user.role !== 'manager' && req.user.role !== 'employee') { return res.status(500).json({ command: 'logErr', msg: `user must be a manager or employee to create a new listing` }); }

//     //la chiamata ha mandato body vuoto
//     if (!req.body) { return res.status(500).json({ command: 'logErr', msg: `body is empty` }); }

//     //creiamo un oggetto per confrontare variabili e simili date in risposta da mongo
//     var dbAnswer = { err: null, listing: listingg, simpleHWman: req.user };

//     //salviamo il nuovo listing

//     const listing = new Listing(dbAnswer.listing);
//     try {
//         await listing.save();
//     } catch (err) {
//         dbAnswer.err = err;
//     }
//     //processing db answer
//     if (dbAnswer.err) return res.status(500).json({ command: 'logErr', msg: `failed to save new listing\n${dbAnswer.err}` });

//     return res.status(200).json({ command: 'noCommand', msg: dbAnswer.listing });
//     //added listing
// });

/// ** COSA DEVE RICEVERE ** ///
/*
    niente
*/
/// ** COSA Ritorna ** ///
/*
    oggetti della stessa forma, tutti elencati qui (ti interessano i 200 che puoi handlare)
    
    //codici 200 che dovrai handlare
    {   //literally the rental array
        command: 'noCommand',
        msg: rentalsArray
    }
    {   //must be logged as SimpleHWMan to get the rentals related to you and your companies
        command: 'displayErr',
        msg: `mustBeLoggedAsSimpleHWMan`
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

router.get('/allForThisSimpleHWMan', async (req, res, next) => { //get all rentals related to you from the nolonolo db

    //vediamo se l'utente e' autenticato
    if (!req.isAuthenticated() || !req.user) { return res.status(500).json({ command: 'logErr', msg: `user must be authed to get any rentals` }); }

    //deve essere un manager o funzionario
    if (req.user.role !== 'manager' && req.user.role !== 'employee') { return res.status(200).json({ command: 'displayErr', msg: `mustBeLoggedAsSimpleHWMan` }); }

    //creiamo un oggetto per confrontare variabili e simili date in risposta da mongo
    var dbAnswer = { err: null, rentals: [], simpleHWman: req.user };

    //gettiamo i rentals in carico all'utente chiamante
    try {
        dbAnswer.rentals = await Rental.find({ 'simpleHWman_id': dbAnswer.simpleHWman._id, 'rejected': false });
    } catch (err) {
        dbAnswer.err = err;
    }
    //processing db answer
    if (dbAnswer.err) return res.status(500).json({ command: 'logErr', msg: `failed to get rentals list\n${dbAnswer.err}` });
    if (!dbAnswer.rentals) { dbAnswer.rentals = []; }

    //concateniamo anche i pending rentals delle compagnie di cui fa parte
    if (req.user.companies && req.user.companies.length > 0) {
        var tmpRentals = [];
        try {
            tmpRentals = await Rental.find({ 'simpleHWman_id': '', 'companies': dbAnswer.simpleHWman.companies });
        } catch (err) {
            dbAnswer.err = err;
        }
        //processing db answer
        if (dbAnswer.err) return res.status(500).json({ command: 'logErr', msg: `failed to get rentals list\n${dbAnswer.err}` });
        if (tmpRentals) {
            dbAnswer.rentals = dbAnswer.rentals.concat(tmpRentals);
        }
    }

    if(dbAnswer.rentals.length > 0){
        return res.status(200).json({ command: 'noCommand', msg: dbAnswer.rentals });
    } else {
        return res.status(200).json({ command: 'noCommand', msg: 'noRentals' });
    }
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

// router.post('/update', async (req, res, next) => { //create a new listing in the nolonolo db
//     var listingg = req.body;

//     //vediamo se l'utente e' autenticato
//     if (!req.isAuthenticated() || !req.user) { return res.status(500).json({ command: 'logErr', msg: `user must be authed to modify a listing` }); }

//     //deve essere un manager o funzionario
//     if (req.user.role !== 'manager' && req.user.role !== 'employee') { return res.status(500).json({ command: 'logErr', msg: `user must be a manager or employee to modify a listing` }); }

//     //la chiamata ha mandato body vuoto
//     if (!req.body) { return res.status(500).json({ command: 'logErr', msg: `body is empty` }); }

//     //creiamo un oggetto per confrontare variabili e simili date in risposta da mongo
//     var dbAnswer = { err: null, listing: listingg, simpleHWman: req.user };

//     //modifichiamo il listing gia' esistente

//     try {
//         dbAnswer.listing = await Listing.findOneAndUpdate({ '_id': dbAnswer.listing._id }, dbAnswer.listing, { new: true });
//     } catch (err) {
//         dbAnswer.err = err;
//     }
//     //processing db answer
//     if (dbAnswer.err) return res.status(500).json({ command: 'logErr', msg: `failed to modify listing\n${dbAnswer.err}` });

//     return res.status(200).json({ command: 'noCommand', msg: dbAnswer.listing });
//     //modified listing
// });


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

// router.get('/allForCustomer', async (req, res, next) => { //create a new listing in the nolonolo db

//     //creiamo un oggetto per confrontare variabili e simili date in risposta da mongo
//     var dbAnswer = { err: null, listings: null, customer: req.user };
//     //gettiamo i listing
//     try {
//         dbAnswer.listings = await Listing.find({ 'disabled': false });
//     } catch (err) {
//         dbAnswer.err = err;
//     }
//     //processing db answer
//     if (dbAnswer.err) return res.status(500).json({ command: 'logErr', msg: `failed to get listings list\n${dbAnswer.err}` });

//     return res.status(200).json({ command: 'noCommand', msg: dbAnswer.listings });
//     //sent listings
// });


module.exports = router;