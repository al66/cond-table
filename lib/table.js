'use strict';

const compiler = require('checkcond').Compiler;
const check = require('checkcond').Check;


class Table {
    constructor(table) {
        this._table = null;
        if (table) this._table = this.compile(table);
    }
    
    compile(table) {
        let compiled = [];
        let inputs = [];
        let outputs = [];
        
        if (table.input) {
            Object.keys(table.input).forEach(function(key) {inputs.push(key)});
        };
        if (table.output) {
            Object.keys(table.output).forEach(function(key) {outputs.push(key)});
        };
        
        let compileRule = function(desc) {
            let rule = {};
            rule.match = [];
            rule.output = [];
            rule.desc = desc;
            
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

            let addOutput = function(item) {
                let output = [];
                output[item] = table.rules[desc][item];
                rule.output = output;
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
