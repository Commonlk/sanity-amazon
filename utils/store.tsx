import React, { createContext, Dispatch, useReducer } from 'react';
import Cookies from 'js-cookie';

import ShippingAddress from '../models/shippingAddress';
import CartItem from '../models/cartItem';
import User from '../models/user';

interface State {
  darkMode: boolean;
  cart: {
    cartItems: CartItem[];
    shippingAddress: ShippingAddress | null;
    paymentMethod: string | undefined;
  };
  userInfo: User | null;
}

export enum ActionType {
  DARK_MODE_ON,
  DARK_MODE_OFF,
  CART_ADD_ITEM,
  CART_REMOVE_ITEM,
  CART_CLEAR,
  USER_LOGIN,
  USER_LOGOUT,
  SAVE_SHIPPING_ADDRESS,
  SAVE_PAYMENT_METHOD,
}

type Action =
  | { type: ActionType.DARK_MODE_ON }
  | { type: ActionType.DARK_MODE_OFF }
  | { type: ActionType.CART_ADD_ITEM; payload: CartItem }
  | { type: ActionType.CART_REMOVE_ITEM; payload: CartItem }
  | { type: ActionType.CART_CLEAR }
  | { type: ActionType.USER_LOGIN; payload: User }
  | { type: ActionType.USER_LOGOUT }
  | { type: ActionType.SAVE_SHIPPING_ADDRESS; payload: ShippingAddress }
  | { type: ActionType.SAVE_PAYMENT_METHOD; payload: string };

interface StateContext {
  state: State;
  dispatch: Dispatch<Action>;
}

const initialState: State = {
  darkMode: Cookies.get('darkMode') === 'ON' ? true : false,
  cart: {
    cartItems: Cookies.get('cartItems')
      ? JSON.parse(Cookies.get('cartItems') || '')
      : [],
    shippingAddress: Cookies.get('shippingAddress')
      ? JSON.parse(Cookies.get('shippingAddress') || '')
      : {},
    paymentMethod: Cookies.get('paymentMethod')
      ? Cookies.get('paymentMethod')
      : '',
  },
  userInfo: Cookies.get('userInfo')
    ? JSON.parse(Cookies.get('userInfo') || '')
    : null,
};

export const Store = createContext<StateContext>({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  dispatch: (action: Action) => undefined,
  state: initialState,
});

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case ActionType.DARK_MODE_ON:
      return { ...state, darkMode: true };
    case ActionType.DARK_MODE_OFF:
      return { ...state, darkMode: false };
    case ActionType.CART_ADD_ITEM: {
      const newItem = action.payload;
      const existItem = state.cart.cartItems.find(
        item => item._key === newItem._key
      );
      const cartItems = existItem
        ? state.cart.cartItems.map(item =>
            item._key === existItem._key ? newItem : item
          )
        : [...state.cart.cartItems, newItem];
      Cookies.set('cartItems', JSON.stringify(cartItems), {
        sameSite: 'Strict',
      });
      return { ...state, cart: { ...state.cart, cartItems } };
    }
    case ActionType.CART_REMOVE_ITEM: {
      const cartItems = state.cart.cartItems.filter(
        item => item._key !== action.payload._key
      );
      Cookies.set('cartItems', JSON.stringify(cartItems), {
        sameSite: 'Strict',
      });
      return { ...state, cart: { ...state.cart, cartItems } };
    }
    case ActionType.CART_CLEAR:
      return {
        ...state,
        cart: { ...state.cart, cartItems: [] },
      };
    case ActionType.USER_LOGIN:
      return {
        ...state,
        userInfo: action.payload,
      };
    case ActionType.USER_LOGOUT:
      return {
        ...state,
        userInfo: null,
        cart: { cartItems: [], shippingAddress: null, paymentMethod: '' },
      };
    case ActionType.SAVE_SHIPPING_ADDRESS:
      return {
        ...state,
        cart: {
          ...state.cart,
          shippingAddress: action.payload,
        },
      };
    case ActionType.SAVE_PAYMENT_METHOD:
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
