///VINCOLI HTML(h) e Class(c)

//page buttons
//h  li devono essere figli diretti di ul
//h  primo figlio di ul deve sempre essere il tasto prev
//h  ultimo figlio di ul deve sempre essere il tasto next
//h  ul deve avere come padre diretto la nav che la contiene
//c  il padre di PageBtns se esiste deve sempre implementare changePage(page, htmlCallerElement);


///TMP OBJ

class PageBtns {

    //private params
    maxPagesPerGroup;   //maximum amount of pages to show at a time
    name;   //exactly the name given to this object or the name of the parent object if present
    ulId;   //id of ul which will contain the page buttons
    totalPages; //quantity
    currentP;   //index counting from 0

    //public params

    //public methods
    PageBtns(name, ulId, maxPagesPerGroup, totalPages, currentP) {
        this.name = name;
        this.ulId = ulId;
        this.maxPagesPerGroup = maxPagesPerGroup;
        this.totalPages = totalPages;
        if (this.totalPages === 0) {
            this.hideBtns();
        }
        this.currentP = currentP;
        this.initPrevNextBtns();
    }

    add(pages) {    //pages MUST be a quantity >= 1
        var start = this.totalPages + 1;
        var end = this.totalPages + pages;
        if (this.totalPages === 0) {
            this.showBtns();
            this.totalPages = end;
            this.addPageBtnsHtml(start, end);
        } else if (Math.ceil(this.totalPages / this.maxPagesPerGroup) === Math.ceil((this.currentP + 1) / this.maxPagesPerGroup) && this.totalPages % this.maxPagesPerGroup !== 0) {
            //se pages finisce in un altro gruppo
            if (Math.ceil(this.totalPages / this.maxPagesPerGroup) !== Math.ceil(end / this.maxPagesPerGroup)) {
                //completiamo il nostro gruppo
                end = Math.ceil(this.totalPages / this.maxPagesPerGroup) * this.maxPagesPerGroup;
                this.addPageBtnsHtml(start, end);
                this.totalPages = this.totalPages + pages;
            } else {
                //guardiamo quanto abbiamo da completare e completiamo
                this.addPageBtnsHtml(start, end);
                this.totalPages = end;
            }
        } else {
            this.totalPages = this.totalPages + pages;
        }

        return this.totalPages;
    }

    reduceTo(pages) {    //RULES at time of call: pages < this.totalPages && pages >= 0 && this.totalPages >= 1

        if (pages === 0) {
            this.currentP = 0;
            this.emptyPageBtnsHtml;
            this.hideBtns;
            this.totalPages = pages;
        } else if (Math.ceil((this.currentP + 1) / this.maxPagesPerGroup) < Math.ceil(pages / this.maxPagesPerGroup)) {
            this.totalPages = pages;
        } else if (Math.ceil((this.currentP + 1) / this.maxPagesPerGroup) === Math.ceil(pages / this.maxPagesPerGroup)) {
            var pagesMod = betterMod(pages, this.maxPagesPerGroup);
            var pagesModOld = betterMod(this.totalPages, this.maxPagesPerGroup);
            if (Math.ceil(this.totalPages / this.maxPagesPerGroup) > Math.ceil(pages / this.maxPagesPerGroup)) {
                if (pagesMod !== this.maxPagesPerGroup) {
                    this.removePageBtnsHtml(this.maxPagesPerGroup - pagesMod);
                }
            } else {
                this.removePageBtnsHtml(pagesModOld - pagesMod);
            }
            this.totalPages = pages;
            if (this.currentP + 1 > pages) {
                this.currentP = pages - 1;
            }
        } else {
            this.emptyPageBtnsHtml()
            this.totalPages = pages;
            this.currentP = pages - 1;
            this.loadPageBtnsHtml(Math.ceil(this.totalPages / this.maxPagesPerGroup));
        }

        return { total: this.totalPages, current: this.currentP };
    }

    changePage(page, html) {    //RULES page e' un indice che parte da 0
        this.currentP = page;
        $(this.ulId + ' .active').removeClass('active');
        html.classList.add('active');
        return this.currentP;
    }

    prevPage() {    //RULES at time of call: this.totalPages >= 1

        //se siamo nel primo gruppo
        if (Math.ceil((this.currentP + 1) / this.maxPagesPerGroup) === 1) {
            //se non siamo nella prima pagina del gruppo
            if (this.currentP !== 0) {
                //ci spostiamo di uno a sinistra
                this.currentP = this.currentP - 1;
            }
        } else {
            //se siamo nella prima pagina del gruppo
            if ((this.currentP + 1) % this.maxPagesPerGroup === 1) {
                //ci spostiamo di gruppo
                this.emptyPageBtnsHtml();
                this.loadPageBtnsHtml(Math.ceil((this.currentP + 1) / this.maxPagesPerGroup) - 1);
                this.currentP = this.currentP - 1;
            } else {
                //ci spostiamo di uno a sinistra
                this.currentP = this.currentP - 1;
            }
        }

        return this.currentP;
    }

    nextPage() {    //RULES at time of call: this.totalPages >= 1

        //se siamo nell'ultimo gruppo
        if (Math.ceil((this.currentP + 1) / this.maxPagesPerGroup) === Math.ceil(this.totalPages / this.maxPagesPerGroup)) {
            //se non siamo nell'ultima pagina del gruppo
            if ((this.currentP + 1) !== this.totalPages) {
                //go to next page
                this.currentP = this.currentP + 1;
            }
        } else {
            //se siamo nell'ultima pagina del gruppo
            if ((this.currentP + 1) % this.maxPagesPerGroup === 0) {
                //cambiamo gruppo
                this.emptyPageBtnsHtml();
                this.loadPageBtnsHtml(Math.ceil((this.currentP + 1) / this.maxPagesPerGroup) + 1);
                this.currentP = this.currentP + 1;
            } else {
                //go to next page
                this.currentP = this.currentP + 1;
            }
        }

        return this.currentP;
    }

    getName() {
        return this.name;
    }

    getCurrent() {
        return this.currentP;
    }

    getTotal() {
        return this.totalPages;
    }

    //private methods
    //html
    emptyPageBtnsHtml() {
        this.removePageBtnsHtml(this.maxPagesPerGroup);
    }

    addPageBtnsHtml(start, end) {   //start e end sono indici che cominciano da 1; start e end sono inclusi
        var ul = document.getElementById($(this.ulId)[0].id);
        for (let i = start; i <= end; i++) {
            var newLi = `
                    <li class="page-item">
                        <a class="page-link" onclick="${this.name}.changePage(${i}, this)" aria-label="Previous">
                            <span aria-hidden="true">${i}</span>
                        </a>
                    </li>`
            ul.insertBefore(newLi, ul.lastElementChild);
        }
    }

    loadPageBtnsHtml(group) {   //group is an index starting from 1; group MUST be >= 1
        var ul = document.getElementById($(this.ulId)[0].id);
        var start = (group - 1 * this.maxPagesPerGroup) + 1;
        var end = group * this.maxPagesPerGroup;

        if (group === Math.ceil(this.totalPages / this.maxPagesPerGroup) && this.totalPages % this.maxPagesPerGroup !== 0) {
            end = start + this.totalPages % this.maxPagesPerGroup;
        }

        this.addPageBtnsHtml(start, end);
    }

    removePageBtnsHtml(q) {   //remove q pages from the bar starting from the right; q MUST be >= 1
        q = ($(this.ulId)[0].children.length - 2) - q;
        for (let i = $(this.ulId)[0].children.length - 2; i > max(0, q); i--) {
            $(this.ulId)[0].children[i].remove();
        }
    }

    initPrevNextBtns() {
        $(this.ulId)[0].children[0].addEventListener("click", `${this.name}.prevPage()`);
        $(this.ulId)[0].children[($(this.ulId)[0].children.length) - 1].addEventListener("click", `${this.name}.nextPage()`);
    }

    hideBtns() {
        $(this.ulId)[0].parentNode.style.display = 'none';
    }

    showBtns() {
        $(this.ulId)[0].parentNode.style.display = 'flex';
    }
}

class RentalsList {
    //private params
    maxRpP; //maximum amount of rentals shown at a time in the current page; at least 1
    name;   //exact name of object, used for onclicks
    edited;
    ulId;   //id (with # at start) of the ul that will be containing the RentalsList
    pagination;
    //private methods


    //public params
    rentals;    //array of arrays each of .length = maxRpP;

    //public methods
    RentalsList(rentals, name, maxRpP, ulId, pageBtnsUlId, maxPagesPerGroup) {
        this.maxRpP = maxRpP;
        this.rentals = [];
        this.name = name;
        this.ulId = ulId;
        this.add(rentals);  //fill the rentals
        this.pagination = new PageBtns(name, pageBtnsUlId, maxPagesPerGroup, this.rentals.length, 0);
    }

    add(rentals, originalPages) {   //receives an array of rentals and the original number of pages before adding more, needed to call pagination add only once
        if (rentals.length > 0) {
            var lastRental = rentals.pop();
            if (this.rentals.length === 0 || this.rentals[this.rentals.length - 1].length === this.maxRpP) {
                if (this.rentals.length === 0) {
                    this.addRentalHtml(lastRental);
                }
                this.rentals.push([lastRental]);
            } else {
                if (this.pagination.currentP === (this.rentals.length - 1)) {
                    this.addRentalHtml(lastRental);
                }
                this.rentals[this.rentals.length - 1].push(lastRental);
            }
            this.add(rentals, originalPages);
        } else if (this.rentals.length - originalPages > 0) {
            this.pagination.add(this.rentals.length - originalPages);
        }
    }

    changePage(page, pageBtnHtml) {  //RULES page e' un indice che parte da 1
        var processedPage = this.pagination.changePage(parseInt(page) - 1, pageBtnHtml);
        this.emptyRentalsTabsHtml();
        this.loadRentalsTabHtml(processedPage);
    }

    nextPage() {
        var oldPage = this.pagination.getCurrent();
        var newPage = this.pagination.nextPage();
        if (oldPage !== newPage) {
            this.emptyRentalsTabsHtml();
            this.loadRentalsTabHtml(newPage);
        }
    }

    prevPage() {
        var oldPage = this.pagination.getCurrent();
        var newPage = this.pagination.prevPage();
        if (oldPage !== newPage) {
            this.emptyRentalsTabsHtml();
            this.loadRentalsTabHtml(newPage);
        }
    }

    saveEdited() {
        if (this.edited._id) {  //se edited e' un nuovo rental o no
            //DA FARE Chiamata ajax e mettere le next lines nella success
            var editedIndex = this.rentals[this.currentP].findIndex((r) => { return (r._id === this.edited._id) });
            this.rentals[this.currentP][editedIndex] = this.edited._id;
        } else {
            //DA FARE Chiamata ajax e mettere la next line nella success
            this.add([this.edited], this.rentals.length);
        }
        this.resetEdited();
    }

    resetEdited() {
        this.edited = {
            customer_id: '',
            simpleHWman_id: '',
            products: [],
            dateStart: '',
            dateEnd: '',
            neverApproved: false,
            rejected: false,
            price: {
                base: 0,
                fidelity: 0,
                modifiers: []
            },
            notes: [],
            neverShowedUp: false,
            unPaid: false,
            damagedProduct: false
        }
    }

    getTotal() {
        return this.rentals.length;
    }

    //html
    addRentalHtml(rental) {
        $(this.ulId).append(`
            <li class="row m-2 nolonoloBackgroundProductListing align-items-center">
                <div class="col-4">
                    <div class="container m-0 p-0" style="width:100px; height:100px">
                        <img src="/api/imgs/${rental.products[0].listing.products[rental.products[0].product].imgs[0]}" style="width:100%; height:100%; object-fit:cover">
                    </div>
                </div>
                <div class="col">
                    <div class="row">
                        <div class="col clientNameCol">
                            <p class="clientName">${rental.customer.username}</p>
                        </div>
                        <div class="col priceCol">
                            <p class="price">${rental.price}</p>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col startDateCol">
                            <p class="startDate">${rental.dateStart}</p>
                        </div>
                        <div class="col endDateCol">
                            <p class="endDate">${rental.dateStart}</p>
                        </div>
                    </div>
                </div>
            </li>`)
    }

    emptyRentalsTabsHtml() {
        $(this.ulId).html('');
    }

    loadRentalsTabHtml(page) {
        for (let i = 0; i < this.rentals[page].length; i++) {
            const r = this.rentals[page][i];
            this.addRentalHtml(r);
        }
    }

}

class LimboRentalsList extends RentalsList {

