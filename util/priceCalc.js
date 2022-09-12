var Holidays = require('date-holidays');
var hd = new Holidays();
const moment = require('moment');
hd.init('IT');
//hd.isHoliday(new Date())

function applyMod(base, mod) {//private, don't call
    switch (mod.sign) {
        case '-':
            base = base - mod.quantity;
            break;
        case '+':
            base = base + mod.quantity;
            break;
        case '/':
            base = base / mod.quantity;
            break;
        case '*':
            base = base * mod.quantity;
            break;
        case '+%':
            base = base + (mod.quantity * 0.01 * base);
            break;
        case '-%':
            base = base - (mod.quantity * 0.01 * base);
            break;
        default:
            base = NaN;
            break;
    }
    return base;
}

function oneDayPrice(priceObj) { //prende l'oggetto prezzo e ritorna il prezzo per un solo giorno mancando onTotal e in base al tipo di giorno
    var price = { daily: priceObj.base, onHoly: priceObj.base, onWeekend: priceObj.base, onHolyWeekend: priceObj.base };

    //apply all appropriate modifiers per 1 day
    for (let index = 0; index < priceObj.modifiers.length; index++) {
        const element = priceObj.modifiers[index];
        if (element.apply === 'daily') {
            price.daily = applyMod(price.daily, element);
            price.onHoly = applyMod(price.onHoly, element);
            price.onWeekend = applyMod(price.onWeekend, element);
            price.onHolyWeekend = applyMod(price.onHolyWeekend, element);
        } else if (element.apply === 'onHoly') {
            price.onHoly = applyMod(price.onHoly, element);
            price.onHolyWeekend = applyMod(price.onHolyWeekend, element);
        } else if (element.apply === 'onWeekend') {
            price.onWeekend = applyMod(price.onWeekend, element);
            price.onHolyWeekend = applyMod(price.onHolyWeekend, element);
        }
    }

    return price;
}

function applyOnTotal(total, mod) { //prende il prezzo totale calcolato e applica i modificatori onTotal

    //apply all appropriate modifiers on total
    for (let index = 0; index < mod.length; index++) {
        const element = mod[index];
        if (element.apply === 'onTotal') {
            total = applyMod(total, element);
        }
    }
    return total;
}

function getPriceForPeriod(priceObj, startingDate, endDate) {    //RULES startDate e endDate sono stringhe in formato ISO '2022-12-01'; ritorna il prezzo totale per un periodo di tempo
    var pricePerDay = {};
    var totalPrice = 0;

    startingDate = new Date (startingDate);
    endDate = new Date (endDate);

    var ndays = 1 + Math.round((endDate.getTime() - startingDate.getTime()) / (24 * 3600 * 1000));
    var nsaturdays = Math.floor((startingDate.getDay() + ndays) / 7);
    var weekendDays = 2 * nsaturdays + (startingDate.getDay() == 0) - (endDate.getDay() == 6);

    //creo struttura per tenere conto dei tipi di giorno e le loro quanitities
    var count = { daily: ndays, onHoly: 0, onWeekend: weekendDays, onHolyWeekend: 0 };

    //prendo tutte le feste che cadono durante il noleggio
    var holidays = [];
    for (let i = 0; i <= (endDate.getFullYear() - startingDate.getFullYear()); i++) {
        holidays = holidays.concat(hd.getHolidays(startingDate.getFullYear() + i));
    }

    //filtro quelle non valide
    holidays = holidays.filter((value) => { return (value.type === 'public' && (new Date(value.date.split(' ')[0])).getTime() <= (endDate.getTime()) && (new Date(value.date.split(' ')[0])).getTime() >= startingDate.getTime()) })

    //segno le quantita'
    count.onHoly = holidays.length;
    count.onHolyWeekend = holidays.filter((value) => { return ((new Date(value.date.split(' ')[0])).getDay() === 0) || (new Date(value.date.split(' ')[0])).getDay() === 6 }).length;
    count.onHoly = count.onHoly - count.onHolyWeekend;
    count.onWeekend = count.onWeekend - count.onHolyWeekend;
    count.daily = count.daily - count.onHoly - count.onWeekend - count.onHolyWeekend;

    pricePerDay = oneDayPrice(priceObj);
    totalPrice = pricePerDay.daily * count.daily + pricePerDay.onHoly * count.onHoly + pricePerDay.onWeekend * count.onWeekend + pricePerDay.onHolyWeekend * count.onHolyWeekend;

    //applichiamo onTotal
    totalPrice = applyOnTotal(totalPrice, priceObj.modifiers);
    console.log(totalPrice);
    return totalPrice; 
}

const price = {
    calc: getPriceForPeriod
}

module.exports = price;






























function applyonTotal(total, priceObj) { // private, don't call
    for (var j = 0; j < priceObj.modifiers.length; j++) {
        var modifier = priceObj.modifiers[j];
        if (modifier.apply === 'onTotal') {
            total.daily = applyMod(total.daily, modifier);
            total.weekend = applyMod(total.weekend, modifier);
            total.holy = applyMod(total.holy, modifier);
        }
    }
    return total;
}

function totalPrice(priceObj, startDate, endDate) {  //returns the total price as a simple number
    var perDay = dailyPriceNoOnTotal();
    var day = 0, holy = 0, weekend = 0;
    //conti quanti giorni di weekend e quante festivita' ci sono, sottrai dai giorni totali e
    var total = perDay.daily * day + perDay.holy * holy + perDay.weekend * weekend;
    perDay.daily = total;
    perDay.holy = 0;
    perDay.weekend = 0;
    return applyonTotal(perDay, priceObj).daily;
}

function dailyPrice(priceObj) {
    return applyonTotal(dailyPriceNoOnTotal(priceObj), priceObj);
}

function dailyPriceNoOnTotal(priceObj) {  //returns an obj of type {daily: number, holy: number, weekend: number} DOES NOT CARE ABOUT THE  TOTAL MODS
    var total = { daily: priceObj.base, holy: priceObj.base, weekend: priceObj.base };

    for (var i = 0; i < priceObj.modifiers.length; i++) {
        var modifier = priceObj.modifiers[i];
        if (modifier.apply === 'onHoly') {
            total.holy = applyMod(total.holy, modifier);
        } else if (modifier.apply === 'onWeekend') {
            total.weekend = applyMod(total.weekend, modifier);
        } else if (modifier.apply === 'daily') {
            total.daily = applyMod(total.daily, modifier);
            total.weekend = applyMod(total.weekend, modifier);
            total.holy = applyMod(total.holy, modifier);
        }
    }
    return total;
}