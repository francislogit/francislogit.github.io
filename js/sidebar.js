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
                str += "<span id='goBack" + isLevel[1] + "' class='back-item'>Go Back</span>"
            }
            str += "<ul>";
            $.each(data,function(index,side_data){
                if(parseInt(isLevel[1]) > 1){
                    $.each(side_data,function(index2,side2_data){
                        str += sidebarTemplate(side2_data, index);
                    });
                }else{
                    str += sidebarTemplate(side_data);
                }
            });
            str += "</ul>";
            $("#sidebar-level" + isLevel[1]).html(str);
        }
    });
    sideEvt();
}
function sidebarTemplate(data, index){
    var str = "";
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
    if(data.link !== undefined){
        if(secTarget.length == 0){
            secTarget = data.link.split(".")[1];
        }
        str += "<li id='" + data.id + "' class='side-item " + data.class + "' target-link='" + data.link + "' obj-title='" + secTarget + "'>" + hasSubStr + "</li>";
    }else{
        str += "<li id='" + data.id + "' class='side-item " + data.class + "' target-url='" + data.url + "' obj-title='" + secTarget + "'>" + hasSubStr + "</li>";
    }
    
    return str;
}
function sideEvt(){
    $(".side-item").on("click",function(){
        var targetLink = $(this).attr("target-link");
        var targetUrl = $(this).attr("target-url");
        if(targetLink !== undefined){
            var level = parseInt(targetLink.split(".")[0].split("level")[1]);
            var tarObj = targetLink.split(".")[1];
            sidebarSwitch((level-1), level, tarObj);
            if($("#page-url .stop").length > 0){
                $("#page-url .stop").remove();
            }
            $("#page-url").append("<span> > " + $(this).find(".sidebar-text").text() + "</span>");
        }else if(targetUrl !== undefined){
            $("#inside-cont").load("inside_page/" + targetUrl);
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
        $("#sidebar-level" + targetLevel + " li[obj-title='" + targetObj + "']").show();
        $("#sidebar-level" + targetLevel).show();
    }
}

