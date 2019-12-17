var budgetController = (function () {
    var incomeId = 0;
    var expenseId = 0;

    var Income = function (id, desc, val) {
        this.id = id;
        this.desc = desc;
        this.val = val;
    }

    var Expense = function (id, desc, val) {
        this.id = id;
        this.desc = desc;
        this.val = val;
    }

    var budget = {
        allItems: {
            inc: [],
            exp: [],
        },
        totals: {
            inc: 0,
            exp: 0,
        },
        total: 0
    }

    return {
        addItem: function (type, description, value) {
            var newItem;

            if (type === 'inc') {
                newItem = new Income(incomeId, description, value);
                incomeId++;
            } else {
                newItem = new Expense(expenseId, description, value);
                expenseId++;
            }
            budget.allItems[type].push(newItem);
            
            return newItem;
        },
        
        getTotals: function (type, value) {
            if (type === 'inc') {
                budget.total += value;
            } else {
                budget.total -= value;
            }
            budget.totals[type] += value;
            return {
                total: budget.total,
                totalInc: budget.totals.inc,
                totalExp: budget.totals.exp
            }
        }
    }
})();

var UIController = (function () {
    var queries = {
        addType: document.querySelector('.add__type'),
        addDesc: document.querySelector('.add__description'),
        addVal: document.querySelector('.add__value'),
        addBtn: document.querySelector('.add__btn'),
        incomeList: document.querySelector('.income__list'),
        expenseList: document.querySelector('.expenses__list'),
        month: document.querySelector('.budget__title--month'),
        totalBudget: document.querySelector('.budget__value'),
        totalIncome: document.querySelector('.budget__income--value'),
        totalExpense: document.querySelector('.budget__expenses--value')
    }
    return {
        getInput: function () {
            return {
                type: queries.addType.value,
                desc: queries.addDesc.value,
                val: queries.addVal.value
            }
        },
        getQueries: function () {
            return queries;
        },
        displayItem: function (obj, type) {
            var html, newHtml, element;

            if (type === 'inc') {
                element = queries.incomeList;
                html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">+ %value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            } else {
                element = queries.expenseList;
                html = '<div class="item clearfix" id="expense-%id%"><div class="item__description>%description%</div><div class="right clearfix"><div class="item__value">- %value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            }

            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.desc);
            newHtml = newHtml.replace('%value%', obj.val);

            element.insertAdjacentHTML('beforeend', newHtml);
        },
        displayBudget: function(obj) {
            queries.totalBudget.textContent = obj.total;
            queries.totalIncome.textContent = obj.totalInc;
            queries.totalExpense.textContent = obj.totalExp;
        }
    }
})();

var appController = (function (budgetCtrl, uiCtrl) {

    var setUpEventListeners = function () {
        var queries = uiCtrl.getQueries();
        queries.addBtn.addEventListener('click', ctrlAddItem);
        document.addEventListener('keypress', function (e) {
            //only for return key pressed
            if (e.keyCode === 13 || e.which === 13) {
                ctrlAddItem();
            }
        })
    }

    var ctrlAddItem = function () {
        var input = uiCtrl.getInput();
        var newItem = budgetCtrl.addItem(input.type, input.desc, input.val);
        uiCtrl.displayItem(newItem, input.type);
        var calcBudget = budgetCtrl.getTotals(input.type, parseInt(newItem.val));
        uiCtrl.displayBudget(calcBudget);
    }

    return {
        init: function () {
            setUpEventListeners();
        }
    }
})(budgetController, UIController);

appController.init();