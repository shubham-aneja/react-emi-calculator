import React from 'react';
import logo from './logo.svg';
import RecurringPolicyCalculator from './components/RecurringPolicyCalculator'
import RecurringReturnsCalculator from './components/RecurringReturnsCalculator'
import './App.css';

/* Material UI-starts */
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Link from '@material-ui/core/Link';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';

/* Material UI-ends */

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper,
    },
    link: {
        '& > * + *': {
            marginLeft: theme.spacing(2),
        }
    }
}));

function App() {
    const [value, setSelectedTab] = React.useState(1);

    const handleChange = (event, newValue) => {
        setSelectedTab(newValue);
    };
    const classes = useStyles();

    const preventDefault = (event) => event.preventDefault();

    return (
        <div className="App">
            <main>
                <AppBar position="static">
                    <header className="App-header">
                        <Tabs value={value} onChange={handleChange} aria-label="simple tabs example">
                            <Tab label="About us" {...a11yProps(0)} />
                            <Tab label="Interest calculator" {...a11yProps(1)} />
                            <Tab label="Recurring Amount calculator" {...a11yProps(2)} />
                        </Tabs>
                    </header>
                </AppBar>
                <TabPanel value={value} index={0}>

                    <img src={logo} className="App-logo" alt="logo" />

                </TabPanel>
                <TabPanel value={value} index={1}>
                    <RecurringPolicyCalculator />

                </TabPanel>
                <TabPanel value={value} index={2}>
                    <RecurringReturnsCalculator />

                </TabPanel>


            </main>
            <footer>
                <Typography className={classes.link}>
                    <Link href="https://www.calculator.net/compound-interest-calculator.html" onClick={preventDefault}>
                        Ref
            </Link>
                </Typography>
            </footer>

        </div>
    );
}


function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box p={3}>
                    {children}
                </Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
};


export default App;
