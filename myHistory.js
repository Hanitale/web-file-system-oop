var self;

function MyHistory(){
    this.myHistoryArray = [];
    this.hereAndNow = -1;
    self = this;
    this.currentFolder;
}

MyHistory.prototype.goBack = function() {
     if (self.hereAndNow > 0) {
        this.currentFolder = self.myHistoryArray[--self.hereAndNow];
    }
}

MyHistory.prototype.goForward = function() {
    if (self.hereAndNow < self.myHistoryArray.length - 1) {
        this.currentFolder = self.myHistoryArray[++self.hereAndNow];
    }
}

MyHistory.prototype.addToHistory = function(changeHistory,currentFolder) {
   var isEmpty = this.myHistoryArray.length == 0;
    var isNotSame = this.myHistoryArray[this.hereAndNow] != currentFolder;
    var isEnd = this.hereAndNow == this.myHistoryArray.length - 1;
    if (isEnd && isNotSame) {
        this.myHistoryArray.push(currentFolder);
        this.hereAndNow++;
    } else if (changeHistory) {
        this.myHistoryArray.splice(this.hereAndNow+1, this.myHistoryArray.length - this.hereAndNow);
        if (isNotSame) {
            this.myHistoryArray.push(currentFolder);
        }
    }
}
