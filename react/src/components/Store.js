import React from 'react'
import ListingCard from './ListingCard'
var listings = [
   { 
    _id:123,
    disabled: false,
    name: 'Catto',
    description: 'cats',
    type: 'cat',
    brand: 'cat',
    company: 'cats',
    products: [
        {
            price: {
                base: 20,
                fidelity: 2,
            },
            disabled: false,
            maintenance: '',
            condition: 'new' 
        }
    ]
    },
    { 
        _id:124,
        disabled: false,
        name: 'Doggo',
        description: 'dogs',
        type: 'dog',
        brand: 'dog',
        company: 'dogs',
        products: [
            {
                price: {
                    base: 10,
                    fidelity: 1,
                },
                disabled: false,
                maintenance: '',
                condition: 'new' 
            }
        ]
        },
        { 
            _id:125,
            disabled: false,
            name: 'Snek',
            description: 'sneks',
            type: 'snek',
            brand: 'snek',
            company: 'sneks',
            products: [
                {
                    price: {
                        base: 5,
                        fidelity: 1,
                    },
                    disabled: false,
                    maintenance: '',
                    condition: 'new' 
                }
            ]
            },
            { 
                _id:126,
                disabled: false,
                name: 'Moo',
                description: 'moos',
                type: 'moo',
                brand: 'moo',
                company: 'moos',
                products: [
                    {
                        price: {
                            base: 12,
                            fidelity: 3,
                        },
                        disabled: false,
                        maintenance: '',
                        condition: 'new' 
                    }
                ]
                }
]
const Store = () => {
    return (
        <div className="tab-pane fade show active" id="nav-store" role="tabpanel" aria-labelledby="nav-store-tab">
            <ul className="list-group d-flex align-items-center nolonoloFullWidth" id="listingsContainer">
            {listings.map((listing) => (
                
                    <ListingCard l={listing} key={listing._id}/>
                ))}

            </ul>
        </div>
    )
}

export default Store
