// مدیریت رمزها در localStorage
if(!localStorage.getItem("adminPasswords")){
    localStorage.setItem("adminPasswords", JSON.stringify({}));
}

function getPasswords(){
    return JSON.parse(localStorage.getItem("adminPasswords"));
}

function setPassword(username, password){
    let passwords = getPasswords();
    passwords[username] = password;
    localStorage.setItem("adminPasswords", JSON.stringify(passwords));
}

function resetAllData(){
    localStorage.clear();
}

function login(){
    let username = document.getElementById("username").value.trim();
    let password = document.getElementById("password").value.trim();
    let error = document.getElementById("error");

    if(!username || !password){
        error.innerText = "نام کاربری و رمز الزامی است";
        return;
    }

    // ادمین ۰۰ برای پاک کردن همه داده‌ها
    if(username === "00" && password === "3.141592653589793238"){
        if(confirm("آیا مطمئنید همه داده‌ها پاک شود؟")){
            resetAllData();
            alert("همه داده‌ها پاک شد");
        }
        return;
    }

    if(Number(username) < 1 || Number(username) > 9){
        error.innerText = "نام کاربری فقط 01 تا 09 مجاز است";
        return;
    }

    let passwords = getPasswords();

    // اگر اولین بار است → ثبت رمز
    if(!passwords[username]){
        setPassword(username, password);
        alert("رمز شما ثبت شد. حالا وارد شوید");
        return;
    }

    // بررسی رمز
    if(passwords[username] === password){
        // هدایت به داشبورد مخصوص ادمین
        if(username === "01") window.location.href = "01/dashboard.html";
        else if(username === "02") window.location.href = "02/dashboard.html";
        else window.location.href = "03plus/dashboard.html";
    } else {
        error.innerText = "رمز اشتباه است";
    }
}