import { combineReducers } from 'redux';
import loading from './loading/reducer';
import { all } from 'redux-saga/effects';

const rootReducer = combineReducers({
    loading,
});

// rootReducer & type of rootReducer
export default rootReducer;

export function* rootSaga() {
    yield all([]);
}

export type RootState = ReturnType<typeof rootReducer>;
