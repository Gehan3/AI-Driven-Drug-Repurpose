import streamlit as st
import requests

st.set_page_config(page_title="Drug Repurposing System", layout="centered")

st.title("🔬 AI-Driven Drug Repurposing System")
st.write("استعلم عن الأدوية والعلاقات المكتشفة من خلال النظام ذكي")

# خانة إدخال اسم الدواء من المستخدم
drug_name = st.text_input("ادخل اسم الدواء للبحث (مثال: Imatinib):")

if st.button("بحث واستعلام 🚀"):
    if drug_name:
        st.info("جاري إرسال الطلب ومعالجته عبر الـ Pipeline...")
        
        # 👇 رابط الـ Webhook بتاعك من نود n8n (تأكدي إنه رابط الـ Production أو التست الشغال)
        webhook_url = "https://135d9cc9.kube-ops.com/webhook-test/04cbb11d-826e-463f-aebb-107e1224b4a0"
        
        # إرسال البيانات للـ n8n
        payload = {"drug_name": drug_name}
        
        try:
            response = requests.post(webhook_url, json=payload)
            if response.status_code == 200:
                result_data = response.json()
                st.success("تم استقبال البيانات بنجاح!")
                st.json(result_data)
            else:
                st.error(f"حدث خطأ في السيرفر: {response.status_code}")
        except Exception as e:
            st.error(f"فشل الاتصال بـ n8n: {e}")
    else:
        st.warning("Please the drug name firstly")