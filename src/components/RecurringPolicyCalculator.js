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
/* Material UI-ends */

const commonChanger = (stateChanger) => (e) => {
    stateChanger(e.target.value);
}

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


const RecurringPolicyCalculator = () => {
    const [amount, changeAmount] = useState(100000);
    const [interest, changeInterest] = useState(7);
    const [duration, changeDuration] = useState(15);
    const [holdingPeriod, changeHoldingPeriod] = useState(0);
    const [interestSettlementFrequency, setInterestSettlementFrequency] = React.useState('1');/* 1 yearly, 4 quater, 12 months */;

    const classes = useStyles();

    return (<section>

        <Typography variant="h3" component="h3" gutterBottom>Recurring Policy Calculator</Typography>
        <form className={classes.root} noValidate autoComplete="off">
            <div><TextField fullWidth type='number' value={amount} onChange={commonChanger(changeAmount)} id="standard-basic" label="Principal amount" /></div>

            <div><TextField fullWidth type='number' value={interest} onChange={commonChanger(changeInterest)} id="standard-basic" label="Interest (in %)" /></div>

            <div><TextField fullWidth type='number' value={duration} onChange={commonChanger(changeDuration)} id="standard-basic" label="Duration(in years)" /></div>

            <div><TextField fullWidth type='number' value={holdingPeriod} onChange={commonChanger(changeHoldingPeriod)} id="standard-basic" label="Holding period(in years)" /></div>


            <FormControl component="fieldset">
                <FormLabel component="legend">Interest settlement frequence</FormLabel>
                <RadioGroup aria-label="Interest settlement frequence" name="Interest settlement frequence" value={interestSettlementFrequency} onChange={commonChanger(setInterestSettlementFrequency)}>
                    <FormControlLabel value="12" control={<Radio />} label="Monthly" />
                    <FormControlLabel value="4" control={<Radio />} label="Quaterly" />
                    <FormControlLabel value="1" control={<Radio />} label="Yearly" />
                </RadioGroup>
            </FormControl>
        </form>
        <Typography variant="h4" component="h3" gutterBottom>Final amount is: <em>Rs.{inWords(calculateCompoundInterestOnRecurringDeposits(amount, interest, parseInt(duration) + parseInt(holdingPeriod), interestSettlementFrequency, amount, duration - 1))} </em></Typography>

    </section>)
}


function inWords(n) {
    return n.toLocaleString('en-IN', {
        maximumFractionDigits: 2,
        style: 'currency',
        currency: 'INR'
    });
}
/* 1. based on quaters/years/months */
/* 2. Holding time to add */
/* 3. Principal gets added every  year */

/* 1. first do for years, then try adding investments every year */

// /* Yearly *//* 
// function calculateCompoundedInterest(investment, yearlyInterest, years, yearlyNewInvestment) {
//     let futureValue = investment;
//     for (i = 1; i <= years; i++) {
//         futureValue = (futureValue) * (1 + yearlyInterest / 100);
//         if (i !== years) {
//             /* Last year, the amount will not get added */
//             futureValue += yearlyNewInvestment;
//         }
//         console.log(`After ${years} years, the amount is ${futureValue}`)
//     }
//     return futureValue.toFixed(2);
// }

// function monthTwo(investment, monthlyRate, months) {
//     monthlyRate = monthlyRate / 100;
//     let futureValue = investment * (Math.pow(1 + monthlyRate, months) - 1) / monthlyRate;
//     return futureValue;
// }

// function yearlyTwo(investment, yearly, years) {
//     yearly = yearly / 100;
//     let futureValue = investment * (Math.pow(1 + yearly, years + 1) - 0) / yearly;
//     return futureValue;
// }
// yearlyTwo(1000, 10, 1);

// /* Monthly */
// function calculateCompoundedInterest(investment, yearlyInterest, years, yearlyNewInvestment) {
//     let futureValue = investment;
//     let months = year + 12;
//     let monthltInterest = 
//     for (i = 1; i <= years; i++) {
//         futureValue = (futureValue) * (1 + yearlyInterest / 100);
//         if (i !== years) {
//             /* Last year, the amount will not get added */
//             futureValue += yearlyNewInvestment;
//         }
//         // console.log(`After ${years} years, the amount is ${futureValue}`);
//     }
//     return futureValue.toFixed(2);
// }
// calculateCompoundedInterest(100, 10, 1, 100)


/**
 * interestOccurancesInAnYear: 1 for yearly, 3 for quaterly, 12 for monthly
 * Formula: 
 *    P ((1 + r/n)^ (nt))
 */
function calculateCompoundInterest(principal, rateOfInterest, years, interestOccurancesInAnYear) {
    rateOfInterest = rateOfInterest / 100;
    debugger;
    const finalAmount = (principal) * (
        Math.pow(
            1 + (rateOfInterest / interestOccurancesInAnYear),
            (interestOccurancesInAnYear * years)
        )
    )
    return Number(finalAmount.toFixed(2));
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






export default RecurringPolicyCalculator