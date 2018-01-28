'use strict';

import React from 'react'
import ReactDOM from 'react-dom'
import { slide as Menu } from 'react-burger-menu'
import { Radio } from 'antd'
const RadioGroup = Radio.Group
import { colors } from '../constants'

export default class OptionsPanel extends React.Component {
    onChange(e) {

    }

    render() {
        return (
            <Menu {...this.props}>
                <RadioGroup onChange={this.onChange} defaultValue={1}>
                    <Radio style={radioStyle} value={1}>Option A</Radio>
                    <Radio style={radioStyle} value={2}>Option B</Radio>
                    <Radio style={radioStyle} value={3}>Option C</Radio>
                </RadioGroup>
            </Menu>
        )
    }
}

const radioStyle = {
    display: 'block',
    height: '30px',
    lineHeight: '30px',
    color: colors.color2
} 
