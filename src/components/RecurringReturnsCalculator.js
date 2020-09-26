import React, { useState } from 'react';

/* Material UI-starts */
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
/* List */
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
/* Material UI-ends */

const useStyles = makeStyles((theme) => ({
    root: {
        '& > *': {
            margin: theme.spacing(1),
            width: '70ch',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
        },
    },
}));


const commonChanger = (stateChanger) => (e) => {
    stateChanger(e.target.value);
}

const RecurringReturnsCalculator = () => {
    const [amount, changeAmount] = useState(100000);
    const [interest, changeInterest] = useState(7);
    const [duration, changeDuration] = useState(15);
    const [holdingPeriod, changeHoldingPeriod] = useState(0);
    const [recurringReturnAmt, changeRecurringReturn] = useState(amount);
    const [recurringYears, changeRecurringYears] = useState(5);
    const [interestSettlementFrequency, setInterestSettlementFrequency] = React.useState('1');/* 1 yearly, 4 quater, 12 months */;

    const [age, updateAge] = useState(27);
    const finalAmount = calculateCompoundInterestOnRecurringDeposits(amount, interest, parseInt(duration) + parseInt(holdingPeriod), interestSettlementFrequency, amount, duration - 1);
    const classes = useStyles();


    return (<section>
        <Typography variant="h3" component="h3" gutterBottom>Recurring Returns Calculator</Typography>

        <form className={classes.root} noValidate autoComplete="off">
            <div><TextField fullWidth type='number' value={amount} onChange={commonChanger(changeAmount)} id="standard-basic" label="Principal amount" /></div>
            <div><TextField fullWidth type='number' value={interest} onChange={commonChanger(changeInterest)} id="outlined-basic" label="Interest (in %)" variant="outlined" /></div>

            <div><TextField fullWidth type='number' value={duration} onChange={commonChanger(changeDuration)} id="outlined-basic" label="Duration(in years)" variant="outlined" /></div>


            <div><TextField fullWidth type='number' value={holdingPeriod} onChange={commonChanger(changeHoldingPeriod)} id="outlined-basic" label="Holding period(in years)" variant="outlined" /></div>


            <div><TextField fullWidth type='number' value={recurringReturnAmt} onChange={commonChanger(changeRecurringReturn)} id="outlined-basic" label="Recurring Return Amt" variant="outlined" /></div>


            <div><TextField fullWidth type='number' value={recurringYears} onChange={commonChanger(changeRecurringYears)} id="outlined-basic" label="Recurring Years" variant="outlined" /></div>


            <div><TextField fullWidth type='number' value={age} onChange={commonChanger(updateAge)} id="outlined-basic" label="Current Age" variant="outlined" /></div>


            <FormControl component="fieldset">
                <FormLabel component="legend">Interest settlement frequence</FormLabel>
                <RadioGroup aria-label="Interest settlement frequence" name="Interest settlement frequence" value={interestSettlementFrequency} onChange={commonChanger(setInterestSettlementFrequency)}>
                    <FormControlLabel value="12" control={<Radio />} label="Monthly" />
                    <FormControlLabel value="4" control={<Radio />} label="Quaterly" />
                    <FormControlLabel value="1" control={<Radio />} label="Yearly" />
                </RadioGroup>
            </FormControl>

        </form>




        


        <Typography variant="h4" component="h4" gutterBottom>Final amount is(if not taken in recurrent installments): <em>Rs.{inWords(finalAmount)} </em></Typography>
        <Typography variant="h5" component="h5" gutterBottom>At the age of: {age + duration + holdingPeriod}</Typography>
        {renderRecurringReturns(finalAmount, recurringReturnAmt, interest, interestSettlementFrequency, recurringYears, parseInt(age) + parseInt(duration) + parseInt(holdingPeriod))}
    </section>)
}

function renderRecurringReturns(finalAmount, recurringAmount, interest, interestSettlementFrequency, recurringYears, receivingAge) {
    let listToRender = [], currentAmount = finalAmount;
    for (let i = 1; i <= recurringYears; i++) {
        /* eg: 1 Lakh will be given back to the policy holder, rest will still be invested */
        let amountToShow = currentAmount;
        currentAmount -= recurringAmount;/* Amount given back to the policy holder */
        currentAmount = calculateCompoundInterestOnRecurringDeposits(currentAmount, interest, 1, interestSettlementFrequency, 0, 0);
        const text = `Year:${i}, Age:${receivingAge + i - 1} received: ${i} * ${inWords(recurringAmount)} = ${inWords(i * recurringAmount)}, Amount still left: ${inWords(amountToShow)}-${inWords(recurringAmount)}=${inWords(amountToShow - recurringAmount)}`
        listToRender.push(
            <ListItem button key={i}>
                <ListItemIcon>
                    <AttachMoneyIcon />
                </ListItemIcon>
                <ListItemText primary={text} />
            </ListItem>
        )
    }

    return (
        <React.Fragment>
            <Divider />
            <List component="nav" aria-label="main mailbox folders">
                {listToRender}
            </List>
        </React.Fragment>)
}

function calculateCompoundInterestOnRecurringDeposits(principal, rateOfInterest, years, interestOccurancesInAnYear, depositPerYear, depositForYears) {
    console.log("Called for values " + `[principal:${principal}], [rateOfInterest:${rateOfInterest}], [years:${years}], [interestOccurancesInAnYear:${interestOccurancesInAnYear}], [depositPerYear:${depositPerYear}], [depositForYears:${depositForYears}]`);
    rateOfInterest = rateOfInterest / 100;
    const principalAmountPostMaturity = (principal) * (
        Math.pow(
            1 + (rateOfInterest / interestOccurancesInAnYear),
            (interestOccurancesInAnYear * years)
        )
    )
    /* Considering the depostis starts after one year completion */
    let recussingAmountPostDeposits = 0;
    if (depositForYears && depositPerYear) {
        for (let i = 1; i <= depositForYears; i++) {
            let effectedYears = (years - i);
            recussingAmountPostDeposits += ((depositPerYear) * (
                Math.pow(
                    1 + (rateOfInterest / interestOccurancesInAnYear),
                    (interestOccurancesInAnYear * effectedYears)
                )
            ))
        }
    }

    return Number((principalAmountPostMaturity + recussingAmountPostDeposits).toFixed(2));
}

function inWords(n) {
    return n.toLocaleString('en-IN', {
        maximumFractionDigits: 2,
        style: 'currency',
        currency: 'INR'
    });
}

export default RecurringReturnsCalculator
