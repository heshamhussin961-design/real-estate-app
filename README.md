# Elite Estates - Premium Real Estate Platform

![Elite Estates Logo](https://img.shields.io/badge/Elite-Estates-gold?style=for-the-badge&logo=home-assistant&logoColor=white)
![Flask](https://img.shields.io/badge/Flask-000000?style=for-the-badge&logo=flask&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

A modern, high-end real estate web application designed for luxury property listings. Built with a focus on visual excellence, performance, and user engagement, featuring interactive 360° VR views and a bilingual AI chatbot.

## 🚀 Key Features

- **💎 Premium glassmorphism UI**: A sleek, modern design with smooth animations using `flutter_animate` (logic inspired) and standard CSS transitions.
- **🏠 Dynamic Property Listings**: Fetches property data from a JSON-based database in real-time.
- **📸 360° VR Tour Integration**: Integrated VR panoramas for an immersive property viewing experience.
- **🤖 Bilingual AI Chatbot**: A custom-built chatbot that supports both Arabic and English to assist users with pricing, locations, and booking.
- **🛠️ Admin Dashboard**: Secure management interface to add and update property listings without touching the code.
- **📱 Fully Responsive**: Optimized for all devices, from mobile phones to high-resolution desktops.

## 🛠️ Tech Stack

- **Backend**: Python (Flask)
- **Frontend**: HTML5, Vanilla CSS3, JavaScript (ES6+)
- **Database**: JSON (Flat-file database for high-speed performance)
- **External Libraries**: Pannellum (for VR), Leaflet/Google Maps (for location tracking)

## 📂 Project Structure

```text
RealEstate_Site/
├── app.py              # Main Flask application logic & API routes
├── properties.json     # JSON Database storing property data
├── requirements.txt    # Python dependencies
├── static/             # Static assets (CSS, JS, Images)
│   ├── script.js       # Frontend logic and Chatbot handling
│   ├── style.css       # Core design system and animations
│   └── images/         # Property photos and icons
└── templates/          # HTML Templates
    ├── index.html      # Main landing page
    └── admin.html      # Administrative dashboard
```

## ⚙️ Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/RealEstate_Site.git
   cd RealEstate_Site
   ```

2. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Run the application**:
   ```bash
   python app.py
   ```

4. **Access the site**:
   - Website: `http://127.0.0.1:5000`
   - Admin Panel: `http://127.0.0.1:5000/admin`

## 💡 Usage

- **User**: Browse properties using filters, interact with the chatbot for quick info, and view properties in VR.
- **Admin**: Go to `/admin` to add new property details including title, price, location, coordinates for maps, and panorama links.

## ⚖️ License

Distributed under the MIT License. See `LICENSE` for more information.

---
*Created with ❤️ by Hussin Hesham*
