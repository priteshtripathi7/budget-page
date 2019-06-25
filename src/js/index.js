import * as UICtrl from './uicontroller';
import Data from './datacontroller';
import { DOMSelector } from './base';

const uniqid = require('uniqid');

var data = new Data();

const setupEventListners = function() {

    document.querySelector(DOMSelector.btn).addEventListener('click', ctrlAddEvents);

    document.addEventListener('keypress', function(e) {
       if(e.keyCode == 13 || e.which == 13) {
           ctrlAddEvents();
       } 
    });
    
    document.querySelector(DOMSelector.conatiner).addEventListener('click', ctrlDeleteEvents);
    
    document.querySelector(DOMSelector.type).addEventListener('change', UICtrl.changeType);
    
};

const dataCalculator = function() {
        
    //1.Calculate the Budget
    data.calculateBudget();
    
    //2.Return budget.
    let calculatedBudget = data.returnData();
    
    //3.Display the budget on the UI
    UICtrl.displayBudget(calculatedBudget);
    
};

const percentageCalculator = function() {
    //1.Calculate Percentages
    data.calculatePercentages();
    
    //2.Get the percentages
    let percentageArr = data.getPercentages();
    
    //3.Display the percentage sun the UI
    UICtrl.displayPercentages(percentageArr);
};

const ctrlAddEvents = function() {
        
    //1.Get Inputs
    var Input = UICtrl.getInput();
    
    //Checking for valid input fields
    if(Input.inputDescription !== '' && !isNaN(Input.inputValue)) {
        
        //2.Add items to the data controller.
        let id = uniqid();

        var newItem = data.updateData(Input.inputType, Input.inputDescription, Input.inputValue, id);
        console.log(newItem);
        //3.Add item to the UI
        UICtrl.addItemToDOM(newItem, Input.inputType);

        //4.Clearing the fields.
        UICtrl.clearInputs();

        //5. Update the budget.
        dataCalculator();
        
        //6.Update percentages
        percentageCalculator();
    
    }
};

const ctrlDeleteEvents = function(event) {
    var item, sliceID, ID, type;
    
    item = event.target.parentNode.parentNode.parentNode.parentNode.id;
    if(item) {
        sliceID = item.split('-');
        type = sliceID[0];
        ID = sliceID[1];
        
        //1.Update the data structure
        data.deleteData(type, ID);
        
        //2.Update the UI
        UICtrl.deleteItem(item);
        
        //3.Update and calculate the budget
        dataCalculator();
        
        //4.Update percentages
        percentageCalculator();
    }
}

const getDataFromDatabase = function(){
    async function callDB(){
        try{
            const res = await fetch('http://localhost:3000/', {
                method: 'POST',
                body: JSON.stringify({
                    username: 'priteshtri'
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const aft = await res.json();
            aft.forEach(function(cur) {
                console.log(cur);
                var newItem = data.updateDataOnLoad(cur.type, cur.description, cur.value, cur.id);
                UICtrl.addItemToDOM(newItem, cur.type);
            })
            UICtrl.clearInputs();
            dataCalculator();
            percentageCalculator();
            
        }catch(error) {
            console.log(error.body);
            window.alert('Error in indexjs');
        }
    }
    callDB();
}

const init =  function() {
    UICtrl.diaplayDate();
    UICtrl.displayBudget({
        budget: 0,
        totalInc: 0,
        totalExp: 0,
        per: -1
    });
    setupEventListners();
    getDataFromDatabase();
}
init();