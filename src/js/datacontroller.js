class Expense {
    constructor(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
    }

    calcPercentages(totalIncome) {
        if(totalIncome > 0) {
            this.percentage = Math.round((this.value / totalIncome) * 100);
        } else {
        this.percentage = -1;
        }
    }

    returnPercentages() {
        return this.percentage;
    }
}

class Income {
    constructor(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
    }
}

export default class Data  {
    constructor(){
        this.allExpenses = {
            inc: new Array(),
            exp: new Array()
        };
        this.expense = {
            income: 0,
            expense: 0
        };
        this.budget = 0;
        this.percentage = -1;
    }

    calculateArraySum(type) {
        var arrSum = 0;
        var requiredArray = this.allExpenses[type];
        
        requiredArray.forEach(function(current, index, array){
           arrSum += current.value; 
        });
        return arrSum;
    }

    updateDataOnLoad(type, des, value, id){
        let newItem;

        if(type === 'inc') {
            newItem = new Income(id, des, value);
        } else if (type === 'exp') {
            newItem = new Expense(id, des, value);
        }

        this.allExpenses[type].push(newItem);
        return newItem;
    }

    updateData(type, des, value, id) {
            
        let newItem;

        // TESTING
        // console.log(type);
        // console.log(this);

        if(type === 'inc') {
            newItem = new Income(id, des, value);
        } else if (type === 'exp') {
            newItem = new Expense(id, des, value);
        }
        
        async function insertItemToDB(){
            try{
                const res = await fetch('http://localhost:3000/insertItem', {
                    method: 'POST',
                    body: JSON.stringify({
                        username: 'priteshtri',
                        id: id,
                        des: des,
                        value: value,
                        type: type
                    }),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                const after = await res.json();
                console.log(after);
            }catch(error){
                console.log(error);
                console.log('Error in data controller');
            }
        }
        insertItemToDB();
        this.allExpenses[type].push(newItem);
        return newItem;
    }

    calculateBudget() {
            
        //1.calculating the total of the array
        this.expense.income = this.calculateArraySum('inc');
        this.expense.expense = this.calculateArraySum('exp');
        
        //2.Calculating the budget
        this.budget = this.expense.income - this.expense.expense;
        
        //3.Calculating the percentages
        if(this.expense.income > 0) {
            this.percentage = Math.round((this.expense.expense/this.expense.income) * 100);
        } else {
            this.percentage = -1;
        }   
    }

    calculatePercentages() {
        let totIncome = this.expense.income;
        this.allExpenses.exp.forEach( function(current) {
            current.calcPercentages(totIncome);
        });
    }

    getPercentages() {
        var percentageArray;
        percentageArray = this.allExpenses.exp.map( function(current) {
            return current.percentage;
        });
        return percentageArray;
    }

    deleteData(type, ID) {
        var idArray, index;

        async function deleteFromDB(){
            try{
                const res = await fetch('http://localhost:3000/deleteItem', {
                    method: 'POST',
                    body: JSON.stringify({
                        id: ID
                    }),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                const after = await res.json();
                console.log(after);
            }catch(error){
                console.log(error);
            }
        }
        deleteFromDB();
        idArray = this.allExpenses[type].map(function(current) {
            return current.id;
        });
        
        index = idArray.indexOf(ID);
        
        if(index !== -1) {
            this.allExpenses[type].splice(index, 1);
        }
    }


    returnData() {
        return {
            budget: this.budget,
            totalInc: this.expense.income,
            totalExp: this.expense.expense,
            per: this.percentage
        };
    }
};

