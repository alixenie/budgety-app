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
        total: 0,
        percentage: -1
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
                if (budget.totals.inc > 0) {
                    newItem.perc = Math.round((value / budget.totals.inc) * 100);
                } else {
                    newItem.perc = -1;
                }
            }
            budget.allItems[type].push(newItem);

            return newItem;
        },

        getTotals: function (type, value) {
            budget.totals[type] += value;
            return {
                totalInc: budget.totals.inc,
                totalExp: budget.totals.exp
            }
        },

        getBudget: function (type, value) {
            if (type === 'inc') {
                budget.total += value;
            } else {
                budget.total -= value;
            }
            return total = budget.total;
        },

        getGlobalPercentage: function () {
            if (budget.totals.inc > 0) {
                budget.percentage = Math.round((budget.totals.exp / budget.totals.inc) * 100);
            } else {
                budget.percentage = -1;
            }
            return globalPerc = budget.percentage;
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
        totalExpense: document.querySelector('.budget__expenses--value'),
        globalPercentage: document.querySelector('.budget__expenses--percentage')
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
            var html, element;

            if (type === 'inc') {
                element = queries.incomeList;
                html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">+ %value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            } else {
                element = queries.expenseList;
                html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">- %value%</div><div class="item__percentage">%percentage% %</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
                if (obj.perc > 0) {
                    html = html.replace('%percentage%', obj.perc);
                } else {
                    html = html.replace('%percentage%', '...');
                }
            }

            html = html.replace('%id%', obj.id);
            html = html.replace('%description%', obj.desc);
            html = html.replace('%value%', obj.val);

            element.insertAdjacentHTML('beforeend', html);
        },

        displayTotals: function (obj) {
            queries.totalIncome.textContent = obj.totalInc;
            queries.totalExpense.textContent = obj.totalExp;
        },

        displayGlobalPercentage: function (globalPercValue) {
            if (globalPercValue > 0) {
                queries.globalPercentage.textContent = globalPercValue + "%";
            } else {
                queries.globalPercentage.textContent = '...'
            }
        },

        displayBudget: function (budgetValue) {
            queries.totalBudget.textContent = budgetValue;
        },

        clearFields: function () {
            queries.addDesc.value = "";
            queries.addVal.value = "";
        },
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
        //get input
        var input = uiCtrl.getInput();

        if (input.desc !== "" && !isNaN(input.val) && input.val > 0) {
            //add new item to the app and to the ui
            var newItem = budgetCtrl.addItem(input.type, input.desc, input.val);
            uiCtrl.displayItem(newItem, input.type);

            //calculate and display new totals
            var calcTotals = budgetCtrl.getTotals(input.type, parseInt(input.val));
            uiCtrl.displayTotals(calcTotals);

            //calculate and display new budget
            var calcBudget = budgetCtrl.getBudget(input.type, parseInt(input.val));
            uiCtrl.displayBudget(calcBudget);

            //get global percentage
            var globalPercentage = budgetCtrl.getGlobalPercentage();
            uiCtrl.displayGlobalPercentage(globalPercentage);

            //clear
            uiCtrl.clearFields();
        }
    }

    return {
        init: function () {
            setUpEventListeners();
        }
    }
})(budgetController, UIController);

appController.init();