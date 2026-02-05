window.onload = function() {
    // --- بارگذاری و ذخیره‌سازی داده‌ها (ساختار جامع برای نگهداری همه چیز) ---
    let data = JSON.parse(localStorage.getItem("data")) || { customers: [], income: 0 };
    const contentArea = document.getElementById("contentArea");

    function saveData() {
        localStorage.setItem("data", JSON.stringify(data));
    }

    function randomPassword() {
        const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
        let pass = "";
        for (let i = 0; i < 6; i++) {
            pass += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return pass;
    }

    function goHome() {
        renderMainMenu();
    }

    // --- منوی اصلی ---
    function renderMainMenu() {
        contentArea.innerHTML = `
            <h3>منوی اصلی</h3>
            <p>درآمد کل: <strong>${data.income.toLocaleString()}</strong> ریال</p>
            <button id="listCustBtn">نمایش مشتری‌ها</button>
            <button id="addCustBtn">ثبت مشتری جدید</button>
            <button id="checkPassBtn">بررسی رمز مشتری</button>
            <button id="addIncomeBtn">ثبت درآمد کلی</button>
            <button id="addScoreBtn">ثبت امتیاز مشتری</button>
        `;
        
        document.getElementById("listCustBtn").onclick = showCustomerList;
        document.getElementById("addCustBtn").onclick = showAddCustomer;
        document.getElementById("checkPassBtn").onclick = showCheckPassword;
        document.getElementById("addIncomeBtn").onclick = showAddIncome;
        document.getElementById("addScoreBtn").onclick = showAddScore;
    }

    // --- ۱. ثبت مشتری جدید ---
    function showAddCustomer() {
        contentArea.innerHTML = `
            <h3>ثبت مشتری جدید</h3>
            <input id="firstName" placeholder="نام">
            <input id="lastName" placeholder="نام خانوادگی">
            <button id="saveBtn">ثبت و دریافت رمز</button>
            <div id="addResult" class="result-box"></div>
            <br>
            <button id="backBtn">بازگشت به منو</button>
        `;
        document.getElementById("saveBtn").onclick = saveCustomer;
        document.getElementById("backBtn").onclick = goHome;
    }

    function saveCustomer() {
        const first = document.getElementById("firstName").value.trim();
        const last = document.getElementById("lastName").value.trim();
        const resultDiv = document.getElementById("addResult");

        if (!first || !last) {
            resultDiv.innerHTML = '<span style="color: red;">نام و نام خانوادگی الزامی است.</span>';
            return;
        }

        const password = randomPassword();

        const newCustomer = {
            first,
            last,
            password,
            score: 0, // امتیاز اولیه صفر
            active: true
        };

        data.customers.push(newCustomer);
        saveData();
        
        resultDiv.innerHTML = `<span style="color: green;">✅ مشتری با موفقیت ثبت شد.<br>رمز اختصاصی: <b>${password}</b></span>`;
    }

    // --- ۲. نمایش لیست مشتری‌ها ---
    function showCustomerList() {
        let html = "<h3>لیست مشتری‌ها</h3>";
        if (!data.customers.length) {
            html += "<p>هیچ مشتری‌ای ثبت نشده است.</p>";
        } else {
            data.customers.forEach(c => {
                html += `
                    <div class="customer-box">
                        <strong>${c.first} ${c.last}</strong> | امتیاز: ${c.score} | رمز: ${c.password}
                    </div>
                `;
            });
        }
        html += `<br><button id="backBtn">بازگشت به منو</button>`;
        contentArea.innerHTML = html;
        document.getElementById("backBtn").onclick = goHome;
    }

    // --- ۳. بررسی رمز مشتری ---
    function showCheckPassword() {
        contentArea.innerHTML = `
            <h3>بررسی اعتبار رمز مشتری</h3>
            <input id="checkPass" placeholder="رمز را وارد کنید">
            <button id="checkBtn">بررسی</button>
            <div id="checkResult" class="result-box"></div>
            <br>
            <button id="backBtn">بازگشت به منو</button>
        `;
        document.getElementById("checkBtn").onclick = checkPassword;
        document.getElementById("backBtn").onclick = goHome;
    }

    function checkPassword() {
        const val = document.getElementById("checkPass").value.trim();
        const resultDiv = document.getElementById("checkResult");
        
        if (!val) {
             resultDiv.innerHTML = '<span style="color: orange;">لطفاً رمز را وارد کنید.</span>';
             return;
        }
        
        const cust = data.customers.find(c => c.password === val);
        
        if (cust) {
            resultDiv.innerHTML = `<span style="color: green;">✅ تایید شد: مشتری ${cust.first} ${cust.last} (امتیاز: ${cust.score})</span>`;
        } else {
            resultDiv.innerHTML = `<span style="color: red;">❌ رمز اشتباه است یا مشتری با این رمز وجود ندارد.</span>`;
        }
    }

    // --- ۴. ثبت درآمد کلی ---
    function showAddIncome() {
        contentArea.innerHTML = `
            <h3>ثبت درآمد کلی</h3>
            <input id="incomeAmount" type="number" placeholder="مبلغ درآمد (ریال)">
            <button id="incomeSaveBtn">ثبت درآمد</button>
            <div id="incomeResult" class="result-box"></div>
            <br>
            <button id="backBtn">بازگشت به منو</button>
        `;
        document.getElementById("incomeSaveBtn").onclick = saveIncome;
        document.getElementById("backBtn").onclick = goHome;
    }

    function saveIncome() {
        const amountStr = document.getElementById("incomeAmount").value;
        const resultDiv = document.getElementById("incomeResult");
        const amount = parseInt(amountStr);

        if (isNaN(amount) || amount <= 0) {
            resultDiv.innerHTML = '<span style="color: red;">لطفاً مبلغ صحیح و مثبت وارد کنید.</span>';
            return;
        }

        data.income += amount;
        saveData();
        
        resultDiv.innerHTML = `<span style="color: green;">✅ ${amount.toLocaleString()} ریال به درآمد کل اضافه شد.</span>`;
    }

    // --- ۵. ثبت امتیاز مشتری (با منطق میانگین‌گیری) ---
    function showAddScore() {
        contentArea.innerHTML = `
            <h3>افزایش امتیاز مشتری</h3>
            <input id="scorePass" placeholder="رمز مشتری برای یافتن">
            <input id="scoreValue" type="number" placeholder="امتیاز جدید (بین 1 تا 10)">
            <button id="scoreSaveBtn">ثبت امتیاز جدید</button>
            <div id="scoreResult" class="result-box"></div>
            <br>
            <button id="backBtn">بازگشت به منو</button>
        `;
        document.getElementById("scoreSaveBtn").onclick = addScore;
        document.getElementById("backBtn").onclick = goHome;
    }
    
    function addScore() {
        const pass = document.getElementById("scorePass").value.trim();
        const scoreStr = document.getElementById("scoreValue").value;
        const resultDiv = document.getElementById("scoreResult");
        const newScoreInput = parseInt(scoreStr);

        // اعتبار سنجی امتیاز ورودی (1 تا 10)
        if (isNaN(newScoreInput) || newScoreInput < 1 || newScoreInput > 10) {
            resultDiv.innerHTML = '<span style="color: red;">امتیاز جدید باید عددی بین 1 تا 10 باشد.</span>';
            return;
        }

        if (!pass) {
            resultDiv.innerHTML = '<span style="color: red;">رمز مشتری الزامی است.</span>';
            return;
        }
        
        const cust = data.customers.find(c => c.password === pass);
        
        if (!cust) {
            resultDiv.innerHTML = '<span style="color: red;">مشتری با این رمز یافت نشد.</span>';
            return;
        }

        let updatedScore;
        if (cust.score === 0) {
            // اگر امتیاز قبلی صفر بود، امتیاز جدید را ثبت کن
            updatedScore = newScoreInput;
        } else {
            // اگر امتیاز قبلی صفر نبود، میانگین بگیر
            updatedScore = Math.round((cust.score + newScoreInput) / 2);
        }
        
        cust.score = updatedScore;
        saveData();
        
        resultDiv.innerHTML = `<span style="color: green;">✅ امتیاز مشتری ${cust.first} ${cust.last} به‌روز شد. امتیاز جدید: ${cust.score}</span>`;
    }

    // --- اجرای اولیه ---
    renderMainMenu();
};
