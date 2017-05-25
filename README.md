# cond-table
[![Build Status](https://travis-ci.org/al66/cond-table.svg?branch=master)](https://travis-ci.org/al66/cond-table)
[![Coverage Status](https://coveralls.io/repos/github/al66/cond-table/badge.svg?branch=master)](https://coveralls.io/github/al66/cond-table?branch=master)

[![NPM](https://nodei.co/npm/cond-table.png)](https://nodei.co/npm/cond-table/)

Checks data object against decision table.

 -> [DMN Notation](http://www.omg.org/spec/DMN/1.1/PDF/).

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

// example data sets, to be checked  
var testData = [
    { 'age': '65', 'hist':'good'},
    { 'age': '70', 'hist':'bad'},
    { 'age': '26', 'hist':'good'},
    { 'age': '20', 'hist':'bad'},
    { 'age': '10', 'hist':'good'}
];

// create an instance
let table = new Table(testTable);

// use table to process data sets 
for (let i=0; i< testData.length; i++) {
    let result = table.result(testData[i]); // result.risk is set now
    console.log(result.risk);
};

```

## More Examples
### Initiate and compile in separate steps
```js
// create an instance direct..
let table = new Table(testTable);

// ...or set and compile separately
let table = new Table();
table.compile(testTable);
```
### Formular expressions in input
```js
let testTable = {
    description: 'Simple table',
    hitPolicy: 'Unique',
    input: {
        'x': {
            description: 'Input x',
            type: 'number'
        },
        'y': {
            description: 'Input y',
            type: 'number',
            default: 2
        },
        'a': {
            description: 'Formula Input',
            type: 'expression',        // optional
            expression: '2 * x + y'    // check expr-eval for syntax
        }
    },
    output: {
        'z': {},
        't': {}
    },
    rules: {
        'First rule': {
            'x': '< 5, [20..30]',
            'y': '> 6,[30..40]',
            'a': '< 15',                // uses the calculated value
            'z': '7',
            't': 'first'
        },
        'Second rule': {
            'x': '> 5',
            'a': '> 15',
            'z': '2',
            't': 'second'
        }
    }
};
```
### Set default values for input (if value is not provided in data sets)
```js
    input: {
        'x': {
            description: 'Input x',
            type: 'number',
            default: '0'                // 0 must be in quotes
        },
        'y': {
            description: 'Input y',
            type: 'number',
            default: 2                  // with or without quotes
        }
    }
```
