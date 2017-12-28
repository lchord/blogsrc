$(function() {
    $(".back-to-top").hide();
    $(window).on("scroll",
    function() {
        var b = $(document).scrollTop();
        if (b > 0) {
            $(".back-to-top").fadeIn()
        } else {
            $(".back-to-top").fadeOut()
        }
    });
    $(".back-to-top i").on("click",
    function() {
        $("html,body").animate({
            scrollTop: 0
        },
        500)
    })
  });