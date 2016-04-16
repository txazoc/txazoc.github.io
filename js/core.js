resize();

function resize() {
    document.getElementById('footer').style.display = 'block';
    var windowHeight = document.documentElement.clientHeight;
    var headHeight = document.getElementById('header').clientHeight;
    var footHeight = document.getElementById('footer').clientHeight;
    var mainHeight = windowHeight - headHeight - footHeight;
    document.getElementById('main').style.minHeight = (mainHeight + 0.5) + 'px';
}

$(function () {
    $('#toolbar-top').on('click', function () {
        $('html, body').animate({scrollTop: 0}, 'slow');
    });

    String.prototype.startWith = function (str) {
        var reg = new RegExp("^" + str);
        return reg.test(this);
    };

    //$('pre code').each(function (i, block) {
    //    var language = $(this).attr('class').trim();
    //    // $(this).parent().addClass('hljs-txazo').append('<span class="language">' + language + '</span>');/**/
    //    $(this).parent().addClass('hljs-txazo hljs-dark');
    //    hljs.highlightBlock(block);
    //});
});
