document.addEventListener("DOMContentLoaded",function(){

    const searchButton=document.getElementById("search-button");
    const usernameInput=document.getElementById("user-input");
    const statsContainer=document.querySelector(".stats-container");
    const easyProgressCircle=document.querySelector(".easy-progress");
    const mediumProgressCircle=document.querySelector(".medium-progress");
    const hardProgressCircle=document.querySelector(".hard-progress");
    const easylabel=document.getElementById("easy-label");
    const mediumlabel=document.getElementById("medium-label");
    const hardlabel=document.getElementById("hard-label");

    function validateusername(username){
        if(username.trim() == ""){
            alert("Username should not be empty");
            return false;

        }
        const regex = /^[a-zA-Z0-9](?:[a-zA-Z0-9_-]{1,14}[a-zA-Z0-9])?$/;

        const isMatching=regex.test(username); 
        if(!isMatching){
            alert("Invalid Username");
        }
        return isMatching;
    }

    async function fetchUserDetails(username){

        
        const url ='https://leetcode.com/graphql'
        try{
            searchButton.textContent="Searching...";
            searchButton.disabled=true;

            //const response=await fetch(url);
            const proxyUrl='http://cors-anywhere.herokuapp.com/'
            const targetUrl='https://leetcode.com/graphql/';
        const myHeaders=new Headers();
        myHeaders.append("content-type","application/json");

        const graphql=JSON.stringify({
            query: "\n    query userSessionProgress($username: String!) {\n      allQuestionsCount {\n        difficulty\n        count\n      }\n      matchedUser(username: $username) {\n        submitStats {\n          acSubmissionNum {\n            difficulty\n            count\n            submissions\n          }\n          totalSubmissionNum {\n            difficulty\n            count\n            submissions\n          }\n        }\n      }\n    }\n  ",
            variables: { "username": username}
        })
        
         
        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: graphql,
            redirect: "follow"
        };

        const response = await fetch(proxyUrl+targetUrl , requestOptions);
            if(!response.ok){
                throw new Error("Unable to fetch the User Details");
            }

            const parsedData=await response.json();
            console.log(response.status, response.statusText);

            console.log("Logging data : " , parsedData);


            DisplayUserData(parsedData);
        }
        catch(error){
            statsContainer.innerHTML='<p>No Data Found</p>'
        }
        finally{
            searchButton.textContent="Search";
            searchButton.disabled=false;
        }

    }

    function updateprogress(solved,total,label,circle){
        const progressDegree=(solved/total)*100;
        circle.style.setProperty("--progress-degree",`${progressDegree}%`);
        label.textContent=`${solved}/${total}`;
        
    }

    function DisplayUserData(parsedData){
        const totalques=parsedData.data.allQuestionsCount[0].count;
        const totaleasyques=parsedData.data.allQuestionsCount[1].count;
        const totalmedques=parsedData.data.allQuestionsCount[2].count;
        const totalhardques=parsedData.data.allQuestionsCount[3].count;
        
        const solvedTotalQues=parsedData.data.matchedUser.submitStats.acSubmissionNum[0].count;
        const solvedeasyTotalQues=parsedData.data.matchedUser.submitStats.acSubmissionNum[1].count;
        const solvedmedTotalQues=parsedData.data.matchedUser.submitStats.acSubmissionNum[2].count;
        const solvedhardTotalQues=parsedData.data.matchedUser.submitStats.acSubmissionNum[3].count;

        updateprogress(solvedeasyTotalQues , totaleasyques , easylabel , easyProgressCircle);
        updateprogress(solvedmedTotalQues , totalmedques , mediumlabel , mediumProgressCircle);
        updateprogress(solvedhardTotalQues , totalhardques , hardlabel , hardProgressCircle);
        
    }

    searchButton.addEventListener("click",function(){
        const username=usernameInput.value;
        console.log("logging username : " , username);
        if(validateusername(username)){
            fetchUserDetails(username);
        }
    })



})