Global = {
    VAR:{
        enableLog: true,
        forceLogToWindow: false,
        currentLang: "en",
        languageData: {}
    },
    FUNC:{},
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
        if(Global.VAR.languageData === undefined || Global.VAR.languageData.lang === undefined){
            $.ajax({
                method: "GET",
                url: "translate/" + Global.VAR.currentLang + ".json",
                dataType : "json"
              })
            .done(function( data ) {
                if(data !== null && data.lang !== undefined){
                    Global.VAR.languageData = data;
                    if(data.lang[current_web_target] !== undefined ){
                        fillWebFont(data.lang[current_web_target]);
                    }
                    else{
                        Global.LOG("Get language target error,  target is [" +current_web_target +"]" );
                    }
                }else{
                    Global.LOG("Get language file error.");
                }
            })
            .fail(function(){
                Global.LOG("Get language file error.");
            });
        }
    }
}


$(window).on("load",function(){
    Global.FUNC.initWebLang("index_default");
})


function fillWebFont(target){
    $("[data-lang-tx]").each(function(){
        var fillText = $(this).attr("data-lang-tx");
        if(fillText === undefined){
            $(this).text("Lang Not Found.");
        }else{
            $(this).html(target[fillText]);
        }
    })
}