def generate_complaint(issue_display: str, city: str, dept_name: str, user_text: str) -> dict:
    english = (
        f"Subject: Complaint Regarding {issue_display}\n\n"
        f"Respected Sir/Madam,\n\n"
        f"I am a resident of {city} and wish to report an issue related to "
        f"{issue_display.lower()}. {user_text}\n\n"
        f"I request the {dept_name} to kindly look into this matter and take "
        f"appropriate action at the earliest.\n\n"
        f"Thank you for your attention.\n\n"
        f"Yours sincerely,\n"
        f"[Your Name]\n"
        f"[Your Contact Information]"
    )

    urdu = (
        f"عنوان: {issue_display} سے متعلق شکایت\n\n"
        f"محترم جناب/مدام،\n\n"
        f"میں {city} کا/کی رہائشی ہوں اور {issue_display} "
        f"سے متعلق ایک مسئلے کی اطلاع دینا چاہتا/چاہتی ہوں۔ {user_text}\n\n"
        f"میں {dept_name} سے درخواست کرتا/کرتی ہوں کہ براہ کرم اس معاملے "
        f"کی تحقیقات کریں اور جلد از جلد مناسب کارروائی فرمائیں۔\n\n"
        f"آپ کی توجہ کا شکریہ۔\n\n"
        f"آپ کا/کی مخلص،\n"
        f"[آپ کا نام]\n"
        f"[آپ کی رابطہ معلومات]"
    )

    return {"urdu": urdu, "english": english}
