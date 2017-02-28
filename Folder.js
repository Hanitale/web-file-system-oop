function Folder(id, name, parentId) {
    this.id = id;
    this.name = name;
    this.children = [];
    this.parentId = parentId;
    this.newFolderCounter = 0;
    this.newFileCounter = 0;
}

Folder.prototype.deleteChild = function (id) {
    for(var i=0; i< this.children.length; i++){
        if(this.children[i].id ==id){
            this.children.splice(i, 1);
            return true;
        }
    }
}

Folder.prototype.rename = function (newName) {
this.name = newName;
}

Folder.prototype.addChild = function (item) {
    this.children.push(item);
    return item;
}

Folder.prototype.findChild = function (id) {
    for(var child in this.children){
        if(child.id == id){
            return child;
        }
    }
}

Folder.prototype.getChildren = function () {
  return this.children;
}

Folder.prototype.getId = function () {
    return this.id;
}

Folder.prototype.getType = function () {
    return 'folder';
}

Folder.prototype.getParentId = function(){
    return this.parentId;
}

