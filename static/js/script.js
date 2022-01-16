window.addEventListener("load" , function (){

    $("#submit").on("click", function(){ submit(); });

    //inputタグに対して、Enterを押すと送信されてしまう。これではJSONがページを埋め尽くすので、Enterキーは受け付けないようにする。
    $(document).on("keypress", "input:not(.allow_submit)", function(event) {
        return event.which !== 13;
    });


    $("#search_submit").on("click", function(){ refresh(search=true); });

    refresh();
});


function submit(){

    let form_elem   = "#form_area";

    let data    = new FormData( $(form_elem).get(0) );

    /*
    let data    = new FormData();
    */
    let url     = $(form_elem).prop("action");
    let method  = $(form_elem).prop("method");

    //data.set("comment","aaa");

    console.log(data);
    
    for (let v of data ){ console.log(v); }
    for (let v of data.entries() ){ console.log(v); }

    $.ajax({
        url: url,
        type: method,
        data: data,
        processData: false,
        contentType: false,
        dataType: 'json'
    }).done( function(data, status, xhr ) { 

        if (data.error){
            console.log("ERROR");
        }
        else{
            $("#content_area").html(data.content);
            $("#textarea").val("");
        }

    }).fail( function(xhr, status, error) {
        console.log(status + ":" + error );
    }); 

}

function refresh(search=false){
    /*

    //AjaxでGETメソッドでデータを送信する場合
    オブジェクト型で送信する。
    Ajax送信時、processDataとcontentTypeは消してデフォルトを読み込みさせる。

    注)POSTメソッドのようにFormDataオブジェクトを使用したり、processData:false contentType:falseを指定すると正常にデータを送信できない
    */

    let data    = {};
    let word    = $("#search_text").val();

    //検索キーワードが指定されている場合、セットして送信
    if (word){
        data["search"]  = word;
    }

    let url     = "/refresh";
    let method  = "GET";

    console.log(data);
    //for (let v of data ){ console.log(v); };

    $.ajax({
        url: url,
        type: method,
        data:data,
        dataType: 'json'
    }).done( function(data, status, xhr ) { 

        if (data.error){
            console.log("ERROR");
        }
        else{
            console.log("OK");
            $("#content_area").html(data.content);
        }

        //検索実行時の場合はループしない
        if (!search){
            loop();
        }

    }).fail( function(xhr, status, error) {
        console.log(status + ":" + error );
    }); 

}

function loop(){
    setTimeout(refresh, 1000);
}



