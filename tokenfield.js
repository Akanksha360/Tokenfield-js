<!DOCTYPE html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Token Field</title>
    <script src="https://code.jquery.com/jquery-3.6.4.min.js"></script>

    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" crossorigin="anonymous" referrerpolicy="no-referrer" />
    <style>
        .inputBox {
            display: grid;
        }
        .list {
            display: flex;
        }
        .token {
            border: 1px solid lightblue;
            border-radius: 30px;
            background-color: pink;
            padding: 4px 6px;
        }
        .tokenfield_dropdown {
            width: 100%;
            border: 1px solid lightblue;
            max-height: 300px;
            display: none;
            background-color: white;
            position: absolute;
            overflow-y: auto;
            z-index: 16;
        }
        .BgColor{
            background-color: rgb(134, 134, 249);
            cursor: pointer;
        }
        .listItem:hover{
            background-color:rgb(224, 233, 224);
            cursor: pointer;
        }
        .listItem{
            padding:6px;
        }
    
        .dropdown{
            width: 100%;
            border: 1px solid lightblue;
            max-height: 300px;
            display: none;
            background-color: white;
            overflow-y: auto;
            z-index: 16;
        }
    
        #tokens {
            background: lightblue;
            border-radius: 8px;
            align-items: center;
            display: flex;
            padding: 4px;
            width: fit-content;
        }
        .tokenfield_selected {
            margin-bottom: 20px;
            margin-top: 20px;
            display: flex;
            gap:10px
        }
    
        .inputField {
            border: 1px solid #DBE7F0;
            outline: none;
            border-radius: 8px;
            padding: 6px;
            width: 100%;
        }
        .profileImgDiv{
            border-radius: 50%;
            background: var(--default-primary-color);
            color: white;
            width: 30px;
            height: 30px;
            font-weight: 600;
        }
        .tokenfield_parent{
            width: 100%;
            position: relative;
        }
    </style>