    //public methods
    LimboRentalsList(rentals, name, maxRpP, ulId, pageBtnsUlId, maxPagesPerGroup) {
        this.maxRpP = maxRpP;
        this.rentals = [];
        this.name = name;
        this.ulId = ulId;
        this.readyList();
        this.add(rentals);  //fill the rentals
        this.pagination = new PageBtns(name, pageBtnsUlId, maxPagesPerGroup, this.rentals.length, 0);
    }

    saveEdited() {  //DA FARE cioe' rifare per quando ci sara' l'edited rental

        //DA FARE Chiamata ajax e mettere le next lines nella success
        var editedIndex = this.rentals[this.currentP].findIndex((r) => { return (r._id === this.edited._id) });
        this.rentals[this.currentP][editedIndex] = this.edited;

        this.resetEdited();
    }

    respond(id, accept) {
        var cPage = this.pagination.getCurrent();   //ci segnamo l'attuale pagina

        var respondedToIndex = this.rentals[cPage].findIndex((r) => { return (r._id === id) }); //prendiamo l'index del rental al quale stiamo rispondendo
        this.rentals[cPage][respondedToIndex].rejected = !accept;
        this.rentals[cPage][respondedToIndex].simpleHWman_id = employee;
        //Chiamata ajax per dire che abbiamo risposto, server side gia' si occupa del rental e ci risponde con il rental processato

        //success
        this.removeRespondedRental(cPage, respondedToIndex);
        if (this.rentals.length === 0 || this.rentals[0].length === 0) {
            this.showEmptyMsg();
        }
        rentalTabObj.add([response]);

        //error
        console.log('rental remained into pending queue as if nothing happened')
        this.rentals[cPage][respondedToIndex].rejected = false;
        this.rentals[cPage][respondedToIndex].simpleHWman_id = '';
    }

    //private methods
    removeRespondedRental(page, rentalIndex) {

        if ((this.rentals.length - 1) === page) {
            this.rentals[page].splice(rentalIndex, 1);
            if (this.pagination.getCurrent() === page) {
                //rimuoviamo l'html del rental
                $(this.ulId)[0].children[rentalIndex].remove();
                if (this.rentals[page].length === 0 && page > 0) {
                    //carichiamo i rental della pagina precedente
                    this.loadRentalsTabHtml(page - 1);
                }
            }
            if (this.pagination.totalPages() > this.rentals.length) {
                this.pagination.reduceTo(page + 1);
            }
        } else {
            //rimuoviamo il rental dal javascript
            this.rentals[page].splice(rentalIndex, 1);
            //pushamo il primo rental della prossima pagina in questa pagina
            this.rentals[page].push(this.rentals[page + 1][0]);

            if (this.pagination.getCurrent() === page) {
                //rimuoviamo l'html del rental
                $(this.ulId)[0].children[rentalIndex].remove();
                //carichiamo l'html dell'ultimo rental di questa pagina (precedentemente era il primo della prossima but not anymore) in fondo alla lista
                this.addRentalHtml(this.rentals[page][this.rentals[page].length - 1])
            }
            removeRespondedRental(page + 1, 0);
        }
    }

    readyList() {    //removes the placeholder if present
        if ($('#pendingRentalsPlaceholder').length !== 0) {
            $('#pendingRentalsPlaceholder')[0].remove();
        }
    }

    showEmptyMsg() {    //shows placeholder if there are no pending rentals
        $('#pendingRentalsList').append(
            `<li class="list-item" id="pendingRentalsPlaceholder">
                    There are no pending rentals currently
                </li>`);
    }

    addRentalHtml(rental) {
        $(this.ulId).append(`
            <li class="row m-2 nolonoloBackgroundProductListing align-items-center">
                <div class="col-4">
                    <div class="container m-0 p-0" style="width:100px; height:100px">
                        <img src="/api/imgs/${rental.products[0].listing.products[rental.products[0].product].imgs[0]}" style="width:100%; height:100%; object-fit:cover">
                    </div>
                </div>
                <div class="col">
                    <div class="row">
                        <div class="col clientNameCol">
                            <p class="clientName">${rental.customer.username}</p>
                        </div>
                        <div class="col priceCol">
                            <p class="price">${rental.price}</p>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col startDateCol">
                            <p class="startDate">${rental.dateStart}</p>
                        </div>
                        <div class="col endDateCol">
                            <p class="endDate">${rental.dateStart}</p>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col acceptButtonCol">
                            <button>Accept</button>
                        </div>
                        <div class="col rejectButtonCol">
                            <button onclick="${this.name}.reject">Reject</button>
                        </div>
                    </div>
                </div>
            </li>`)
    }
}

class RentalEditor {
    //private params

    //public params

    //public methods

    //private methods

    //html
}

class ListingViewer {
    //private params
    isShown;
    listing;    //contains the listing to be showed when viewer is opened
    productIndex;

    //public params

    //public methods
    ListingViewer() {
        isShown = false;

    }   //empty constructor

    initialize(listing, productIndex) {    //call to load a new listing into the listing viewer
        this.listing = listing;
        this.productIndex = productIndex;
        if (this.listing) {
            this.loadListing();
        }
    }

    show() {
        this.isShown = true;
        this.showAllHtml();
        return this.isShown;
    }

    hide() {
        this.isShown = false;
        this.hideAllHtml();
        return this.isShown;
    }

    isShown() {
        return this.isShown;
    }

    selectProduct(index) {
        index = parseInt(index);
        if (this.productIndex !== index) {
            this.productIndex = index;
            this.loadListing();
        }

        return this.productIndex;
    }

    //private methods
    loadListing() {
        this.loadCentralInfo();
        this.loadImgCarousel();
        this.loadProductPicker();
        this.loadPrice();
    }

    //html
    loadCentralInfo() {
        $('#listing-title').text(this.listing.name);
        $('#listing-description').text(this.listing.description);
        $('#listing-type').text(this.listing.type);
        $('#listing-brand').text(this.listing.brand);
        $('#listing-condition').text(this.listing.products[this.productIndex].condition);
        $('#listing-disabled-notice')[0].style.display = this.listing.disabled ? 'flex' : 'none';
        $('#product-disabled-notice')[0].style.display = this.listing.products[this.productIndex].disabled ? 'flex' : 'none';
        this.loadDatePicker();
    }

    loadDatePicker() {
        //azzera date picker

        //se prodotto disabled

        //setta display none
        //else

        //start loading animation
        //chiamata al server inviando listing id e productIndex per ricevere: con quel listing e product i rental attualmente attivi e futuri come array range di date
        //success

        //finish loading animation
        //prendiamo il range di date ricevute e ci aggiungiamo quelle della manutenzione
        //le impostiamo come disabled nel date picker
        //error

        //finish loading animation
        //informazione che qualcosa e' andato storto
    }

    loadImgCarousel() {
        var carousel = this.getCarouselFrom(this.listing.products[this.productIndex]);
        $('#carouselBtns').html(carousel.carouselBtn);
        $('#carouselImgs').html(carousel.carouselInner);
    }

    loadProductPicker() {
        $("#products-ul").html('');
        for (let i = 0; i < this.listing.products.length; i++) {
            const prod = this.listing.products[i];
            $("#products-ul").append(`<li class="list-group-item nolonoloHandHover" onclick="listingViewer.selectProduct('${i}')">
                <img src="/api/imgs/${prod.imgs[0]}" style="width:100px; height: 100px; object-fit: cover">
            </li>`);
        }
    }

    loadPrice() {
        var mods = this.listing.products[this.productIndex].price.modifiers;
        if (mods.length > 0) {
            var firstMod = this.renderReadableMod(mods[0]);
            $('#modifiersViewer').html(`
                <div class="row justify-content-center mt-3">
                    <div class="col d-flex justify-content-center">
                        ${mods[0].reason}
                    </div>
                    <div class="col d-flex justify-content-center">
                        ${firstMod.sANDq}
                    </div>
                    <div class="col d-flex justify-content-center">
                        ${firstMod.on}
                    </div>
                </div>`
            );

            for (let i = 1; i < mods.length; i++) {
                var mod = this.renderReadableMod(mods[i]);
                $('#modifiersViewer').append(`
                    <div class="row justify-content-center">
                        <div class="col d-flex justify-content-center">
                            ${mods[i].reason}
                        </div>
                        <div class="col d-flex justify-content-center">
                            ${mod.sANDq}
                        </div>
                        <div class="col d-flex justify-content-center">
                            ${mod.on}
                        </div>
                    </div>`
                );
            }

        } else {
            $('#modifiersViewer').html('');
        }
    }

    getCarouselFrom(prod) {
        var carouselBtn = '<button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" class="active" aria-current="true" aria-label="Slide 1"></button>';
        var carouselInner = `
        <div class="carousel-item active">
            <img src="/api/imgs/${prod.imgs[0]}" class="d-block m-auto y-auto" alt="..." style="width: 300px; height: 300px; object-fit: cover;">
        </div>`
        for (let i = 1; i < prod.imgs.length; i++) {
            carouselInner = carouselInner + `
        <div class="carousel-item">
            <img src="/api/imgs/${prod.imgs[i]}" class="d-block m-auto" alt="..." style="width: 300px; height: 300px; object-fit: cover;">
        </div>`
            carouselBtn = carouselBtn + `<button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="${i}" aria-label="Slide ${i + 1}"></button>`
        }
        return { carouselBtn, carouselInner };
    }

    renderReadableMod(mod) {
        var sANDq = '', on = '';

        sANDq = mod.sign[0] + mod.quantity + (mod.sign.length > 1 ? mod.sign[1] : (mod.sign === '/' || mod.sign === '*' ? '' : '$'));

        switch (mod.apply) {
            case 'daily':
                on = 'per day';
                break;
            case 'onHoly':
                on = 'on holidays';
                break;
            case 'onWeekend':
                on = 'on weekends';
                break;
            case 'onTotal':
                on = 'on the total'
                break;
            default:
                on = '';
                console.log('modifier ' + this.listing.products[this.productIndex].price.modifiers.indexOf(mod) + ' with reason "' + mod.reason + '" of product ' + this.productIndex + ' of listingid ' + this.listing._id + ' HAS NO APPLY');
                break;
        }
        return ({ sANDq: sANDq, on: on });
    }

    showAllHtml() {
        if ($('#listingContent')[0].style.display === 'none' || $('#listingContent')[0].style.display === 'none !important') {
            $('#listingContent')[0].style.display = 'flex';
        }
        $('#listingContent').show();
    }

    hideAllHtml() {
        $('#listingContent').hide();
    }
}

class RentalTab {
    //private params
    //private methods


    //public params
    accepted;
    ongoing;
    past;
    limbo;
    //public methods

    RentalTab() { ; }   //empty constructor

    initialize(allRentals) {
        this.accepted = new RentalsList([], 'accepted', 5, '#bookedRentalsList', '#bookedRPageBtns', 5);
        this.ongoing = new RentalsList([], 'ongoing', 5, '#activeRentalsList', '#activeRPageBtns', 5);
        this.past = new RentalsList([], 'past', 5, '#closedRentalsList', '#closedRPageBtns', 5);
        this.limbo = new LimboRentalsList([], 'limbo', 5, '#pendingRentalsList', '#pendingRPageBtns', 5);
        this.add(allRentals);
    }

    add(rentals) {   //receives an array
        var accR = [], ongR = [], pasR = [], limR = [];

        for (let i = 0; i < rentals.length; i++) {  //divide into different arrays to send to each Rental Tab
            const rental = rentals[i];
            if (!rental.simpleHWman_id || rental.simpleHWman_id === '' || typeof rental.simpleHWman_id === 'undefined' || rental.simpleHWman_id === null || rental.simpleHWman_id === '0') {   //DA FARE CHECK IF SERVER ANSWERS WITH EMPTY LIKE THIS
                limR.push(rentals[i]);
            } else if (rental.dateStart > new Date()) {
                accR.push(rentals[i]);
            } else if (rental.dateEnd < new Date()) {
                pasR.push(rentals[i]);
            } else {
                ongR.push(rentals[i]);
            }
        }

        //add to each individual Rental Tab
        if (accR.length > 0) {
            this.accepted.add(accR, this.accepted.getTotal());
        }
        if (ongR.length > 0) {
            this.ongoing.add(ongR, this.ongoing.getTotal());
        }
        if (pasR.length > 0) {
            this.past.add(pasR, this.past.getTotal());
        }
        if (limR.length > 0) {
            this.limbo.add(limR, this.limbo.getTotal());
        }
    }

    //html

}

class ListingsManager {

    /// - Private Params

    listings;           //listings as we got them from the server, you can add listings, change listings, disable listings
    lpP;                //lpP is an array made of arrays of length maxLpP or less, each listing contains:
    /*
    {
        l: listing,
        prod: 0         //index of cheapest product of l that the filters will allow
    }
    */
    filters;            //current filters
    isShown;            //not actually used but kept there for good mesure, helps at hiding the structure it's in when the page is changed
    maxLpP;             //max listings per one page, at least 1
    pagination;         //object that displays the pages buttons and manages them


