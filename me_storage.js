//(NOTE*)OBJECT & ARRAY can be stored
//MARS SESSION,LOCAL,OBJ HANDLER (JQUERY) 2015-12-17
/*response (JSON OBJECT) : {
                            "responsecode": 1 : -1 ,
                                "responsestring" : "script response",
                                     "responsevalue" : "expected value"
                            }


*/

/*


SAMPLE :
         me_storage._index({"type": "session"}); //session , local, obj_tmp
        action-type : set[params=key,value],get[params=key],delete[params=key]

        me_storage._action({"action-type" : "set","key": "hello","value": 1234   });
        var obj_response = me_storage._action({"action-type" : "get","key": "hello"});
        alert(obj_response['responsevalue']);  
        :    
*/



var me_storage = new function()
{
    this._tmp_vars = {};
    this._vars = {
        "current-params" : null,
    };

    this._current_type = "object-tmp"; //session,local,object-tmp
    this._index = function(array_params)
    {

        if(!window.jQuery){me_storage._halt({"halt-type" : "no-jquery"});}

        if(typeof array_params['type']!='undefined')
        {
           switch(array_params['type'].toLowerCase())
           {
            case "session":me_storage._current_type = "session";break;
            case "local":me_storage._current_type = "local"; break;
            case "object-tmp":me_storage._current_type = "object-tmp";break;
            default:me_storage._current_type = "session";break;
           }
        }

    }
    this._encode = function(value)
    {
        var encoded_value = {"type" : typeof value,"value": value};
         encoded_value= JSON.stringify(encoded_value);
        return  encoded_value;
    }
    this._decode = function(value)
    {
        var decoded_value = JSON.parse(value);
        return decoded_value;
    }
    this._halt = function(array_params)
    {
        var msg = "An error occured.";
        switch(array_params['halt-type'])
        {
            case "missing-jquery":
                msg = "Error: JQUERY not loaded.";
            break;
            case "missing-action-type":
                msg = "Error: Missing `action-type`";
            break;
            case "missing-required":
                 msg = "Error: Missing required parameter.";
            break;
            case "no-storage":
                msg = "Error: No Web Storage support..";
            break;
            case "no-jquery":
                 msg = "Error: JQUERY not loaded.";
            break;

        }

        console.log(msg);throw new Error(msg);

    }

    this._response_ticker = function(array_params)
    {
            var responsecode = -1;
            var responsevalue = "";
            var responsestring = "An Error occured";
           
           

        switch(array_params['type'])
        {

            case "object-tmp-set-ok" :
            case "session-set-ok" : 
            case "local-set-ok" :
                responsecode = 1;
                responsestring = "Set ok";
            break;

            //%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
            //%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
            //%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
                
            case "object-tmp-get-ok" : 
            case "session-get-ok":
            case "local-get-ok":
                responsecode = 1;
                responsestring = "Get ok";
            break;

            //%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
            //%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
            //%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

            case "object-tmp-delete-ok" :
            case "session-delete-ok":
            case "local-delete-ok":
                responsecode = 1;
                responsestring = "Delete ok";
            break;


            //%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
            //%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
            //%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
            //%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
            //%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
            //%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
            case "object-tmp-set-not-ok":
            case "session-set-not-ok":
            case "local-set-not-ok":
                responsecode = -1;
                responsestring = "Set not ok";
            break;

            case "object-tmp-get-not-ok":
            case "session-get-not-ok":
            case "local-get-not-ok":
                responsecode = -1;
                responsestring = "Get not ok";
            break;


            case "object-tmp-delete-not-ok":
            case "session-delete-not-ok":
            case "local-delete-not-ok":
                responsecode = -1;
                responsestring = "Delete not ok";
            break;
            //%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
            //%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
            //%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%


            //@@@@@@@@@@@@@@@@@@@@@@@@@@@
        }



        var response_array = {"responsecode" : responsecode,"responsestring" : responsestring,};

         if(typeof array_params['responsevalue']!="undefined"){
            response_array['responsevalue']=array_params['responsevalue'];
        }

        return response_array;

    }


    this._check_required = function(array_params)
    {
        var required_array = array_params['required-array'];
        var current_params = me_storage._vars['current-params'];

       

       
            var is_missing = false;
            
                 var is_exist = false;
                 var keylist = Array();
                 $.each(current_params,function(key,val){keylist.push(key);});
                 

                 for(x=0;x<required_array.length;x++)
                 {

                     var is_exist = $.inArray(required_array[x],keylist);
                     if(is_exist==-1){is_missing = true;}

                 }
                   
        if(is_missing == true){me_storage._halt({"halt-type" : "missing-required"});}


    }

    this._action = function(array_params)
    {
        //me_storage._action({"action-type":"set (key)(value)/get(key,value)/delete(key)"});
        

                if(typeof array_params['action-type']=='undefined' ){me_storage._halt({"halt-type" : "missing-action-type"});}


                 me_storage._vars['current-params'] = array_params;

                
                 var current_type = me_storage._current_type;
                 if(typeof array_params['type']!='undefined')
                 {
                    switch(array_params['type'].toLowerCase())
                       {
                        case "session":current_type = "session";break;
                        case "local":current_type= "local"; break;
                        case "object-tmp":current_type = "object-tmp";break;
                        default:current_type = "session";break;
                       }
                 }


                 if(current_type=='object-tmp')
                {
                    if(array_params['action-type']=='set')
                    {
                        var required_array = ["key","value"];
                        me_storage._check_required({"required-array" : required_array});
                        //@@@@@@@@@@@@@88888888888888888888
                        return me_storage._set_obj_tmp({"key":array_params['key'],"value" : array_params['value']});
                        //@@@@@@@@@@@@@88888888888888888888

                    }
                    else if(array_params['action-type']=='get')
                    {
                        var required_array = ["key"];
                        me_storage._check_required({"required-array" : required_array});
                        //@@@@@@@@@@@@@88888888888888888888
                        return me_storage._get_obj_tmp({"key":array_params['key']});
                        //@@@@@@@@@@@@@88888888888888888888

                    }
                    else if(array_params['action-type']=='delete')
                    {
                        var required_array = ["key"];
                        me_storage._check_required({"required-array" : required_array});
                        //@@@@@@@@@@@@@88888888888888888888
                        return me_storage._delete_obj_tmp({"key":array_params['key']});
                        //@@@@@@@@@@@@@88888888888888888888

                    }
                    
                }
                else if(current_type=='local')
                {
                    if(array_params['action-type']=='set')
                    {
                        var required_array = ["key","value"];
                        me_storage._check_required({"required-array" : required_array});
                        //@@@@@@@@@@@@@88888888888888888888
                       return me_storage._set_local({"key":array_params['key'],"value":array_params['value']});
                        //@@@@@@@@@@@@@88888888888888888888

                    }
                    else if(array_params['action-type']=='get')
                    {
                        var required_array = ["key"];
                        me_storage._check_required({"required-array" : required_array});
                        //@@@@@@@@@@@@@88888888888888888888
                       return  me_storage._get_local({"key":array_params['key']});
                        //@@@@@@@@@@@@@88888888888888888888

                    }
                    else if(array_params['action-type']=='delete')
                    {
                        var required_array = ["key"];
                        me_storage._check_required({"required-array" : required_array});
                        //@@@@@@@@@@@@@88888888888888888888
                       return  me_storage._delete_local({"key":array_params['key']});
                        //@@@@@@@@@@@@@88888888888888888888

                    }

                }
                else if(current_type=='session')
                {

                    if(array_params['action-type']=='set')
                    {
                        var required_array = ["key","value"];
                        me_storage._check_required({"required-array" : required_array});
                        //@@@@@@@@@@@@@88888888888888888888
                        return me_storage._set_session({"key":array_params['key'],"value":array_params['value']});
                        //@@@@@@@@@@@@@88888888888888888888

                    }
                    else if(array_params['action-type']=='get')
                    {
                        var required_array = ["key"];
                        me_storage._check_required({"required-array" : required_array});   
                        //@@@@@@@@@@@@@88888888888888888888
                        return me_storage._get_session({"key":array_params['key']});
                        //@@@@@@@@@@@@@88888888888888888888
                    }
                    else if(array_params['action-type']=='delete')
                    {
                        var required_array = ["key"];
                        me_storage._check_required({"required-array" : required_array});
                        //@@@@@@@@@@@@@88888888888888888888
                       return  me_storage._delete_session({"key":array_params['key']});
                        //@@@@@@@@@@@@@88888888888888888888
                    }

                }
         
       
    }

    //@@@@@@@@@@@@@@@@@@@@AAAAAAAAAAAAAAAAAAAAAA LOCAL STORAGE
    //XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
    this._set_local = function(array_params){
       var response_ticker = me_storage._response_ticker({
            "type" : "local-set-not-ok"
        });

     if(typeof(Storage) !== "undefined"){
             localStorage.setItem(array_params["key"],me_storage._encode(array_params["value"]));

                response_ticker = me_storage._response_ticker({
                    "type" : "local-set-ok"
                });   
        } 
     else{me_storage._halt({"halt-type" : "no-storage"});}
      return response_ticker;
    }
    this._get_local = function(array_params)
    {
       var response_ticker = me_storage._response_ticker({
            "type" : "local-get-not-ok"
        });

      if(typeof(Storage) !== "undefined"){
         var response = localStorage.getItem(array_params["key"]);
         if(response!=null){

                var obj_response = me_storage._decode(response);
                

                response_ticker = me_storage._response_ticker({
                    "type" : "local-get-ok",
                    "responsevalue" : obj_response['value'],
                });
         }
      }
      else{ me_storage._halt({"halt-type" : "no-storage"});}

     

      return response_ticker;
    }   
    this._delete_local = function(array_params)
    {
       var response_ticker = me_storage._response_ticker({
            "type" : "local-delete-not-ok"
        });


     if(typeof(Storage) !== "undefined"){
            localStorage.removeItem(array_params["key"]);

                response_ticker = me_storage._response_ticker({
                "type" : "local-delete-ok"
                });
        }
     else{ me_storage._halt({"halt-type" : "no-storage"});}

        return response_ticker;
    }
    //XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
    //@@@@@@@@@@@@@@@@@@@@AAAAAAAAAAAAAAAAAAAAAA  LOCAL STORAGE

    //@@@@@@@@@@@@@@@@@@@@AAAAAAAAAAAAAAAAAAAAAA SESSION STORAGE
    //XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
    this._set_session = function(array_params){
            var response_ticker = me_storage._response_ticker({
                    "type" : "session-set-not-ok"
                });

             if(typeof(Storage) !== "undefined"){

                     var value = me_storage._encode(array_params['value']);
                     sessionStorage.setItem(array_params["key"],value);

                        response_ticker = me_storage._response_ticker({
                            "type" : "session-set-ok"
                        });   
                } 
             else{me_storage._halt({"halt-type" : "no-storage"});}
              return response_ticker;
    }
    this._get_session = function(array_params){
           var response_ticker = me_storage._response_ticker({
                "type" : "session-get-not-ok"
            });

          if(typeof(Storage) !== "undefined"){
             var response = sessionStorage.getItem(array_params["key"]);
             if(response!=null){


                    var obj_response = me_storage._decode(response);

                    response_ticker = me_storage._response_ticker({
                        "type" : "session-get-ok",
                        "responsevalue" : obj_response['value'],
                    });


             }
          }
          else{ me_storage._halt({"halt-type" : "no-storage"});}

          return response_ticker;
    }
    this._delete_session = function(array_params){
             var response_ticker = me_storage._response_ticker({
                        "type" : "session-delete-not-ok"
                    });


                 if(typeof(Storage) !== "undefined"){

                            sessionStorage.removeItem(array_params["key"]);
                            response_ticker = me_storage._response_ticker({
                            "type" : "session-delete-ok"
                            });

                    }
                 else{ me_storage._halt({"halt-type" : "no-storage"});}

                    return response_ticker;
    }
    //XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
    //@@@@@@@@@@@@@@@@@@@@AAAAAAAAAAAAAAAAAAAAAA  SESSIOn STORAGE


    //@@@@@@@@@@@@@@@@@@@@AAAAAAAAAAAAAAAAAAAAAA OBJECT TMP STORAGE
    //XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
    this._set_obj_tmp = function(array_params){
        var response_ticker = me_storage._response_ticker({
            "type" : "object-tmp-set-not-ok"
        });

        me_storage._tmp_vars[array_params['key']] = me_storage._encode(array_params['value']);
        response_ticker = me_storage._response_ticker({
            "type" : "object-tmp-set-ok"
        });

        return response_ticker;
    }
    this._get_obj_tmp = function(array_params){
        var response_ticker = me_storage._response_ticker({"type" : "object-tmp-get-not-ok"});

        if(typeof me_storage._tmp_vars[array_params['key']]!='undefined'){
            var obj_response =  me_storage._decode(me_storage._tmp_vars[array_params['key']]);
            
             response_ticker = me_storage._response_ticker({
                "type" : "object-tmp-get-ok",
                "responsevalue":obj_response['value'],
            });
        }
        return response_ticker;
    }
    this._delete_obj_tmp = function(array_params){
        var response_ticker = me_storage._response_ticker({"type" : "object-tmp-delete-not-ok"});

        if(typeof me_storage._tmp_vars[array_params['key']]!='undefined')
            {
                delete me_storage._tmp_vars[array_params['key']];
                response_ticker = me_storage._response_ticker({
                     "type" : "object-tmp-delete-ok"
                 });
            }
        return response_ticker;
    }
    //XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
    //@@@@@@@@@@@@@@@@@@@@AAAAAAAAAAAAAAAAAAAAAA  OBJECT TMP STORAGE

}