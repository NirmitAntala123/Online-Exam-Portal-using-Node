store = () => {
    let flag=true;
    let Sid=$('#sid').val();
    let Nm=$('#name').val();
    let Qa=$('#qa').val();
    let Em=$('#email').val();
    let Un=$('#unm').val();
    let Pa=$('#pass').val();
    let Number = /^[0-9]+$/;
    let letter = /^[ a-zA-Z]+$/;
    let mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    if(Sid == ""){
        // document.getElementById('est').innerText="please enter studentid";
        $('#est').html("please enter studentid");
        $('#sid').focus();
        flag=false; 
    }
    else if(Sid.match(Number) == null){
        $('#est').html("please enter valid studentid");
        $('#sid').focus();
        flag=false;
    }
    else if(Nm == ""){
       $("#est").html("please enter name");
       $('#name').focus();
        flag=false; 
    }
    else if(Nm.match(letter) == null){
        $("#est").html("please enter valid name");
        $('#name').focus();
         flag=false; 
     }
     else if(Qa == ""){
        $("#est").html("please enter Qualification");
        $('#qa').focus();
         flag=false; 
     }
     else if(Qa.match(letter) == null){
        $("#est").html("please enter valid field");
        $('#qa').focus();
         flag=false; 
     }
     else if(Em == ""){
        $("#est").html("please enter email");
        $('#email').focus();
         flag=false; 
     }
     else if(Em.match(mailformat) == null){
        $("#est").html("please enter valid email");
        $('#email').focus();
         flag=false; 
     }
     else if(Un == ""){
        $("#est").html("please enter username");
        $('#unm').focus();
         flag=false; 
     }
     else if(Un.match(letter) == null){
         $("#est").html("please enter valid username");
         $('#unm').focus();
          flag=false; 
      }
      else if(Pa == ""){
        $("#est").html("please enter password");
        $('#pass').focus();
        
         flag=false; 
     }
     if(flag!=false)
    alert("Registration successful");

return flag;
    
}

login = () => {
    let flag=true;
    let Lun=$('#luser').val();
    let Lpa=$('#lpass').val();
    
    let letter = /^[ a-zA-Z]+$/;

     if(Lun == ""){
        $("#elo").html("please enter username");
        $('#luser').focus();
         flag=false; 
     }
     else if(Lun.match(letter) == null){
         $("#elo").html("please enter valid username");
         $('#luser').focus();
          flag=false; 
      }
      else if(Lpa == ""){
        $("#elo").html("please enter password");
        $('#lpass').focus();
        
         flag=false; 
     }
     return flag;
}
