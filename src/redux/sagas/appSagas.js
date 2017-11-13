'use strict'

import { put, takeLatest, call } from 'redux-saga/effects'

function* testSaga(action) {
}

export function* watchTest() {
    yield takeLatest('TEST', testSaga)
}