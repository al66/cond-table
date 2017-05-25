'use strict';

const compiler = require('checkcond').Compiler;
const check = require('checkcond').Check;
const Parser = require('expr-eval').Parser;
const parser = new Parser();

class Table {
    constructor(table) {
        this._table = null;
        if (table) this._table = this.compile(table);
    }
    
    compile(table) {
        let compiled = [];
        let inputs = [];
        let outputs = [];
        table.calculate = [];
        table.defaults = {};
        
        if (table.input) {
            Object.keys(table.input).forEach(function(key) {
                inputs.push(key);
                // input parameter calculated based on expressions
                if (table.input[key].expression) {
                    let calc = [];
                    calc[0] = key;
                    calc[1] = parser.parse(table.input[key].expression);
                    table.calculate.push(calc);
                };
                // default values for input parameter
                if (table.input[key].default) {
                    table.defaults[key] = table.input[key].default; 
                };
            });
        };
        if (table.output) {
            Object.keys(table.output).forEach(function(key) {outputs.push(key)});
        };
        
        let compileRule = function(desc) {
            let rule = {};
            rule.match = [];
            rule.output = [];
            rule.desc = desc;
            
            // bild array of input variables with the assigned compiled(!) condition for this rule
            let addInput = function(item) {
                let input = [];
                let condString = table.rules[desc][item];
                if (condString) {
                    let cond = compiler(condString);
                    input[0] = item;
                    input[1] = cond;
                    rule.match.push(input);
                }
            }
            inputs.forEach(addInput);

            // build array of output variables for this rule
            let addOutput = function(item) {
                rule.output[item] = table.rules[desc][item];
            }
            outputs.forEach(addOutput);
            
            compiled.push(rule);
        };
        
        if (table.rules) {
            Object.keys(table.rules).forEach(compileRule);
        }    
        
        this._table = table;
        this._table.compiled = compiled;
        return this._table;
    }
    
    result(data) {
        let self = this;
        let res = data;
        let output = {};
        
        // assign default values
        Object.keys(this._table.defaults).forEach(function(key) {
            if (!data[key]) data[key] = self._table.defaults[key];
        });
        
        // calculate expressions
        let calcExpr = function(calc) {
            data[calc[0]] = calc[1].evaluate(data);
        };
        this._table.calculate.forEach(calcExpr);

        if (this._table.output) {
            Object.keys(this._table.output).forEach(function(key) {res[key] = null});
        }
        
        let checkCond = function(cond) {
            //console.log('check value %s = %s against cond:', cond[0], data[cond[0]], cond);
            return check(data[cond[0]],cond[1]);
        }
        
        let checkRule = function(rule) {
            //console.log('check rule:', rule);
            if (rule.match.every(checkCond)) {
                //res['z'] = 'Found ' + rule.desc;
                //console.log('Found:', rule);
                if (self._table.output) {
                    Object.keys(self._table.output).forEach(function(key) {res[key] = rule.output[key]});
                };
                return true;
            }
        } 
        this._table.compiled.some(checkRule);
        
        return res;
    }
    
    get table() {
        return this._table;
    }
};

module.exports = Table;
