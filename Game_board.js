""
const arrColors = [
  "hsl(180, 55%, 80%)",  // 2 - טורקיז מים מרענן
  "hsl(150, 60%, 75%)",  // 4 - ירוק מנטה נוכח
  "hsl(100, 55%, 75%)",  // 8 - ירוק אביבי
  "hsl(60, 65%, 75%)",   // 16 - צהוב פרימוורה
  "hsl(40, 80%, 70%)",   // 32 - משמש חם
  "hsl(20, 80%, 75%)",   // 64 - ורוד קורל רך
  "hsl(0, 75%, 80%)",    // 128 - ורוד פלמינגו עדין
  "hsl(330, 70%, 75%)",  // 256 - ורוד מג'נטה רך

  "hsl(280, 65%, 75%)",  // 512 - סגול אמטיסט בהיר
  "hsl(240, 60%, 75%)",  // 1024 - כחול רויאל מעודן
  "hsl(200, 70%, 70%)"   // 2048 - כחול ים עמוק
];

let seconds = 0; // משתנה גלובלי לשמירת מספר השניות שעברו
let timerInterval; //משתנה גלובלי לשמירת מזהה הטיימר כדי שנוכל לעצור אותו מאוחר יותר  

let scorecurrent = 0; 

let currentuser = JSON.parse(sessionStorage.getItem("current_user"));
let scoremax = currentuser ? currentuser.score : 0;

// בדיקה: אם אין משתמש מחובר, שלח אותו לדף ההתחברות
if (!currentuser) {
    alert("אין משתמש מחובר. אנא התחבר כדי לשחק.");
    window.location.href = "/log in/login.html"; 
}


let currentMat =[ [0, 0, 0, 0],
                 [0, 0, 0, 0],
                 [0, 0, 0, 0],
                 [0, 0, 0, 0]];
    
   startGame();

function startGame() 
{
    startTimer();

    let arr = [];
    let index1 = Math.floor(Math.random() * 16);//הגרלת 2 מקומים רנדומליים בין 0 ל-15
    let index2 = Math.floor(Math.random() * 16);//הגרלת 2 מקומים רנדומליים בין 0 ל-15
    while (index1 == index2) {
        index2 = Math.floor(Math.random() * 16);
    }
 let r1=randTwoOrFour();
 let r2=randTwoOrFour();
    let div = document.getElementById(index1);
    let newDiv1 = document.createElement("div");
    newDiv1.classList.add("cell");
    newDiv1.textContent = r1;
    newDiv1.style.backgroundColor = arrColors[Math.floor(Math.log2(r1) - 1)];
div.appendChild(newDiv1);

     div = document.getElementById(index2);
     let newDiv2 = document.createElement("div");
     newDiv2.classList.add("cell");
    newDiv2.textContent = r2;
    newDiv2.style.backgroundColor = arrColors[Math.floor(Math.log2(r2) - 1)];
    div.appendChild(newDiv2);
    scorecurrent=0;

    // עדכון תצוגת שיא הניקוד רק עכשיו:
    let divBest = document.getElementById("best-score");
    if (divBest) 
        {
        divBest.textContent = scoremax;
        }

}

