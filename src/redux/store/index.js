'use strict'

import configureStore from './configureStore'
import rootReducer from '../Reducers/'
import rootSaga from '../Sagas'

export default () => configureStore(rootReducer, rootSaga)