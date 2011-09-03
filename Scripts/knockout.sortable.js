    //connect items with observableArrays
    ko.bindingHandlers.sortableList = {
        init: function(element, valueAccessor) {
            var list = valueAccessor();
            $(element).sortable({
                update: function(event, ui) {
                    //retrieve our actual data item
                    var item = ui.item.tmplItem().data;
                    //figure out its new position
                    var position = ko.utils.arrayIndexOf(ui.item.parent().children(), ui.item[0]);
                    //remove the item and add it back in the right spot
                    if (position >= 0) {
                        list.remove(item);
                        list.splice(position, 0, item);
                    }
                }
            });
        }
    };