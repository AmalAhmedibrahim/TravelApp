var Client=function(e){var t={};function n(r){if(t[r])return t[r].exports;var a=t[r]={i:r,l:!1,exports:{}};return e[r].call(a.exports,a,a.exports,n),a.l=!0,a.exports}return n.m=e,n.c=t,n.d=function(e,t,r){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var a in e)n.d(r,a,function(t){return e[t]}.bind(null,a));return r},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=8)}([function(e,t){const n="16157293-1dc39b307c24dc502a2479e8f";let r={};const a=(e,t)=>{return(new Date(e).getTime()-new Date(t).getTime())/864e5};document.getElementById("submit").addEventListener("click",function(e){const t=document.getElementById("city").value;let o=document.getElementById("departing-date").value,i=document.getElementById("end-date").value;r.tripLength=parseInt(a(i,o)),r.city=t,r.departingDate=o,Client.validateCity(t)?(console.log("::: Form Submitted :::"),(async(e,t,n)=>{let r=e+t+"&username="+n;const a=await fetch(r);try{return await a.json()}catch(e){console.log("error: ",e)}})("http://api.geonames.org/searchJSON?Cities=",t,"amal.ahmed").then(e=>{return r.country=e.geonames[0].countryName,r.latitude=e.geonames[0].countryName,r.longitude=e.geonames[0].lng,r.numOfDays=a(o,Date.now()),(async(e,t,n,r,a)=>{if(a<=7){const t="https://api.weatherbit.io/v2.0/current?city="+e+"&key=2cce0263d94645a793554e20e270c72b",n=await fetch(t);try{const e=await n.json();if(e.count>0)return e.data[0].weather.description}catch(e){console.log("error: ",e)}}else{const t="https://api.weatherbit.io/v2.0/forecast/daily?city="+e+"&key=2cce0263d94645a793554e20e270c72b",n=await fetch(t);try{const e=await n.json();if(e.count>0)return e.data[0].weather.description}catch(e){console.log("error: ",e)}}})(r.city,r.country,r.latitude,r.longitude,r.numOfDays)}).then(e=>(r.weather=e,r.imageURL=(async(e,t)=>{const r="https://pixabay.com/api/?key="+n+"&q="+e+"&image_type=photo&pretty=true",a=await fetch(r);try{const e=await a.json();if(e.hits.length>0)return e.hits[0].largeImageURL;if(e.hits.length>0)return e.hits[0].largeImageURL}catch(e){console.log("error: ",e)}})(t),r.imageURL)).then(e=>{(async(e,t)=>{console.log(t),document.getElementById("result-container").style.display="flex",document.getElementById("res-image").src=e,document.getElementById("weather-data").innerHTML=t.weather,document.getElementById("country-data").innerHTML=t.city,document.getElementById("city-data").innerHTML=t.country,document.getElementById("trip-Length-data").innerHTML=t.tripLength})(e,r)})):alert("Please Enter a Valid City ")})},function(e,t,n){},function(e,t,n){},function(e,t,n){},function(e,t,n){},function(e,t,n){},function(e,t,n){},function(e,t,n){},function(e,t,n){"use strict";n.r(t);var r=n(0);function a(e){return!!new RegExp(/^[a-zA-Z]+(?:[\s-][a-zA-Z]+)*$/).test(e)}n(1),n(2),n(3),n(4),n(5),n(6),n(7);n.d(t,"submitTrip",function(){return r.submitTrip}),n.d(t,"validateCity",function(){return a})}]);