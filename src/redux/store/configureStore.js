'use strict'

import { createStore, applyMiddleware, compose } from 'redux'
import createSagaMiddleware from 'redux-saga'
import { TRON_ENABLED } from '../..//ReactotronConfig'
import Reactotron from 'reactotron-react-js'

export default (rootReducer, rootSaga) => {

  const sagaMonitor = TRON_ENABLED ? Reactotron.createSagaMonitor() : null

  const sagaMiddleware = createSagaMiddleware({ sagaMonitor })

  const createAppropriateStore = TRON_ENABLED ? Reactotron.createStore : createStore
  const store = createAppropriateStore(rootReducer, compose(applyMiddleware(sagaMiddleware)))

  sagaMiddleware.run(rootSaga)
  return store
}