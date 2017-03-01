UI = (function ($) {
    'use strict';

    const ROOT_ID = 0;
    var whoClicked = null;
    // var newFolderCounter = 0;
    // var newFileCounter = 0;
    var folder_to_delete_found;
    var myRoot;
    var myFs;
    var openFileId;
    var self;
    var currentFolder;

function UI(fs, myHistory) {
        this.fs = fs;
        myFs = this.fs;
        this.myHistory = myHistory;
        this.init();
        this.root = this.fs.fs[0];
        myRoot = this.root;
        self = this;
}

UI.prototype.init = function () {
        this.buildRoot();
        this.setListeners();
        this.showContent(ROOT_ID);
        this.setRightClickMenu();
        this.setNavigationButtons();
        this.setAddressLine();
    }

UI.prototype.buildRoot = function () {
        var htmlToAppend = '<li class="liFolder0"><img class="folderClosed" src="folders.png"> <a href="#" data-id="0" id="aRoot" data-custom ="folder"> Root</a><ul class="collapsed"></ul></li>';
        $('.folderList').append(htmlToAppend);
    }

UI.prototype.setListeners = function () {
        var parent = $(".folderList");
        parent.on("click", "a", function (e) {
            whoClicked = $(e.currentTarget).attr('data-id');
            var id = $(e.currentTarget).attr('data-id');
            this.collapseExpand(id, true);
        }.bind(this));
        var contentItems = $(".content");
        contentItems.on("click", "a", function (e) {
            whoClicked = $(e.currentTarget).attr('data-id');
            var id = $(e.currentTarget).attr('data-id');
            if ($(e.currentTarget).attr('data-custom') == 'file') {
                self.open(whoClicked);
            } else {
                this.showContent(whoClicked, null, true);
            }
        }.bind(this));

        $('button.clearFileContent').on('click', function () {
            var fileToClear = self.fs.getItem(openFileId)
            fileToClear.clearFileContent();
        });
        $('button.saveFileContent').on('click', function () {
            var fileToSave = self.fs.getItem(openFileId);
            var saved = fileToSave.setContent($('textarea').val());
            if (saved) {
                $('.textarea').css('display', 'none');
            }

        });
    }

UI.prototype.setNavigationButtons = function(e) {
    $('#back-btn').on('click', function(){
        self.myHistory.goBack();
        self.showContent(null, self.myHistory.currentFolder);
    });
    $('#forward-btn').on('click', function(){
        self.myHistory.goForward();
        self.showContent(null, self.myHistory.currentFolder);
    });
}

UI.prototype.collapseExpand = function (id, changeHistory) {
        var whereTo = '.liFolder' + whoClicked + '> ul';
        var changeImg = '.liFolder' + whoClicked + '> img';
        if ($(whereTo).attr('class') == 'collapsed') {
            $(whereTo).attr('class', 'expanded');
            $(changeImg).attr('class', 'folderOpen');
            this.showFolderList(id, changeHistory);
        } else {
            $(whereTo).attr('class', 'collapsed');
            $(changeImg).attr('class', 'folderClosed');
            $(whereTo).empty();
            this.showContent(whoClicked, null, changeHistory);
        }
    }

UI.prototype.showFolderList = function (id, changeHistory) {
   currentFolder = this.fs.getItem(id);
         var showChildren = currentFolder.getChildren();
        for (var child of showChildren) {
            if (child.getType() == 'folder') {
                var htmlToAppend = '<li class="liFolder' + child.getId() + '"><img class="folderClosed"> <a href="#" data-id="'
                    + child.getId() + '" data-custom ="folder">'
                    + child.name + '</a><ul class="collapsed"></ul></li>';
                var whereToAppend = '.liFolder' + whoClicked + '> ul';
                $(whereToAppend).append(htmlToAppend);
            }
        }
        this.showContent(whoClicked, null, changeHistory);
    }

UI.prototype.showContent = function (id, myHistoryLocation, changeHistory) {
    this.fs.path = '';
    $('li a').removeClass('highlight');
    $('.content').empty();
    if (myHistoryLocation) {
        currentFolder = myHistoryLocation
        id = currentFolder.id;
     } else {
        var folder = this.fs.getItem(id);
        currentFolder = folder;
        this.myHistory.addToHistory(changeHistory, currentFolder);
    }
    var getAddressLine = this.fs.getPath(currentFolder.id, this.fs.fs);
    this.showAddressLine();
    var toHighLight = currentFolder.id;
    $('a[data-id='+toHighLight+']').attr('class','highlight');
    if (currentFolder.children) {
        for (var item of currentFolder.children) {
            var liFolder = '<span><a href="#" data-custom ="folder" data-id="' + item.id + '"><img src="folders.png"> '
                + item.name + '</a></span>';
            var liFile = '<span><a href="#" data-custom ="file" data-id="' + item.id + '"><img src="File.png"> '
                + item.name + '</a> </span>';
            if (item.getType() == 'folder') {
                $('.content').append(liFolder);
            } else {
                $('.content').append(liFile);
            }
        }
    }
    this.setRightClickMenu();
    this.updateNavButtons();
}

UI.prototype.responseToUser = function (startMessage, Arg1, Arg2, endMessage) {
        var myResponse;
        if (startMessage && Arg1 && !Arg2 && !endMessage) {
            myResponse = Arg1 + startMessage;
        }
        else if (!Arg1 && Arg2) {
            myResponse = startMessage + Arg2;
        }
        else if (endMessage) {
            //responseToUser('Sorry, the name ', newItem ,null, ' is taken.');
            myResponse = startMessage + Arg1 + endMessage;
        }
        else if (!Arg1 && !Arg2) {
            myResponse = startMessage;
        }
        $('.messageArea').text(myResponse);
        setTimeout(this.clearMessage, 3500);
    }

UI.prototype.clearMessage = function () {

        $('.messageArea').css('display', 'none');
    }

UI.prototype.createFile = function () {
    var id = $('.right-click-menu').data('id');
     if(id==undefined){
        id= currentFolder.id;
    } else {
        currentFolder = findById(myRoot, id);
      }
    var newName = prompt('Enter name of file to add');
    if (newName == null) {
        return;
    } else if (newName == '') {
         newName = undefined;
    } else {
       var ifExists = findByName(currentFolder, newName)
      }
        if (!ifExists) {
            var newItem = self.fs.addFile(newName, currentFolder.id);
            self.open(newItem.id);
            self.showContent(currentFolder.id);
        } else {
            this.responseToUser('Sorry, the name "', newName, null, '" is taken.');
        }

    }

UI.prototype.createFolder = function () {
    debugger;
    var id = $('.right-click-menu').data('id');
    if(id == undefined){
        id = currentFolder.id;
    } else {
        currentFolder = findById(myRoot, id);
    }
    var newName = prompt('Enter name of folder to add');




    if (newName == null) {
        return;
    } else if (newName == '') {
        newName = undefined;
    } else {
        var ifExists = findByName(currentFolder, newName)
    }
    if (!ifExists) {
        var newItem = self.fs.addFolder(newName, currentFolder.id);
        self.collapseExpand(currentFolder.id);
        self.collapseExpand(currentFolder.id);
        self.showContent(currentFolder.id);
         id = undefined;
    } else {
        self.responseToUser('Sorry, the name "', newName, null, '" is taken.');
    }
}

UI.prototype.updateFolderList = function (item, action) {
        var htmlToAppend = '<li class="liFolder' + item.id + '"><img class="small" src="folders.png"> <a href="#" data-id="'
            + item.id + '" data-custom ="folder">'
            + item.name + '</a><ul class="collapsed"></ul></li>';
        var whereToAppend = '.liFolder' + currentFolder.id + '> ul';
        if (action == 'rename') {
            $(whereToAppend).empty();
        }
        $(whereToAppend).attr('class', 'expanded');
        $(whereToAppend).append(htmlToAppend);

    }

UI.prototype.rename = function () {
        var id = $('.right-click-menu').data('id');
        if(id == 0){
            self.responseToUser('Sorry, cannot change Root directory name');
        }  else{
            var newName = prompt('Enter new name');
            if(newName == null){return;}
            else if(newName == ''){
                self.responseToUser('Sorry, please enter a valid name');
                return;
            }
            var ifExists = findByName(self.fs.fs[0], newName);
            if(!ifExists){
                var renamed = self.fs.rename(id, newName);
                if(renamed) {
                    $('a[data-id=' + id + ']').text(newName);
                    self.showContent(currentFolder.id);
                }
            } else {
                self.responseToUser('Sorry, the name ', newName , null, ' is taken.');
            }
        }


    }

UI.prototype.uiDelete = function (id) {
   if (id == 0) {
      this.responseToUser("Root directory cannot be deleted");
    } else {
        var itemToDelete = findById(this.root, id)
      }
        var areYouSure = confirm('Are you sure you want to delete ' + itemToDelete.name + '?');
        if (!areYouSure) {
            this.responseToUser("Action cancelled");
        } else {
        folder_to_delete_found = 0;
        currentFolder = findById(this.fs.fs[0], itemToDelete.getParentId());
           var hasBeenDeleted = this.fs.deleteItem(id, currentFolder);
            if (hasBeenDeleted) {
               id = undefined;
                this.showContent(currentFolder.id);
                this.collapseExpand(currentFolder.id);
                this.collapseExpand(currentFolder.id);
                this.responseToUser(" has been deleted", itemToDelete.name);
            } else {
                $('.messageArea').text(itemToDelete.name + " cannot be deleted");
                setTimeout(this.clearMessage, 3000);
            }
        }
}

UI.prototype.open = function(id){
    openFileId = id;
   var fileToOpen = myFs.getItem(id);
        $('.textarea').css('display', 'block');
        $('textarea').attr('data-id', id);
        $('textarea').val(fileToOpen.getContent());
        $('textarea').focus();
        $('.textarea').keyup(function (event) {
            if (event.keyCode == 27) {
              var saved = fileToOpen.setContent( $('textarea').val());
                if(saved){
                    $('.textarea').css('display', 'none');}
                 }
        });

}

UI.prototype.setRightClickMenu = function() {
        $('[data-custom]').off('contextmenu');
        $('[data-custom]').on('contextmenu', this.setMenu);

        $('.fileSystem').contextmenu(function () { return false; });
        $(window).click(function () { self.hideRightClickMenu(); });
    };

UI.prototype.setMenu = function(event){
    event.stopPropagation();
    self.setRightClickMenuItems();
    showRightClickMenu(event);
    return false;
}

UI.prototype.setRightClickMenuItems = function() {
        $('.right-click-menu > menuitem').off('click');
        $('.right-click-menu > .rename').on('click', self.rename);
        $('.right-click-menu > .createFolder').on('click', self.createFolder);
        $('.right-click-menu > .createFile').on('click', self.createFile);
        $('.right-click-menu > .delete').on('click', function () {
            var id = $('.right-click-menu').data('id');
              self.uiDelete(id);
        });
        $('.right-click-menu > .open').on('click', function () {
            var id = $('.right-click-menu').data('id');
            self.open(id);
        });
    };

UI.prototype.hideRightClickMenu = function() {
        $('menu.right-click-menu').css('display', 'none');
    }

UI.prototype.updateNavButtons = function(){
        if(this.myHistory.hereAndNow <= 0) {
            $('.back-btn').attr('class', 'back-btn-no-more');
        } else {
            $('.back-btn-no-more').attr('class', 'back-btn');
        }
        if(this.myHistory.hereAndNow != this.myHistory.myHistoryArray.length - 1|| this.myHistory.hereAndNow ==undefined) {
            $('.forward-btn-no-more').attr('class', 'forward-btn');
        } else {
            $('.forward-btn').attr('class', 'forward-btn-no-more');
        }
    }

UI.prototype.showAddressLine = function () {
    $('.addressLine').val(this.fs.path);
}

UI.prototype.setAddressLine = function() {
    $('input.addressLine').keyup(function (event) {
        if (event.keyCode == 13) {
           self.fs.path = $(this).val();
            self.goToAddress(self.fs.path);
        }
    });
}

UI.prototype.goToAddress = function(path) {
    var pathElements = path.split('/');
    pathElements[0] = myRoot;
    for(var i=0; i < pathElements.length; i++){
        if(pathElements[i+1]!='' && pathElements[i+1] != undefined ){
            var folder = findByName(pathElements[i], pathElements[i+1])
            pathElements[i+1] = folder;
        } else{
            break;
          }
    }
    this.showContent(folder.getId());
}

function showRightClickMenu(e) {
        var id = $(e.currentTarget).attr('data-id');
        var type = $(e.currentTarget).attr('data-custom');
        $('menu.right-click-menu').css('display', 'block');
        $('menu.right-click-menu').attr('data-type', type);
        $('menu.right-click-menu').css('left', e.pageX + 'px');
        $('menu.right-click-menu').css('top', e.pageY + 'px');
        $('menu.right-click-menu').data('id', id);
    }

// function substituteName(item) {
//    if(item=='folder'){
//             var name = (newFolderCounter == 0) ? 'new Folder':'new Folder' + newFolderCounter;
//             newFolderCounter++;
//         } else {
//             name = (newFileCounter == 0) ? 'new File':'File' + newFileCounter;
//             newFileCounter++;
//         }
//         return name;
//     }

return UI;

})(jQuery)