    /// - Public Methods

    ListingsManager(maxLpP) {  //called to initialize
        this.maxLpP = maxLpP;
        this.isShown = false;
        this.listings = [];
        this.lpP = [];
        this.filters = this.current = {
            minPrice: null,
            maxPrice: null,
            brand: null,
            type: null,
            onlyAvailable: false
        };
        this.pagination = new PageBtns('listingsObj', 'listingsPages', 5, 0, 0);
    }

    add(listings) {  //adds listings to the currently loaded ones, then filters them and paginates them
        if (listings.length > 0) {
            this.listings.push({ l: listings.pop(), prod: 0 });
        } else {
            this.paginate(this.filter(this.listings, 0, []), 0, this.lpP.length);
        }
    }

    setFilters() {   //sets the filters specified by the user
        //first we get the values
        this.filters = this.current = {
            minPrice: $('#minPrice')[0].value,
            maxPrice: $('#maxPrice')[0].value,
            brand: $('#brandSelect')[0].value,
            type: $('#typeSelect')[0].value,
            onlyAvailable: $('#filterAvail')[0].checked
        };
        //then we make them digestable for the functions in ListingsManager
        this.filter.minPrice = this.filter.minPrice === '' || !this.filter.minPrice ? null : this.filter.minPrice;
        this.filter.maxPrice = this.filter.maxPrice === '' || !this.filter.maxPrice ? null : this.filter.maxPrice;
        this.filter.brand = this.filter.brand === '' || !this.filter.brand ? null : this.filter.brand;
        this.filter.type = this.filter.type === '' || !this.filter.type ? null : this.filter.type;

        //lastly we call refilter which reapplies the filters and repaginates
        this.refilter();
    }

    refilter() {    //applies the filters again and paginates again
        //first we reset the listings per page and pagination
        this.resetLpP();

        //then we filter and paginate all the listings
        this.paginate(this.filter(this.listings, 0, []), 0, this.lpP.length);
    }

    /// - Private Methods

    lowestInRange(prices, min, max) {    //prices is an array of base prices mapped from the corresponding products array, min and max are the currently applied filters
        var c = null;

        for (let i = 0; i < prices.length; i++) {
            const p = prices[i];
            if ((max !== -1 && p >= min && p <= max) || (max === -1 && p >= min)) {
                if (!c || prices[c] > p) {
                    c = i;
                }
            }
        }
        return c;
    }

    paginate(listings, i, originalPages) {  //paginates the listings at the end of the currently paginated ones
        if (i < listings.length) {
            var listing = listings[i];
            if (this.lpP.length === 0 || this.lpP[this.lpP.length - 1].length === this.maxLpP) {
                if (this.lpP.length === 0) {
                    this.addListingHtml(listing);
                }
                this.lpP.push([listing]);
            } else {
                if (this.pagination.currentP === (this.lpP.length - 1)) {
                    this.addListingHtml(listing);
                }
                this.lpP[this.lpP.length - 1].push(listing);
            }
            this.paginate(listings, i + 1, originalPages);
        } else if (this.lpP.length - originalPages > 0) {
            this.pagination.add(this.lpP.length - originalPages);
        }
    }

    filter(listings, i, filtered) {   //filters an array of listings, i starts from 0, filtered starts from [], returns filtered

        if (i < listings.length) {
            var listing = listings[i];

            //filtering by availability
            if (listing && this.filters.onlyAvailable && listing.l.disabled) {
                return this.filter(listings, i + 1, filtered);
            }

            //filtering by brand
            if (this.filters.brand && this.filters.brand !== listing.l.brand) {
                return this.filter(listings, i + 1, filtered);
            }

            //filtering by type
            if (this.filters.type && this.filters.type !== listing.l.type) {
                return this.filter(listings, i + 1, filtered);
            }

            //filtering by price and setting the lowest priced product index
            var min = 0, max = -1;
            if (this.filters.minPrice) {
                min = (this.filters.minPrice).parseInt();
            }
            if (this.filters.maxPrice) {
                max = (this.filters.maxPrice).parseInt();
            }
            listing.prod = this.lowestInRange(listing.l.products.map((prod) => { return prod.price.base; }), min, max);
            if (listing.prod) {
                filtered.push(listing);
            } else {
                listing.prod = 0;
            }
            return this.filter(listings, i + 1, filtered);
        } else {
            return filtered;
        }
    }

    resetLpP(){
        this.lpP = [];
        this.pagination.reduceTo(0);
    }





















    //Constructor
    ListingsManager() {
        this.isShown = false;
    }

    initialize(listings) {
        this.listings = listings;
        for (let i = 0; i < listings.length; i++) {
            this.filteredListings.push({ l: listings[i], prodI: 0 });
        }
        this.pageGroupMax = 5;
        this.lpPCount = 14;
        this.generateLpP();
        this.filtersObj = new Filters({
            minPrice: 0,
            maxPrice: 0,
            type: '',
            avail: false,
            brand: ''
        })
        if (this.listingsPerPage.length === 0 || this.listingsPerPage[0].length === 0) {
            this.showNoListingsMessage();
        }
    }

    //utility
    static dupListing(listing) {
        var dup = {
            disabled: listing.disabled,
            name: listing.name,
            description: listing.description,
            type: listing.type,
            brand: listing.brand,
            company: listing.company,
            products: []
        }
        for (let i = 0; i < listing.products.length; i++) {
            var product = {
                imgs: [],
                price: {
                    base: listing.products[i].price.base,
                    modifiers: [],
                    fidelity: listing.products[i].price.fidelity
                },
                condition: listing.products[i].price.condition,
                disabled: listing.products[i].price.disabled,
                maintenance: listing.products[i].price.maintenance
            }
            for (let j = 0; j < listing.products[i].imgs.length; j++) {
                product.imgs.push(listing.products[i].imgs[j]);
            }
            for (let j = 0; j < listing.products[i].price.modifiers.length; j++) {
                var modifier = {
                    reason: listing.products[i].price.modifiers[j].reason,
                    sign: listing.products[i].price.modifiers[j].sign,
                    quantity: listing.products[i].price.modifiers[j].quantity,
                    apply: listing.products[i].price.modifiers[j].apply
                }
                product.price.modifiers.push(modifier);
            }
            dup.products.push(product);
        }
        return dup;
    }

    loglPP(lPP) {
        for (let i = 0; i < lPP.length; i++) {
            for (let j = 0; j < lPP[i].length; j++) {
                const prods = lPP[i][j].l.products;
                const chose = lPP[i][j].prodI;
                console.log('\tper listing');
                console.log('chose   ' + prods[chose].price.base);
                var outof = 'outof   ';
                for (let i = 0; i < prods.length; i++) {
                    const prod = prods[i];
                    var outof = outof + prod.price.base + '   ';
                }
                console.log(outof);
            }
        }
    }

    resetFilteredListings() {
        this.filteredListings = [];
        for (let i = 0; i < this.listings.length; i++) {
            this.filteredListings.push({ l: this.listings[i], prodI: 0 });
        }
    }

    show() {
        this.showAllHtml();
        this.isShown = true;
        filters.show();
        return this.isShown;
    }

    hide() {
        this.hideAllHtml();
        this.isShown = false;
        filters.hide();
        return this.isShown;
    }

    //pagination
    generateLpP() {
        this.listingsPerPage = new Array(Math.ceil(this.filteredListings.length / this.lpPCount));
        for (let i = 0; i < this.listingsPerPage.length; i++) {
            for (let j = i * this.lpPCount; j <= (((i + 1) * this.lpPCount) - 1); j++) {
                if (typeof this.listingsPerPage[i] === 'undefined') {
                    this.listingsPerPage[i] = [];
                }
                if (typeof this.filteredListings[j] !== 'undefined') {
                    this.listingsPerPage[i].push(this.filteredListings[j]);
                }
            }
        }
    }

    changePage(page, caller) {
        page = parseInt(page);
        if (page > this.listingsPerPage.length || page < 1) {
            return console.log('asked for a non existing page')
        }
        this.currentPage = page;

        //azzerare i listing correnti
        $('#listingsContainer').html('');
        //caricare i listing di una pagina
        this.listingsPerPage[this.currentPage - 1].map(value => this.htmlSetListing(value));

        $('#pageTabs .page-item.active').removeClass('active');
        caller.parentNode.classList.add('active');
    }

    prevPage() {
        if (this.currentPage === 1) return;
        this.currentPage = this.currentPage - 1;

        //azzerare i listing correnti
        $('#listingsContainer').html('');
        //caricare i listing di una pagina
        this.listingsPerPage[this.currentPage - 1].map(value => this.htmlSetListing(value));

        //caricare i button delle pagine
        this.htmlSetPageBtns();
    }

    nextPage() {
        if (this.currentPage === this.listingsPerPage.length) return;
        this.currentPage = this.currentPage + 1;

        //azzerare i listing correnti
        $('#listingsContainer').html('');
        //caricare i listing di una pagina
        this.listingsPerPage[this.currentPage - 1].map(value => this.htmlSetListing(value));

        //caricare i button delle pagine
        this.htmlSetPageBtns();
    }

    set() {  //gets the filters from the html page
    }

    search(word, listings) {   //applies a search on the currently filtered listings

    }

    cheapestProd(listing) {  //returns the index of the cheapest product from a listing based on the current filters
    }

    //HTML
    correctMinPrice(minHtml) {
        if (minHtml.value && minHtml.value < 0) {
            minHtml.value = 0;
        }
        var min = parseInt(minHtml.value);
        if ($('#maxPrice')[0].value) {
            var max = parseInt($('#maxPrice')[0].value)
            if (min > max) {
                minHtml.value = max;
            }
        }
    }
    correctMaxPrice(maxHtml) {
        if (maxHtml.value && maxHtml.value < 0) {
            maxHtml.value = 0;
        }
        var max = parseInt(maxHtml.value);
        if ($('#minPrice')[0].value) {
            var min = parseInt($('#minPrice')[0].value)
            if (max < min) {
                maxHtml.value = min;
            }
        }
    }
    loadBrandsHtml() {

    }
    loadTypesHtml() {

    }

    /// --- HTML
    async htmlFilter() {
        this.resetFilteredListings();
        var htmlFilters = new FormData(document.getElementById('filterForm'));
        var filters = {
            minPrice: parseInt(htmlFilters.get('minPrice')),
            maxPrice: parseInt(htmlFilters.get('maxPrice')),
            type: htmlFilters.get('filterType'),
            brand: htmlFilters.get('filterBrand'),
            avail: document.getElementById('filterAvail').checked,
        }
        filters.minPrice = filters.minPrice && filters.minPrice !== NaN ? filters.minPrice : -1;
        filters.maxPrice = filters.maxPrice && filters.maxPrice !== NaN ? filters.maxPrice : -1;
        filters.type = (filters.type === 'any') ? '' : filters.type;
        filters.brand = (filters.brand === 'any') ? '' : filters.brand;
        this.filteredListings = this.filtersObj.filterAll(filters, this.filteredListings);
        this.generateLpP(this.filteredListings);
        this.htmlSetPages();
    }

    htmlSetPages() {
        $('#returnToStore').hide();

        this.currentPage = 1;
        //azzerare i listing correnti
        $('#listingsContainer').html('');
        //caricare i listing di una pagina\
        if (this.listingsPerPage.length > 0) {
            this.listingsPerPage[0].map(listingsOfPage0 => this.htmlSetListing(listingsOfPage0));
        }

        //caricare i button delle pagine
        this.htmlSetPageBtns();
    }

    htmlSetListing(listing) {
        var htmlListing =
            `<li class="card list-group-item p-0" id="listing-${listing.l._id}">
                <div class="container p-0 m-0" style="height: 65%;display:inline-block;position:relative">
                ${listing.l.disabled ? `<div class="bg-secondary isDisabled nolonoloFullWidth disabledBadge" style=";height:10%;">DISABLED</div>` : ''}
                    <img src="/api/imgs/${listing.l.products[listing.prodI].imgs[0]}" alt="Product Img" style="width:100%">

                </div>
                <div class="flex-column d-flex">
                        <p class="listingName nolonoloBoldText">${listing.l.name}</p>
                        <p class="price">${listing.l.products[listing.prodI].price.base}</p>                
                        <button onclick="openListing('${listing.l._id}','${listing.prodI}')">Open Listing</button>
                </div>
            </li>`
        $('#listingsContainer').append(htmlListing);
    }