// מאזין לכל לחיצה על מקש במקלדת
document.addEventListener("keydown", function(event) {
    if (event.key == "ArrowUp") {
        // פעולה שתתבצע כשלוחצים חץ למעלה
        moveUp();
    } else if (event.key == "ArrowDown") {
        moveDown();
    } 
    else if (event.key == "ArrowLeft") {
        moveLeft();
    } else if (event.key == "ArrowRight") {
        moveRight();
    }
});
// פונקציה שמקבלת שורה וממזגת את המספרים זה עם זה לפי חוקי המשחק, ומחזירה את השורה המעודכנת
function mergeRow(tempArr) {
    for (let i = 0; i < 3; i++) {
        if (tempArr[i] === tempArr[i + 1] && tempArr[i] !== 0) {
            tempArr[i] *= 2;
            tempArr[i + 1] = 0;
            scorecurrent += tempArr[i];

            let divScore = document.getElementById("current-score");
            if (divScore) divScore.textContent = scorecurrent;

            if (scorecurrent > scoremax) 
                {
                scoremax = scorecurrent;
                let divBestScore = document.getElementById("best-score");
                if (divBestScore) divBestScore.textContent = scoremax;

                // --- כאן השינוי המרכזי ---
                if (currentuser) { // השם הנכון
                    currentuser.score = scoremax;
                    
                    // שמירה ב-sessionStorage (זה מה שדואג שהמשתמש לא יתנתק או ייעלם)
                    sessionStorage.setItem("current_user", JSON.stringify(currentuser));

                    // עדכון המאגר הכללי ב-localStorage
                    let allUsers = JSON.parse(localStorage.getItem("users")) || {};
                    if (allUsers[currentuser.username]) {
                        allUsers[currentuser.username].score = scoremax;
                        localStorage.setItem("users", JSON.stringify(allUsers));
                    }
                }
            }
        }
    }
    return tempArr;
}

//פונקציה שמזיזה את המספרים בשורה שמאלה, ומעבירה את האפסים לסוף השורה
function shiftrowLeft(tempArr)
 {
    let newRow = [0, 0, 0, 0];
    let index = 0;
    let tempindex = 0;
    if (tempArr[0] !=0&& tempArr[1] != 0 && tempArr[2] != 0&& tempArr[3] != 0) 
{
        return tempArr;
    }
    for (let i = 0; i < 4; i++)
         {
        if (tempArr[i] != 0) {
            newRow[index] = tempArr[i];
            index++;
        }
        else {
            console.log("המספר הוא אפס, לא מעבירים אותו לשורה החדשה");
             tempindex=i;
             while(tempindex<3&&tempArr[tempindex+1]==0)
             {
                 tempindex++;
             }
             if(tempindex<3)
             {
                 newRow[index] = tempArr[tempindex+1];
                 index++;
                 tempArr[tempindex+1]=0;

             }
             else
             {
                 console.log("סיימנו להעביר את המספרים ");
             }
        }

    }
    return newRow;
}

// זו הפונקציה ש"מנהלת" את האירוע של בדיקת שורה
function processRow(row) {
    row = shiftrowLeft(row);  // הזזה ראשונה
    row = mergeRow(row);  // מיזוג
    row = shiftrowLeft(row);  // הזזה שנייה לסגירת חורים
    return row;
}

//פונקציה שממלאה את המטריצה בלוח משחק הנוכחי
function updateCurrentMat() 
{
    for(let i=0; i<4; i++)
    {
        for(let j=0; j<4; j++)
        {
            let current_div = document.getElementById(i*4+j);
          if(current_div.childElementCount > 0)
          {
            console.log("בדיב הנוכחי יש ילד, בודקים את הדיב הבא");
            let x=current_div.children[0].textContent;
            currentMat[i][j]=parseInt(x);
          }
        }
    }
    return currentMat;
}

//פונקציה שמקבלת מטריצה ומקטינה אותה על ידי איחוד שורות או עמודות לפי הצורך
function ShrinkMatrix(matrix) 
{
    let newMatrix = matrix;
    for(let i=0; i<4; i++)
    {
        let row = newMatrix[i];
        row = processRow(row);
        newMatrix[i] = row;
    }
    updateBoard(newMatrix); //המטריצה המעודכנת שאותה יש להציג על הלוח משחק לאחר מכן
}

//פונקציה שמקבלת מטריצה ומעדכנת את הלוח משחק בהתאם למטריצה החדשה
function updateBoard(matrix)
{
    for(let i=0; i<4; i++)
    {
        for(let j=0; j<4; j++)
        {
            let current_div = document.getElementById(i*4+j);
            if(matrix[i][j]==0) 
            {
                if(current_div.childElementCount > 0)
                {
                    current_div.children[0].remove();
                }
            }
            else
                {
                     if(current_div.childElementCount > 0) 
           
                       {
                current_div.children[0].textContent = matrix[i][j];
                current_div.children[0].style.backgroundColor = arrColors[Math.log2(matrix[i][j])-1];
            
            }
            else
                {
                    let newDiv = document.createElement("div");
                    newDiv.classList.add("cell");
                    newDiv.textContent = matrix[i][j];
                    newDiv.style.backgroundColor = arrColors[Math.log2(matrix[i][j])-1];
                    current_div.appendChild(newDiv);
                }
                }
            
        }
    }
}

