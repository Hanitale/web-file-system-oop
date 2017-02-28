(function() {
    'use strict'
    var fs = new FileSystem();
    var myHistory = new MyHistory();
    var ui = new UI(fs, myHistory);
 })();