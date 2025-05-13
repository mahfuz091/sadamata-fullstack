(function ($) {
    "use strict";

    $(window).on("load", function () {
        bwsplit_text();
    });

    // Split Text
    function bwsplit_text() {
        setTimeout(function () {
            var splitTextElements = $(".sec-title__title, .sec-title__tagline, .page-header__title, .title, .bw-text");
            if (splitTextElements.length === 0) return;
            gsap.registerPlugin(SplitText);
            splitTextElements.each(function (index, element) {
                var splitElement = new SplitText(element, {
                    type: "chars, words", // "chars, words, lines"
                });

                gsap.set(element, {
                    perspective: 400
                });

                if ($(element).hasClass("bw-split-in-fade")) {
                    gsap.set(splitElement.chars, {
                        opacity: 0,
                        ease: "Back.easeOut"
                    });
                }
                if ($(element).hasClass("bw-split-in-right")) {
                    gsap.set(splitElement.chars, {
                        opacity: 0,
                        x: "20",
                        ease: "Back.easeOut"
                    });
                }
                if ($(element).hasClass("bw-split-in-left")) {
                    gsap.set(splitElement.chars, {
                        opacity: 0,
                        x: "-20",
                        ease: "Back.easeOut"
                    });
                }
                if ($(element).hasClass("bw-split-in-up")) {
                    gsap.set(splitElement.chars, {
                        opacity: 0,
                        y: "20",
                        ease: "circ.out"
                    });
                }
                if ($(element).hasClass("bw-split-in-down")) {
                    gsap.set(splitElement.chars, {
                        opacity: 0,
                        y: "-20",
                        ease: "circ.out"
                    });
                }
                if ($(element).hasClass("bw-split-in-rotate")) {
                    gsap.set(splitElement.chars, {
                        opacity: 0,
                        rotateX: "50deg",
                        ease: "circ.out"
                    });
                }
                if ($(element).hasClass("bw-split-in-scale")) {
                    gsap.set(splitElement.chars, {
                        opacity: 0,
                        rotateX: "50deg",
                        ease: "circ.out"
                    });
                }
                element.anim = gsap.to(splitElement.chars, {
                    scrollTrigger: {
                        trigger: element,
                        toggleActions: "restart pause resume reverse",
                        start: "top 90%"
                    },
                    x: "0",
                    y: "0",
                    rotateX: "0",
                    scale: 1,
                    opacity: 1,
                    duration: 1.2,
                    stagger: 0.02
                });
            });
        }, 200);
    }

    /****Image Reveal Animation Js ****/
    const options = {
        root: null,
        rootMargin: "0px",
        threshold: 0.9,
    };

    let bwCallback = (entries, self) => {
        entries.forEach(entry => {
            let container = entry.target;
            let img = entry.target.querySelector("img");
            const easeInOut = "power3.out";
            const revealAnim = gsap.timeline({
                ease: easeInOut
            });

            if (entry.isIntersecting) {
                revealAnim.set(container, {
                    visibility: "visible",
                });
                revealAnim.fromTo(
                    container, {
                        clipPath: "polygon(0 0, 0 0, 0 100%, 0% 100%)",
                        webkitClipPath: "polygon(0 0, 0 0, 0 100%, 0% 100%)",
                    }, {
                        clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
                        webkitClipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
                        duration: 1,
                        ease: easeInOut,
                    }
                );
                revealAnim.from(img, 4, {
                    scale: 1.4,
                    ease: easeInOut,
                    delay: -1,
                });
                self.unobserve(entry.target);
            }
        });
    };

    let bwObserver = new IntersectionObserver(bwCallback, options);

    document.querySelectorAll(".bw-image-anim").forEach(reveal => {
        bwObserver.observe(reveal);
    });



    var hoverBtns = gsap.utils.toArray(".wb-hover-btn-wrapper");

    const hoverBtnItem = gsap.utils.toArray(".wb-hover-btn-item");
    hoverBtns.forEach((btn, i) => {
        $(btn).mousemove(function (e) {
            callParallax(e);
        });

        function callParallax(e) {
            parallaxIt(e, hoverBtnItem[i], 80);
        }

        function parallaxIt(e, target, movement) {
            var $this = $(btn);
            var relX = e.pageX - $this.offset().left;
            var relY = e.pageY - $this.offset().top;

            gsap.to(target, 0.5, {
                x: ((relX - $this.width() / 2) / $this.width()) * movement,
                y: ((relY - $this.height() / 2) / $this.height()) * movement,
                ease: Power2.easeOut,
            });
        }
        $(btn).mouseleave(function (e) {
            gsap.to(hoverBtnItem[i], 0.5, {
                x: 0,
                y: 0,
                ease: Power2.easeOut,
            });
        });
    });

    // button hover animation
    $('.wb-hover-btn').on('mouseenter', function (e) {
        var x = e.pageX - $(this).offset().left;
        var y = e.pageY - $(this).offset().top;

        $(this).find('.wb-btn-circle-dot').css({
            top: y,
            left: x
        });
        console.log($('.wb-hover-btn'))
    });

    $('.wb-hover-btn').on('mouseout', function (e) {
        var x = e.pageX - $(this).offset().left;
        var y = e.pageY - $(this).offset().top;

        $(this).find('.wb-btn-circle-dot').css({
            top: y,
            left: x
        });
        console.log($(this))
    });

})(jQuery);