# Privacy Policy — CricVerse360

**Last updated: April 30, 2026**

> **IMPORTANT — LEGAL REVIEW REQUIRED:** This policy is a comprehensive draft prepared to address known gaps. It has NOT been reviewed by legal counsel. Rising Star Cricket League should have this document reviewed by a qualified attorney before relying on it.

---

## 1. Who We Are

CricVerse360 ("the Platform") is operated by **Rising Star Cricket League** ("we," "us," "our"), a company based in the United States. CricVerse360 provides AI-powered cricket video analysis for training guidance.

**Contact:** info@cricverse360.com

---

## 2. Information We Collect

### 2.1 Information You Provide

- **Account information:** Full name, email address, age, location, player profile details (role, batting/bowling style, academy affiliation), and bio.
- **Video data:** Cricket batting and bowling videos you upload for AI analysis. This is the most sensitive data we collect and process — see Section 4 for details.
- **Payment information:** Processed securely through Stripe. We do not store your credit card numbers, CVV, or full card details on our servers.
- **Profile content:** Player cards, shared analysis results, leaderboard entries, and any other content you choose to make public.
- **Communications:** Emails, support requests, and feedback you send us.

### 2.2 Information Collected Automatically

- **Usage data:** Pages viewed, features used, buttons clicked, analysis history, scores, and interaction patterns.
- **Device information:** Browser type, operating system, screen resolution, and device identifiers.
- **Log data:** IP address, access times, referring URLs, and error logs.
- **Local storage:** We use browser localStorage (not cookies) to store your authentication tokens and app preferences. See Section 8.

### 2.3 Information from Third Parties

We do not currently purchase or receive personal information from third-party data brokers.

---

## 3. Legal Basis for Processing (GDPR)

If you are in the EU/EEA or UK, we process your personal data under the following legal bases:

| Purpose | Legal Basis |
|---------|-------------|
| Providing the Platform and AI analysis | Performance of contract (Art. 6(1)(b)) |
| Processing payments | Performance of contract (Art. 6(1)(b)) |
| Sending service-related communications | Performance of contract (Art. 6(1)(b)) |
| Improving the Platform and analytics | Legitimate interest (Art. 6(1)(f)) |
| Sending promotional communications | Consent (Art. 6(1)(a)) — you can withdraw at any time |
| Complying with legal obligations | Legal obligation (Art. 6(1)(c)) |
| Processing video data through AI | Consent (Art. 6(1)(a)) — given when you upload |
| Processing data of minors (under 16 in EU) | Consent of parent/guardian (Art. 8) |

---

## 4. Video Data and AI Processing

This section explains how we handle your video data, which we consider the most sensitive information we process.

### 4.1 On-Device Analysis (Browser-Based)

When you use our browser-based pose detection features (powered by MediaPipe), video is processed **entirely on your device**. No video data is sent to our servers or any third party. The pose landmarks generated remain in your browser's memory and are discarded when you leave the page.

### 4.2 Cloud Analysis (Server Upload)

When you upload a video for full AI analysis:

