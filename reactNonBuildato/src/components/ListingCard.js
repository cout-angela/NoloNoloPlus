import React from 'react'

const ListingCard = ({l}, {key} ) => {
    var cheapest = 0;
    for (var i = 1; i < l.products.length; i++) {
        if (l.products[i].price.base < l.products[cheapest].price.base) {
            cheapest = i;
        }
    }
    return (
        
      
                <li className="card list-group-item p-0" key={key} id=""> 
                <div className="container m-0 p-0 listingImgContainer">
                    <span className="badge bg-secondary isDisabled nolonoloFullWidth listingDisabledBadge">DISABLED</span>
                        <img alt="Product Img" className="nolonoloFullWidth" />
                </div>
                <div className="flex-column d-flex">
                    <p className="listingName nolonoloBoldText">{l.name}</p>
                    <p className="price">{l.products[cheapest].price.base}</p>                
                    <button>Open Listing</button>
                </div>
                </li>

    )
}

export default ListingCard
