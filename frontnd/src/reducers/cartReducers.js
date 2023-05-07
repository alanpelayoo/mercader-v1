import { 
    CART_ADD_ITEM,
    CART_REMOVE_ITEM,
    CART_SAVE_SHIPPING_ADDRESS,
    CART_SAVE_PAYMENT_METHOD,
    CART_CLEAR_ITEMS
} from '../constants/cartConstants';


// cartItems is an array of objs. 
//state is and object
//First we check if the product that we sent from the action using payload is already in cartItems
///... means spread operator
/// x.product refers to product id

export const cartReducer = (state = {cartItems:[], shippingAddress:{}}, action) => {
    switch(action.type){
        case CART_ADD_ITEM:
            const item = action.payload
            const existItem = state.cartItems.find(x => x.product === item.product)

            if (existItem) {
                return {
                    ...state,
                    cartItems: state.cartItems.map(x =>
                        x.product === existItem.product ? item : x)
                }

            } else {
                return {
                    ...state,
                    cartItems: [...state.cartItems, item]
                }
            }
            
        case CART_REMOVE_ITEM:
            return {
                ...state,
                cartItems: state.cartItems.filter(x => x.product !== action.payload)
            }
        
        case CART_SAVE_SHIPPING_ADDRESS:
            return {
                ...state,
                shippingAddress: action.payload
            }

        case CART_SAVE_PAYMENT_METHOD:
            return {
                ...state,
                paymentMethod: action.payload
            }
            
        case CART_CLEAR_ITEMS:
            return {
                ...state,
                cartItems: []
            }
        default:
            return state;
    };
};