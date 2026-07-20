AI-DRIVEN-DRUG-REPURPOSE/
│
├── .devcontainer/                  # إعدادات بيئة التطوير (يمكن تركها كما هي)
├── data/                           # بدلاً من وضع الملفات بالخارج، نجمعها هنا
│   ├── raw/                        # ملفات الـ Hetionet الأصلية و CSVs
│   └── processed/                  # البيانات بعد المعالجة
│
├── notebooks/                      # جولات الـ Jupyter Notebooks للتجريب
│   ├── Drug_repurpose_Project_EAI.ipynb
│   └── import.ipynb
│
├── src/                            # قلب الكود البرمجي (Source Code)
│   ├── __init__.py
│   ├── data_loader.py              # تحميل وتنظيف البيانات
│   ├── model.py                    # كود الـ SparseGraph والنماذج
│   ├── predict.py                  # منطق التنبؤ
│   └── main.py                     # نقطة التشغيل الأساسية
│
├── backend/                        # سيرفر الـ FastAPI أو الـ Backend الخاص بكِ
│
├── frontend/                       # واجهة الـ Streamlit أو الـ UI
│
├── assets/                         # الصور والرسوم البيانية (مثل Fig. 1 و Fig. 2 للبحث)
│
├── .gitignore                      # ملف استبعاد الملفات من جيت هاب (هام جداً)
├── requirements.txt                # المكتبات المطلوبة
├── README.md                       # وصف المشروع (واجهة المشروع على GitHub)
└── LICENSE                         # (اختياري) رخصة الاستخدام
