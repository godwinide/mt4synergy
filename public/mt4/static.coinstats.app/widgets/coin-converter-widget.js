"use strict";(function(){var config={attributes:true};function createWidget(placeHolder){var converterRows=[];var sellRow=null;var buyRow=null;var divider=null;var widgetTable=null;var sellCoin={};var buyCoin={};var sellCount=1;var buyCount=0;var buyInput=null;var sellInput=null;var sellCoinActive=-1;var searchResult=[];var sellRowPostion=0;var buyRowPosition=2;var globalType="large";var colors={};function getData(firstCoinId,secondCoinId,callback){return fetch("https://api.coin-stats.com/v2/coins/prices",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({average:[firstCoinId,secondCoinId]})}).then(function(res){return res.json()}).then(function(res){return callback(res.prices.average)})}function createStyle(){var style=document.createElement("style");style.setAttribute("type","text/css");var styleCss=document.createTextNode("\n    .dropdown-option.active  > span {\n      color: #ffa959;\n    }\n    .dropdown-option:hover {\n      color: #ffa959;\n\n    }\n    .dropdown-container {\n      display: none;\n    }\n    .dropdown-container.open {\n      display: block;\n    }\n    input::-webkit-outer-spin-button,\n    input::-webkit-inner-spin-button {\n        -webkit-appearance: none;\n        margin: 0;\n    }\n    input[type=number] {\n        -moz-appearance:textfield;\n    }\n    coin-stats-converter-widget * {\n      word-break: initial;\n      word-wrap: initial;\n      box-sizing: border-box;\n    }\n  ");style.appendChild(styleCss);return style}(function(){var sellCoinId=placeHolder.getAttribute("sell-coin-id");var buyCoinId=placeHolder.getAttribute("buy-coin-id");if(!sellCoinId||!buyCoinId){return}getData(sellCoinId,buyCoinId,function(data){var background=placeHolder.getAttribute("background");var text=placeHolder.getAttribute("text-color");var borderColor=placeHolder.getAttribute("border-color");var rotateButtonColor=placeHolder.getAttribute("rotate-button-color");var disableCredits=placeHolder.getAttribute("disable-credits");var type=placeHolder.getAttribute("type")||"large";globalType=type;var width=placeHolder.getAttribute("width")||310;var font=placeHolder.getAttribute("font")||"Roboto, Arial, Helvetica";for(var i=0;i<data.length;i++){if(data[i].i===sellCoinId){sellCoin=data[i]}if(data[i].i===buyCoinId){buyCoin=data[i]}}buyCount=formatePrice(sellCoin.pu/buyCoin.pu,buyCoin.s);colors={text:text,background:background,border:borderColor,rotateButton:rotateButtonColor};var widgetContainer=document.createElement("div");widgetContainer.appendChild(createStyle());widgetTable=document.createElement("div");widgetTable.style.cssText="\n          padding: 10.5px 0;\n          background-color: "+colors.background+";\n          border-radius: 29px;\n          border: solid 1px "+colors.border+";\n          color: "+colors.text+";\n          max-width: "+(Number(width)>310?width+"px":"310px")+";\n          box-sizing: border-box;\n          font-family: "+font+", sans-serif;\n        ";sellRow=sellRowNode(sellCoin.ic,sellCoin.n,sellCoin.s);divider=createDivider();buyRow=buyRowNode(buyCoin.ic,buyCoin.n,buyCoin.s);converterRows[0]=sellRow;converterRows[1]=divider;converterRows[2]=buyRow;if(placeHolder.children.length===1){placeHolder.removeChild(placeHolder.lastChild)}for(var _i=0;_i<converterRows.length;_i++){widgetTable.appendChild(converterRows[_i])}widgetContainer.appendChild(widgetTable);if(!disableCredits){widgetContainer.appendChild(createCredits(colors.text,font))}placeHolder.appendChild(widgetContainer)})})();function createSearchDropDownOptionContainer(coins,keyword,field){var searchDropDownOptionContainer=document.createElement("div");searchDropDownOptionContainer.setAttribute("class","dropdown-container");if(keyword){searchDropDownOptionContainer.classList.add("open")}else{searchDropDownOptionContainer.classList.remove("open")}searchDropDownOptionContainer.style.cssText="\n        position: absolute;\n        width: 100%;\n        z-index: 999;\n        background: "+colors.background+";\n        border-radius: 26px;\n        padding: 8px 0;\n        box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2);\n      ";var noResult=document.createElement("p");noResult.style.cssText="\n        text-align: center;\n        opacity: 0.5;\n        font-size: 10px;\n        font-weight: 500;\n      ";noResult.appendChild(document.createTextNode("NO RESULTS"));if(!coins.length){searchDropDownOptionContainer.appendChild(noResult)}for(var i=0;i<coins.length;i++){searchDropDownOptionContainer.appendChild(renderDropdownOption(coins[i],i,field))}return searchDropDownOptionContainer}function createSellSearchInputNode(){var searchContainer=document.createElement("div");var searchInput=document.createElement("input");searchContainer.style.cssText="\n        position: relative;\n      ";searchInput.style.cssText="\n        background: transparent;\n        height: 38px;\n        background: transparent;\n        border: none;\n        outline: none;\n        font-size: 16px;\n        font-weight: 300;\n        font-style: normal;\n        font-stretch: normal;\n        line-height: normal;\n        letter-spacing: normal;\n        color: "+colors.text+" !important;\n      ";searchInput.setAttribute("type","text");searchInput.setAttribute("placeholder","Search...");searchContainer.appendChild(searchInput);searchInput.addEventListener("keyup",function(e){if(e.keyCode===38||e.keyCode===40||e.keyCode===13){handleDropDownNavigation(e,searchContainer,"sell");return}handleSearchCoin(e.target.value,searchContainer,"sell")});return searchContainer}function createBuySearchInputNode(){var searchContainer=document.createElement("div");var searchInput=document.createElement("input");searchContainer.style.cssText="\n        position: relative;\n      ";searchInput.style.cssText="\n        background: transparent;\n        height: 38px;\n        background: transparent;\n        border: none;\n        outline: none;\n        font-size: 16px;\n        font-weight: 300;\n        font-style: normal;\n        font-stretch: normal;\n        line-height: normal;\n        letter-spacing: normal;\n        color: "+colors.text+" !important;\n      ";searchInput.setAttribute("type","text");searchInput.setAttribute("placeholder","Search...");searchContainer.appendChild(searchInput);searchInput.addEventListener("keyup",function(e){if(e.keyCode===38||e.keyCode===40||e.keyCode===13){handleDropDownNavigation(e,searchContainer,"buy");return}handleSearchCoin(e.target.value,searchContainer,"buy")});return searchContainer}function handleDropDownNavigation(e,container,field){if(e.keyCode===40){if(sellCoinActive===4){sellCoinActive=-1}removeClass(container.lastChild.children);++sellCoinActive}if(e.keyCode===38){if(sellCoinActive===0){sellCoinActive=5}removeClass(container.lastChild.children);--sellCoinActive}if(e.keyCode===13){var activeElement=container.getElementsByClassName("active")[0];var index=activeElement.getAttribute("data-index");var coin=searchResult[Number(index)];selectCoin(field,coin);widgetTable.innerHTML="";if(field==="sell"){if(sellRowPostion===0){buyCount=formatePrice(sellCoin.pu/buyCoin.pu,buyCoin.s)}else{sellCount=formatePrice(buyCoin.pu/sellCoin.pu,sellCoin.s)}sellRow=sellRowNode(coin.ic,coin.n,coin.s);converterRows[sellRowPostion]=sellRow}else{if(sellRowPostion===2){sellCount=formatePrice(buyCoin.pu/sellCoin.pu,sellCoin.s)}else{buyCount=formatePrice(sellCoin.pu/buyCoin.pu,buyCoin.s)}buyRow=buyRowNode(coin.ic,coin.n,coin.s);converterRows[buyRowPosition]=buyRow}sellInput=sellRow.lastChild;buyInput=buyRow.lastChild;for(var i=0;i<converterRows.length;i++){widgetTable.appendChild(converterRows[i])}if(field==="sell"&&sellRowPostion===0){sellInput.lastChild.focus();sellInput.lastChild.select();buyInput.lastChild.value=buyCount}else if(field==="buy"&&sellRowPostion===2){buyInput.lastChild.focus();buyInput.lastChild.select();sellInput.lastChild.value=sellCount}}container.lastChild.children[sellCoinActive].classList.add("active")}function removeClass(elements){for(var i=0;i<elements.length;i++){elements[i].classList.remove("active")}}function handleSearchCoin(keyword,searchContainer,field){fetch("https://api.coin-stats.com/v4/coins?keyword="+keyword+"&limit=5").then(function(result){return result.json().then(function(result){sellCoinActive=-1;if(searchContainer.children.length>1){searchContainer.removeChild(searchContainer.children[1])}searchResult=result.coins;var searchDropDownOptionContainer=createSearchDropDownOptionContainer(result.coins,keyword,field);searchContainer.appendChild(searchDropDownOptionContainer)})})}function renderDropdownOption(coin,i,field){var option=document.createElement("div");option.setAttribute("class","dropdown-option");option.style.cssText="\n        width: 100%;\n        box-sizing: border-box;\n        transition: 300ms color;\n        padding: 12px 14px;\n        display: flex;\n        align-items: center;\n        font-size: 16px;\n        font-weight: 300;\n      ";var coinName=document.createElement("span");option.setAttribute("data-index",i);coinName.appendChild(document.createTextNode(coin.n+" ("+coin.s+")"));option.appendChild(createLogo(coin.ic));option.appendChild(coinName);option.addEventListener("click",function(e){selectCoin(field,coin);option.parentNode.classList.remove("open");widgetTable.innerHTML="";if(field==="sell"){if(sellRowPostion===0){buyCount=formatePrice(sellCoin.pu/buyCoin.pu,buyCoin.s)}else{sellCount=formatePrice(buyCoin.pu/sellCoin.pu,sellCoin.s)}sellRow=sellRowNode(coin.ic,coin.n,coin.s);converterRows[sellRowPostion]=sellRow}else{if(sellRowPostion===2){sellCount=formatePrice(buyCoin.pu/sellCoin.pu,sellCoin.s)}else{buyCount=formatePrice(sellCoin.pu/buyCoin.pu,buyCoin.s)}buyRow=buyRowNode(coin.ic,coin.n,coin.s);converterRows[buyRowPosition]=buyRow}sellInput=sellRow.lastChild;buyInput=buyRow.lastChild;for(var _i2=0;_i2<converterRows.length;_i2++){widgetTable.appendChild(converterRows[_i2])}if(field==="sell"&&sellRowPostion===0){sellInput.lastChild.focus();sellInput.lastChild.select();buyInput.lastChild.value=buyCount}else if(field==="buy"&&sellRowPostion===2){buyInput.lastChild.focus();buyInput.lastChild.select();sellInput.lastChild.value=sellCount}});return option}function selectCoin(field,coin){if(field==="buy"){buyCoin=coin}else{sellCoin=coin}}function formatePrice(price,symbol){var minimumFractionDigits=2;if(price%1===0){minimumFractionDigits=0}else if(symbol==="BTC"){minimumFractionDigits=8}else if(symbol==="ETH"&&price<1&&price>-1){minimumFractionDigits=8}else if(price<1&&price>-1){minimumFractionDigits=6}else{minimumFractionDigits=2}return price.toFixed(minimumFractionDigits)}function iconMaker(icon){if(icon&&icon.toLowerCase().indexOf("http")>=0){return icon}return"https://api.coin-stats.com/api/files/812fde17aea65fbb9f1fd8a478547bde/"+icon}function createLogo(src){var icon=document.createElement("img");icon.setAttribute("src",iconMaker(src));icon.style.cssText="\n    width: 24px;\n    height: 24px;\n    margin-right: 14px;\n  ";return icon}function createSellInput(){var priceInputContainer=document.createElement("div");var priceInput=document.createElement("input");priceInput.style.cssText="\n    width: 76%;\n    margin-left: 17px;\n    height: 38px;\n    background: transparent;\n    border: none;\n    outline: none;\n    font-size: 16px;\n    font-weight: 300;\n    font-style: normal;\n    font-stretch: normal;\n    line-height: normal;\n    letter-spacing: normal;\n    color: "+colors.text+" !important;\n    padding: 0;\n  ";priceInput.setAttribute("type","number");priceInput.setAttribute("placeholder","Count");priceInput.addEventListener("keyup",handleSellPriceChange);priceInput.value=sellCount;priceInputContainer.appendChild(priceInput);return priceInputContainer}function createBuyInput(){var priceInputContainer=document.createElement("div");var priceInput=document.createElement("input");priceInput.style.cssText="\n    width: 76%;\n    margin-left: 17px;\n    height: 38px;\n    background: transparent;\n    border: none;\n    outline: none;\n    font-size: 16px;\n    font-weight: 300;\n    font-style: normal;\n    font-stretch: normal;\n    line-height: normal;\n    letter-spacing: normal;\n    color: "+colors.text+" !important;\n    padding: 0;\n  ";priceInput.setAttribute("type","number");priceInput.setAttribute("placeholder","Count");priceInput.addEventListener("keyup",handleBuyPriceChange);priceInput.value=buyCount;priceInputContainer.appendChild(priceInput);return priceInputContainer}function handleSellPriceChange(e){sellCount=e.target.value;buyCount=formatePrice(sellCount*sellCoin.pu/buyCoin.pu,buyCoin.s);buyInput.firstChild.value=buyCount}function handleBuyPriceChange(e){sellCount=formatePrice(e.target.value*buyCoin.pu/sellCoin.pu,sellCoin.s);buyCount=e.target.value;sellInput.firstChild.value=sellCount}function createDivider(){var dividerContainer=document.createElement("div");var divider=document.createElement("div");var rotateButton=document.createElement("div");if(globalType==="large"||globalType==="small"){divider.style.cssText="\n          width: 100%;\n          height: 1px;\n          background: "+colors.border+";\n        ";dividerContainer.style.cssText="\n          display: flex;\n          align-items: center;\n        ";rotateButton.innerHTML='\n          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="22" viewBox="0 0 24 22">\n            <path fill="'+colors.rotateButton+'" fill-rule="evenodd" d="M2.2 10.9c0-2.367.777-4.459 2.146-6.163l-2.06.976a.9.9 0 1 1-.772-1.626l3.8-1.8a.901.901 0 0 1 1.203.436l1.8 3.9a.9.9 0 0 1-1.635.755L5.9 5.682C4.688 7.106 4 8.865 4 10.9c0 4.503 3.597 8.1 8.1 8.1.773 0 1.47-.17 2.281-.373a.9.9 0 1 1 .437 1.746l-.035.009c-.78.195-1.672.418-2.683.418a9.862 9.862 0 0 1-9.9-9.9m7.618-7.727C10.63 2.97 11.326 2.8 12.1 2.8c4.503 0 8.1 3.597 8.1 8.1 0 1.943-.627 3.634-1.74 5.023l-.163-2.287a.9.9 0 1 0-1.795.128l.3 4.2a.9.9 0 0 0 .981.832l4.3-.4a.9.9 0 0 0-.167-1.792l-1.84.171C21.307 15.125 22 13.136 22 10.9 22 5.403 17.597 1 12.1 1c-1.01 0-1.902.223-2.683.418l-.035.009a.9.9 0 1 0 .436 1.746"/>\n          </svg>\n        ';rotateButton.style.cssText="\n          margin: 0 20px;\n          width: 24px;\n          height: 22px;\n          cursor: pointer;\n        "}if(globalType==="medium"){divider.style.cssText="\n          width: 100%;\n          height: 1px;\n          background: rgba(255, 255, 255, 0.07);\n        ";dividerContainer.style.cssText="\n          display: flex;\n          align-items: center;\n          padding: 22px 0px;\n          position: relative;\n        ";rotateButton.innerHTML='\n          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="22" viewBox="0 0 24 22">\n              <path fill="'+colors.rotateButton+'" fill-rule="evenodd" d="M2.2 10.9c0-2.367.777-4.459 2.146-6.163l-2.06.976a.9.9 0 1 1-.772-1.626l3.8-1.8a.901.901 0 0 1 1.203.436l1.8 3.9a.9.9 0 0 1-1.635.755L5.9 5.682C4.688 7.106 4 8.865 4 10.9c0 4.503 3.597 8.1 8.1 8.1.773 0 1.47-.17 2.281-.373a.9.9 0 1 1 .437 1.746l-.035.009c-.78.195-1.672.418-2.683.418a9.862 9.862 0 0 1-9.9-9.9m7.618-7.727C10.63 2.97 11.326 2.8 12.1 2.8c4.503 0 8.1 3.597 8.1 8.1 0 1.943-.627 3.634-1.74 5.023l-.163-2.287a.9.9 0 1 0-1.795.128l.3 4.2a.9.9 0 0 0 .981.832l4.3-.4a.9.9 0 0 0-.167-1.792l-1.84.171C21.307 15.125 22 13.136 22 10.9 22 5.403 17.597 1 12.1 1c-1.01 0-1.902.223-2.683.418l-.035.009a.9.9 0 1 0 .436 1.746"/>\n          </svg>\n        ';rotateButton.style.cssText="\n          width: 24px;\n          height: 22px;\n          cursor: pointer;\n          position: absolute;\n          background: "+colors.background+";\n          padding: 0 11px;\n          box-sizing: content-box;\n          left: calc(50% - 24px);\n        "}rotateButton.addEventListener("click",rotate);dividerContainer.appendChild(divider);dividerContainer.appendChild(rotateButton);return dividerContainer}function rotate(){if(converterRows[0]===sellRow){buyRowPosition=0;sellRowPostion=2;converterRows[0]=buyRow;converterRows[2]=sellRow}else{buyRowPosition=2;sellRowPostion=0;converterRows[2]=buyRow;converterRows[0]=sellRow}var buyCountHolder=buyCount;buyCount=sellCount;sellCount=buyCountHolder;for(var i=0;i<converterRows.length;i++){widgetTable.appendChild(converterRows[i])}}function sellRowNode(iconSrc,name,symbol){var tableRowNode=document.createElement("div");var coinContainer=document.createElement("div");var logoNode=createLogoNode(iconSrc);var nameNode=createNameNode(name,symbol);if(globalType==="large"||globalType==="small"){coinContainer.style.cssText="\n          display: flex;\n          align-items: center;\n          cursor: pointer;\n          width: 50%;\n        ";tableRowNode.style.cssText="\n          display: flex;\n          align-items: center;\n          margin: 0 30px;\n        ";sellInput=createSellInput();sellInput.style.cssText="\n          width: 50%;\n        "}if(globalType==="medium"){coinContainer.style.cssText="\n          display: flex;\n          align-items: center;\n          cursor: pointer;\n          width: 100%;\n        ";tableRowNode.style.cssText="\n          display: flex;\n          flex-direction: column;\n          align-items: center;\n          margin: 0 30px;\n        ";sellInput=createSellInput();sellInput.style.cssText="\n          width: 100%;\n          margin-left: 35px;\n          margin-top: 7px;\n        "}coinContainer.appendChild(logoNode);coinContainer.appendChild(nameNode);coinContainer.addEventListener("click",function(){changeSellViewInput(coinContainer)});tableRowNode.appendChild(coinContainer);tableRowNode.appendChild(sellInput);return tableRowNode}function changeSellViewInput(container){if(container.children.length===1){return}container.innerHTML="";sellCoin={};var sellSearchInputNode=createSellSearchInputNode();container.appendChild(sellSearchInputNode);sellSearchInputNode.firstChild.focus()}function changeBuyViewInput(container){if(container.children.length===1){return}container.innerHTML="";buyCoin={};var buySearchInputNode=createBuySearchInputNode();container.appendChild(buySearchInputNode);buySearchInputNode.firstChild.focus()}function buyRowNode(iconSrc,name,symbol){var tableRowNode=document.createElement("div");var coinContainer=document.createElement("div");var logoNode=createLogoNode(iconSrc);var nameNode=createNameNode(name,symbol);if(globalType==="large"||globalType==="small"){coinContainer.style.cssText="\n          display: flex;\n          align-items: center;\n          cursor: pointer;\n          width: 50%;\n        ";tableRowNode.style.cssText="\n          display: flex;\n          align-items: center;\n          margin: 0 30px;\n        ";buyInput=createBuyInput();buyInput.style.cssText="\n          width: 50%;\n        "}if(globalType==="medium"){coinContainer.style.cssText="\n          display: flex;\n          align-items: center;\n          cursor: pointer;\n          width: 100%;\n        ";tableRowNode.style.cssText="\n          display: flex;\n          flex-direction: column;\n          align-items: center;\n          margin: 0 30px;\n        ";buyInput=createBuyInput();buyInput.style.cssText="\n          width: 100%;\n          margin-left: 35px;\n          margin-top: 7px;\n        "}coinContainer.appendChild(logoNode);coinContainer.appendChild(nameNode);coinContainer.addEventListener("click",function(){changeBuyViewInput(coinContainer)});tableRowNode.appendChild(coinContainer);tableRowNode.appendChild(buyInput);return tableRowNode}function createCredits(textColor,font){var credits=document.createElement("div");var anchor=document.createElement("a");anchor.href="http://coinstats.app";anchor.target="_blank";anchor.innerHTML='Powered by <span style="letter-spacing: 0.25px;font-size: 14px; vertical-align: unset;">Coin<b style="vertical-align: unset;">Stats</b></span>';anchor.style.cssText="\n      font-size: 12px;\n      font-weight: 300;\n      text-decoration: none;\n      color: "+textColor+";\n      vertical-align: unset;\n      font-family: "+font+", sans-serif;\n    ";credits.style.cssText="\n      padding-top: 10px;\n      padding-left: 34px;\n      vertical-align: unset;\n    ";credits.appendChild(anchor);return credits}function createNameNode(name,symbol){var tableDataNode=document.createElement("div");var nameNode=document.createElement("span");if(globalType==="small"){nameNode.innerHTML=symbol}else{nameNode.innerHTML=name+" ("+symbol+")"}nameNode.style.cssText="\n        font-size: 16px;\n        font-weight: 300;\n        font-stretch: normal;\n        font-style: normal;\n        line-height: normal;\n        letter-spacing: normal;\n      ";tableDataNode.appendChild(nameNode);tableDataNode.style.display="flex";return tableDataNode}function createLogoNode(src){var tableDataNode=document.createElement("div");var logoNode=document.createElement("img");logoNode.setAttribute("src",iconMaker(src));logoNode.style.cssText="\n    height: 25px;\n    width: 25px;\n  ";tableDataNode.style.cssText="\n    text-align: center;\n    display: flex;\n    margin-right: 15px;\n  ";tableDataNode.appendChild(logoNode);return tableDataNode}}function ready(callbackFunc){if(document.readyState!=="loading"){callbackFunc()}else if(document.addEventListener){document.addEventListener("DOMContentLoaded",callbackFunc)}else{document.attachEvent("onreadystatechange",function(){if(document.readyState==="complete"){callbackFunc()}})}}function initAll(){var allPlaceHolders=document.querySelectorAll("coin-stats-converter-widget");allPlaceHolders.forEach(function(node){createWidget(node)})}function observeMutations(){var nodes=document.querySelectorAll("coin-stats-converter-widget");var observer=new MutationObserver(callback);nodes.forEach(function(node){var disable=node.getAttribute("disable-mutation-observer");if(!disable){observer.observe(node,config)}});function callback(MutationRecord){createWidget(MutationRecord[0].target)}}ready(function(){initAll();observeMutations()})})();