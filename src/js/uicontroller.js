import {DOMSelector} from './base';

const formatDisplay = function(num, type) {
    var numSplit, int, dec, type;
    
    num = Math.abs(num);
    num = num.toFixed(2);

    numSplit = num.split('.');

    int = numSplit[0];
    if (int.length > 3) {
        int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3); //input 23510, output 23,510
    }

    dec = numSplit[1];

    return (type === 'exp' ? '-' : '+') + ' ' + int + '.' + dec;
};

const nodeListForEach = function(list, callback) {
    for(var i = 0; i < list.length; i++) {
        callback(list[i], i);
    }
};

export const getInput =  function() {
    return {
        inputType: document.querySelector(DOMSelector.type).value,
        inputDescription: document.querySelector(DOMSelector.description).value,
        inputValue: parseFloat(document.querySelector(DOMSelector.value).value)
    };
};

export const addItemToDOM =  function(ele, type) {
    var textToBeString, newTextToBeString, placeToInsert;
    async function callDB(){
        try{
            const res = await fetch('http://localhost:3000/', {
                method: 'get'
            });
            console.log(res);
            const aft = await res.json();
            aft.forEach(ele => {
                //Create new HTML String
                if(ele.type === 'inc') {
                    placeToInsert = DOMSelector.incomeContainer;
                    
                    textToBeString = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
                } else if (type === 'exp') {
                    placeToInsert = DOMSelector.expenseContainer;
                    
                    textToBeString = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
                }
                newTextToBeString = textToBeString.replace('%id%', ele.id);
                newTextToBeString = newTextToBeString.replace('%description%', ele.name);
                newTextToBeString = newTextToBeString.replace('%value%', formatDisplay(ele.value, type));
                
                //Insert the new object into DOM
                document.querySelector(placeToInsert).insertAdjacentHTML('beforeend', newTextToBeString);
            })
        }catch(error){
            console.log(error);
        }
    }
    callDB();
    //Create new HTML String
    if(type === 'inc') {
        placeToInsert = DOMSelector.incomeContainer;
        
        textToBeString = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
    } else if (type === 'exp') {
        placeToInsert = DOMSelector.expenseContainer;
        
        textToBeString = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
    }
    
    //Replacing the id,value and correct description.
    
    newTextToBeString = textToBeString.replace('%id%', ele.id);
    newTextToBeString = newTextToBeString.replace('%description%', ele.description);
    newTextToBeString = newTextToBeString.replace('%value%', formatDisplay(ele.value, type));
    
    //Insert the new object into DOM
    document.querySelector(placeToInsert).insertAdjacentHTML('beforeend', newTextToBeString);
};


export const clearInputs = function() {
    var fields, fieldsArray;
    
    fields = document.querySelectorAll(DOMSelector.description + ' ,' + DOMSelector.value);
    
    fieldsArray = Array.prototype.slice.call(fields);
    
    fieldsArray.forEach(function(current, index, array) {
       current.value = ''; 
    });
    
    fields[0].focus();
};

export const displayBudget = function(object) {
    var type;
    
    object.budget >= 0 ? type = 'inc' : type = 'exp'; 
    
    document.querySelector(DOMSelector.totalBudget).textContent = formatDisplay(object.budget, type);
    document.querySelector(DOMSelector.totalIncome).textContent = formatDisplay(object.totalInc, 'inc');
    document.querySelector(DOMSelector.totalExpense).textContent = formatDisplay(object.totalExp, 'exp');
    
    if(object.per > 0) {
        document.querySelector(DOMSelector.percentageSelector).textContent = object.per + '%';
    } else {
        document.querySelector(DOMSelector.percentageSelector).textContent = '***';
    }
};

export const displayPercentages = function(percentage) {
    var selector;
    selector = document.querySelectorAll(DOMSelector.percentageSelect);
    
    nodeListForEach(selector, function(current, index){
        if(percentage[index] > 0){
            current.textContent = percentage[index] + '%';
        } else {
            current.textContent = '***';
        }
    });
};

export const diaplayDate = function() {
    var now, months, month, year;
    
    now = new Date();
    
    months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    
    month = now.getMonth();
    year = now.getFullYear();
    
    document.querySelector(DOMSelector.dateSelect).textContent = months[month] + ' ' + year;
};

export const deleteItem =  function(selectorID) {
    var el = document.getElementById(selectorID);
    el.parentNode.removeChild(el);
};

export const changeType = function() {
            
    var fields = document.querySelectorAll(
        DOMSelector.type + ',' +
        DOMSelector.description + ',' +
        DOMSelector.value
    );
    
    nodeListForEach(fields, function(current){
        current.classList.toggle('red-focus');
    });
    
    
    document.querySelector(DOMSelector.btn).classList.toggle('red');
};