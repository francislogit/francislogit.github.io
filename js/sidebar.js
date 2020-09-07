function createSidebar(){
    $.ajax({
        method: "GET",
        url: "data/sidebar_setting.json",
        dataType : "json"
      })
    .done(function( data ) {
        if(data !== null && data.level1 !== undefined){
            genSidebar(data);
        }else{
            Global.LOG("Get sidebar file error.");
        }
    })
    .fail(function(){
        Global.LOG("Get sidebar file error.");
    });
}
function genSidebar(data){
    $("#sidebar").empty();
    
    
    $.each(data,function(index, data){
        var isLevel = index.split("level");
        var str = "";
        if(isLevel.length > 1){
            $("#sidebar").append("<div id='sidebar-level" + isLevel[1] + "' class='sidebar-level'></div>");
            if(parseInt(isLevel[1]) > 1){
                $("#sidebar-level" + isLevel[1]).append("<span id='goBack" + isLevel[1] + "' class='back-item'>Go Back</span>");
                $("#goBack" + isLevel[1]).data("prevLevel", parseInt(isLevel[1])-1);
            }
            $("#sidebar-level" + isLevel[1]).append("<ul></ul>");
            $.each(data,function(index,side_data){
                if(parseInt(isLevel[1]) > 1){
                    $.each(side_data,function(index2,side2_data){
                        str = sidebarTemplate(side2_data, index);
                        str.data("belongTo", index);
                        str.data("currentLevel",parseInt(isLevel[1]));
                        $("#sidebar-level" + isLevel[1] + " ul").append(str);
                    });
                }else{
                    str = sidebarTemplate(side_data);
                    str.data("belongTo", index);
                    str.data("currentLevel",parseInt(isLevel[1]));
                    $("#sidebar-level" + isLevel[1] + " ul").append(str);
                }
            });
        }
    });
    sideEvt();
}
function sidebarTemplate(data, index){
    var str = "";
    var $str = "";
    var hasSubStr = "";
    var secTarget = "";
    if(index !== undefined){
        secTarget = index;
    }
    if(data.hasSub == true){
        hasSubStr += "<div class='sidebar-text'>" + data.tag + "</div>" + 
                    "<div class='sidebar-icon'><i class='fas fa-chevron-right'></i></div>";
    }else{
        hasSubStr += "<div class='sidebar-text'>" + data.tag + "</div>";
    }
    str += "<li id='" + data.id + "' class='side-item " + data.class + "'>" + hasSubStr + "</li>";
    $str = $(str);
    $str.data("currentTag", data.tag)
    $str.data("followWith", data.link );
    $str.data("endWith", data.url );
    return $str;
}
function sideEvt(){
    $(".side-item").on("click",function(){
        var targetLink = $(this).data("followWith");
        var targetUrl = $(this).data("endWith");
        if(targetLink !== undefined && targetLink.length != 0){
            var level = parseInt(targetLink.split(".")[0].split("level")[1]);
            var tarObj = targetLink.split(".")[1];
            sidebarSwitch((level-1), level, tarObj);
            if($("#page-url .stop").length > 0){
                $("#page-url .stop").remove();
            }
            $("#page-url").append("<span> > " + $(this).find(".sidebar-text").text() + "</span>");
        }else if(targetUrl !== undefined && targetUrl.length != 0){
            $("#inside-cont").load("inside_page/" + targetUrl, function(){
                Global.PAGE.DATA();
                Global.PAGE.EVENT();
                Global.FUNC.initWebLang(Global.PAGE.LANG);
                $("#inside-cont").trigger("finishPageLoad");
            });
            if($("#page-url .stop").length == 0){
                $("#page-url").append("<span class='stop'> > " + $(this).find(".sidebar-text").text() + "</span>");
            }
        }
    })
    $(".back-item").on("click",function(){
        var currentLevel = parseInt($(this).parents(".sidebar-level").attr("id").split("sidebar-level")[1]);
        sidebarSwitch(currentLevel,(currentLevel-1));
        if($("#page-url .stop").length > 0){
            $("#page-url .stop").remove();
        }
        $("#page-url").find("span").last().remove();
    });
}
function sidebarSwitch(currentLevel, targetLevel, targetObj){
    if(targetLevel < currentLevel){
        $("#sidebar-level" + currentLevel).hide();
        $("#sidebar-level" + targetLevel).show();
    }else{
        $("#sidebar-level" + currentLevel).hide();
        $("#sidebar-level" + targetLevel).find(".side-item").hide();
        $("#sidebar-level" + targetLevel + " li").each(function(){
            if(targetObj == $(this).data("belongTo")){
                $(this).show();
            }
        })
        $("#sidebar-level" + targetLevel).show();
    }
}

