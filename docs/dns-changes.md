# DNS Changes: SPF + DKIM for cricverse360.com

**Audit findings:** QA-003 (Missing SPF), QA-004 (Missing DKIM)

---

## 1. Email Provider Investigation

| Item | Finding |
|------|---------|
| **Provider** | AWS Cognito (verification & password-reset emails) |
| **Current sender** | `no-reply@verificationemail.com` (Cognito default) |
| **Custom SES config** | None — Cognito has no `emailConfiguration` set |
| **From address** | Not `@cricverse360.com` currently |
| **DNS host** | GoDaddy (`ns03.domaincontrol.com`, `ns04.domaincontrol.com`) |
| **Existing SPF** | None |
| **Existing DKIM** | None |
| **Existing MX** | None |
| **Existing DMARC** | `v=DMARC1; p=quarantine; adkim=r; aspf=r; rua=mailto:dmarc_rua@onsecureserver.net;` |

### Why SPF/DKIM don't help today

Cognito's default sender sends from `verificationemail.com`, not from
`cricverse360.com`. Adding SPF/DKIM to `cricverse360.com` has no effect
on those emails. To fix email deliverability properly, two things must happen:

1. **Verify `cricverse360.com` as a domain identity in AWS SES**
2. **Configure Cognito to use SES with a custom From address** (`no-reply@cricverse360.com`)

Only then do SPF/DKIM records on `cricverse360.com` become meaningful.

---

## 2. Required Infrastructure Changes (CDK)

Add SES domain verification and Cognito email configuration to the CDK stack:

```typescript
// In lib/cricverse360-stack.ts — after UserPool creation:

// 1. SES domain identity (auto-generates DKIM tokens)
// Note: Must be done via AWS Console or CLI first to get DKIM selectors.
// CDK EmailIdentity construct can also handle this:
//
// import * as ses from 'aws-cdk-lib/aws-ses';
// const emailIdentity = new ses.EmailIdentity(this, 'DomainIdentity', {
//   identity: ses.Identity.domain('cricverse360.com'),
// });

// 2. Update UserPool email configuration:
// Add to UserPool props:
//   email: cognito.UserPoolEmail.withSES({
//     fromEmail: 'no-reply@cricverse360.com',
//     fromName: 'CricVerse360',
//     sesRegion: 'us-east-1',
//   }),
```

---

## 3. DNS Records to Add

After SES domain verification generates the DKIM tokens, add these records
in GoDaddy DNS management:

### 3.1 SPF Record

| Type | Name | Value | TTL |
|------|------|-------|-----|
| TXT | `@` (root) | `v=spf1 include:amazonses.com ~all` | 3600 |

**Notes:**
- `include:amazonses.com` covers all AWS SES sending IPs
- `~all` (softfail) is safe for initial deployment; tighten to `-all` after confirming all senders are covered
- If you add other email providers later (e.g., Google Workspace for team email), add their `include:` before `~all`

### 3.2 DKIM CNAME Records

SES generates 3 DKIM signing keys when you verify a domain. The exact
selectors will be shown in the SES console after verification. Format:

| Type | Name | Value | TTL |
|------|------|-------|-----|
| CNAME | `<selector1>._domainkey` | `<selector1>.dkim.amazonses.com` | 3600 |
| CNAME | `<selector2>._domainkey` | `<selector2>.dkim.amazonses.com` | 3600 |
| CNAME | `<selector3>._domainkey` | `<selector3>.dkim.amazonses.com` | 3600 |

**To get the actual selectors:**
1. Go to AWS SES Console → Verified identities → Create identity
2. Select "Domain" → Enter `cricverse360.com`
3. Click "Create identity"
4. SES will display 3 CNAME records — those are the exact values to add

**Or via CLI:**
```bash
aws sesv2 create-email-identity --identity-name cricverse360.com --region us-east-1
aws sesv2 get-email-identity --email-identity cricverse360.com --region us-east-1 \
  | jq '.DkimAttributes.Tokens'
```

Each token value (e.g., `abc123xyz`) becomes:
- Name: `abc123xyz._domainkey.cricverse360.com`
- Value: `abc123xyz.dkim.amazonses.com`

---

## 4. DMARC Note

Current DMARC record:
```
v=DMARC1; p=quarantine; adkim=r; aspf=r; rua=mailto:dmarc_rua@onsecureserver.net;
```

**Issue:** `rua` (aggregate report address) points to `onsecureserver.net` — this
is a GoDaddy/Secureserver domain, likely a leftover from a DNS template. DMARC
aggregate reports are being sent to a domain you may not control or monitor.

**Recommendation:**
- Change `rua` to `mailto:dmarc-reports@cricverse360.com` (requires that mailbox to exist), OR
- Use a free DMARC monitoring service (e.g., `rua=mailto:re+abc123@dmarc.postmarkapp.com`)
- Keep `p=quarantine` for now; tighten to `p=reject` after SPF+DKIM are verified and stable for 2+ weeks

---

## 5. Verification Steps (after DNS propagation)

### 5.1 Check SPF
```bash
dig txt cricverse360.com +short
# Expected: "v=spf1 include:amazonses.com ~all"
```

### 5.2 Check DKIM
```bash
dig cname <selector1>._domainkey.cricverse360.com +short
# Expected: <selector1>.dkim.amazonses.com.
```

### 5.3 End-to-end test
1. Register a new account on cricverse360.com with a fresh Gmail address
2. Check inbox for verification email
3. In Gmail: click "Show original" on the received email
4. Confirm headers show:
   - `SPF: PASS`
   - `DKIM: PASS`
   - `DMARC: PASS`
5. Repeat with an Outlook/Hotmail address

### 5.4 Online tools
- https://mxtoolbox.com/spf.aspx — verify SPF record
- https://mxtoolbox.com/dkim.aspx — verify DKIM
- https://www.mail-tester.com — send test email, get deliverability score

---

## 6. Rollback Plan

If email deliverability degrades after changes:
1. Remove the SPF TXT record (or change to `v=spf1 ~all` which permits all)
2. Remove DKIM CNAMEs
3. Revert Cognito email config to default sender (remove `email:` prop from CDK)
4. Redeploy CDK stack

SPF/DKIM are purely additive — removing them returns to the status quo
(which is already delivering via Cognito's default domain).

---

## 7. Action Required from Product Owner

- [ ] Confirm whether `rua=mailto:dmarc_rua@onsecureserver.net` is intentional
- [ ] Run the SES domain verification (AWS Console or CLI command above)
- [ ] Copy the 3 DKIM selector values from SES
- [ ] Add DNS records in GoDaddy panel (SPF TXT + 3 DKIM CNAMEs)
- [ ] Confirm propagation with verification steps above
- [ ] Approve CDK stack update to configure Cognito → SES email sending
