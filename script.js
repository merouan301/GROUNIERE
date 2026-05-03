/**
 * إعدادات البيانات الأساسية (عينة للولايات الكبرى)
 * ملاحظة: يمكنك إضافة باقي البلديات بنفس النمط
 */
const dzData = {
    "01- أدرار": ["أدرار", "فنوغيل", "تمنطيط", "رقان", "أولاد أحمد تيمي"],
    "02- الشلف": ["الشلف", "تنس", "بوقادير", "أولاد فارس", "المرسى"],
    "09- البليدة": ["البليدة", "بوفاريك", "العفرون", "موزاية", "حمام ملوان"],
    "16- الجزائر": ["سيدي امحمد", "باب الوادي", "الحراش", "الدار البيضاء", "الشراقة", "دالي إبراهيم", "زرالدة", "بئر مراد رايس"],
    "19- سطيف": ["سطيف", "العلمة", "عين أرنات", "قجال", "عين الكبيرة"],
    "25- قسنطينة": ["قسنطينة", "الخروب", "حامة بوزيان", "زيغود يوسف", "عين عبيد"],
    "31- وهران": ["وهران", "عين الترك", "بطيوة", "السانية", "بئر الجير"],
    // ... أضف أي ولاية أخرى بنفس الطريقة
};

/**
 * تعريف العناصر من الـ HTML
 */
const form = document.getElementById('orderForm');
const btn = document.getElementById('submitBtn');
const wilayaInput = document.getElementById('wilaya-input');
const wilayaList = document.getElementById('wilayas');
const communeInput = document.getElementById('commune-input');
const communeList = document.getElementById('communes');

// رابط الـ API (استبدله برابطك الحقيقي لاحقاً)
const scriptURL = 'YOUR_GOOGLE_SHEET_API_URL';

/**
 * 1. تهيئة قائمة الولايات (Autofill)
 */
function initWilayas() {
    Object.keys(dzData).forEach(wilaya => {
        const option = document.createElement('option');
        option.value = wilaya;
        wilayaList.appendChild(option);
    });
}

/**
 * 2. التحكم في اختيار البلديات بناءً على الولاية
 */
wilayaInput.addEventListener('input', function() {
    const selectedWilaya = this.value;
    
    if (dzData[selectedWilaya]) {
        communeInput.disabled = false;
        // منع فقدان التركيز عند النقر (خاص بالموبايل)
        communeInput.setAttribute('autocomplete', 'off'); 
        
        communeList.innerHTML = ""; 
        dzData[selectedWilaya].forEach(commune => {
            const option = document.createElement('option');
            option.value = commune;
            communeList.appendChild(option);
        });

        // سطر السحر: التركيز القوي (Forced Focus)
        setTimeout(() => {
            communeInput.focus();
            communeInput.click(); // محاكاة نقرة لفتح القائمة
        }, 300);
    } else {
        communeInput.disabled = true;
        communeInput.value = "";
    }
});


/**
 * 3. وظيفة تغيير صور المنتج (الغاليري)
 */
function changeImage(src) {
    const mainImg = document.getElementById('current-img');
    if (mainImg) {
        mainImg.src = src;
        
        // تحسين مظهر المصغرات النشطة
        const thumbs = document.querySelectorAll('.thumbnails img');
        thumbs.forEach(t => {
            t.style.borderColor = "transparent";
            if(t.src === src) t.style.borderColor = "#1a4d3c";
        });
    }
}

/**
 * 4. معالجة إرسال النموذج (Submit)
 */
form.addEventListener('submit', e => {
    e.preventDefault();

    // إظهار حالة التحميل على الزر
    btn.disabled = true;
    btn.style.opacity = "0.7";
    btn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> جاري تأكيد طلبك...';

    // إرسال البيانات
    fetch(scriptURL, { 
        method: 'POST', 
        body: new FormData(form)
    })
    .then(response => {
        // التحويل لصفحة الشكر عند النجاح
        window.location.href = "success.html";
    })
    .catch(error => {
        console.error('Error!', error.message);
        alert('حدث خطأ أثناء الإرسال. يرجى التحقق من اتصال الإنترنت والمحاولة مجدداً.');
        
        // إعادة الزر لحالته الطبيعية في حال الخطأ
        btn.disabled = false;
        btn.style.opacity = "1";
        btn.innerHTML = '<span>أرسل طلبك الآن</span> <i class="fas fa-paper-plane"></i>';
    });
});
communeInput.addEventListener('mousedown', function(e) {
    if (!this.disabled) {
        // منع المتصفح من إغلاق لوحة المفاتيح الافتراضية
        const val = this.value;
        this.value = ''; // تفريغ مؤقت لجذب التركيز
        setTimeout(() => { this.value = val; }, 10);
    }
});

// تشغيل التهيئة عند تحميل الصفحة
window.onload = initWilayas;
