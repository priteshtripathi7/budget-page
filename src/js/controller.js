import * as UICtrl from './uicontroller';
import Data from './datacontroller';
import { DOMSelector } from './base';

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
    let percentageArr = dataCtrl.getPercentages();
    
    //3.Display the percentage sun the UI
    UICtrl.displayPercentages(percentageArr);
    
    
};

const ctrlAddEvents = function() {
        
    //1.Get Inputs
    var Input = UICtrl.getInput();
    
    //Checking for valid input fields
    if(Input.inputDescription !== '' && !isNaN(Input.inputValue)) {
        
        //2.Add items to the data controller.
        var newItem = data.updateData(Input.inputType, Input.inputDescription, Input.inputValue);

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
        ID = parseInt(sliceID[1]);
        
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

const init =  function() {
    UICtrl.diaplayDate();
    UICtrl.displayBudget({
        budget: 0,
        totalInc: 0,
        totalExp: 0,
        per: -1
    });
    setupEventListners();
    data = new Data();
}
init();