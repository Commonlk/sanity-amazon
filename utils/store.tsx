import React, { createContext, Dispatch, useReducer } from 'react';
import IShippingAddress from '../models/shippingAddress';
import ICartItem from '../models/cartItem';
import Cookies from 'js-cookie';
import IUser from '../models/user';

interface State {
  darkMode: boolean;
  cart: {
    cartItems: ICartItem[];
    shippingAddress: IShippingAddress;
    paymentMethod: string;
  };
  userInfo: IUser | null;
}

interface Action {
  type: string;
  payload?: any;
}

interface StateContext {
  state: State;
  dispatch: Dispatch<Action>;
}

const initialState: State = {
  darkMode: Cookies.get('darkMode') === 'ON' ? true : false,
  cart: {
    cartItems: Cookies.get('cartItems')
      ? JSON.parse(Cookies.get('cartItems')!)
      : [],
    shippingAddress: Cookies.get('shippingAddress')
      ? JSON.parse(Cookies.get('shippingAddress')!)
      : {},
    paymentMethod: Cookies.get('paymentMethod')
      ? Cookies.get('paymentMethod')!
      : '',
  },
  userInfo: Cookies.get('userInfo')
    ? JSON.parse(Cookies.get('userInfo')!)
    : null,
};

export const Store = createContext<StateContext>({
  // eslint-disable-next-line no-unused-vars
  dispatch: (action: Action) => undefined,
  state: initialState,
});

const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case 'DARK_MODE_ON':
      return { ...state, darkMode: true };
    case 'DARK_MODE_OFF':
      return { ...state, darkMode: false };
    case 'CART_ADD_ITEM': {
      const newItem = action.payload;
      const existItem = state.cart.cartItems.find(
        item => item._key === newItem._key
      );
      const cartItems = existItem
        ? state.cart.cartItems.map(item =>
            item._key === existItem._key ? newItem : item
          )
        : [...state.cart.cartItems, newItem];
      Cookies.set('cartItems', JSON.stringify(cartItems));
      return { ...state, cart: { ...state.cart, cartItems } };
    }
    case 'CART_REMOVE_ITEM': {
      const cartItems = state.cart.cartItems.filter(
        item => item._key !== action.payload._key
      );
      Cookies.set('cartItems', JSON.stringify(cartItems));
      return { ...state, cart: { ...state.cart, cartItems } };
    }
    case 'CART_CLEAR':
      return {
        ...state,
        cart: { ...state.cart, cartItems: [] },
      };
    case 'USER_LOGIN':
      return {
        ...state,
        userInfo: action.payload,
      };
    case 'USER_LOGOUT':
      return {
        ...state,
        userInfo: null,
        cart: { cartItems: [], shippingAddress: {}, paymentMethod: '' },
      };
    case 'SAVE_SHIPPING_ADDRESS':
      return {
        ...state,
        cart: {
          ...state.cart,
          shippingAddress: action.payload,
        },
      };
    case 'SAVE_PAYMENT_METHOD':
      return {
        ...state,
        cart: {
          ...state.cart,
          paymentMethod: action.payload,
        },
      };
    default:
      return state;
  }
};

interface Props {
  children: React.ReactNode;
}

export const StoreProvider = (props: Props) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = { state, dispatch };

  return <Store.Provider value={value}>{props.children}</Store.Provider>;
};