</head>
<body>
  
    
    <div style="width:700px" id="recipient"></div>
    <script>
        class TokenField {
            static instances = [];
            constructor(id, limit, callback,ListUpdateFunction) {
                this.id = id;
                this.list = [];
                this.maxLimit = limit;
                this.callback = callback;
                this.dropdownList = [];
                this.currIndex = -1;
                this.ListUpdateFunction=ListUpdateFunction
                console.log("callback.......", id, limit, callback,ListUpdateFunction);
                TokenField.instances.push(this);
            }
            init() {
                let tokenFieldHTML = `<div class="flex items-center gap-2 w-full tokenfield_parent">
                  <div class="w-full" id="${this.id}">
                   <input placeholder="Enter here" type="text" class="inputField" id="${this.id}_tokenfield" value=""  placeholder="" />
                   <div class="tokenfield_dropdown" id="${this.id}_tokenfield_dropdown"></div>
                   <div class="flex items-center gap-2 flex-wrap tokenfield_selected" id="${this.id}_tokenfield_selected"></div>
                  </div>`;
                return tokenFieldHTML;
            }
        }
        $(document).ready(function () {
            TokenField.instances.map((tokenfields) => {
                $("#" + tokenfields.id + "_tokenfield").on("input", function () {
                    if (parseInt(tokenfields.maxLimit) <= tokenfields.list.length) {
                        alert("You can't select more than " + parseInt(tokenfields.maxLimit)+" users at a time");
                        $("#" + tokenfields.id + "_tokenfield").val("");
                        return;
                    }
                   
                    if (event.target.value.length > 2) {
                        getDropdownData();
                    } else {
                        $("#" + tokenfields.id + "_tokenfield_dropdown").css(
                            "display",
                            "none"
                        );
                    }
                });
                $("html").on("click", function () {
                    $("#" + tokenfields.id + "_tokenfield_dropdown").css(
                        "display",
                        "none"
                    );
                    $("#" + tokenfields.id + "_tokenfield").val("");
                    tokenfields.currIndex=-1;
                });
    
                $("#" + tokenfields.id + "_tokenfield").on("keydown", function (e) {
                    // debugger
                    if (e.keyCode === 13&&tokenfields.currIndex>=0) {
                        $("#" + tokenfields.id + "_tokenfield").val("");
                        $("#" + tokenfields.id + "_tokenfield_dropdown").hide();
                        let flag = false;
                        TokenField.instances.map((tokenfield) => {
                            tokenfield.list.map((elem) => {
    
                                if (elem.id == tokenfields.dropdownList[tokenfields.currIndex ].id) {
                                    flag = true
                                    alert("Already Selected.");
                                }
                            })
                        })
                        if (flag) return;
                        else {
                            tokenfields.list.push(
                                tokenfields.dropdownList[tokenfields.currIndex]
                            );
                            if(!!tokenfields.ListUpdateFunction)
                                tokenfields.ListUpdateFunction(tokenfields)
                            prepareHTML(tokenfields);
                        }
                        tokenfields.currIndex = -1;
                    }
                    if (e.keyCode === 38) {
                        // debugger
                        action = true;
                        if (tokenfields.currIndex > 0&&tokenfields.dropdownList.length>0) {
                            $("." + tokenfields.id + "_tokenfield_listItem")[
                                tokenfields.currIndex
                                ].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
                            $("." + tokenfields.id + "_tokenfield_listItem")
                                .eq(tokenfields.currIndex)
                                .removeClass("BgColor");
                            $("." + tokenfields.id + "_tokenfield_listItem")
                                .eq(tokenfields.currIndex - 1)
                                .addClass("BgColor");
                            tokenfields.currIndex -= 1;
                        }
                    }
                    if (e.keyCode === 40) {
                        // debugger
                        action = false;
                        if (tokenfields.dropdownList.length > tokenfields.currIndex+1&&tokenfields.dropdownList.length>0) {
                            console.log(
                                $("." + tokenfields.id + "_tokenfield_listItem")[tokenfields.currIndex]
                            );
                            tokenfields.currIndex+=1
                            $("." + tokenfields.id + "_tokenfield_listItem")[
                                tokenfields.currIndex
                                ].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
                            $("." + tokenfields.id + "_tokenfield_listItem")
                                .eq(tokenfields.currIndex - 1)
                                .removeClass("BgColor");
                            $("." + tokenfields.id + "_tokenfield_listItem")
                                .eq(tokenfields.currIndex)
                                .addClass("BgColor");
    
                        }
                    }
                });
                
                function getDropdownData() {
                    tokenfields.callback((response) => {
                        if (response?.results?.length > 0) {
                            $("#" + tokenfields.id + "_tokenfield_dropdown").html("");
                            tokenfields.dropdownList = response.results;
                            let displayableList = createConfig(response);
                            displayableList.forEach((elem) => {
                                let fieldsHTML = "";
                                let isFirst = true;   
                                for (let key in elem) {
                                    if (elem[key].weigthage === "") {
                                        continue;
                                    }   
                                    if (elem[key].display !== "") {
                                        if (isFirst) {
                                            fieldsHTML += `<div class="p1"><b>${elem[key].display?elem[key].display:""}</b> ${elem[key].value}</div>`;
                                            isFirst = false;
                                        } else {
                                            fieldsHTML += `<div class="p1">${elem[key].display} ${elem[key].value}</div>`;
                                        }
                                    } else {
                                        if (isFirst) {
                                            fieldsHTML +=  `<div class="p1"><b>${elem[key].value}</b></div>`;
                                            isFirst = false;
                                        } else {
                                            fieldsHTML += `<div class="p1">${elem[key].value}</div>`;
                                        }
                                    }
                                }
                                let htmlChunk =    `<div class='w-full px-8 py-2 border-blue flex flex-col listItem ${tokenfields.id}_tokenfield_listItem'>${fieldsHTML}</div>`;
                                $("#" + tokenfields.id + "_tokenfield_dropdown").append(htmlChunk);
                                $("#" + tokenfields.id + "_tokenfield_dropdown").css("display", "block");
                            });
                            $("#" + tokenfields.id + "_tokenfield_dropdown").scrollTop(0);
                            $("." + tokenfields.id + "_tokenfield_listItem").click(function (
                              e
                            ) {
                                $("#" + tokenfields.id + "_tokenfield").val("");
                                $("#" + tokenfields.id + "_tokenfield_dropdown").css(
                                  "display",
                                  "none"
                                );
                                let flag = false;
                                TokenField.instances.map((tokenfield) => {
                                    tokenfield.list.map((elem) => {
                                        if (elem.id == response.results[$('.' + tokenfields.id + "_tokenfield_listItem")?.index(this)].id) {
                                            flag = true
                                            alert("Already Selected.");
                                        }
                                    })
                                })
                                if (flag) return;
                                else {
                                    tokenfields.list.push(
                                      response.results[
                                        $("." + tokenfields.id + "_tokenfield_listItem").index(
                                          this
                                        )
                                        ]
                                    );
                                    console.log("token filed extra function",tokenfields.ListUpdateFunction)
                                    if(!!tokenfields.ListUpdateFunction)
                                        tokenfields.ListUpdateFunction(tokenfields);
                                    prepareHTML(tokenfields);
                                }
                            });
                        } else {
                            tokenfields.dropdownList=[];
                            $("#" + tokenfields.id + "_tokenfield_dropdown").css('display','block')
                            $("#" + tokenfields.id + "_tokenfield_dropdown").html(
                              `<div class='w-full px-8 py-2 border-blue flex flex-col listItem ${tokenfields.id}_tokenfield_listItem ' >
                <div class="p1">No data found</div>
                </div>`
                            );
                        }
                    });
                }
                function createConfig(res) {
                    let ansObj = [];
                    sortedObj = Object.fromEntries(
                      Object.entries(res.config).sort(([, a], [, b]) => b.weightage - a.weightage)
                    );
                    res.results.forEach((elem) => {
                        let newObj = {};
                        for (let key in sortedObj) {
                            newObj[key] = { ...sortedObj[key], value: elem[key] };
                        }
                        ansObj.push(newObj);
                    })
                    return ansObj;
                }

                function prepareHTML(tokenfields) {
                    let selectedUserChunk = "";
                    $("#" + tokenfields.id + "_tokenfield_selected").html("");
                    tokenfields.list.map((user, index) => {
                        selectedUserChunk += `<div  class='flex items-center  ${tokenfields.id
                        }_tokenfield_token  px-3 py-3 gap-2 p1' id="tokens">
                          <div>${user.name}</div><i id="removeCross" class="fa-solid fa-xmark cursor-pointer ${tokenfields.id}_tokenfield_cross"></i></div>`;
                    });
                    $("#" + tokenfields.id + "_tokenfield_selected").append(
                        selectedUserChunk
                    );
                    $("." + tokenfields.id + "_tokenfield_cross").click(function () {
                        tokenfields.list.splice(
                            $("." + tokenfields.id + "_tokenfield_cross").index(this),
                            1
                        );
                        if(!!tokenfields.ListUpdateFunction)
                            tokenfields.ListUpdateFunction(tokenfields);
                        prepareHTML(tokenfields);
                    });
                }

            });
        });
    
        function createTokenField(id, maxLimit, callback,ListUpdateFunction) {
            const tokenfield = new TokenField(id, maxLimit, callback,ListUpdateFunction);
            let ht = tokenfield.init();
            $("#" + id).append(ht);
            return tokenfield;
        }
        // function dataGiverFunction(cb){
        //     let response={
        //         config:{
        //             name:{
        //                 displayName:"Name",
        //             }
        //         },
        //         results:[{
        //         id:34,
        //         name:"Akanksha",
        //         age:23,
        //         Address:"Gurugram Haryana"
        //     },{
        //         id:35,
        //         name:"Akanksha",
        //         age:23,
        //         Address:"Gurugram Haryana"
        //     },{
        //         id:36,
        //         name:"Akanksha",
        //         age:23,
        //         Address:"Gurugram Haryana"
        //     },{
        //         id:37,
        //         name:"Akanksha",
        //         age:23,
        //         Address:"Gurugram Haryana"
        //     },{
        //         id:38,
        //         name:"Akanksha",
        //         age:23,
        //         Address:"Gurugram Haryana"
        //     },{
        //         id:39,
        //         name:"Akanksha",
        //         age:23,
        //         Address:"Gurugram Haryana"
        //     }]
        //     }
        //     cb(response)
        // }
        // document.addEventListener("DOMContentLoaded", function() {
        //     let recipient=createTokenField('recipient',10,dataGiverFunction,()=>{})
        // });
    </script>
  
    
</body>
</html>
