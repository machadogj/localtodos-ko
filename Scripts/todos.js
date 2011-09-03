var todos = (function () {

    var Task = function (name, completed, backlog) {
        this.name = ko.observable(name);
        this.completed = ko.observable(completed === true);
        this.backlog = backlog;
        this.editing = ko.observable(false);
        this.edit = function(){
            this.editing(true);
        };
        this.view = function(){
            this.editing(false);
        };
        this.remove = function(){
            backlog.tasks.remove(this);
        };
        
        this.toDto = function(){
            return {name: this.name(), completed: this.completed()};
        };
        
        if (backlog){
            backlog.tasks.push(this);
        }
    };

    var NewTaskModel = function (backlog) {
        this.backlog = backlog;
        this.name = ko.observable();
        this.toTask = function () {
            return new todos.Task(this.name(), false, this.backlog);
        };
        this.clear = function () {
            this.name("");
        }
        this.save = function () {
            var task = this.toTask();
            this.clear();
            return task;
        };

        this.hasName = ko.dependentObservable(function () {
            return this.name() && this.name().length > 0;
        }, this);
    };
    
    var Backlog = function () {
        this.tasks = ko.observableArray()
        this.pending = ko.dependentObservable(function () {
            return $.grep(this.tasks(), function (item) {
                return !item.completed();
            });
        }, this);
        this.completed = ko.dependentObservable(function () {
            return $.grep(this.tasks(), function (item) {
                return item.completed();
            });
        }, this);
        
        this.clearCompleted = function () {
            this.tasks.removeAll(this.completed());
        };
        this.clearTasks = function () {
            this.tasks([]);
        };
        this.completeVsTotal = ko.dependentObservable(function () {
            return this.completed().length + "/" + this.tasks().length;
        }, this);

        this.newTask = new todos.NewTaskModel(this);

        this.itemsLeft = ko.dependentObservable(function(){
            if (this.pending().length == 1){
                return " item left.";
            }
            else{
                return " items left.";
            }
        }, this);

        this.itemsCompleted = ko.dependentObservable(function(){
            if (this.completed().length == 1){
                return " item left.";
            }
            else{
                return " items left.";
            }
        }, this);

        this.hasTasks = ko.dependentObservable(function(){
            return this.tasks().length > 0;
        }, this);

        this.hasCompletedTasks = ko.dependentObservable(function(){
            return this.completed().length > 0;
        }, this);
    };

    return { Task: Task, Backlog: Backlog, NewTaskModel: NewTaskModel};
    
})();
