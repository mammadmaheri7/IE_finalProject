import React from 'react';
import ReactDOM from 'react-dom';

import * as serviceWorker from './serviceWorker';
import './index.css';

// Import Route Components
import Login from './Login.js';
import Field from './Field.js';
import FieldForm from './FieldForm.js';

// Import routing components
import {
    BrowserRouter as Router,
    Route
}
    from 'react-router-dom';


// RTL
import { create } from 'jss';
import rtl from 'jss-rtl';
import {
    StylesProvider, jssPreset, createMuiTheme, ThemeProvider
} from '@material-ui/core/styles';

const jss = create({ plugins: [...jssPreset().plugins, rtl()] });

function RTL(props) {
    return (
        <StylesProvider jss={jss}>
            {props.children}
        </StylesProvider>
    );
}

const theme = createMuiTheme({
    direction: 'rtl',
    typography: {
        fontFamily: [
            'IRANYekan',
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"',
        ].join(','),
    },
});

ReactDOM.render(
    <ThemeProvider theme={theme}>
        <RTL>
            <Router>
                <Route exact path="/" component={Login} theme={theme} />
                <Route exact path="/field" component={Field} theme={theme} />
                <Route path="/field/form/:fid" component={FieldForm} theme={theme} />
            </Router>
        </RTL>
    </ThemeProvider>
    ,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
