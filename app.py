from flask import Flask, render_template, request, jsonify
import json
import os

app = Flask(__name__)

# منع الكاش أثناء التطوير (عشان الـ CSS يسمع علطول)
app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0

DB_FILE = 'properties.json'

# --- 1. دوال التعامل مع البيانات (Database Logic) ---
def load_data():
    # لو ملف البيانات مش موجود، اخلق واحد ببيانات افتراضية
    if not os.path.exists(DB_FILE):
        default_data = [
            {
                "id": 1,
                "title": "Sea View Villa",
                "location": "Saadiyat Island, Abu Dhabi",
                "price": "15,000,000 AED",
                "type": "villa",
                "beds": 5, "baths": 6, "area": "6500 sqft",
                "img": "static/images/villa1.jpg",  # تأكد ان الصورة دي موجودة
                "coords": [24.5422, 54.4372],
                "panorama": "https://pannellum.org/images/alma.jpg"
            },
            {
                "id": 2,
                "title": "Downtown Penthouse",
                "location": "Downtown Dubai",
                "price": "5,200,000 AED",
                "type": "apartment",
                "beds": 3, "baths": 3, "area": "2800 sqft",
                "img": "static/images/duplex.jpg", # تأكد ان الصورة دي موجودة
                "coords": [25.1972, 55.2744],
                "panorama": "https://pannellum.org/images/bma-0.jpg"
            }
        ]
        save_data(default_data)
        return default_data
    
    # لو الملف موجود، اقرأ منه
    try:
        with open(DB_FILE, 'r', encoding='utf-8') as f:
            return json.load(f)
    except (json.JSONDecodeError, FileNotFoundError):
        return [] # لو الملف بايظ رجع ليست فاضية

def save_data(data):
    with open(DB_FILE, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=4, ensure_ascii=False)

# --- 2. صفحات الموقع (Routes) ---
@app.route('/')
def home():
    return render_template('index.html')

@app.route('/admin')
def admin():
    return render_template('admin.html')

# --- 3. الـ APIs (الحلقة بين البايثون والجافاسكريبت) ---

# جلب كل العقارات
@app.route('/api/properties', methods=['GET'])
def get_properties():
    return jsonify(load_data())

# إضافة عقار جديد
@app.route('/api/add_property', methods=['POST'])
def add_property():
    new_prop = request.json
    data = load_data()
    
    # عمل ID جديد تلقائي
    new_id = 1 if not data else data[-1]['id'] + 1
    new_prop['id'] = new_id
    
    # --- تصحيح مسار الصورة بذكاء ---
    # لو المستخدم كتب "villa.jpg" بس، الكود هيخليها "static/images/villa.jpg"
    img_name = new_prop.get('img', '')
    if img_name and not img_name.startswith('static/'):
        # لو المستخدم نسي يكتب static/images/ احنا بنحطها له
        if not img_name.startswith('images/'):
             new_prop['img'] = f'static/images/{img_name}'
        else:
             new_prop['img'] = f'static/{img_name}'
             
    data.append(new_prop)
    save_data(data)
    return jsonify({"success": True, "message": "Property Added Successfully!"})

# الشات بوت الذكي (عربي وانجليزي)
@app.route('/api/chat', methods=['POST'])
def chat():
    msg = request.json.get('message', '').lower()
    
    # الردود العربية
    if any(word in msg for word in ["سعر", "اسعار", "بكام", "تكلفة"]):
        reply = "الأسعار تبدأ من 2 مليون درهم وتصل إلى 50 مليون حسب الموقع والمساحة."
    elif any(word in msg for word in ["موقع", "مكان", "فين"]):
        reply = "نغطي أرقى المناطق في أبوظبي (السعديات، ياس) ودبي (مارينا، داون تاون)."
    elif any(word in msg for word in ["تواصل", "رقم", "اتصال"]):
        reply = "يمكنك التواصل معنا فوراً عبر الهاتف: 0097150000000 أو عبر الواتساب."
    elif any(word in msg for word in ["مرحبا", "هلا", "السلام"]):
        reply = "أهلاً بك في Elite Estates! كيف يمكنني مساعدتك اليوم؟"
        
    # English Responses
    elif "price" in msg or "cost" in msg:
        reply = "Prices start from 2M AED up to 50M AED based on location."
    elif "location" in msg or "where" in msg:
        reply = "We cover prime locations in Abu Dhabi (Saadiyat, Yas) and Dubai (Marina, Downtown)."
    elif "contact" in msg or "phone" in msg:
        reply = "Call us at +971-50-000-0000 or click the WhatsApp button."
    elif "hello" in msg or "hi" in msg:
        reply = "Welcome to Elite Estates! How can I help you find your dream home?"
    
    # Default fallback
    else:
        reply = "I can help with Prices, Locations, and Booking. / أستطيع مساعدتك في الأسعار والمواقع."
        
    return jsonify({"response": reply})

if __name__ == '__main__':
    app.run(debug=True)