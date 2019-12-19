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
        this.perc = -1;
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
        getPercentages: function(obj) {
            obj.perc = Math.round((parseInt(obj.val) / budget.totals.inc) * 100);
        },

        addItem: function (type, description, value) {
            var newItem;

            if (type === 'inc') {
                newItem = new Income(incomeId, description, value);
                incomeId++;
                // budget.allItems.exp.forEach(this.getPercentages(obj));
            } else {
                newItem = new Expense(expenseId, description, value);
                expenseId++;
                if (budget.totals.inc > 0) {
                    this.getPercentages(newItem);
                }
            }
            budget.allItems[type].push(newItem);

            return newItem;
        },

        getTotals: function (operation, type, value) {
            operation === 'add' ? budget.totals[type] += value : budget.totals[type] -= value;

            return {
                totalInc: budget.totals.inc,
                totalExp: budget.totals.exp
            }
        },

        getBudget: function (operation, type, value) {
            if (operation === 'add') {
                type === 'inc' ? budget.total += value : budget.total -= value;
            } else {
                type === 'inc' ? budget.total -= value : budget.total += value;
            }
            return budget.total;
        },

        getGlobalPercentage: function () {
            budget.percentage = budget.totals.inc > 0 ? Math.round((budget.totals.exp / budget.totals.inc) * 100) : -1;
            return budget.percentage;
        },

        deleteItem: function (type, id) {
            if (type === 'inc' & budget.total > 0) {
                // budget.allItems.exp.forEach(this.getPercentages(item));
            }
            var ids = budget.allItems[type].map(function(current) {
                return current.id;
            });
            index = ids.indexOf(id);
            var temp = budget.allItems[type][index].val;

            if (index !== -1) {
                budget.allItems[type].splice(index, 1);
            }
            return temp;
        }
    }
})();

var UIController = (function () {
    var queries = {
        month: document.querySelector('.budget__title--month'),
        addType: document.querySelector('.add__type'),
        addDesc: document.querySelector('.add__description'),
        addVal: document.querySelector('.add__value'),
        addBtn: document.querySelector('.add__btn'),
        incomeList: document.querySelector('.income__list'),
        expenseList: document.querySelector('.expenses__list'),
        container: document.querySelector('.container'),
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

        formatNumbers: function(num, type) {
            num = Math.abs(num);
            num = num.toFixed(2);
            var numSplit = num.split('.');

            var int = numSplit[0];
            if (int.length > 3) {
                var thousands = int.length % 3;
                int = int.substr(0, thousands) + ',' + int.substr(thousands, 3);
            }

            int = type === 'inc' ? '+' + int : '-' + int;
            numSplit[0] = int;
            num = numSplit.join('.');
            return num;
        },

        displayMonth: function() {
            var now, year, months, month;
            now = new Date();
            year = now.getFullYear();
            months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            month = now.getMonth();
            queries.month.textContent = months[month] + ' ' + year;
        },

        changeType: function() {
            addClass = function(el, className) {
                el.classList.toggle(className);
            }
            addClass(queries.addType, 'red-focus');
            addClass(queries.addDesc, 'red-focus');
            addClass(queries.addVal, 'red-focus');
            addClass(queries.addBtn, 'red');
        },

        displayItem: function (obj, type) {
            var html, element;

            if (type === 'inc') {
                element = queries.incomeList;
                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            } else {
                element = queries.expenseList;
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">%percentage%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'

                html = obj.perc >= 0 ? html.replace('%percentage%', obj.perc + '%') : html.replace('%percentage%', '...');
            }

            html = html.replace('%id%', obj.id);
            html = html.replace('%description%', obj.desc);
            html = html.replace('%value%', this.formatNumbers(obj.val, type));

            element.insertAdjacentHTML('beforeend', html);
        },

        displayTotals: function (obj) {
            queries.totalIncome.textContent = this.formatNumbers(obj.totalInc, 'inc');
            queries.totalExpense.textContent = this.formatNumbers(obj.totalExp, 'exp');
        },

        displayGlobalPercentage: function (globalPercValue) {
            queries.globalPercentage.textContent = globalPercValue >= 0 ? globalPercValue + "%" : "...';"
        },

        displayBudget: function (budgetValue) {
            var budgetType = budgetValue >= 0 ? 'inc' : 'exp';
            queries.totalBudget.textContent = this.formatNumbers(budgetValue, budgetType);
        },

        removeItem: function (id) {
            el = document.getElementById(id)
            el.parentNode.removeChild(el);
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
        queries.container.addEventListener('click', ctrlDeleteItem);
        queries.addType.addEventListener('change', uiCtrl.changeType);
    }

    var calculate = function(operation, type, value) {
        //calculate and display new totals
        var calcTotals = budgetCtrl.getTotals(operation, type, value);
        uiCtrl.displayTotals(calcTotals);
    
        //calculate and display new budget
        var calcBudget = budgetCtrl.getBudget(operation, type, value);
        uiCtrl.displayBudget(calcBudget);
    
        //get global percentage
        var globalPercentage = budgetCtrl.getGlobalPercentage();
        uiCtrl.displayGlobalPercentage(globalPercentage);
    }

    var ctrlAddItem = function () {
        var input = uiCtrl.getInput();

        if (input.desc !== "" && !isNaN(input.val) && input.val > 0) {

            var newItem = budgetCtrl.addItem(input.type, input.desc, input.val);
            uiCtrl.displayItem(newItem, input.type);

            calculate('add', input.type, parseInt(input.val));

            uiCtrl.clearFields();
        }
    }

    var ctrlDeleteItem = function() {
        var itemId, splitId;
        itemId = event.target.parentNode.parentNode.parentNode.parentNode.id;

        if (itemId) {
            splitId = itemId.split('-');
            type = splitId[0];
            id = splitId[1];

            var temp = budgetCtrl.deleteItem(type, parseInt(id));
            uiCtrl.removeItem(itemId);
            calculate('remove', type, parseInt(temp));
        }
    }

    return {
        init: function () {
            uiCtrl.displayMonth();
            setUpEventListeners();
        },

        ohwell: function() {
            console.log(budgetCtrl.budget.allItems.exp);
        }
    }
})(budgetController, UIController);

appController.init();