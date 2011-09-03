/// <reference path="jquery-1.6.2.js" />
/// <reference path="knockout-1.2.1.js" />
/// <reference path="qunit.js" />
/// <reference path="todos.js" />

module("tasks");
test("when creating a task, it is not completed.", function () {
    var t = new todos.Task();
    //assert
    ok(!t.completed());
});

test("when creating a task, you can specify a name.", function () {
    var name = "test task";
    var t = new todos.Task(name);
    //assert
    equal(t.name(), name);
});

test("when creating a task, you can specify a complete status", function () {
    var t = new todos.Task("some name", true);
    //assert
    ok(t.completed());
});

test("when creating a task, is not in editing mode.", function(){
    var t = new todos.Task();
    ok(!t.editing());
});

test("when deleting a task, it should be removed from the backlog", function() {
   var backlog = new todos.Backlog();
    backlog.newTask.save();
    backlog.tasks()[0].remove();

    ok(backlog.tasks().length == 0);
});
test("when storing a task, should contain name and status", function(){
    var t = new todos.Task("test name", true);
    var dto = t.toDto();

    equal(dto.name, "test name");
    equal(dto.completed, true);
});

module("newTaskModel");
test("toTask creates a task with the right name", function () {
    var m = new todos.NewTaskModel();
    m.name("test task");
    var t = m.toTask();
    //assert
    equal(t.name(), "test task");
});
test("clear sets the name to empty string", function () {
    var m = new todos.NewTaskModel();
    m.name("some name");
    m.clear();
    equal(m.name(), "");
});

test("when saving a new task, task is added to the backlog's tasks.", function () {
    var backlog = new todos.Backlog();
    var m = backlog.newTask;
    m.name("test task");
    m.save();
    //assert
    equal(backlog.tasks().length, 1);
    equal(backlog.tasks()[0].name(), "test task");
});

test("has name is true when name is not empty.", function () {
    var m = new todos.Backlog().newTask;
    m.name("test task");
    //assert
    ok(m.hasName());
});

module("backlog");
test("a new backlog should contain an empty list of tasks.", function () {
    var backlog = new todos.Backlog();
    //assert
    ok(backlog.tasks().length === 0, "actual: " + backlog.tasks);
});

test("a new backlog should contain an empty list of pending tasks.", function () {
    var backlog = new todos.Backlog();
    //assert
    ok(backlog.pending().length === 0);
});

test("a new backlog should contain an empty list of completed tasks.", function () {
    var backlog = new todos.Backlog();
    //assert
    ok(backlog.completed().length === 0);
});

test("should be able to add a task to the backlog.", function () {
    var backlog = new todos.Backlog();
    backlog.tasks.push(new todos.Task("test task"));
    equal(backlog.tasks().length, 1);
});

test("when a pending task is added, pending tasks contains one task", function () {
    var backlog = new todos.Backlog();
    backlog.tasks.push(new todos.Task("test task"));
    equal(backlog.pending().length, 1);
});

test("when a pending task is added, completed tasks is empty", function () {
    var backlog = new todos.Backlog();
    backlog.tasks.push(new todos.Task("test task"));
    equal(backlog.completed().length, 0);
});

test("when adding a task and then completing it, pending tasks is empty", function () {
    var backlog = new todos.Backlog();
    var t = new todos.Task("test task");
    backlog.tasks.push(t);
    t.completed(true);
    //assert
    equal(backlog.pending().length, 0);
});

test("when adding a task and then completing it, completed tasks has one", function () {
    var backlog = new todos.Backlog();
    var t = new todos.Task("test task");
    backlog.tasks.push(t);
    t.completed(true);
    //assert
    equal(backlog.completed().length, 1);
});

test("when cleaning completed tasks, backlog's completed tasks is empty", function () {
    var backlog = new todos.Backlog();
    var t = new todos.Task("test task");
    backlog.tasks.push(t);
    t.completed(true);
    backlog.clearCompleted();

    equal(backlog.completed().length, 0);
});

test("when cleaning completed tasks, backlog's uncompleted tasks are not deleted.", function () {
    var backlog = new todos.Backlog();
    var t = new todos.Task("test task");
    backlog.tasks.push(t);
    backlog.clearCompleted();

    equal(backlog.tasks().length, 1);
});

test("when cleaning a completed task, backlog's uncompleted task is not deleted.", function () {
    var backlog = new todos.Backlog();
    var t1 = new todos.Task("test task");
    backlog.tasks.push(t1);
    var t2 = new todos.Task("test task");
    backlog.tasks.push(t2);
    t2.completed(true);
    backlog.clearCompleted();

    equal(backlog.tasks().length, 1);
});

test("when cleaning tasks, backlog's tasks is empty", function () {
    var backlog = new todos.Backlog();
    backlog.tasks.push(new todos.Task("test task"));
    backlog.clearTasks();
    //assert
    equal(backlog.tasks().length, 0);
});

test("when backlog is empty, completeVsTotal is 0/0", function () {
    var backlog = new todos.Backlog();

    equal(backlog.completeVsTotal(), "0/0");
});

test("when there's a pending task in the backlog, completeVsTotal is 0/1", function () {
    var backlog = new todos.Backlog();
    backlog.newTask.save();

    equal(backlog.completeVsTotal(), "0/1");
});

test("when there's one complete task in the backlog, completeVsTotal is 1/1", function () {
    var backlog = new todos.Backlog();
    var t = new todos.Task();
    backlog.tasks.push(t);
    t.completed(true);

    equal(backlog.completeVsTotal(), "1/1");
});

test("when backlog has one item, itemsLeft should be ' item left.' ", function() {
    var backlog = new todos.Backlog();
    backlog.newTask.save();

    equal(backlog.itemsLeft(), " item left.");
});
test("when backlog has more than one item, itemsLeft should be ' items left.' ", function(){
    var amount = 5;
    var backlog = new todos.Backlog();
    for(var i = 0; i < 5; i++){
        backlog.newTask.save();
    }
    equal(backlog.itemsLeft(), " items left.");
});

test("when backlog has one completed item, itemsCompleted should be ' completed item.' ", function() {
    var backlog = new todos.Backlog();
    backlog.newTask.save();
    backlog.tasks()[0].completed(true);
    equal(backlog.itemsCompleted(), " item left.");
});
test("when backlog has more than one completed item, itemsCompleted should be ' completed items.' ", function(){
    var amount = 5;
    var backlog = new todos.Backlog();
    for(var i = 0; i < 5; i++){
        backlog.newTask.save();
        backlog.tasks()[i].completed(true);
    }
    equal(backlog.itemsCompleted(), " items left.");
});

test("when there are tasks, hasTasks is true.", function(){
    var backlog = new todos.Backlog();
    backlog.newTask.save();
    equal(backlog.hasTasks(), true);
});
test("when there are no tasks, hasTasks is false.", function(){
    var backlog = new todos.Backlog();
    equal(backlog.hasTasks(), false);
});

test("when there are completed tasks, hasCompletedTasks is true.", function(){
    var backlog = new todos.Backlog();
    backlog.newTask.save();
    backlog.tasks()[0].completed(true);
    equal(backlog.hasCompletedTasks(), true);
});
test("when there are no completed tasks, hasCompletedTasks is false.", function(){
    var backlog = new todos.Backlog();
    backlog.newTask.save();
    equal(backlog.hasCompletedTasks(), false);
});