    //returns the buttons to display at the bottom in order to navigate the pages
    htmlSetPageBtns() { //pageGroupMax is the number of buttons that need to be shown per group
        this.htmlResetPageBtns();
        if (this.pageGroupMax < 1) return console.log('pageGroupMax not acceptable if below 1, was ' + this.pageGroupMax);
        if (this.listingsPerPage.length < 1) return;
        //the buttons we will return
        var htmlBtns = ``
        //which group of buttons we must return
        var pageGroup = Math.ceil((this.currentPage) / this.pageGroupMax);
        //how many buttons should be added to the group, in case of being in the last group which might not have pageGroupMax amount of pages
        var lastForGroup = Math.ceil(this.listingsPerPage.length / this.pageGroupMax) > pageGroup ? this.pageGroupMax * pageGroup : this.listingsPerPage.length;
        for (let i = ((pageGroup - 1) * this.pageGroupMax) + 1; i <= lastForGroup; i++) {
            $('#nextPageBtn').before(`<li class="page-item ${this.currentPage === i ? 'active' : ''}">
                                    <a class="page-link" onclick="listingsObj.changePage('${i}', this)">${i}</a>
                                   </li>`);
        }
    }

    htmlResetPageBtns() {
        var buttonsToDelete = $("#pageTabs")[0].children;
        for (let i = buttonsToDelete.length - 2; i > 0; i--) {
            buttonsToDelete[i].remove();
        }
    }

    hideAllHtml() {
        $('#listingsList').hide();
        this.hideNoListingsMessage();
    }

    showAllHtml() {
        if (this.listingsPerPage.length === 0 || this.listingsPerPage[0].length === 0) {
            this.showNoListingsMessage();
        } else {
            if ($('#listingsList')[0].style.display === 'none' || $('#listingsList')[0].style.display === 'none !important') {
                $('#listingsList')[0].style.display = 'block';
            }
            $('#listingsList').show();
        }
    }

    showNoListingsMessage() {
        if ($('#noListings')[0].style.display === 'none' || $('#noListings')[0].style.display === 'none !important') {
            $('#noListings')[0].style.display = 'flex';
        }
        $('#noListings').show();
    }

    hideNoListingsMessage() {
        $('#noListings').hide();
    }
}

class ListingEditor {

}

class PageMaster {

    /// -- Private Params
    employee;
    siteNavigation;

    /// -- Public Methods

    PageMaster() {
        this.employee = null;
        this.siteNavigation = {
            listingsTab: [],
            clientsTab: [],
            rentalsTab: [],
            profileTab: [],
        };
    }

    register() {

        $.ajax({
            url: '/api/employee/reg',
            type: 'POST',
            data: $('#regForm').serialize(),
            success: function (answer) {
                answer = handle(answer);
                if (answer) {
                    if (answer.command) {
                        if (answer.msg === 'usernameAlreadyInUse') {
                            alert('This username is already in use');
                        } else if (answer.msg === 'alreadyLogged') {
                            alert('You need to log out in order to register')
                        } else if (answer.msg === 'banned') {
                            alert('This customer account is banned')
                            window.location.href = "../customer/";
                        }
                    } else if (answer === 'regged') {
                        page.registerSuccess();
                    }
                }
            },
            error: function (err) {
                handle(err.responseJSON);
            }
        });
        return false;
    }

    registerSuccess() {
        $('#logUsername').val($('#username').val());
        $('#logPassword').val($('#password').val());

        $('#regForm').trigger("reset");
        alert('Login fields pre filled, just press the login button');
    }

    login() {

        $.ajax({
            url: '/api/employee/login',
            type: 'POST',
            data: $('#logForm').serialize(),
            success: function (answer) {
                answer = handle(answer);
                if (answer) {

                    if (answer.command && answer.command === 'displayErr') {  //we make sure to show the possible problems to the user when they arise
                        switch (answer.msg) {
                            case 'userNotFound':
                                alert('No user with this username!');
                                break;
                            case 'wrongPass':
                                alert('Incorrect Password!');
                                break;
                            case 'userNotFound':
                                alert('Username inserted is of a customer account!');
                                break;
                            default:
                                alert('Failed to log you in, please reload and try again');
                                break;
                        }
                    } else {
                        page.loginSuccess(answer);
                        $('#nav-store-tab').click();
                    }
                }

            },
            error: function (err) {
                handle(err)
            }
        });
        return false;
    }

    loginSuccess(answer) {
        this.employee = answer;
        $('#employeeGreeting').text(`${getGreeting()}, ${employee.username}`)
        $('#nav-store-tab').removeClass('disabled');
        $('#nav-clients-tab').removeClass('disabled');
        $('#nav-rentals-tab').removeClass('disabled');
        $('#searchBtn').removeClass('disabled');
        $('#master-notLoggedForms').hide();

        this.getListings();  //get the listings to show and stop loading
        this.getBrands();
        this.getTypes();

        this.getRentals();   //get the rentals

        this.getCustomers(); //get the customers
    }

    //getters
    getAll() {
        loading.pageStart();
        this.getEmployee();
    }

    getEmployee() { //gets the employee data if he's logged in
        $.ajax({
            url: '/api/employee/isLogged',
            success: function (answer) {

                answer = handle(answer);
                if (answer) {

                    if (answer.command === 'displayErr') {  //we make sure to show the possible problems to the user when they arise
                        switch (answer.msg) {
                            case 'banned':
                                alert('You tried to log in as a banned customer in the employee page!');
                                break;
                            default:
                                alert('Failed not log you in, please reload and try again');
                                break;
                        }
                        return;
                    }

                    if (answer === 'notLogged') {   //if the employee is not logged in we show the forms for reg and log

                        $('#nav-profile-tab').click();
                        loading.pageStop(); //stop loading page if it's still loading

                    } else {    //if the employee is logged in we go ahead and get everything else that the page needs                        
                        page.loginSuccess(answer);
                        $('#nav-store-tab').click();
                    }
                }
            },
            error: function (err) {
                handle(err.responseJSON);
            }
        });
    }

    getListings() {
        $.ajax({
            url: '/api/listing/allForThisSimpleHWMan',
            success: (answer) => {
                answer = handle(answer);
                if (answer) {

                    if (answer.command && answer.command === 'displayErr') {
                        switch (answer.msg) {
                            case 'mustBeLoggedAsSimpleHWMan':
                                alert('Not logged as a manager or employee');
                                break;
                            default:
                                alert('Failed to retreive listings data');
                                break;
                        }
                        return;
                    }

                    loading.pageStop();
                    if (answer === 'noCompanies') {
                        listingsObj.initialize([]);
                    } else {
                        listingsObj.initialize(answer);
                    }
                    listingsObj.generateLpP();
                    listingsObj.htmlSetPages();
                }
            },
            error: (err) => {
                handle(err.responseJSON);
            }
        });
    }

    getBrands() {
        console.log('da fare');
    }
    getTypes() {
        console.log('da fare');
    }
    getRentals() {
        console.log('da fare');
    }
    getCustomers() {
        console.log('da fare');
    }
}

class ClientsManager {

}

class Loading {
    //private param
    isStillLoadingPage;

    //public methods
    Loading() {
        this.isStillLoadingPage = false;
    }

    pageStart() {
        if (!this.isStillLoadingPage) {
            $('#loading').html(`LOADING...<img src="/clientUtil/loadingCat.gif" alt="">`)
        }
        $('#pageContent').css('display', 'none');
        $('#loading').css('display', 'flex');
        this.isStillLoadingPage = true;
        setTimeout(() => {
            if (this.isStillLoadingPage) {
                $('#loading').html('SERVER DID NOT RESPOND<br>PLEASE TRY RELOADING')
            }
        }, 15000);
    }
    pageStop() {
        this.isStillLoadingPage = false;
        $('#loading').css('display', 'none');
        $('#pageContent').css('display', 'block');
    }
}

//dataObjs
var page = new PageMaster();

var loading = new Loading();

var listingViewer = new ListingViewer();

var listingsObj = new ListingsManager();

var rentalTabObj = new RentalTab();

//class user
var employee = { isEmpty: true };

function displayProfile(e) {

    $('#nav-profile').html(`
    <div class="row nolonoloFullWidth p-3">
                <div class="col d-flex justify-content-end">
                    <button class="btn nolonoloYellowBackground nolonoloWhiteText" onclick="logOut()">LOG OUT</button>
                </div>
            </div>
            <div class="row nolonoloFullWidth p-2 justify-content-center">
                <div class="col-6">
                    <form id="profileForm">
                        <div class="mb-3 row">
                            <div class="col-6 d-flex justify-content-end">
                                <label for="employee-username" class="nolonoloBoldText">Username</label>
                            </div>    
                            <div class="col-6">
                                <input type="text" readonly class="form-control" id="employee-username" name="username" value="${e.username}">
                                <p id="usernameWarning" class="nolonoloSmallText">Please note that changing your username will log you out</p>
                                <p id="sameUsernameError" class="nolonoloYellowText nolonoloSmallText"> Username already in use </p>
                            </div>
                        </div>
                        <div class="mb-3 row">
                            <div class="col-6 d-flex justify-content-end">
                                <label for="employee-name" class="nolonoloBoldText">Name</label>
                            </div>
                            <div class="col-6">
                                <input type="text" readonly class="form-control" id="employee-name" name="name" value="${e.name}">
                            </div>
                        </div>
                        <div class="mb-3 row">
                            <div class="col-6 d-flex justify-content-end">
                                <label for="employee-surname" class="nolonoloBoldText">Surname</label>
                            </div>
                            <div class="col-6">
                                <input type="text" readonly class="form-control" id="employee-surname" name="surname" value="${e.surname}">
                            </div>
                        </div>
                        <div class="mb-3 row">
                            <div class="col-6 d-flex justify-content-end">
                                <label for="employee-password" class="nolonoloBoldText">Password</label>
                            </div>
                            <div class="col-3">
                                <input type="text" readonly class="form-control" id="employee-password" value="&#8226;&#8226;&#8226;&#8226;">
                            </div>
                            <div class="col-3">
                                <button class="btn nolonoloBackgroundNavSecond nolonoloWhiteText" id="editEmployeePasswordBtn" data-bs-toggle="modal" data-bs-target="#changePasswordModal"> CHANGE PASSWORD </button>
                            </div>
                        </div>
                        <div class="mb-3 row">
                            <div class="col d-flex justify-content-end" id="companiesListDiv">
                                <label for="companiesList" class="nolonoloBoldText">Companies</label>
                                <ul class="p-0" id="companiesList">

                                </ul>
                            </div>
                            <div class="col">
                                <button class="btn nolonoloBackgroundNavSecond nolonoloWhiteText" id="addCompanyBtn" data-bs-toggle="modal" data-bs-target="#addCompanyModal"> ADD COMPANY </button>
                            </div>

                            <div class="col">
                                <ul class="list-group m-2" id="companiesList">

                                </ul>
                            </div>
                        </div>
                        <div class="mb-3 row justify-content-center">
                            <div class="col-3 d-flex justify-content-center">
                                <button type="button" class="btn nolonoloBackgroundNavSecond nolonoloWhiteText" id="editEmployeeBtn" onclick="editEmployee()"> EDIT </button>
                                <button type="submit "class="btn nolonoloBackgroundNavSecond nolonoloWhiteText" id="saveEmployeeBtn"> SAVE </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

    <div class="modal fade" id="changePasswordModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">Change your Password</h5>
                    <p class="nolonoloSmallText">Please note that changing your password will log you out</p>
                </div>
                <form id="passwordForm">
                    <div class="modal-body">
                        <label for="oldPassword" class="nolonoloBoldText">Old password</label>
                        <input type="password" class="form-control" id="oldPassword" name="oldPassword" placeholder="insert old password">
                        <p id="wrongPassError" class="nolonoloYellowText nolonoloSmallText">Wrong password</p>

                        <label for="newPassword" class="nolonoloBoldText">New password</label>
                        <input type="password" class="form-control" id="newPassword" name="newPassword" placeholder="insert new password">
                        <p id="samePassError" class="nolonoloYellowText nolonoloSmallText">New password can't be the same as old password</p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="submit" class="btn nolonoloYellowBackground nolonoloWhiteText">Save changes</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
    
    <div class="modal fade" id="addCompanyModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">Add a company you work with</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <form id="addCompanyForm">
                    <div class="modal-body">
                        <label for="companyName" class="nolonoloBoldText">Company name</label>
                        <input name="name" type="text" class="form-control" id="companyName" placeholder="insert the company name">

                        <label for="companyPassword" class="nolonoloBoldText">Company password</label>
                        <input name="password" type="text" class="form-control" id="companyPassword" placeholder="insert the company password">
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="submit" class="btn nolonoloYellowBackground nolonoloWhiteText" data-bs-dismiss="modal">Save changes</button>
                    </div>
                </form>
            </div>
        </div>
    </div>`)

    $('#saveEmployeeBtn').hide();
    $('#editEmployeePasswordBtn').hide();
    $('#addCompanyBtn').hide();
    $('#sameUsernameError').hide();
    $('#samePassError').hide();
    $('#wrongPassError').hide();
    $('#usernameWarning').hide();
    if (!e.companies) {
        console.log('no companies')
    } else {
        for (var i = 0; i < e.companies.length; i++) {
            $('#companiesList').append(`<li class="row m-2 align-items-center">${e.companies[i]}`)
        }

    }
    $('#addCompanyForm').submit(function () {
        $.ajax({
            url: '/api/company/addToSelf',
            type: 'POST',
            data: $('#addCompanyForm').serialize(),
            success: function (answer) {
                answer = handle(answer);
                if (answer) {
                    if (answer.command) {
                        if (answer.msg === 'nameFieldEmpty') {
                            alert('Please insert the company name');
                        } else if (answer.msg === 'passwordFieldEmpty') {
                            alert('Please insert the company password');
                        } else if (answer.msg === 'companyNotFound') {
                            alert('This company does not exist');
                        } else if (answer.msg === 'wrongPass') {
                            alert('This company password is incorrect');
                        }
                    }
                    if (typeof answer === 'object') {
                        employee = answer;
                        updateEverything();
                    } else {
                        console.log('shouldnt be here', answer);
                    }
                }
            },
            error: function (err) {
                handle(err.responseJSON);
            }
        });
        return false;
    });

    $('#profileForm').submit(function () {
        $.ajax({
            url: '/api/employee/update',
            type: 'POST',
            data: $('#profileForm').serialize(),
            success: function (answer) {
                answer = handle(answer);
                if (answer) {
                    if (answer.command) {
                        if (answer.msg === 'usernameAlreadyInUse') {
                            $('#sameUsernameError').show();
                        }
                    } else if (answer === 'loggedOut') {
                        location.reload();
                    } else {
                        $('#sameUsernameError').hide();
                        e.username = answer.username;
                        e.name = answer.name;
                        e.surname = answer.surname;
                        $('#employee-username').attr('readonly', true);
                        $('#employee-name').attr('readonly', true);
                        $('#employee-surname').attr('readonly', true);
                        $('#saveEmployeeBtn').hide();
                        $('#editEmployeeBtn').show();
                        $('#editEmployeePasswordBtn').hide();
                        $('#addCompanyBtn').hide();
                        $('#usernameWarning').hide();
                    }
                }
            },
            error: function (err) {
                handle(err.responseJSON);
            }
        });
        return false;
    });

    $('#passwordForm').submit(function () {
        $.ajax({
            url: '/api/employee/updatePassword',
            type: 'POST',
            data: $('#passwordForm').serialize(),
            success: function (answer) {
                answer = handle(answer);
                if (answer) {
                    if (answer.command) {
                        if (answer.msg === 'samePass') {
                            $('#samePassError').show();
                            $('#wrongPassError').hide();
                        } if (answer.msg === 'wrongPass') {
                            $('#samePassError').hide();
                            $('#wrongPassError').show();
                        }
                    } else {
                        location.reload();
                    }
                }
            },
            error: function (err) {
                handle(err.responseJSON);
            }
        });
        return false;
    });
}
function editEmployee() {
    $('#employee-username').removeAttr('readonly');
    $('#employee-name').removeAttr('readonly');
    $('#employee-surname').removeAttr('readonly');
    $('#saveEmployeeBtn').show();
    $('#editEmployeeBtn').hide();
    $('#editEmployeePasswordBtn').show();
    $('#addCompanyBtn').show();
    $('#usernameWarning').show();
}


