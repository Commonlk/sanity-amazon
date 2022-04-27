import Cookies from 'js-cookie';
import { createContext, Dispatch, useReducer } from 'react';
import ICartItem from '../models/cartItem';

interface State {
  darkMode: boolean;
  cart: {
    cartItems: ICartItem[];
  };
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
  },
};

export const Store = createContext<StateContext>({
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
        item => item._id === newItem._id
      );
      const cartItems = existItem
        ? state.cart.cartItems.map(item =>
            item._id === existItem._id ? newItem : item
          )
        : [...state.cart.cartItems, newItem];
      Cookies.set('cartItems', JSON.stringify(cartItems));
      return { ...state, cart: { ...state.cart, cartItems } };
    }
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
