Global = {
    VAR:{
        enableLog: true,
        forceLogToWindow: false,
        currentLang: "en",
        languageData: {}
    },
    FUNC:{},
    PAGE:{
        DATA:(function(){}),
        EVENT:(function(){}),
        LANG:"index_default"
    },
    LOG:function(str){
        if( Global.VAR.enableLog == false){
            return false;
        }
        if($("body.mobile").length > 0 || Global.VAR.forceLogToWindow == true){
            $.alert("[Mobile Log] : [" + str + "]");
            return 1;
        }else{
            console.log("[Log] : [" + str + "]");
            return 2;
        }
    }
}

Global.FUNC = {
    initWebLang: function( current_web_target ){
        function handelLang(data){
            if(data !== null && data.lang !== undefined){
                Global.VAR.languageData = data;
                var tempLang = current_web_target.split(".");
                var targetLang = data.lang[tempLang.shift()];
                $.each(tempLang,function(i, val){
                    if(targetLang !== undefined){
                        targetLang = targetLang[val];
                    }else{
                        Global.LOG("Get language target error,  target is [" +current_web_target +"]" );
                        return false;
                    }
                })
                if(targetLang === undefined){
                    Global.LOG("Get language target error,  target is [" +current_web_target +"]" );
                    return false;
                }
                fillWebFont(targetLang);
            }else{
                Global.LOG("Get language file error.");
            }
        }
        if(Global.VAR.languageData === undefined || Global.VAR.languageData.lang === undefined){
            $.ajax({
                method: "GET",
                url: "translate/" + Global.VAR.currentLang + ".json",
                dataType : "json"
              })
            .done(function( data ) {
                handelLang(data);
            })
            .fail(function(){
                Global.LOG("Get language file error.");
            });
        }else{
            handelLang(Global.VAR.languageData);
        }
    }
}


$(window).on("load",function(){
    Global.FUNC.initWebLang("index_default");
    createSidebar();
    if($(window).width() <= 980){
        $("#header, #content, #footer").css("max-width", $(window).width());
        $("#header, #content, #footer").css("min-width", $(window).width());
        $("#header, #content, #footer").css("width", $(window).width());
    }
})

$(window).on("resize",function(){
    if($(window).width() <= 980){
        $("#header, #content, #footer").css("max-width", $(window).width());
        $("#header, #content, #footer").css("min-width", $(window).width());
        $("#header, #content, #footer").css("width", $(window).width());
    }else{
        $("#header, #content, #footer").attr("style","");
    }
})


function fillWebFont(target){
    $("[data-lang-tx]").each(function(){
        var fillText = $(this).attr("data-lang-tx");
        if(target[fillText] === undefined){
            //$(this).text("Lang Not Found.");
        }else{
            $(this).html(target[fillText]);
        }
    })
}