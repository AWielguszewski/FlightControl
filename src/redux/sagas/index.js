'use strict'

import { all } from 'redux-saga/effects'
import { watchTest } from './appSagas'

export default function* rootSaga() {
    yield all([
        watchTest()
    ])
}