//ON DOC READY  //Where it all begins
$(document).ready(function () {
    page.getAll();

});

//class Calls

function getRentals() {
    $.ajax({
        url: '/api/rental/allForThisSimpleHWMan',
        success: (answer) => {
            answer = handle(answer);
            if (answer.command === 'displayErr') { return alert(answer.msg) };
            rentals = answer;
            if (answer === 'noRentals') {
                rentalTabObj.initialize([]);
            } else {
                rentalTabObj.initialize(answer);
            }
        },
        error: (err) => {
            handle(err.responseJSON);
        }
    });
}

//class listingEditor
var listing = {
    disabled: false,
    name: '',
    description: '',
    type: '',
    brand: '',
    company: '',
    products: []
}
var tmpProduct = {
    disabled: false,
    price: {
        base: 0,
        fidelity: 0,
        modifiers: []
    },
    maintenance: '',
    condition: '',
    imgs: []
}
function logOut() {
    $.ajax({
        url: '/api/employee/logout',
        type: 'DELETE',
        success: function (answer) {
            handle(answer)
        },
        error: function (err) {
            handle(err)
        }
    });
    return false;
}
function setModifyListingForms(l) {

    $('#returnToStore').attr('onclick', `returnToListing('${l}')`);

    listing = listings.find((value, index) => { return value._id === l })
    $('#storeContent').html(`
    <div class="row container m-auto">
        <div class="col border-end border-2 pe-4">
            <form class="row g-3" id="addListingForm" action="../api/listing/create" method="post" enctype="multipart/form-data">
                <div class="col-12">
                    <h2>Listing</h2>
                </div>
                <div class="col-12">
                    <label for="listingName" class="form-label">Name</label>
                    <input name="name" type="text" class="form-control" id="listingName" placeholder="Add a listing name" required>
                </div>
                <div class="col-12">
                    <label for="listingDescription" class="form-label">Description</label>
                    <textarea name="description" class="form-control" id="listingDescription" rows="2" required></textarea>
                </div>
                <div class="col-12">
                    <label for="listingType" class="form-label">Type</label>
                    <input name="type" type="text" class="form-control" id="listingType" placeholder="Add a listing type" required>
                </div>
                <div class="col-12">
                    <label for="listingBrand" class="form-label">Brand</label>
                    <input name="brand" type="text" class="form-control" id="listingBrand" placeholder="Add a listing brand" required>
                </div>
                <div class="col-12">
                    <label for="listingDisabled" class="form-label">Disabled</label>
                    <input name="disabled" type="checkbox" class="form-check-input" id="listingDisabled">
                </div>
                <div class="col-12">
                    <label class="form-label" for="listingCompany">Company</label>
                    <select name="company" class="form-select" aria-label="listing company" id="listingCompany">
                    </select>
                </div>
                <div class="col-12">
                    <button type="submit" class="btn nolonoloYellowBackground nolonoloWhiteText">SAVE</button>
                </div>
            </form>
            <ul class="p-0" id="productsList">
            </ul>
        </div>
        <div class="col border-end border-2 ps-4 pe-4">
            <form class="row g-3" id="productForm" enctype="multipart/form-data">
                <div class="col-12">
                    <h2>Product</h2>
                </div>    
                <div class="col-12">
                    <div class="mb-3">
                        <label for="productImgInput" class="form-label">Multiple files input example</label>
                        <input name="imgs" class="form-control" type="file" id="productImgInput" onchange="displayProductImgs()" multiple>
                    </div>
                    <div id="productImgsDisplay">
                    </div>
                </div>
                <div class="col-12">
                    <label class="form-label" for="productCondition">Condition</label>
                    <select name="condition" class="form-select" aria-label="product condition" id="productCondition" required>
                        <option value="New">New</option>
                        <option value="Good">Good</option>
                        <option value="Decent">Decent</option>
                        <option value="Damaged">Aestetically Damaged</option>
                    </select>
                </div>
                <div class="col-6">
                    <label for="productDisabled" class="form-label me-3">Disabled</label>
                    <input name="disabled" type="checkbox" class="form-check-input" id="productDisabled">
                </div>
                <div class="col-6">
                    <label for="productMaintenance" class="form-label">maintenance until</label>
                    <input type="date" id="productMaintenance" class="form-control" name="maintenance">
                </div>
                <div class="row mt-3">
                    <div class="col-6" id="productPriceDiv">
                        <label for="productPrice" class="form-label">Price</label>
                        <input name="base" type="number" class="form-control" id="productPrice" placeholder="Add product base price" required>
                    </div>
                    <div class="col-6">
                        <label for="productFidelityPoints mt-3" class="form-label">Fidelity points (%)</label>
                        <input name="fidelity" type="number" class="form-control" id="productFidelityPoints" placeholder="Fidelity points" required>
                    </div>
                   
                </div>
                <div class="col-12">
                    <button type="submit" class="btn nolonoloYellowBackground nolonoloWhiteText">SAVE</button>
                    <button type="reset" class="btn nolonoloYellowBackground nolonoloWhiteText" onclick="newProduct()">NEW PRODUCT</button>
                </div>
            </form>
            <ul class="p-0" id="modifiersList">
            </ul>
        </div>
        <div class="col ps-4">
            <form class="row g-3" id="modifierForm">
                <div class="col-12">
                    <h2>Price Modifier</h2>
                </div>
                <div class="row mt-3">
                    <div class="col-6">
                        <label for="modifierSign" class="form-label">Sign</label>
                        <select name="sign" class="form-select" aria-label="Default select example" id="modifierSign">
                            <option value="+" selected>+</option>
                            <option value="-">-</option>
                            <option value="+%">+%</option>
                            <option value="-%">-%</option>
                            <option value="/">/</option>
                            <option value="*">*</option>
                        </select>
                    </div>
                    <div class="col-6">
                        <label for="modifierQuantity" class="form-label">Quantity</label>
                        <input name="quantity" type="number" class="form-control" id="modifierQuantity" placeholder="Set quantity" required>
                    </div>
                </div>
                <div class="row mt-3">
                    <div class="col-12">
                        <label for="modifierReason" class="form-label">Reason</label>
                        <input name="reason" type="text" class="form-control" id="modifierReason" placeholder="Add the reason of the modifier" required>
                    </div>
                </div>
                <div class="row mt-3">
                    <div class="col-12">
                        <label for="modifierTime" class="form-label">Apply:</label>
                        <select name="apply" class="form-select" aria-label="Default select example" id="modifierTime">
                            <option value="daily" selected>daily</option>
                            <option value="onWeekend">on weekends</option>
                            <option value="onHoly">on festivities</option>
                            <option value="onTotal">on total</option>
                        </select>
                    </div>
                </div>
                <div class="col-12 mt-3">
                    <button type="submit" class="btn nolonoloYellowBackground nolonoloWhiteText">SAVE</button>
                    <button type="reset" class="btn nolonoloYellowBackground nolonoloWhiteText" onclick="addModifier()">NEW MODIFIER</button>
                </div>
            </form>
            <div id="returnedImages">

            </div>
        </div>
    </div>`)
    //fare il for per aggiungere le companies
    for (var i = 0; i < employee.companies.length; i++) {
        $('#listingCompany').append(`<option value="${employee.companies[i]}">${employee.companies[i]}</option>`)
    }
    $("#addListing").hide()

    //DA FARE LA RETURN TO LISTING AL POSTO DELLA RETURN TO STORE
    $('#returnToStore').show();
    $('#storeFilterButton').hide();

    //aggiorniamo i valori del form del listing e aggiungiamo anche i prodotti da vieware
    $('#listingName').val(listing.name);
    $('#listingDescription').val(listing.description);
    $('#listingType').val(listing.type);
    $('#listingBrand').val(listing.brand);
    document.getElementById('listingDisabled').checked = listing.disabled ? true : false;
    $('#listingCompany').val(listing.company);
    for (let i = 0; i < listing.products.length; i++) {
        const prod = listing.products[i];
        $('#productsList').append(`<li class="list-group-item pb-1 ps-2 mt-3">
            <div class="row mb-2">
                <div class="col-4">
                    <div class="container m-0 p-0" style="width:50px; height:50px">
                        <img src="/api/imgs/${prod.imgs[0]}" style="width:100%; height:100%; object-fit:cover">
                    </div>
                </div>
                <div class="col-4 d-flex align-items-center">
                    <p class="nolonoloBoldText">${prod.condition}</p>
                </div>
                <div class="col-4 d-flex align-items-center">
                    <p class="nolonoloBoldText">${prod.price.base} $</p>
                </div>
            </div>
            <button class="btn nolonoloBackgroundNavSecond nolonoloWhiteText" onclick="viewProductForm(this)">View</button>
            </li>`)
    }


    $('#addListingForm').submit(async function (e) {
        e.preventDefault();
        var listingSerialized = new FormData(e.target);
        if (listing.products.length <= 0) {
            alert('You have to add at least one product');
            return false;
        }
        listing.name = listingSerialized.get('name');
        listing.description = listingSerialized.get('description');
        listing.type = listingSerialized.get('type');
        listing.brand = listingSerialized.get('brand');
        listing.company = listingSerialized.get('company');
        listing.disabled = listingSerialized.get('disabled') ? true : false;

        $.ajax({
            url: '/api/listing/update',
            data: JSON.stringify(listing),
            contentType: 'application/json; charset=utf-8',
            method: 'POST',
            type: 'POST', // For jQuery < 1.9
            success: function (data2) {
                $('#productForm').trigger('reset');
                $('#modifierForm').trigger('reset');
                $('#addListingForm').trigger('reset');
                $('#productImgsDisplay').html('');
                $('#modifiersList').html('');
                $('#productsList').html('');
                listing = {
                    disabled: false,
                    name: '',
                    description: '',
                    type: '',
                    brand: '',
                    company: '',
                    products: []
                };
                tmpProduct = {
                    disabled: false,
                    price: {
                        base: 0,
                        fidelity: 0,
                        modifiers: []
                    },
                    maintenance: '',
                    condition: '',
                    imgs: []
                }
                alert('listing updated successfully')
            },
            error: function (err) {
                console.log(err.responseJSON);
                handle(err.responseJSON)
            }
        });
    });
    $('#productForm').submit(async function (event) {
        event.preventDefault();
        //prendiamo i dati del form
        var productSerialized = new FormData(event.target)
        tmpProduct.disabled = productSerialized.get('disabled') ? true : false;
        tmpProduct.maintenance = productSerialized.get('maintenance') ? productSerialized.get('maintenance') : '';
        tmpProduct.condition = productSerialized.get('condition');
        tmpProduct.price.base = productSerialized.get('base');
        tmpProduct.price.fidelity = productSerialized.get('fidelity');

        //controlliamo se ci sono immagini caricate nel prodotto attualmente modificato
        if (tmpProduct.imgs.length <= 0) {
            return alert('A product needs at least one image to be saved')
        }

        if ($('.activeProduct').length <= 0) {
            $('#productsList').append(`<li class="list-group-item pb-1 ps-2 mt-3">
            ${addProductHtml(tmpProduct, true)}
            </li>`)
            listing.products.push(tmpProduct);
            document.getElementById('productsList').lastChild.classList.add('activeProduct');
        } else {
            $('.activeProduct').html(addProductHtml(tmpProduct, false))
            var index = Array.prototype.indexOf.call($('.activeProduct')[0].parentNode.children, $('.activeProduct')[0]);
            listing.products.splice(index, 1, tmpProduct);
        }
    });
    $('#modifierForm').submit(function (e) {
        e.preventDefault();
        var modifierSerialized = new FormData(e.target)
        if ($('.activeProduct').length <= 0) {
            alert('Please save the product before saving a modifier');
        } else {
            var modifier = {
                sign: modifierSerialized.get('sign'),
                quantity: modifierSerialized.get('quantity'),
                reason: modifierSerialized.get('reason'),
                apply: modifierSerialized.get('apply')

            }

            if ($('.activeModifier').length <= 0) {
                $('#modifiersList').append(`<li class="list-group-item pb-1 ps-2 mt-3">${addModifierListItem(modifier)}
                </li>`);
                tmpProduct.price.modifiers.push(modifier);
                document.getElementById('modifiersList').lastChild.classList.add('activeModifier');
            } else {
                $('.activeModifier').html(addModifierListItem(modifier));
                var mTmp = document.getElementsByClassName('activeModifier')[0];
                var mIndex = Array.prototype.indexOf.call(mTmp.parentNode.children, mTmp);
                tmpProduct.price.modifiers.splice(mIndex, 1, modifier);
            }
        }
    })
}
function addListing() {
    $('#storeContent').html(`
    <div class="row container m-auto">
        <div class="col border-end border-2 pe-4">
            <form class="row g-3" id="addListingForm" action="../api/listing/create" method="post" enctype="multipart/form-data">
                <div class="col-12">
                    <h2>Listing</h2>
                </div>
                <div class="col-12">
                    <label for="listingName" class="form-label">Name</label>
                    <input name="name" type="text" class="form-control" id="listingName" placeholder="Add a listing name" required>
                </div>
                <div class="col-12">
                    <label for="listingDescription" class="form-label">Description</label>
                    <textarea name="description" class="form-control" id="listingDescription" rows="2" required></textarea>
                </div>
                <div class="col-12">
                    <label for="listingType" class="form-label">Type</label>
                    <input name="type" type="text" class="form-control" id="listingType" placeholder="Add a listing type" required>
                </div>
                <div class="col-12">
                    <label for="listingBrand" class="form-label">Brand</label>
                    <input name="brand" type="text" class="form-control" id="listingBrand" placeholder="Add a listing brand" required>
                </div>
                <div class="col-12">
                    <label for="listingDisabled" class="form-label">Disabled</label>
                    <input name="disabled" type="checkbox" class="form-check-input" id="listingDisabled">
                </div>
                <div class="col-12">
                    <label class="form-label" for="listingCompany">Company</label>
                    <select name="company" class="form-select" aria-label="listing company" id="listingCompany">
                    </select>
                </div>
                <div class="col-12">
                    <button type="submit" class="btn nolonoloYellowBackground nolonoloWhiteText">SAVE</button>
                </div>
            </form>
            <ul class="p-0" id="productsList">
            </ul>
        </div>
        <div class="col border-end border-2 ps-4 pe-4">
            <form class="row g-3" id="productForm" enctype="multipart/form-data">
                <div class="col-12">
                    <h2>Product</h2>
                </div>    
                <div class="col-12">
                    <div class="mb-3">
                        <label for="productImgInput" class="form-label">Multiple files input example</label>
                        <input name="imgs" class="form-control" type="file" id="productImgInput" onchange="displayProductImgs()" multiple>
                    </div>
                    <div id="productImgsDisplay">
                    </div>
                </div>
                <div class="col-12">
                    <label class="form-label" for="productCondition">Condition</label>
                    <select name="condition" class="form-select" aria-label="product condition" id="productCondition" required>
                        <option value="New">New</option>
                        <option value="Good">Good</option>
                        <option value="Decent">Decent</option>
                        <option value="Damaged">Aestetically Damaged</option>
                    </select>
                </div>
                <div class="col-6">
                    <label for="productDisabled" class="form-label me-3">Disabled</label>
                    <input name="disabled" type="checkbox" class="form-check-input" id="productDisabled">
                </div>
                <div class="col-6">
                    <label for="productMaintenance" class="form-label">maintenance until</label>
                    <input type="date" id="productMaintenance" class="form-control" name="maintenance">
                </div>
                <div class="row mt-3">
                    <div class="col-6" id="productPriceDiv">
                        <label for="productPrice" class="form-label">Price</label>
                        <input name="base" type="number" class="form-control" id="productPrice" placeholder="Add product base price" required>
                    </div>
                    <div class="col-6">
                        <label for="productFidelityPoints mt-3" class="form-label">Fidelity points (%)</label>
                        <input name="fidelity" type="number" class="form-control" id="productFidelityPoints" placeholder="Fidelity points" required>
                    </div>
                   
                </div>
                <div class="col-12">
                    <button type="submit" class="btn nolonoloYellowBackground nolonoloWhiteText">SAVE</button>
                    <button type="reset" class="btn nolonoloYellowBackground nolonoloWhiteText" onclick="newProduct()">NEW PRODUCT</button>
                </div>
            </form>
            <ul class="p-0" id="modifiersList">
            </ul>
        </div>
        <div class="col ps-4">
            <form class="row g-3" id="modifierForm">
                <div class="col-12">
                    <h2>Price Modifier</h2>
                </div>
                <div class="row mt-3">
                    <div class="col-6">
                        <label for="modifierSign" class="form-label">Sign</label>
                        <select name="sign" class="form-select" aria-label="Default select example" id="modifierSign">
                            <option value="+" selected>+</option>
                            <option value="-">-</option>
                            <option value="+%">+%</option>
                            <option value="-%">-%</option>
                            <option value="/">/</option>
                            <option value="*">*</option>
                        </select>
                    </div>
                    <div class="col-6">
                        <label for="modifierQuantity" class="form-label">Quantity</label>
                        <input name="quantity" type="number" class="form-control" id="modifierQuantity" placeholder="Set quantity" required>
                    </div>
                </div>
                <div class="row mt-3">
                    <div class="col-12">
                        <label for="modifierReason" class="form-label">Reason</label>
                        <input name="reason" type="text" class="form-control" id="modifierReason" placeholder="Add the reason of the modifier" required>
                    </div>
                </div>
                <div class="row mt-3">
                    <div class="col-12">
                        <label for="modifierTime" class="form-label">Apply:</label>
                        <select name="apply" class="form-select" aria-label="Default select example" id="modifierTime">
                            <option value="daily" selected>daily</option>
                            <option value="onWeekend">on weekends</option>
                            <option value="onHoly">on festivities</option>
                            <option value="onTotal">on total</option>
                        </select>
                    </div>
                </div>
                <div class="col-12 mt-3">
                    <button type="submit" class="btn nolonoloYellowBackground nolonoloWhiteText">SAVE</button>
                    <button type="reset" class="btn nolonoloYellowBackground nolonoloWhiteText" onclick="addModifier()">NEW MODIFIER</button>
                </div>
            </form>
            <div id="returnedImages">

            </div>
        </div>
    </div>`)
    //fare il for per aggiungere le companies
    for (var i = 0; i < employee.companies.length; i++) {
        $('#listingCompany').append(`<option value="${employee.companies[i]}">${employee.companies[i]}</option>`)
    }
    $("#addListing").hide()
    $('#returnToStore').show();
    $('#storeFilterButton').hide();

    $('#addListingForm').submit(async function (e) {
        e.preventDefault();
        var listingSerialized = new FormData(e.target);
        if (listing.products.length <= 0) {
            alert('You have to add at least one product');
            return false;
        }
        listing.name = listingSerialized.get('name');
        listing.description = listingSerialized.get('description');
        listing.type = listingSerialized.get('type');
        listing.brand = listingSerialized.get('brand');
        listing.company = listingSerialized.get('company');
        listing.disabled = listingSerialized.get('disabled') ? true : false;
        $.ajax({
            url: '/api/listing/create',
            data: JSON.stringify(listing),
            contentType: 'application/json; charset=utf-8',
            method: 'POST',
            type: 'POST', // For jQuery < 1.9
            success: function (data2) {
                data2 = handle(data2);
                if (answer.command === 'displayErr') { return alert(answer.msg) };
                listingsObj.initialize(listings)
                $('#productForm').trigger('reset');
                $('#modifierForm').trigger('reset');
                $('#addListingForm').trigger('reset');
                $('#productImgsDisplay').html('');
                $('#modifiersList').html('');
                $('#productsList').html('');
                listing = {
                    disabled: false,
                    name: '',
                    description: '',
                    type: '',
                    brand: '',
                    company: '',
                    products: []
                };
                tmpProduct = {
                    disabled: false,
                    price: {
                        base: 0,
                        fidelity: 0,
                        modifiers: []
                    },
                    maintenance: '',
                    condition: '',
                    imgs: []
                }
                alert('listing added successfully')
            },
            error: function (err) {
                console.log(err.responseJSON);
                handle(err.responseJSON)
            }
        });
    });
    $('#productForm').submit(async function (event) {
        event.preventDefault();
        //prendiamo i dati del form
        var productSerialized = new FormData(event.target)
        tmpProduct.disabled = productSerialized.get('disabled') ? true : false;
        tmpProduct.maintenance = productSerialized.get('maintenance') ? productSerialized.get('maintenance') : '';
        tmpProduct.condition = productSerialized.get('condition');
        tmpProduct.price.base = productSerialized.get('base');
        tmpProduct.price.fidelity = productSerialized.get('fidelity');

        //controlliamo se ci sono immagini caricate nel prodotto attualmente modificato
        if (tmpProduct.imgs.length <= 0) {
            return alert('A product needs at least one image to be saved')
        }

        if ($('.activeProduct').length <= 0) {  //if the product is new and not yet saved
            $('#productsList').append(`<li class="list-group-item pb-1 ps-2 mt-3">${addProductHtml(tmpProduct, true)}</li>`);
            listing.products.push(tmpProduct);
            document.getElementById('productsList').lastChild.classList.add('activeProduct');
        } else {    //if the product is already part of listing and needs to be updated
            $('.activeProduct').html(addProductHtml(tmpProduct, true))
            var index = Array.prototype.indexOf.call($('.activeProduct')[0].parentNode.children, $('.activeProduct')[0]);
            listing.products.splice(index, 1, tmpProduct);
        }

    });
    $('#modifierForm').submit(function (e) {
        e.preventDefault();
        var modifierSerialized = new FormData(e.target)
        if ($('.activeProduct').length <= 0) {
            alert('Please save the product before saving a modifier');
        } else {
            var modifier = {
                sign: modifierSerialized.get('sign'),
                quantity: modifierSerialized.get('quantity'),
                reason: modifierSerialized.get('reason'),
                apply: modifierSerialized.get('apply')

            }

            if ($('.activeModifier').length <= 0) {
                $('#modifiersList').append(`<li class="list-group-item pb-1 ps-2 mt-3">${addModifierListItem(modifier)}
                </li>`);
                tmpProduct.price.modifiers.push(modifier);
                document.getElementById('modifiersList').lastChild.classList.add('activeModifier');
            } else {
                $('.activeModifier').html(addModifierListItem(modifier));
                var mTmp = document.getElementsByClassName('activeModifier')[0];
                var mIndex = Array.prototype.indexOf.call(mTmp.parentNode.children, mTmp);
                tmpProduct.price.modifiers.splice(mIndex, 1, modifier);
            }
        }
    })
}
function addModifier() {
    $('#modifierForm').trigger('reset');
    $('.activeModifier').removeClass('activeModifier');
}
function addModifierListItem(modifier) {
    return (` <p class="nolonoloBoldText">${modifier.apply} ${modifier.sign} ${modifier.quantity}</p>
                <button class="btn nolonoloBackgroundNavSecond nolonoloWhiteText" onclick="viewModifierForm(this)">View</button>
                <button class="btn nolonoloBackgroundNavSecond nolonoloWhiteText" onclick="deleteModifierForm(this)">Delete</button>`)
}
function newProduct() {

    $('#productForm').trigger('reset');

    //delete from server the images we don't need anymore
    var toBeDeleted = [];
    if ($('.activeProduct').length <= 0) { //if the product was never actually saved
        //delete all the previously loaded images
        toBeDeleted = tmpProduct.imgs;
    } else { //if changes of a already existing product are discarted
        var index = Array.prototype.indexOf.call($('.activeProduct')[0].parentNode.children, $('.activeProduct')[0]);
        //delete only the images contained in tmpProduct.imgs that are not contained in the listing already
        for (let i = 0; i < tmpProduct.imgs.length; i++) {
            if (listing.products[index].imgs.indexOf(tmpProduct.imgs[i]) === -1) {
                toBeDeleted.push(tmpProduct.imgs[i]);
            }
        }
    }
    if (toBeDeleted.length >= 1) {
        $.ajax({
            url: '/api/imgsArray/?array=' + JSON.stringify(toBeDeleted),
            method: 'DELETE',
            success: (answer) => {
                console.log(answer)
            },
            error: (err) => {
                console.log(err.responseJSON)
            }
        })
    }
    //reset the rest of the form and stuff
    $('.activeProduct').removeClass('activeProduct');
    $('#productDisabled').attr('checked', false);
    $('#productImgsDisplay').html('');
    $('#modifiersList').html('');
    $('#modifierForm').trigger('reset');
    //reset the javascript counterpart to the html tmp Product being created/modified
    tmpProduct = {
        disabled: false,
        price: {
            base: 0,
            fidelity: 0,
            modifiers: []
        },
        maintenance: '',
        condition: '',
        imgs: []
    }
}
function addProductHtml(product, showDelBtn) {
    return `<div class="row mb-2">
        <div class="col-4">
            <div class="container m-0 p-0" style="width:50px; height:50px">
                <img src="/api/imgs/${product.imgs[0]}" style="width:100%; height:100%; object-fit:cover">
            </div>
        </div>
        <div class="col-4 d-flex align-items-center">
            <p class="nolonoloBoldText">${product.condition}</p>
        </div>
        <div class="col-4 d-flex align-items-center">
            <p class="nolonoloBoldText">${product.price.base} $</p>
        </div>
    </div>
    <button class="btn nolonoloBackgroundNavSecond nolonoloWhiteText" onclick="viewProductForm(this)">View</button>
    ${showDelBtn ? `<button class="btn nolonoloBackgroundNavSecond nolonoloWhiteText" onclick="deleteProductForm(this)">Delete</button>` : ''}`
}
function deleteImgForm(myBtn) {

    var prodIndex = listing.products.indexOf(tmpProduct);
    if (myBtn.parentNode.parentNode.children.length <= 1 && prodIndex !== -1) {
        return alert('cannot delete last image in a saved product');
    }

    var imgIndex = Array.prototype.indexOf.call(myBtn.parentNode.parentNode.children, myBtn.parentNode);
    $.ajax({
        url: '/api/imgs/' + tmpProduct.imgs[imgIndex],
        method: 'DELETE',
        success: () => {
            //if we delete the first image in a already saved product we must update the one showing in the product list
            if (imgIndex === 0 && prodIndex !== -1) {
                document.getElementById('productsList').children[prodIndex].getElementsByTagName('img')[0].src = '/api/imgs/' + tmpProduct.imgs[1];
            }
            //update html and js
            myBtn.parentNode.remove();
            tmpProduct.imgs.splice(imgIndex, 1);
        },
        error: (err) => {
            console.log(err.responseJSON)
        }
    });
}
function deleteModifierForm(myModifierListBtn) {

    if (myModifierListBtn.parentNode.classList.contains('activeModifier')) {
        $('#modifierForm').trigger('reset');
    }

    var mIndex = Array.prototype.indexOf.call(myModifierListBtn.parentNode.parentNode.children, myModifierListBtn.parentNode);
    tmpProduct.price.modifiers.splice(mIndex, 1);
    myModifierListBtn.parentNode.remove();
}
function deleteProductForm(myProductListBtn) {
    //empty the product form if the one to be deleted is also the active one
    if (myProductListBtn.parentNode.classList.contains('activeProduct')) {
        $('#productForm').trigger('reset');
        $('#productDisabled').attr('checked', false);
        $('#productImgsDisplay').html('');
        $('#modifiersList').html('');
        tmpProduct = {
            disabled: false,
            price: {
                base: 0,
                fidelity: 0,
                modifiers: []
            },
            maintenance: '',
            condition: '',
            imgs: []
        }
    }
    //delete the product from the listing, but delete the photos from mongo first
    var index = Array.prototype.indexOf.call(myProductListBtn.parentNode.parentNode.children, myProductListBtn.parentNode);
    if (listing.products[index].imgs.length >= 1) {
        $.ajax({
            url: '/api/imgsArray/?array=' + JSON.stringify(listing.products[index].imgs),
            method: 'DELETE',
            success: (answer) => {
                console.log(answer)
            },
            error: (err) => {
                console.log(err.responseJSON)
            }
        })
    }
    listing.products.splice(index, 1);
    myProductListBtn.parentNode.remove();

}
async function displayProductImgs() {

    /// -- load the images on the database
    //load them in a formData first
    var data = new FormData();
    var imgs = $('#productImgInput').prop('files');
    if (!imgs) return console.log('no images');
    for (let i = 0; i < imgs.length; i++) {
        data.append('imgs', imgs[i]);
    }
    //send them to the server
    jQuery.ajax({
        url: '/api/imgs/upload',
        data: data,
        cache: false,
        contentType: false,
        processData: false,
        method: 'POST',
        type: 'POST', // For jQuery < 1.9
        success: function (answer) {
            //add them to the page via dynamic html
            for (let i = 0; i < answer.length; i++) {
                tmpProduct.imgs.push(answer[i]);
                addImgHtml(answer[i]);
            }
        },
        error: function (err) {
            console.log(err.responseJSON);
        }
    });
}
function addImgHtml(img) {
    $('#productImgsDisplay').append(`<div>
        <button class="btn nolonoloYellowText" onclick="deleteImgForm(this)" type="button">
            <span class="material-icons-round">close</span>
        </button>
        <img class="me-2 mb-2" src="/api/imgs/${img}" style="width:40%">
    </div>`);
}
function viewModifierForm(tmp) {
    $('.activeModifier').removeClass('activeModifier');
    tmp.parentNode.classList.add('activeModifier');
    var mIndex = Array.prototype.indexOf.call(tmp.parentNode.parentNode.children, tmp.parentNode);
    $('#modifierForm').trigger('reset');
    $('#modifierSign').val(tmpProduct.price.modifiers[mIndex].sign);
    $('#modifierQuantity').val(tmpProduct.price.modifiers[mIndex].quantity);
    $('#modifierReason').val(tmpProduct.price.modifiers[mIndex].reason);
    $('#modifierTime').val(tmpProduct.price.modifiers[mIndex].apply);
}
async function viewProductForm(tmp) {

    //set pressed product as active
    $('.activeProduct').removeClass('activeProduct');
    tmp.parentNode.classList.add('activeProduct');
    //same but for js
    var index = Array.prototype.indexOf.call(tmp.parentNode.parentNode.children, tmp.parentNode);

    //delete images from server if they are not saved in listing
    if (tmpProduct.imgs.length >= 0 && listing.products.indexOf(tmpProduct) === -1) {
        $.ajax({
            url: '/api/imgsArray/?array=' + JSON.stringify(tmpProduct.imgs),
            method: 'DELETE',
            success: (answer) => {
                console.log(answer)
            },
            error: (err) => {
                console.log(err.responseJSON)
            }
        })
    }
    tmpProduct = listing.products[index];

    //reset product form and then load it with all the info from the pressed product
    $('#productForm').trigger('reset');
    $('#productCondition').val(tmpProduct.condition);
    if (tmpProduct.disabled) {
        $('#productDisabled').attr('checked', true);
    } else {
        $('#productDisabled').attr('checked', false);
    }
    $('#productMaintenance').val(tmpProduct.maintenance);
    $('#productPrice').val(tmpProduct.price.base);
    $('#productFidelityPoints').val(tmpProduct.price.fidelity);


    //add images
    $('#productImgsDisplay').html('');
    for (let i = 0; i < tmpProduct.imgs.length; i++) {
        var image = tmpProduct.imgs[i];
        $('#productImgsDisplay').append(addImgHtml(image));
    }

    //add the modifiers
    $('#modifierForm').trigger('reset');
    $('#modifiersList').html('');
    for (var i = 0; i < tmpProduct.price.modifiers.length; i++) {
        $('#modifiersList').append(`<li class="list-group-item pb-1 ps-2 mt-3">${addModifierListItem(tmpProduct.price.modifiers[i])}</li>`);
    }
}

