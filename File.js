function File(id, name, parentId, content) {
    this.name = name;
    this.content = content;
    this.id = id;
    this.parentId = parentId
    this.newCounter = 0;
}


File.prototype.setContent = function (content) {
    this.content = content;
    return true;
}

File.prototype.getParentId = function(){
    return this.parentId;
}

File.prototype.getId = function () {
    return this.id;
}

File.prototype.getType = function () {
    return 'file';
}

File.prototype.rename = function(newName) {
    this.name = newName;
}

File.prototype.getContent = function() {
    return this.content;
}
