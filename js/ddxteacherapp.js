document.addEventListener("deviceready", onDeviceReady, false);
function onDeviceReady() {
    StatusBar.hide();
}


$(document).ready(function(e) {
	var level="1.1",childElements =[],path;
	$(document).bind('pageinit', function() {
        $(this).find('a[data-rel="back"]').click(function(event) {
            $('#searchBox').val('');
            $('#searchWindow').hide();
                
            event.stopPropagation();
            event.stopImmediatePropagation();
            // console.log("level length : "+level);
            if((level!=="" || typeof(level)!=undefined) && childElements.length>0) {
                recollapse("true","collapse");
            }
            $.mobile.back();

            return true;
        });
    }); 
    
    var recollapse = function(booleanAttr,c) { 
        for(var i=0;i<=level.length;i=i+2){
            var stepLevel=level.substring(0, level.length-i);
            childElements.each(function(element){
                var levelNumber = $(this).data('level');
                if(typeof levelNumber === 'number'){
                    levelNumber = levelNumber.toString();
                }
                if((levelNumber===stepLevel) && (typeof $(this).data('collapsed') !== typeof undefined && $(this).data('collapsed') !== false)){
                    $(this).attr("data-collapsed",booleanAttr);
                    $(this).collapsible(c);   
                }
            });
        }
    };

    $('#btnsearch').click(function(e) {
    	console.log('button search');
        if($("#searchWindow").is(':hidden')){
        	$('#searchWindow').show();
        	$('#searchBox').focus();
        } else {
        	$('#searchBox').val('');
        	$('#searchWindow').hide();
        }
    });

    $('#searchBtn').on('click',function(event){
        
        searching(event);
    })
    var searching=function searching (event) {
        searchResult=[];
            var str=$('#searchBox').val();
            if (str === "") {
                alert ("Please enter some text to search!");
                return;
            }

            var listItems = $("#parentList li");

            listItems.each(function(li) {
                var substr = $(this).clone().children().remove().end().text();

                if (substr.toLowerCase().match(str.toLowerCase())) {

                    var path = $(this).parent().data('pathattribute');
                    var level = $(this).data('level');
                    var parentLi = $(this).parent().data('levelattribute');
                    var temp={};
                   
                    temp["level"]=level;
                    temp["path"]=path;
                    temp["parentLi"]=parentLi;
                    temp["searchResultString"]=substr;
                    searchResult.push(temp);
                }
            });

            $("#resultList").empty();
            // console.log("result length....."+searchResult.length);
            if(searchResult.length!==0){
                for (cnt = 0; cnt < searchResult.length; cnt++) {
                    var str = resultListText(searchResult[cnt].level);
                    $("#resultList").append("<li class=\"searchterm\" data-level="+searchResult[cnt].level+" data-path="+searchResult[cnt].path+"><a href=\"#\">"+str+"<a></li>");
                }
                $('#searchBox').val('');
                $('#searchWindow').hide();
            } else {
                $("#resultList").append("<li>No result found after searching. Click 'Back' to go to Home page</li>");
            }
            window.location = "#searchResult";
    }

    $('#searchBox').keypress(function(event){
        var keycode = (event.keyCode ? event.keyCode : event.which);
        if(keycode == '13'){  
            searching(event);
        }
        event.stopPropagation();
    });
        
    $("#resultList").on("click", ".searchterm", function(event){
    	level=$(this).data('level').toString();
        path=$(this).data('path');
        childElements = $(path).find("*");
      	childElements.each(function(element){
            if(level===$(this).attr("data-level")) {
                window.location = path;
                setTimeout(function(){
                    recollapse("false","expand");
                },25);
                
            }
        });         
    });

    var resultListText = function(datalevel) { 
        var str=" ";
        var indices = [];
        for(var i=0; i<datalevel.length;i++) {
            if (datalevel[i] == ".") 
                indices.push(i);
        }
        for(var i=1;i<=indices.length-1;i++){
            var stepLevel=datalevel.substring(0, indices[i]);
            var listItems1= $("#parentList").find("[data-level='" + stepLevel + "']");
            str+=$(listItems1).clone().children().remove().end().text() + " / ";   
        }
        var liLastElement = $("#parentList").find("[data-level='" + datalevel + "']");
        str+=$(liLastElement).clone().children().remove().end().text();
        return str;
    };

   	$(document).on('click', '.ui-input-clear', function () {
   		$('#searchWindow').hide();
   	});
});