//class listingViewer

function openListing(listingId, c) {
    c = parseInt(c)
    var l = listings.find((value, index) => { return value._id === listingId });
    listingViewer.initialize(l, c);
    listingsObj.hide();
    listingViewer.show();
    // var carousel = imgCarousel.getCarouselFrom(l.products[c])

    // var tabContentHTML = `
    // <div class="mb-3 mt-5 row nolonoloFullWidth" id="listingContent">
    // <div class="col-4">
    //     <div id="carouselExampleIndicators" class="carousel carousel-dark slide" data-bs-ride="carousel">
    //         <div id="carouselBtns" class="carousel-indicators">
    //         ${carousel.carouselBtn}
    //         </div>
    //         <div id="carouselImgs" class="carousel-inner">
    //         ${carousel.carousellInner}
    //         </div>
    //         <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
    //             <span class="carousel-control-prev-icon" aria-hidden="true"></span>
    //             <span class="visually-hidden">Previous</span>
    //         </button>
    //         <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
    //             <span class="carousel-control-next-icon" aria-hidden="true"></span>
    //             <span class="visually-hidden">Next</span>
    //         </button>
    //     </div>
    // </div>
    // <div class="col-8" id="listingInfo">
    //     <div class="mb-3 row justify-content-center">
    //         <div class="col-4 d-flex justify-content-end">
    //             <label for="listing-title" class="nolonoloBoldText">Title</label>
    //         </div>
    //         <div class="col-4">
    //             <input type="text" readonly class="form-control" id="listing-title" value="${l.name}">
    //         </div>
    //     </div>
    //     <div class="mb-3 row justify-content-center">
    //         <div class="col-4 d-flex justify-content-end">
    //             <label for="listing-description" class="nolonoloBoldText">Description</label>
    //         </div>
    //         <div class="col-4">
    //             <textarea class="form-control" id="listing-description" rows="3" readonly>${l.description}</textarea>
    //         </div>
    //     </div>
    //     <div class="mb-3 row justify-content-center">
    //         <div class="col-4 d-flex justify-content-end">
    //             <label for="listing-type" class="nolonoloBoldText">Type</label>
    //         </div>
    //         <div class="col-4">
    //             <input type="text" readonly class="form-control" id="listing-type" value="${l.type}">
    //         </div>
    //     </div>
    //     <div class="mb-3 row justify-content-center">
    //         <div class="col-4 d-flex justify-content-end">
    //             <label for="listing-brand" class="nolonoloBoldText">Brand</label>
    //         </div>    
    //         <div class="col-4">
    //             <input type="text" readonly class="form-control" id="listing-brand" value="${l.brand}">
    //         </div>
    //     </div>
    //     <div class="mb-3 row justify-content-center">
    //         <div class="col-4 d-flex justify-content-end">
    //             <label for="listing-disabled" class="nolonoloBoldText">Disabled</label>
    //         </div>    
    //         <div class="col-4">
    //             <input type="checkbox" class="form-check-input" value="" id="listing-disabled" disabled ${l.disabled ? 'checked' : ''}>
    //         </div>
    //     </div>
    //     <div class="mb-3 row justify-content-center">
    //         <div class="col-4 d-flex justify-content-end">
    //             <label for="listing-available-products" class="nolonoloBoldText">Available products</label>
    //         </div>    
    //         <div class="col-4">
    //             <ul class="list-group list-group-horizontal" id="products-ul">

    //             </ul> 

    //         </div>
    //     </div>
    //     <div class="mb-3 row justify-content-center">
    //         <div class="col-4 d-flex justify-content-center" id="listing-form-buttons">
    //             <button class="btn nolonoloBackgroundNavSecond nolonoloWhiteText" id="modify-listing-btn" onclick="setModifyListingForms('${l._id}')">Modify</button>
    //             <button class="btn nolonoloBackgroundNavSecond nolonoloWhiteText" id="save-listing-btn">Save</button>
    //         </div>
    //     </div>
    // </div>
    // </div>`;

    $('#addListing').hide();
    $('#storeFilterButton').hide();
    $('#returnToStore').show();
    //$('#storeContent').html(tabContentHTML);
    $('#addProductInListing').hide();
    $('#save-listing-btn').hide();
    // for (var i = 0; i < l.products.length; i++) {
    //     $("#storeContent #products-ul").append(`<li class="list-group-item" onclick="viewProductInCarousel('${l._id}', '${i}')">
    //         <img src="/api/imgs/${l.products[i].imgs[0]}" style="width:100px">
    //     </li>`);
    // }
}
function viewProductInCarousel(lId, i) {
    var l = listings.find((value, index) => { return value._id === lId });
    var carousel = imgCarousel.getCarouselFrom(l.products[i])
    $('#carouselBtns').html(carousel.carouselBtn);
    $('#carouselImgs').html(carousel.carousellInner);
}
function returnToStore() {
    //$('#storeContent').html(`<ul class="list-group list-group-horizontal d-flex justify-content-center" style="flex-wrap: wrap" id="listingsContainer"></ul>`)
    listingViewer.hide();
    listingsObj.show();
    $('#returnToStore').hide();
    $("#addListing").show();
    $('#storeFilterButton').show();
    listing = {
        disabled: false,
        name: '',
        description: '',
        type: '',
        brand: '',
        company: '',
        products: []
    };
    tmpProduct = {
        disabled: false,
        price: {
            base: 0,
            fidelity: 0,
            modifiers: []
        },
        maintenance: '',
        condition: '',
        imgs: []
    }
}
function returnToListing(listingId) {
    var cheapest = 0;
    var l = listings.find((value, index) => { return value._id === listingId })
    for (var i = 1; i < l.products.length; i++) {
        if (l.products[i].price.base < l.products[cheapest].price.base) {
            cheapest = i;
        }
    }
    listing = {
        disabled: false,
        name: '',
        description: '',
        type: '',
        brand: '',
        company: '',
        products: []
    };
    tmpProduct = {
        disabled: false,
        price: {
            base: 0,
            fidelity: 0,
            modifiers: []
        },
        maintenance: '',
        condition: '',
        imgs: []
    }
    openListing(listingId, cheapest.toString());
    $('#returnToStore').attr('onclick', `returnToStore()`);
}

