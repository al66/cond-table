# cond-table

Checks data object against descition table.

## Usage
```js
const Table = require('cond-table').Table;

var testTable = {
    description: 'Applicant Risk rating',   // optional
    hitPolicy: 'First',                     // optional (actual only First possible) 
    input: {
        'age': {
            description: 'Applicant Age',   // optional
            type: 'number'                  // optional
        },
        'hist': {
            description: 'Medical History',
            type: 'string'
        }
    },
    output: {
        'risk': {
            description: 'Risk Rating',     //optional
            type: 'string'                  //optional
        }
    },
    rules: {
        'older 60 / good': {
            'age': '>60',
            'hist': 'good',
            'risk': 'Medium'
        },
        'older 60 / bad': {
            'age': '>60',
            'hist': 'bad',
            'risk': 'High'
        },
        'mid age': {
            'age': '[25..60]',
            'risk': 'Medium'
        },
        'kids / good': {
            'age': '<25',
            'hist': 'good',
            'risk': 'Low'
        },
        'kids / bad)': {
            'age': '<25',
            'hist': 'bad',
            'risk': 'Medium'
        }
    }
};

var testData = [
    { 'age': '65', 'hist':'good'},
    { 'age': '70', 'hist':'bad'},
    { 'age': '26', 'hist':'good'},
    { 'age': '20', 'hist':'bad'},
    { 'age': '10', 'hist':'good'}
];


let table = new Table();
table.compile(testTable);
for (let i=0; i< testData.length; i++) {
    let result = table.result(testData[i]); // result.z is set now
    console.log(result.z);
};

```

## Examples

