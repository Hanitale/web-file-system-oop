function File(id, name, parentId, content) {
    this.name = name;
    this.content = content;
    this.id = id;
    this.parentId = parentId
    this.newCounter = 0;
}
File.prototype.open = function(){
    $('.textarea').css('display', 'block');
    $('textarea').attr('data-id', id);
    $('textarea').val(this.content);
    $('textarea').focus();
    $('.textarea').keyup(function (event) {
        if (event.keyCode == 27) {
            saveFileContent()
        }
    });
    $('textarea').blur(function (event) {
          this.saveFileContent();
    });

}

File.prototype.clearFileContent = function() {
    $('textarea').val('');
    $('textarea').focus();
    this.content = '';
}

File.prototype.setContent = function (content) {
    this.content = content;
    return true;
}

File.prototype.getParentId = function(){
    return this.parentId;
}

File.prototype.getId = function (content) {
    return this.id;
}

File.prototype.getType = function (content) {
    return 'file';
}

File.prototype.rename = function(newName) {
    this.name = newName;
}

File.prototype.getContent = function() {
    return this.content;
}
