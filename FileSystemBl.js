FileSystem = (function () {
    'use strict';

var fsFlatArray = [];
var fs=[];
var findLastId = [];
var lastId;
var self;

function FileSystem() {
    this.root = new Folder(0, 'Root', -1);
    var savedFileSystem = this.readFromLocalStorage();
    if(savedFileSystem){
        this.fs = [savedFileSystem];
    } else{
     this.fs = [this.root];
      }
    this.path ='';
    self = this;
}

FileSystem.prototype.readFromLocalStorage = function() {
      var localStorageContent = localStorage.getItem('fs');
        if (localStorageContent) {
            var fsFlatArray = JSON.parse(localStorageContent);
            var response =  this.restoreFileSystem(fsFlatArray);
       } return response;
}

FileSystem.prototype.restoreFileSystem = function(fsFlatArray ) {
   var tempArray = [];
        for(var item of fsFlatArray){
           if(item.type=='folder'){
                var itemToAdd = new Folder(item.id, item.name, item.parentId);
            } else {
                itemToAdd = new File(item.id, item.name, item.parentId, item.content );
              }
       tempArray.push(itemToAdd);
       findLastId.push(item.id);
        }
    for(var restoredItem of tempArray){
        //var currentFolder = restoredItem;
        for(var i = 0; i < tempArray.length; i++){
            if(restoredItem.id == tempArray[i].parentId){
                restoredItem.children.push(tempArray[i]);
            }
        }
    }
    var highestId = Math.max.apply(Math, findLastId);
    lastId = highestId;
    return tempArray[0];
}

FileSystem.prototype.flattenArray = function(fileSystem){
    for(var item of fileSystem){
        if (item.getType()== 'folder') {
            var itemToFlatten = {
                id: item.getId(),
                parentId: item.parentId,
                name: item.name,
                type: item.getType(),
                  };
        } else  {
            itemToFlatten = {
                id: item.getId(),
                parentId:item.parentId,
                name: item.name,
                type: item.getType(),
                content: item.getContent()};
        }
        console.log(item.name);
        fsFlatArray.push(itemToFlatten);
        if(item.children){
          this.flattenArray(item.children);
        }
    }
     this.saveToLocalStorage(fsFlatArray);

}

FileSystem.prototype.saveToLocalStorage = function(fsFlatArray){
    var fsContent = JSON.stringify(fsFlatArray);
    localStorage.clear();
    localStorage.setItem('fs', fsContent)
    //responseToUser('FileSystem saved Successfully to LocalStorage');

}

FileSystem.prototype.getItem = function (id) {
        if (id == 0) {
            return this.fs[0];
        } else {
            return findById(this.fs[0], id);
        }
}

FileSystem.prototype.addFolder = function (name, parentId) {
    var parent = this.getItem(parentId);
    if(!name){
        if( parent.newFolderCounter == 0){
            name = 'new Folder'
            parent.newFolderCounter++;
        } else {
            name = 'new Folder'+ parent.newFolderCounter;
            parent.newFolderCounter++;
        }
    }   var newFolder = new Folder(++lastId, name, parentId);
    parent.addChild(newFolder);
    fsFlatArray = [];
    this.flattenArray(this.fs);
    return newFolder;
}

FileSystem.prototype.addFile = function (name, parentId, content) {
    var parent = this.getItem(parentId);
    if(!name){
        if( parent.newFileCounter == 0){
            name = 'new File'
            parent.newFileCounter++;
        } else {
            name = 'new File'+ parent.newFileCounter;
            parent.newFileCounter++;
        }
    }
    var newFile = new File(++lastId, name, parentId);
    parent.addChild(newFile);
    fsFlatArray = [];
    this.flattenArray(this.fs);
    return newFile;
}

FileSystem.prototype.rename = function (id, newName) {
    var item = this.getItem(id);
    item.rename(newName);
    fsFlatArray = [];
    this.flattenArray(this.fs);
    return item;
        }

FileSystem.prototype.deleteItem = function (id, currentFolder) {
        var deleted = currentFolder.deleteChild(id);
        fsFlatArray = [];
        this.flattenArray(this.fs);
        return deleted;
    }

FileSystem.prototype.getPath = function(id, fileSystem) {
       if (fileSystem) {
            for (var i=0; i<fileSystem.length; i++) {
                if (fileSystem[i].getId() == id) {
                    this.path = fileSystem[i].name + '/' + this.path;
                    return fileSystem[i];
                }
                else {
                    var found = this.getPath(id, fileSystem[i].children);
                    if (found) {
                        this.path = fileSystem[i].name + '/' + this.path;
                        return found;
                    }
                }
            }
        }
    }

return FileSystem;
})();



