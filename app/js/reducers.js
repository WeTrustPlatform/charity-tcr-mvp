import {
  WEB3_NETWORK_ID,
  WEB3_AVAILABLE,
  WEB3_UNLOCK_ACCOUNT,
  WEB3_LOCK_ACCOUNT,
  WEB3_TRST_BALANCE,
} from './actions';

const initialState = {
  networkId: 'unknown',
  account: null,
  web3: null,
  trstBalance: '0',
};

export default function web3App(state = initialState, action) {
  switch (action.type) {
    case WEB3_NETWORK_ID:
      return Object.assign({}, state, {
        networkId: action.networkId,
      });
    case WEB3_AVAILABLE:
      return Object.assign({}, state, {
        web3: action.web3,
      });
    case WEB3_UNLOCK_ACCOUNT:
      return Object.assign({}, state, {
        account: action.account,
      });
    case WEB3_LOCK_ACCOUNT:
      return Object.assign({}, state, {
        account: null,
      });
    case WEB3_TRST_BALANCE:
      return Object.assign({}, state, {
        trstBalance: action.trstBalance,
      });
    default:
      return state;
  }
}