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
                str += "<span id='goBack" + isLevel[1] + "'></span>"
            }
            str += "<ul>";
            $.each(data,function(index,side_data){
                if(parseInt(isLevel[1]) > 1){
                    $.each(side_data,function(index,side2_data){
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
        str += "<li id='" + data.id + "' class='side-item " + data.class + "' target-link='" + data.link + "' obj-title='" + secTarget + "'>" + hasSubStr + "</li>";
    }else{
        str += "<li id='" + data.id + "' class='side-item " + data.class + "' target-url='" + data.url + "' obj-title='" + secTarget + "'>" + hasSubStr + "</li>";
    }
    
    return str;
}
function sideEvt(){
    $(".side-item").on("click",function(){
        console.log("yes");
        var targetLink = $(this).attr("target-link");
        var targetUrl = $(this).attr("target-url");
        var targetid=$(this).attr("id");
        var isBack = targetid.split("goBack");
        if(targetLink!== undefined){
            var level = parseInt(targetLink.split(".")[0].split("level")[1]);
            $("#sidebar-" + (level - 1)).hide();
            var tarObj = $(this).attr("obj-title");
            
            $("#sidebar-" + level + "[obj-title='" + tarObj + "']").show();
            $("#sidebar-" + level).find(".side-item").hide();
            $("#sidebar-" + level).show();
        }else if(targetUrl){
            $("#inside_cont").load("inside_page/" + targetUrl);
        }
    })
}