//פונקציה שמקבלת מטריצה ומסובבת אותה ימינה
function TurnToRight() {
    for(let i=0; i<4; i++)
    {
        currentMat[i].reverse(); ;
    }
}
//פונקציה שמשחלפת את המטריצה
function transpose(matrix) {
    let newMatrix = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ];

    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            newMatrix[j][i] = matrix[i][j];
        }
    }
    return newMatrix;
}

function moveLeft() {
    console.log("לחץ על החץ שמאלה – הפעולה התבצעה!");
    updateCurrentMat();
    ShrinkMatrix(currentMat);
    let gameStatus = checkGameOver();
   if(gameStatus==0)
    {
    randDivTwoOrFour();
    }
     if(gameStatus==1)
        {
            alert("ניצחת!");
                        triggerWin(scorecurrent, document.getElementById("game-timer").textContent);

            restartGame();
            startGame();
        }
        if(gameStatus==-1)
        {
            alert("המשחק נגמר, אין לך מה לעשות יותר");
                        showEndGame(scorecurrent, document.getElementById("game-timer").textContent);

            restartGame();
            startGame();
        }
}



function moveUp() 
{
    console.log("לחץ על החץ למעלה – הפעולה התבצעה!");
    updateCurrentMat();
    currentMat = transpose(currentMat);
    ShrinkMatrix(currentMat);           // דוחף שמאלה (שהיה במקור למעלה)
    currentMat = transpose(currentMat);
    updateBoard(currentMat);
    let gameStatus = checkGameOver();
    if(gameStatus==0)
    {
    randDivTwoOrFour();
    }
     if(gameStatus==1)
        {
            alert("ניצחת!");
                        triggerWin(scorecurrent, document.getElementById("game-timer").textContent);

            restartGame();
            startGame();
        }
        if(gameStatus==-1)
        {
            alert("המשחק נגמר, אין לך מה לעשות יותר");
                        showEndGame(scorecurrent, document.getElementById("game-timer").textContent);

            restartGame();
            startGame();
        }
}

function moveDown() {
    console.log("לחץ על החץ למטה – הפעולה התבצעה!");
   updateCurrentMat();
    currentMat = transpose(currentMat); // הופך עמודות לשורות
    TurnToRight();                      // הופך כל שורה (עכשיו הלמטה הוא בצד שמאל)
    ShrinkMatrix(currentMat);           // דוחף שמאלה
    TurnToRight();                      // מחזיר את הסדר
    currentMat = transpose(currentMat); // מחזיר למבנה המקורי
    updateBoard(currentMat);
    let gameStatus = checkGameOver();
     if(gameStatus==0)
    {
    randDivTwoOrFour();
    }
     if(gameStatus==1)
        {
            alert("ניצחת!");
                        triggerWin(scorecurrent, document.getElementById("game-timer").textContent);

            restartGame();
            startGame();
        }
        if(gameStatus==-1)
        {
            alert("המשחק נגמר, אין לך מה לעשות יותר");
                        showEndGame(scorecurrent, document.getElementById("game-timer").textContent);

            restartGame();
            startGame();
        }
}