//class ClientsManager
function displayClients(c) {
    $("#clientsList").append(`<li class="row m-2 nolonoloBackgroundProductListing align-items-center">
    <div class="col">
    <div class="container m-0 p-0" style="width:100px; height:100px">
      <img src="${c.avatar[0]}" style="width:100%; height:100%; object-fit:cover">
    </div>
    </div>
    <div class="col">
      <p class="username"><b>username:</b> ${c.username}</p>

    </div>
    <div class="col">
      <p class="name"><b>name:</b> ${c.name}</p>

    </div>
    <div class="col">
      <p class="surname"><b>surname:</b> ${c.surname}</p>

    </div>
    <div class="col">
      <button class="btn nolonoloWhiteText nolonoloBackgroundNavSecond" onclick="openClientProfile(${c._id})">View</button>

    </div>

  </li>`)
}
function editClient() {
    $('#client-username').removeAttr('readonly');
    $('#client-name').removeAttr('readonly');
    $('#client-surname').removeAttr('readonly');
    $('#client-brokenItems').removeAttr('readonly');
    $('#client-latePayments').removeAttr('readonly');
    $('#client-fidelityPoints').removeAttr('readonly')
    $('#clientBanned').removeAttr('disabled');

    $('#editClientBtn').hide();
    $('#addNoteToClientBtn').show();
    $('#saveClientBtn').show();




}
function openClientProfile(clientId) {
    var r = [];
    for (var i = 0; i < clients.length; i++) {
        if (clientId === clients[i]._id) {
            var c = clients[i];
        }
    }
    for (var j = 0; j < c.rentals.length; j++) {
        for (var i = 0; i < rentals.length; i++) {
            if (c.rentals[j] === rentals[i]._id) {
                r.push(rentals[i]);
            }
        }

    }


    $("#nav-clients").html(`

            <div class="row nolonoloFullWidth p-2">
                <div class="col d-flex justify-content-start">
                    <button id="returnToList" class="btn" style="width: 10%;" onclick="returnToClientList()">
                        <i class="fas fa-chevron-left nolonoloYellowText" style="font-size: 20px;"></i>
                    </button>
                </div>
            </div>
            <div class="row nolonoloFullWidth p-2">
                <div class="col-3 m-2">
                    <h3>Rentals</h3>
                    <ul class="list-group d-flex" id="clientRentalsList">

                    </ul>
                </div>
                <div class="col p-2">
                    <div class="row mb-3 justify-content-center">
                        <div class="col-4 d-flex justify-content-center">
                            <img id="client-avatar" src="${c.avatar[0]}" style="width:50%">
                        </div>
                    </div>
                    <div class="mb-3 row justify-content-center">
                        <div class="col-4 d-flex justify-content-end">
                            <label for="client-username" class="nolonoloBoldText">Username</label>
                        </div>    
                        <div class="col-3">
                            <input type="text" readonly class="form-control" id="client-username" value="${c.username}">
                        </div>
                    </div>
                    <div class="mb-3 row justify-content-center">
                        <div class="col-4 d-flex justify-content-end">
                            <label for="client-name" class="nolonoloBoldText">Name</label>
                        </div>
                        <div class="col-3">
                            <input type="text" readonly class="form-control" id="client-name" value="${c.name}">
                        </div>
                    </div>
                    <div class="mb-3 row justify-content-center">
                        <div class="col-4 d-flex justify-content-end">
                            <label for="client-surname" class="nolonoloBoldText">Surname</label>
                        </div>
                        <div class="col-3">
                            <input type="text" readonly class="form-control" id="client-surname" value="${c.surname}">
                        </div>
                    </div>
                    <div class="mb-3 row justify-content-center">
                        <div class="col-4 d-flex justify-content-end">
                            <label for="client-brokenItems" class="nolonoloBoldText">Items broken</label>
                        </div>
                        <div class="col-3">
                            <input type="number" readonly class="form-control" id="client-brokenItems" value="${c.itemsBroken}">
                        </div>
                    </div>
                    <div class="mb-3 row justify-content-center">
                        <div class="col-4 d-flex justify-content-end">
                            <label for="client-latePayments" class="nolonoloBoldText">Late payments</label>
                        </div>
                        <div class="col-3">
                            <input type="number" readonly class="form-control" id="client-latePayments" value="${c.latePayments}">
                        </div>
                    </div>
                    <div class="mb-3 row justify-content-center">
                        <div class="col-4 d-flex justify-content-end">
                            <label for="client-fidelityPoints" class="nolonoloBoldText">Fidelity points</label>
                        </div>
                        <div class="col-3">
                            <input type="number" readonly class="form-control" id="client-fidelityPoints" value="${c.fidelityPoints}">
                        </div>
                    </div>
                    <div class="mb-3 row justify-content-center">
                        <div class="col-4 d-flex justify-content-end">
                            <label class="nolonoloBoldText" for="clientBanned">Banned</label>
                        </div>
                        <div class="col-3">
                            <input class="form-check-input" type="checkbox" value="banned" id="clientBanned" ${c.banned ? 'checked' : ''} disabled>
                        </div>
                    </div>
                    <div class="mb-3 row justify-content-center">
                        <div class="col-4 d-flex justify-content-end">
                            <label for="client-notes" class="nolonoloBoldText">Notes</label>
                        </div>
                        <div class="col-3" id="client-notes-div">

                            <button class="btn nolonoloBackgroundNavSecond nolonoloWhiteText" id="addNoteToClientBtn" data-bs-toggle="modal" data-bs-target="#addNoteModal"> ADD NOTE </button>
                        </div>
                    </div>
                    <div class="mb-3 row justify-content-center">
                        <div class="col-3 d-flex justify-content-center">
                            <button class="btn nolonoloBackgroundNavSecond nolonoloWhiteText" id="editClientBtn" onclick="editClient()"> EDIT </button>
                            <button class="btn nolonoloBackgroundNavSecond nolonoloWhiteText" id="saveClientBtn" onclick="saveClient()"> SAVE </button>
                        </div>
                    </div>
                </div>
            </div>

            <div class="modal fade" id="addNoteModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="exampleModalLabel">Add note about <b>${c.username}</b></h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <textarea class="form-control" id="noteText"> </textarea>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="button" class="btn btn-primary" onclick="saveNote()" data-bs-dismiss="modal">Save changes</button>
                        </div>
                    </div>
                </div>
            </div>`)

    $('#saveClientBtn').hide();
    $('#addNoteToClientBtn').hide();
    for (var i = 0; i < c.notes.length; i++) {

        var e = employees.find((value, index, array) => {
            return value._id === c.notes[i].employeeId
        });

        $('#nav-clients #client-notes-div').append(`<p>from: ${e ? e.username : ''}</p><textarea class="border border-3 modifierFormBorder nolonoloFullWidth" readonly>${c.notes[i].text}</textarea>`);
    }

}
function returnToClientList() {
    $("#nav-clients").html(`<ul class="list-group m-2" id="clientsList"></ul>`)
    clients.map(displayClients);
    $('#returnToList').hide();

}
function saveNote() {
    $('#nav-clients #client-notes-div').append(`<p>from: ${employee.username} </p><textarea class="border border-3 modifierFormBorder nolonoloFullWidth" readonly>${$('#noteText').val()}</textarea>`);

}



