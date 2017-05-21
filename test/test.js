'use strict';

var expect = require('chai').expect;
var Table = require('../index').Table;

var testTable = {
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
        }
    },
    output: {
        'z': {
            description: 'Output z',
            type: 'number'
        }
    },
    rules: {
        'First rule': {
            'x': '< 5, [20..30]',
            'y': '> 6,[30..40]',
            'z': '7'
        },
        'Second rule': {
            'x': '> 5',
            'z': '2'
        }
    }
};

var testData = [
    { 'x': '3', 'y':'2', 'z':null},
    { 'x': '3', 'y':'7', 'z':'7'},
    { 'x': '6', 'y':'7', 'z':'2'},
    { 'x': '20', 'y':'37', 'z':'7'},
    { 'x': '6', 'z':'2'}
]

describe('Compile table', function() {
    describe('Init class', function() {
        it('Init without table', function(done){
            let table = new Table();
            //expect(table).to.be.equals(expected);
            done();
        });
        it('Call compile', function(done){
            let table = new Table();
            table.compile(testTable);
            let t = table.table;
            expect(t.rules).to.be.equals(testTable.rules);
            done();
        });
    });
});

describe('Test table 1', function() {
    let table = new Table();
    table.compile(testTable);
    for (let i=0; i< testData.length; i++) {
        it('Test data line ' + i, function(done){
            let result = table.result(testData[i]);
            expect(result.z).to.be.equals(testData[i].z);
            done();
        });
    }
});

testTable = {
    description: 'Applicant Risk rating',
    hitPolicy: 'Unique',
    input: {
        'age': {
            description: 'Applicant Age',
            type: 'number'
        },
        'hist': {
            description: 'Medical History',
            type: 'string'
        }
    },
    output: {
        'risk': {
            description: 'Risk Rating',
            type: 'string'
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

testData = [
    { 'age': '65', 'hist':'good', 'risk':'Medium'},
    { 'age': '70', 'hist':'bad', 'risk':'High'},
    { 'age': '26', 'hist':'good', 'risk':'Medium'},
    { 'age': '20', 'hist':'bad', 'risk':'Medium'},
    { 'age': '10', 'hist':'good', 'risk':'Low'}
];

describe('Test table 2', function() {
    let table = new Table();
    table.compile(testTable);
    for (let i=0; i< testData.length; i++) {
        it('Test data line ' + i, function(done){
            let result = table.result(testData[i]);
            expect(result.z).to.be.equals(testData[i].z);
            done();
        });
    }
});