1. **Upload:** Your video is transmitted over an encrypted connection (TLS) to our servers hosted on Amazon Web Services (AWS) in the United States.
2. **AI Processing:** The video is sent to **Google Gemini AI** for technique analysis. Google processes the video in accordance with their [Privacy Policy](https://policies.google.com/privacy) and [AI Terms](https://ai.google.dev/terms). Google may temporarily store the video during processing but does not use it to train their general AI models when accessed through their API.
3. **Report Generation:** The AI-generated analysis report (scores, feedback, drills, timestamps) is stored in our database linked to your account.
4. **Video Retention:** Uploaded videos are retained for **90 days** to allow re-analysis and support requests. After 90 days, videos are automatically and permanently deleted from our servers and from AWS storage. Analysis reports and scores are retained for as long as your account is active.
5. **Deletion on Request:** You may request immediate deletion of your uploaded videos at any time by contacting info@cricverse360.com. We will delete the video within 30 days of your request.

### 4.3 Biometric Data Notice

Our on-device pose detection analyzes body positions and movements in your video to identify cricket technique patterns. In some jurisdictions (including Illinois under BIPA, Texas under CUBI, and Washington), this type of analysis may be classified as biometric data processing.

**By uploading a video or enabling on-device pose detection, you consent to this processing.** We do not sell, lease, or trade biometric data. Biometric data derived from on-device processing is not transmitted to our servers. Biometric-related analysis from cloud processing (e.g., stance angles, footwork patterns) is stored only as part of your analysis report and is deleted when your account is deleted or upon request.

If you are an Illinois resident, you may contact us at info@cricverse360.com to learn more about our biometric data practices or to revoke your consent.

---

## 5. How We Use Your Information

- Provide AI-powered cricket video analysis using Google Gemini AI
- Generate performance scores, reports, improvement plans, and drills
- Display your profile on leaderboards and player directories (only if you opt in to a public profile)
- Process payments and manage your subscription through Stripe
- Send service-related notifications (analysis complete, account changes)
- Send promotional communications (only with your consent; you can opt out at any time)
- Monitor and analyze usage trends to improve the Platform
- Detect and prevent fraud, abuse, and security incidents
- Comply with legal obligations

---

## 6. Third-Party Service Providers (Data Processors)

We share data with the following service providers who process data on our behalf:

| Provider | Purpose | Data Shared | Location |
|----------|---------|-------------|----------|
| **Google Gemini AI** | Video analysis and report generation | Uploaded videos, analysis prompts | United States |
| **Amazon Web Services (AWS)** | Server hosting, database, video storage | All platform data | United States |
| **Stripe** | Payment processing | Name, email, payment method | United States |
| **Vercel** | Web application hosting and CDN | Browsing data, IP address | Global (US-based) |
| **Amazon Cognito** | User authentication | Email, password (hashed) | United States |

We do not sell your personal information. We do not share your data with advertisers, data brokers, or any third parties for their own marketing purposes.

A full list of sub-processors is available at [/processors](/processors).

---

## 7. Data Retention

| Data Type | Retention Period |
|-----------|-----------------|
| Account information | Until you delete your account |
| Uploaded videos | 90 days, then automatically deleted |
| Analysis reports and scores | Until you delete your account |
| Payment records | As required by tax/accounting law (typically 7 years) |
| Usage/analytics data | 24 months from collection |
| Authentication tokens | Until you log out or they expire |
| Support communications | 3 years from last contact |

When you delete your account, we will delete or anonymize your personal data within 30 days, except where retention is required by law.

---

## 8. Cookies and Local Storage

CricVerse360 uses **browser localStorage** (not traditional HTTP cookies) to store:

- Authentication tokens (to keep you logged in)
- App preferences and settings
- Cached analysis data for offline access

We use **first-party analytics only** — we track events (page views, uploads, purchases) through our own API, not through third-party analytics services like Google Analytics. We do not use advertising pixels, cross-site tracking, or third-party cookies.

**Because we do not use non-essential cookies or third-party tracking, a cookie consent banner is not strictly required under current EU ePrivacy rules.** However, we provide transparency about our localStorage usage above.

You can clear localStorage data at any time through your browser settings (Developer Tools > Application > Local Storage > clear the `cricverse360_` entries).

---

## 9. Children and Young Players

CricVerse360 is designed for cricket players of all ages, including youth players in U13, U15, U17, and U19 categories. We take the privacy of minors seriously.

### 9.1 Users Under 13 (COPPA Compliance — United States)

Under the U.S. Children's Online Privacy Protection Act (COPPA):
- Users under 13 **must have verifiable parental or guardian consent** before creating an account or uploading videos.
- During signup, users who indicate they are under 13 will be prompted to provide a parent/guardian email address. The parent/guardian must confirm consent before the account is activated.
- Parents/guardians may at any time: review their child's personal information, request deletion, or refuse further collection by contacting info@cricverse360.com.
- If we become aware that we have collected personal information from a child under 13 without verified parental consent, we will delete that information promptly.

### 9.2 Users Under 16 (GDPR-K — EU/EEA/UK)

Under GDPR Article 8 and the UK Age Appropriate Design Code:
- Users under 16 in the EU/EEA (or under the applicable age in their member state) require parental or guardian consent for data processing.
- We apply the same parental consent mechanism described in 9.1 to users under 16 from EU/EEA/UK.
- We design our platform with minors in mind: we do not use manipulative design patterns, we limit data collection to what is necessary, and we provide clear, age-appropriate information.

### 9.3 Users Aged 13–17

- Users aged 13–17 should use the Platform with the knowledge and guidance of a parent or guardian.
- Parents/guardians may contact us at any time to review, delete, or restrict processing of their child's data.

---

## 10. Your Privacy Rights

### 10.1 All Users

Regardless of where you live, you have the right to:
- **Access** the personal data we hold about you
- **Correct** inaccurate personal data
- **Delete** your personal data and uploaded videos
- **Export** your data in a portable format
- **Opt out** of promotional communications
- **Disable** your public profile at any time

To exercise these rights, email info@cricverse360.com. We will respond within 30 days.

### 10.2 EU/EEA/UK Residents (GDPR)

In addition to the above, you have the right to:
- **Restrict processing** of your personal data
- **Object to processing** based on legitimate interest
- **Data portability** — receive your data in a structured, machine-readable format
- **Withdraw consent** at any time (without affecting the lawfulness of processing before withdrawal)
- **Lodge a complaint** with your local data protection authority (e.g., the ICO in the UK, CNIL in France, or your national supervisory authority)

### 10.3 California Residents (CCPA/CPRA)

If you are a California resident, you have the right to:
- **Know** what personal information we collect, use, and disclose
- **Delete** your personal information
- **Opt out of the sale or sharing** of personal information
- **Non-discrimination** — we will not treat you differently for exercising your rights

**We do not sell personal information** as defined under CCPA/CPRA. We do not use third-party advertising pixels, cross-site tracking, or share data with data brokers.

To submit a CCPA request, email info@cricverse360.com or use the "Do Not Sell or Share My Personal Information" link in the footer.

### 10.4 Other Jurisdictions

If you are located in Australia (Privacy Act 1988), Canada (PIPEDA), or other jurisdictions with data protection laws, you may have additional rights. Contact us and we will accommodate your request to the extent required by applicable law.

---

## 11. International Data Transfers

CricVerse360 is hosted in the United States. If you access the Platform from outside the US (including the EU/EEA, UK, or Australia), your data will be transferred to and processed in the United States.

For transfers from the EU/EEA/UK to the US, we rely on:
- The EU-US Data Privacy Framework (where applicable)
- Standard Contractual Clauses (SCCs) approved by the European Commission
- Your explicit consent (provided when you create an account and upload videos)

We ensure that our third-party service providers maintain appropriate safeguards for international data transfers.

---

## 12. Data Security

We implement industry-standard security measures including:
- Encryption in transit (TLS/SSL) for all data transmissions
- Encryption at rest for stored data (AWS)
- Access controls and authentication (AWS Cognito)
- Regular security reviews

However, no method of transmission over the Internet is 100% secure. We cannot guarantee absolute security. If we become aware of a data breach affecting your personal information, we will notify you and the relevant authorities as required by applicable law.

---

## 13. Changes to This Policy

We may update this Privacy Policy from time to time. We will notify you of material changes by:
- Posting the updated policy on this page with a new "Last updated" date
- Sending an email notification for significant changes
- Displaying a notice on the Platform

Your continued use of the Platform after changes constitutes acceptance of the updated policy.

---

## 14. Contact Us

For questions, concerns, or requests related to this Privacy Policy:

**Rising Star Cricket League** (operating as CricVerse360)
Email: info@cricverse360.com

For EU/EEA residents: If you are unsatisfied with our response, you have the right to lodge a complaint with your local supervisory authority.
