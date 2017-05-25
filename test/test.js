'use strict';

var expect = require('chai').expect;
var Table = require('../index').Table;



describe('Compile table', function() {
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
    describe('Init class', function() {
        it('Init without table', function(done){
            let table = new Table();
            done();
        });
        it('Init table', function(done){
            let table = new Table(testTable);
            expect(table.table.rules).to.be.equals(testTable.rules);
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
                default: '0'
            },
            'a': {
                description: 'Formula Input',
                type: 'expression',
                expression: '2 * x + y'
            },
            'b': {
                description: 'Formula Input',
                type: 'expression',
                expression: 'x > y'
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
                'a': '< 15',
                'b': 'false',
                'z': '7'
            },
            'Second rule': {
                'x': '> 5',
                'a': '> 15',
                'b': 'false',
                'z': '2'
            },
            'Third rule': {
                'x': '> 5',
                'a': '< 15',
                'b': 'true',
                'z': '3'
            }
        }
    };
    let testData = [
        { 'x': '3', 'y':'2', 'z':null},
        { 'x': '3', 'y':'7', 'z':'7'},
        { 'x': '6', 'y':'7', 'z':'2'},
        { 'x': '20', 'y':'37', 'z':null},
        { 'x': '6', 'z':'3'}
    ];
    let testCopy = (JSON.parse(JSON.stringify(testData)))
    let table = new Table();
    table.compile(testTable);
    for (let i=0; i< testData.length; i++) {
        it('Test data line ' + i, function(done){
            let result = table.result(testData[i]);
            expect(result.z).to.be.equals(testCopy[i].z);
            done();
        });
    }
});


describe('Test table 2', function() {
    let testTable = {
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
    let testData = [
        { 'age': '65', 'hist':'good', 'risk':'Medium'},
        { 'age': '70', 'hist':'bad', 'risk':'High'},
        { 'age': '26', 'hist':'good', 'risk':'Medium'},
        { 'age': '20', 'hist':'bad', 'risk':'Medium'},
        { 'age': '10', 'hist':'good', 'risk':'Low'}
    ];
    let testCopy = (JSON.parse(JSON.stringify(testData)))

    let table = new Table(testTable);
    for (let i=0; i< testData.length; i++) {
        it('Test data line ' + i, function(done){
            let result = table.result(testData[i]);
            expect(result.risk).to.be.equals(testCopy[i].risk);
            done();
        });
    }
});

describe('Multiple output', function() {
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
                type: 'expression',
                expression: '2 * x + y'
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
                'a': '< 15',
                'z': '7',
                't': 'first'
            },
            'Second rule': {
                'x': '> 5',
                'a': '> 15',
                'z': '2',
                't': 'second'
            },
            'Third rule': {
                'x': '< 5, [20..30]',
                'y': '> 6,[30..40]',
                'a': '> 15',
                'z': '7',
                't': 'third'
            },
            '4th rule': {
                'x': '> 5',
                'a': '< 15',
                'z': '5',
                't': '4th'
            }            
        }
    };
    let testData = [
        { 'x': '3', 'y':'2', 'z':null, 't':null},
        { 'x': '3', 'y':'7', 'z':'7', 't':'first'},
        { 'x': '6', 'y':'7', 'z':'2', 't':'second'},
        { 'x': '20', 'y':'37', 'z':'7', 't':'third'},
        { 'x': '6', 'z':'5', 't':'4th'}
    ];
    let testCopy = (JSON.parse(JSON.stringify(testData)))

    let table = new Table();
    table.compile(testTable);
    for (let i=0; i< testData.length; i++) {
        it('Test data line ' + i, function(done){
            let result = table.result(testData[i]);
            expect(result.z).to.be.equals(testCopy[i].z);
            expect(result.t).to.be.equals(testCopy[i].t);
            done();
        });
    }
});

describe('Incomplete Table', function() {
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
    it('Missing input', function(done) {
        let testData = [
            { 'x': '3', 'y':'2', 'z':null},
            { 'x': '3', 'y':'7', 'z':null},
            { 'x': '6', 'y':'7', 'z':null},
            { 'x': '20', 'y':'37', 'z':null},
            { 'x': '6', 'z':null}
        ];
        let t = testTable;
        let d = testData;
        t.input = null;
        let table = new Table();
        table.compile(t);
        for (let i=0; i< d.length; i++) {
            let result = table.result(d[i]);
            expect(result.z).to.be.equals(d[i].z);
        }
        done();
    });
    it('Missing output', function(done) {
        let testData = [
            { 'x': '3', 'y':'2'},
            { 'x': '3', 'y':'7'},
            { 'x': '6', 'y':'7'},
            { 'x': '20', 'y':'37'},
            { 'x': '6'}
        ];
        let t = testTable;
        let d = testData;
        t.output = null;
        let table = new Table();
        table.compile(t);
        for (let i=0; i< d.length; i++) {
            let result = table.result(d[i]);
            expect(result.z).to.be.undefined;
        }
        done();
    });
    it('Missing rules', function(done) {
        let testData = [
            { 'x': '3', 'y':'2'},
            { 'x': '3', 'y':'7'},
            { 'x': '6', 'y':'7'},
            { 'x': '20', 'y':'37'},
            { 'x': '6'}
        ];
        let t = testTable;
        let d = testData;
        t.rules = null;
        let table = new Table();
        table.compile(t);
        for (let i=0; i< d.length; i++) {
            let result = table.result(d[i]);
            expect(result.z).to.be.undefined;
        }
        done();
    });
});
