const express = require('express');
const router = express.Router();
const price = require('../util/priceCalc');


/// ** COSA DEVE RICEVERE ** ///
/*
    oggetto del tipo
    {
        priceObj : {struttura che trovi nel modello del listing},
        dateStart: '2022-01-02' //esattamente in questo formato, significa 2 gennaio, mi raccomando gli zeri prima delle cifre se sono minori di 10
        dateEnd: '2022-01-02' //DEVE ESSERE UNA DATA SUCCESSIVA O CORRISPONDENTE A DATESTART O ESPLODE, per la struttura vedi dateStart
    }
*/
/// ** COSA Ritorna ** ///
/*
    oggetti della stessa forma, tutti elencati qui (ti interessano i 200 che puoi handlare)
    
    //codici 200 che dovrai handlare
    {   //literally the answer
        command: 'noCommand',
        msg: 100    //price as number
    }
    //codici 500 di fallimento creati da mongo e anche dal server stesso eccetera che dovrai riparare se vedi, servono per debugging only
    {   
        command: 'logErr',
        msg: `messaggio di errore che verra' loggato in automatico nel front end`
    }
*/

router.post('/calc', (req, res) => {

    //la chiamata ha mandato body vuoto
    if (!req.body) { return res.status(500).json({ command: 'logErr', msg: `body is empty` }); }

    return res.status(200).json({command: 'noCommand', msg: price.calc(req.body.priceObj, req.body.dateStart, req.body.dateEnd)});
});


/// ** COSA DEVE RICEVERE ** ///
/*
    array di oggetti
    [
        {
            priceObj : {struttura che trovi nel modello del listing},
            dateStart: '2022-01-02' //esattamente in questo formato, significa 2 gennaio, mi raccomando gli zeri prima delle cifre se sono minori di 10
            dateEnd: '2022-01-02' //DEVE ESSERE UNA DATA SUCCESSIVA O CORRISPONDENTE A DATESTART O ESPLODE, per la struttura vedi dateStart
        }
    ]
*/
/// ** COSA Ritorna ** ///
/*
    oggetti della stessa forma, tutti elencati qui (ti interessano i 200 che puoi handlare)
    
    //codici 200 che dovrai handlare
    {   //literally the answer
        command: 'noCommand',
        msg: [100, 44, 1325, 3]    //array di prezzi calcolati, nello stesso ordine di quelli inviati
    }
    //codici 500 di fallimento creati da mongo e anche dal server stesso eccetera che dovrai riparare se vedi, servono per debugging only
    {   
        command: 'logErr',
        msg: `messaggio di errore che verra' loggato in automatico nel front end`
    }
*/

router.post('/calcAll', (req, res) => {

    //la chiamata ha mandato body vuoto
    if (!req.body) { return res.status(500).json({ command: 'logErr', msg: `body is empty` }); }

    var allPrices = [];

    for (let i = 0; i < req.body.length; i++) {
        const data = req.body[i];
        allPrices.push(price.calc(data.priceObj, data.dateStart, data.dateEnd))
    }

    return res.status(200).json({command: 'noCommand', msg: allPrices});
});

module.exports = router;