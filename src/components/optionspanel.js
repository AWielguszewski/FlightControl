'use strict';

import React from 'react';
import ReactDOM from 'react-dom';

export default function OptionsPanel(props) {
    return (
        <section className="options-panel">
            <section className="style-change-container">
                <p className="panel_title">{'Map styles'}</p>
                <label className="style_label" data-map-style="basic">
                    <input type="radio" name="radiobnt" value="basic" checked />
                    <span data-text="Basic">{'Basic'}</span>
                </label>
                <label className="style_label" data-map-style="streets">
                    <input type="radio" name="radiobnt" value="streets" />
                    <span data-text="Streets">{'Streets'}</span>
                </label>
                <label className="style_label" data-map-style="bright">
                    <input type="radio" name="radiobnt" value="bright" />
                    <span data-text="Bright">{'Bright'}</span>
                </label>
                <label className="style_label" data-map-style="light">
                    <input type="radio" name="radiobnt" value="light" />
                    <span data-text="Light">{'Light'}</span>
                </label>
                <label className="style_label" data-map-style="dark">
                    <input type="radio" name="radiobnt" value="dark" />
                    <span data-text="Dark">{'Dark'}</span>
                </label>
                <label className="style_label" data-map-style="satellite">
                    <input type="radio" name="radiobnt" value="satellite" />
                    <span data-text="Satellite">{'Satellite'}</span>
                </label>
            </section>
        </section>
    );
}
