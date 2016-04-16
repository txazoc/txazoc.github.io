(function ($) {
    var $page = $('.page');
    if ($page.length > 0) {
        var pageValue = $page.attr('page');
        var pages = pageValue.split('#');
        var currentPage = pages[0];
        var totalPage = pages[1];
    }
})(jQuery);
