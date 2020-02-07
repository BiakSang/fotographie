///get viewport dimensions
let v = {
    w: () => {
        ///return viewport width
        return $(window).innerWidth();
    },
    h: () => {
        ///return viewport height
        return $(window).innerHeight();
    },
    
    setHeaderHeight: () => {
        ///set header height to viewport height
        $("header").css({
            "height" : `${v.h()}px`
        });
    },
    setPhotosHeight: () => {
        if (v.w() > 700){
            const vw50 = v.w() / 2;
            const vw40 = (v.w() / 10) * 4;
            const vw70 = (v.w() / 10) * 7;
            $(".lp, .pl").css({
                "height" : `${vw50}px`
            });
            $(".ll").css({
                "height" : `${vw40}px`
            });
            $(".pp").css({
                "height" : `${vw70}px`
            });
        }
        else {
            $(".lp, .pl").css({
                "height" : "auto"
            });
            $(".ll").css({
                "height" : "auto"
            });
            $(".pp").css({
                "height" : "auto"
            });
        }
    },
    
    set: () => {
        ///set DOM elements style
        v.setHeaderHeight();
        v.setPhotosHeight();
    }
};

v.set();
$(window).on("resize", v.set);

///DOM triggers
let dt = {
    controlMenu: () => {
        const fullscreen = $("#top-bar").attr("class");
        
        if (fullscreen.includes("fullscreen")){
            ///hide top-bar navigation
            $("#top-bar").removeClass("fullscreen");
        }
        else {
            ///show top-bar navigation
            $("#top-bar").addClass("fullscreen");
        }
    },
    explore: () => {
        const vh = $(window).innerHeight();
        $(window).scrollTop(vh);
    },
    onScroll: () => {
        const scrollTop = $(window).scrollTop();
        const vh = $(window).innerHeight();
        
        ///control category main element
        if (scrollTop >= vh){
            ///show category main
            $("main").addClass("active");
        }
        else {
            ///hide category main
            $("main").removeClass("active");
        }
    },
    
    movePlaceholderOnFocus: (el) => {
        $(el).prev().addClass("blur");
    },
    movePlaceholderOnBlur: (el) => {
        const value = $(el).val();
        
        if (value.length <= 0){
            $(el).prev().removeClass("blur");
        }
    },
    resetContactForm: () => {
        $("#email-input").val("");
        $("#message-input").val("");
    }
};

$(window)
    .on("scroll", dt.onScroll)
    .on("load", dt.resetContactForm);

///photos
let p = {
    category: "wedding",
    
    container: '<div class="photos ORIENTATION">PHOTOONEPHOTOTWO</div>',
    photo: '<a href="assets/photos/CATEGORY/NAME" target="_blank" class="photo"><img src="assets/photos/CATEGORY/NAME" class="photo_"></a>',
    
    showCategories: () => {
        $("#categories").addClass("visible");
        setTimeout(() => {
            $("#categories-back-layer").addClass("visible");
            $("#category-list").addClass("visible");
        }, 100);
        
        p.markCurrentCategory();
    },
    markCurrentCategory: () => {
        $(".category").removeClass("active");
        const category = document.getElementsByClassName("category");
        for (let i = 0; i < category.length; i++){
            const c = $(category[i]).attr("data-category");
            if (c === p.category){
                $(category[i]).addClass("active");
                break;
            }
        }
    },
    hideCategories: () => {
        $("#category-list").removeClass("visible");
        setTimeout(() => {
            $("#categories-back-layer").removeClass("visible");
        }, 100);
        setTimeout(() => {
            $("#categories").removeClass("visible");
        }, 200);
    },
    load: (category, scroll) => {
        const c = category;
        category = eval(category);
        p.setCurrentCategory();
        
        $("#photos").html("");
        for (let i = 0; i < category.length; i+=2){
            let orientation = "";
            if (category[i]){
                if (category[i].orientation === "l"){
                    orientation += "l";
                }
                else if (category[i].orientation === "p"){
                    orientation += "p";
                }
            }
            if (category[i+1]){
                if (category[i+1].orientation === "l"){
                    orientation += "l";
                }
                else if (category[i+1].orientation === "p"){
                    orientation += "p";
                }
            }
            
            let newPhotos = "";
            if (orientation.length === 2){
                newPhotos = p.container
                .split("ORIENTATION")
                .join(orientation)
                .split("PHOTOONE")
                .join(
                    p.photo
                    .split("CATEGORY")
                    .join(c)
                    .split("NAME")
                    .join(category[i].name)
                )
                .split("PHOTOTWO")
                .join(
                    p.photo
                    .split("CATEGORY")
                    .join(c)
                    .split("NAME")
                    .join(category[i+1].name)
                )
            }
            else if (orientation.length === 1){
                newPhotos = p.container
                .split("ORIENTATION")
                .join(orientation)
                .split("PHOTOONE")
                .join(
                    p.photo
                    .split("CATEGORY")
                    .join(c)
                    .split("NAME")
                    .join(category[i].name)
                )
                .split("PHOTOTWO")
                .join("")
            }
            else {
                newPhotos = "";
                break
            }
            
            $("#photos").append(newPhotos);
        }
        
        v.setPhotosHeight();
        setTimeout(() => {
            if (scroll){
                dt.explore();
            }
        }, 300);
    },
    initLoad: () => {
        p.load(p.category);
    },
    loadCategory: (el) => {
        const c = $(el).attr("data-category");
        
        p.category = c;
        p.load(p.category, true);
        h.goBack();
    },
    setCurrentCategory: () => {
        $("#current-category span").text(p.category);
    }
};

$(window).on("load", p.initLoad);

///hashchange
let h = {
    onHashChange: () => {
        if (location.hash === ""){
            $("#anc").removeClass("visible");
            p.hideCategories();
        }
        else if (location.hash === "#anc"){
            $("#anc")
            .addClass("visible")
            .scrollTop(0);
        }
        else if (location.hash === "#categories"){
            p.showCategories();
        }
    },
    goBack: () => {
        history.back();
    },
    clear: () => {
        if (location.hash.length > 0){
            history.back();
        }
        setTimeout(() => {
            if (location.hash.length > 0){
                history.back();
            }
        }, 100);
        setTimeout(() => {
            if (location.hash.length > 0){
                history.back();
            }
        }, 200);
    }
};

$(window).on("hashchange", h.onHashChange);
$(window).on("load", h.clear);