//UTILS
//* Convert blob to base64
function blobToData(blob) {
    return new Promise((resolve) => {
        const reader = new FileReader()
        reader.onloadend = () => resolve(reader.result)
        reader.readAsDataURL(blob)
    })
}

function getGreeting() {
    var selector = 0;
    var randomGreeting = '';
    selector = getRandomInt(3);
    if (selector == 0) {
        randomGreeting = 'Hi';
    } else if (selector == 1) {
        randomGreeting = 'Hello';
    } else if (selector == 2) {
        randomGreeting = 'Greetings';
    }
    return randomGreeting;
}
function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}
function search() {
    var input, filter, ul, li, inputTxt, i, txtValue;
    input = document.getElementById('searchInput');
    filter = input.value.toUpperCase();

    if ($('#nav-store-tab').hasClass('active')) {
        // Declare variables

        ul = document.getElementById("listingsContainer");
        li = ul.getElementsByTagName('li');

        // Loop through all list items, and hide those who don't match the search query
        for (i = 0; i < li.length; i++) {
            inputTxt = li[i].getElementsByClassName("listingName")[0];
            txtValue = inputTxt.textContent || inputTxt.innerText;
            if (txtValue.toUpperCase().indexOf(filter) > -1) {
                li[i].style.display = "";
            } else {
                li[i].style.display = "none";
            }
        }

    } else if ($('#nav-clients-tab').hasClass('active')) {
        ul = document.getElementById("clientsList");
        li = ul.getElementsByTagName('li');

        // Loop through all list items, and hide those who don't match the search query
        for (i = 0; i < li.length; i++) {
            a = li[i].getElementsByClassName("username")[0];
            txtValue = a.textContent || a.innerText;
            if (txtValue.toUpperCase().indexOf(filter) > -1) {
                li[i].style.display = "";
            } else {
                li[i].style.display = "none";
            }
        }
    }
}
