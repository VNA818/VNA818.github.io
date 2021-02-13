$(document).ready(function() {

const url = window.location; 
const urlObject = new URL(url);
const searchq = urlObject.searchParams.get('searchq');



function jsondisp(jsonfile){  
 $.getJSON( jsonfile, function( data1 ) {
  
  $.each( data1.data, function() {
    var il= this.attributes.posterImage.original;
    var arating =this.attributes.averageRating;
    var ratecolor='null';
  
    if (parseFloat(arating)>=75){
      ratecolor='good';
    } else if (parseFloat(arating)>=50){
      ratecolor='ok';
    } else if (parseFloat(arating)<50){
      ratecolor='bad';
    }else{
      ratecolor='null';
    }
     
    
    if (arating==null){
      arating='NR';
    }else{
    arating= parseFloat(arating).toFixed(1)+'%';
  }
    var des = '<header class="anititle">'+this.attributes.titles.en+'</header><br><header class="anidate">'+this.attributes.startDate+'</header><br><p class="anidisc">'+this.attributes.synopsis+'</p><div class="rating" id="'+ratecolor+'">'+arating+'</div>';

    
    in1=document.getElementsByClassName("imageinfo");
 //in1[0].innerHTML='Title:'+$("#search").val()+',    Link:'+il;
     im1=document.getElementsByClassName("image");
 im1[0].innerHTML='<img class="im1" src='+il+' alt="img result" >';
 im2=document.getElementsByClassName("disc");
 im2[0].innerHTML=des;
 $( '#loading' ).hide();
 return false;
     });


  });
}

function jsondisp2(jsonfile){  
 $.getJSON( jsonfile, function( data1 ) {
  
 //alert(jsonfile);
    var il= data1.data.attributes.posterImage.original;
    var arating =data1.data.attributes.averageRating;

    var ratecolor='null';
    
    if (parseFloat(arating)>=75){
      ratecolor='good';
    } else if (parseFloat(arating)>=50){
      ratecolor='ok';
    } else if (parseFloat(arating)<50){
      ratecolor='bad';
    }else{
      ratecolor='null';
    }
    if (arating==null){
      arating='NR';
    }else{
    arating= parseFloat(arating).toFixed(1)+'%';
  }
    var des = '<header class="anititle">'+data1.data.attributes.titles.en_jp+'</header><br><header class="anidate">'+data1.data.attributes.startDate+'</header><br><p class="anidisc">'+data1.data.attributes.synopsis+'</p><div class="rating" id="'+ratecolor+'">'+arating+'</div>';

    in1=document.getElementsByClassName("imageinfo");
 //in1[0].innerHTML='Title:'+$("#search").val()+',    Link:'+il;
     im1=document.getElementsByClassName("image");
 im1[0].innerHTML='<img class="im1" src='+il+' alt="img result" >';
 im2=document.getElementsByClassName("disc");
 im2[0].innerHTML=des;
 $( '#loading' ).hide();
 return false;
  


  });
}
  $( '#loading' ).hide();

  $("#submitButton").click(function() {
    $( '#loading' ).show();
    var sq= $("#search").val();
    sq=sq.replace(' ','%20');
    var  jsonfile ='https://kitsu.io/api/edge/anime?filter[text]='+sq;
    //'https://kitsu.io/api/edge/anime?filter[text]='+sq;
    //'https://vna818.github.io/anisearch/Resources/code/prac.json';
    jsondisp(jsonfile);
 
 
  });

$("#randbutton").click(function() {
    $( '#loading' ).show();
    var sq= String(Math.floor(Math.random() * 11000));
    var jsonfile= 'https://kitsu.io/api/edge/anime/'+sq;
    //'https://kitsu.io/api/edge/anime?filter[text]='+sq;
    //'https://vna818.github.io/anisearch/Resources/code/prac.json';
    
    jsondisp2(jsonfile);
    
 
  });


$(".mini-image").click(function() {
    alert("Made by VNA in January 2021");
  });

if(searchq!=null){
  $("#search").val(searchq);
  $(".subb").click();
}
    });


  

   