var findById = function (item, id) {
    id = id|| 0;
    if (item.id == id) {
        return item;
    } else {
        if(item.children){
            for(var child of item.children) {
                var found = findById(child, id);
                if (found) {
                return found;
            }
        }
      }
    }
}

var findByName = function (item, name) {
    if (item.name == name) {
        return item;
    } else {
        if(item.children){
        for (var child of item.children) {
            if (child.name == name) {
                return child;
            }
         }
        }
      }
}