function moveRight() {
    console.log("לחץ על החץ ימינה – הפעולה התבצעה!");
    updateCurrentMat();
    TurnToRight();
    ShrinkMatrix(currentMat);
    TurnToRight();
    updateBoard(currentMat);
    let gameStatus = checkGameOver();
    if(gameStatus==0)
    {
    randDivTwoOrFour();
    }
     if(gameStatus==1)
        {
            alert("ניצחת!");
                        triggerWin(scorecurrent, document.getElementById("game-timer").textContent);
            restartGame();
            startGame();
        }
        if(gameStatus==-1)
        {
            alert("המשחק נגמר, אין לך מה לעשות יותר");
            showEndGame(scorecurrent, document.getElementById("game-timer").textContent);
            restartGame();
            startGame();
        }
      
}
//פונקציה שמגרילה 2 או 4 עם הסתברות של 80% ל-2 ו-20% ל-4
function randTwoOrFour() {
    const rand1 = Math.random(); // מספר אקראי בין 0 ל-1
  if (rand1 < 0.8) {
    return 2; // 80% סיכוי
  } else {
    return 4; // 20% סיכוי
  }
}

//פונקציה שמוסיפה מספר 2 או 4 למקום רנדומלי בלוח המשחק, רק אם המקום ריק (0)
function randDivTwoOrFour() 
{
    let mat=updateCurrentMat(); 
    let randIndex = Math.floor(Math.random() * 16); // מספר אקראי בין 0 ל-15
    while (mat[Math.floor(randIndex / 4)][randIndex % 4] != 0) 
    {
        randIndex = Math.floor(Math.random() * 16);
    }
    let numberToAdd = randTwoOrFour();
    let newDiv = document.createElement("div");
    newDiv.classList.add("cell");
    newDiv.textContent = numberToAdd;
    newDiv.style.backgroundColor = arrColors[Math.log2(numberToAdd)-1];
    let div = document.getElementById(randIndex);
    div.appendChild(newDiv);
}

//פונקציה שבודקת אם המשחק נגמר או אם השחקן ניצח
function checkGameOver() {
    let mat = updateCurrentMat();

    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            if (mat[i][j] === 2048) return 1; // ניצחון!
        }
    }

    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            if (mat[i][j] === 0) return 0; // עדיין יש מקום
        }
    }
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            // בדיקת שכן מימין
            if (j < 3 && mat[i][j] === mat[i][j + 1]) 
                return 2;
            // בדיקת שכן מלמטה
            if (i < 3 && mat[i][j] === mat[i + 1][j]) 
                return 2;
        }
    }

    // אם הגענו לכאן - אין אפסים ואין זוגות זהים סמוכים
    return -1; // הפסד
}

//פונקציה שמאתחלת את המשחק על ידי איפוס המטריצה והלוח משחק
function restartGame() {
    currentMat = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ];
    updateBoard(currentMat);
    let divScore = document.getElementById("current-score");
    divScore.textContent = "0";
    clearInterval(timerInterval);
}


// פונקציה שמפעילה את הטיימר
function startTimer() {
    // איפוס טיימר קודם אם היה
    if (timerInterval) clearInterval(timerInterval);
    
    seconds = 0;
    timerInterval = setInterval(updateTimer, 1000);
}

function updateTimer() {
    seconds++;
    let mins = Math.floor(seconds / 60);
    let secs = seconds % 60;
    
    // פורמט של 00:00
    let displayMins = mins < 10 ? "0" + mins : mins;
    let displaySecs = secs < 10 ? "0" + secs : secs;
    
    const timerElement = document.getElementById("game-timer");
    if (timerElement) {
        timerElement.textContent = displayMins + ":" + displaySecs;
    }
}

// פונקציה להצגת החלונית (קרא לה בסיום המשחק)
function showEndGame(score, time) {
    document.getElementById('final-score').innerText = score;
    document.getElementById('play-time').innerText = time;
    document.getElementById('modal-overlay').style.display = 'flex';
}

// פונקציה לסגירת החלונית כשלוחצים על ה-X
function closeModal() {
    document.getElementById('modal-overlay').style.display = 'none';
    document.getElementById('play-time').innerText = "00:00";
}

function triggerWin(score, time) {
    document.getElementById('win-score').innerText = score;
    document.getElementById('win-time').innerText = time ;
    document.getElementById('win-modal').style.display = 'flex';
}