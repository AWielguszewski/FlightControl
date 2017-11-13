'use strict'

import Reactotron from 'reactotron-react-js'
import { reactotronRedux } from 'reactotron-redux'
import sagaPlugin from 'reactotron-redux-saga'

export const TRON_ENABLED = true

if (TRON_ENABLED) {
    Reactotron
        .configure()
        .use(reactotronRedux())
        .use(sagaPlugin())
        .connect()

    console.tron = Reactotron;
    Reactotron.clear();
}