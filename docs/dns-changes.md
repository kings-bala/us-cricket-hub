# DNS Changes: SPF + DKIM for cricverse360.com

**Audit findings:** QA-003 (Missing SPF), QA-004 (Missing DKIM)

---

## Prerequisites Summary

Four things must happen in order to make SPF/DKIM meaningful for cricverse360.com:

| # | Step | Owner | Status |
|---|------|-------|--------|
| 1 | Verify `cricverse360.com` as SES domain identity | PO (AWS Console or CLI) | TODO |
| 2 | Configure Cognito to send via SES (`no-reply@cricverse360.com`) | CDK deploy | TODO |
| 3 | Add SPF TXT + DKIM CNAME records in GoDaddy | PO (DNS panel) | TODO |
| 4 | Request SES production access (exit sandbox) | PO (AWS Console) | TODO |

**Why all four are required:**
- Without Step 1: SES can't sign emails for your domain
- Without Step 2: Cognito keeps sending from `verificationemail.com` (SPF/DKIM on your domain are irrelevant)
- Without Step 3: Receiving mail servers can't validate SPF/DKIM
- Without Step 4: SES sandbox restricts sending to verified addresses only (can't email real users)

---

## Current State

| Item | Finding |
|------|---------|
| **Provider** | AWS Cognito (verification & password-reset emails) |
| **Current sender** | `no-reply@verificationemail.com` (Cognito default) |
| **Custom SES config** | None — Cognito has no `emailConfiguration` set in CDK |
| **DNS host** | GoDaddy (`ns03.domaincontrol.com`, `ns04.domaincontrol.com`) |
| **Existing SPF** | None |
| **Existing DKIM** | None |
| **Existing MX** | None |
| **Existing DMARC** | `v=DMARC1; p=quarantine; adkim=r; aspf=r; rua=mailto:dmarc_rua@onsecureserver.net;` |

---

## Step 1: Verify cricverse360.com in AWS SES

**Run this CLI command** (or do it in the AWS Console → SES → Verified identities):

```bash
aws sesv2 create-email-identity \
  --identity-name cricverse360.com \
  --region us-east-1
```

This returns 3 DKIM tokens. Save them — they're needed for Step 3.

```bash
# Get the DKIM tokens:
aws sesv2 get-email-identity \
  --email-identity cricverse360.com \
  --region us-east-1 \
  | jq '.DkimAttributes.Tokens[]'
```

Example output: `"abc123def456"`, `"ghi789jkl012"`, `"mno345pqr678"`

**Verification status** will show "pending" until DNS records from Step 3 propagate.

---

## Step 2: Configure Cognito to Use SES (CDK Change)

In `cricverse360-infra/lib/cricverse360-stack.ts`, add email configuration to the UserPool:

```typescript
import * as ses from "aws-cdk-lib/aws-ses";

// After the existing UserPool definition, add SES email identity:
const emailIdentity = new ses.EmailIdentity(this, "CricVerse360EmailIdentity", {
  identity: ses.Identity.domain("cricverse360.com"),
});

// Modify the UserPool to use SES for email:
const userPool = new cognito.UserPool(this, "CricVerse360UserPool", {
  // ... existing props ...
  email: cognito.UserPoolEmail.withSES({
    fromEmail: "no-reply@cricverse360.com",
    fromName: "CricVerse360",
    sesRegion: "us-east-1",
    sesVerifiedDomain: "cricverse360.com",
  }),
});
```

**Important:** The SES domain must be verified (Step 1 complete + DNS records propagated) BEFORE deploying this CDK change. Otherwise Cognito will fail to send emails.

**Deploy order (critical — do NOT reorder):**

```
Day 1 (TODAY — start the async clocks):
  ┌─ Step 1: Create SES identity (instant)
  └─ Step 4: Request SES production access (ASYNC — 24-48h for AWS approval)
       ⚠️  Do this NOW. AWS takes 24-48h minimum to review.
       The clock starts when you submit, not when you're ready for everything else.

Day 1-2 (after Step 1 provides DKIM tokens):
  └─ Step 3: Add SPF + DKIM records in GoDaddy DNS
       Wait for SES to confirm domain is verified (typically 15 min to a few hours)

After BOTH conditions are met:
  ✓ SES domain shows "Verified" status
  ✓ SES production access APPROVED (not just requested)
  └─ Step 2: Deploy CDK stack (flips Cognito to use SES)

⚠️  DO NOT deploy Step 2 before production access is approved.
    If you flip Cognito before AWS approves production access,
    verification emails to new signups will FAIL during the window.
```

**Timing: do the final flip on a workday morning (not Friday afternoon).** If DNS propagation or SES has issues, you want AWS support reachable.

---

## Step 3: DNS Records (GoDaddy Panel)

### 3.1 SPF Record

| Type | Name | Value | TTL |
|------|------|-------|-----|
| TXT | `@` (root) | `v=spf1 include:amazonses.com ~all` | 3600 |

**Notes:**
- `include:amazonses.com` covers all AWS SES sending IPs
- `~all` (softfail) is appropriate for initial deployment
- Tighten to `-all` (hardfail) after 2 weeks of stable sending
- If you add Google Workspace later: `v=spf1 include:amazonses.com include:_spf.google.com ~all`

### 3.2 DKIM CNAME Records

Using the tokens from Step 1 (replace `{token1}`, `{token2}`, `{token3}` with actual values):

| Type | Name | Value | TTL |
|------|------|-------|-----|
| CNAME | `{token1}._domainkey` | `{token1}.dkim.amazonses.com` | 3600 |
| CNAME | `{token2}._domainkey` | `{token2}.dkim.amazonses.com` | 3600 |
| CNAME | `{token3}._domainkey` | `{token3}.dkim.amazonses.com` | 3600 |

### 3.3 Verify DNS Propagation

```bash
# Check SPF
dig txt cricverse360.com +short
# Expected: "v=spf1 include:amazonses.com ~all"

# Check DKIM (replace with actual token)
dig cname {token1}._domainkey.cricverse360.com +short
# Expected: {token1}.dkim.amazonses.com.
```

After DNS propagates, SES will automatically verify the domain (check status in SES Console).

---

## Step 4: Request SES Production Access

> **⚠️ DO THIS TODAY.** This is the single biggest timing dependency in the whole
> DNS sequence. AWS takes **24-48 hours** to approve, sometimes longer if they
> ask follow-up questions. The clock starts when you submit the request, not when
> you're ready for everything else. If you're hoping to soft-launch in two weeks,
> submit this request now.

By default, SES accounts are in **sandbox mode** — you can only send to verified email addresses. To send to real users (signup verification, password reset), you must request production access.

**AWS Console path:** SES → Account dashboard → "Request production access"

**Or via CLI (Service Quotas):**
```bash
aws sesv2 put-account-details \
  --mail-type TRANSACTIONAL \
  --website-url "https://cricverse360.com" \
  --use-case-description "Sending account verification and password reset emails to users who sign up on cricverse360.com. Expected volume: <100 emails/day initially." \
  --contact-language EN \
  --production-access-enabled \
  --region us-east-1
```

**Typical approval time:** 24-48 hours (sometimes instant for low-volume transactional use cases; sometimes longer if AWS asks follow-up questions).

**What to include in the request:**
- Type: Transactional
- Website: https://cricverse360.com
- Use case: Account verification emails, password reset emails
- Expected volume: Low (<100/day initially)
- Compliance: Users opt-in by registering; emails are triggered by user actions only

---

## DMARC Note

Current DMARC record:
```
v=DMARC1; p=quarantine; adkim=r; aspf=r; rua=mailto:dmarc_rua@onsecureserver.net;
```

**Issue:** `rua` points to `onsecureserver.net` — GoDaddy template leftover. Aggregate reports are going somewhere you likely don't monitor.

**Recommendation:** Change `rua` to `mailto:dmarc-reports@cricverse360.com` or use a free DMARC monitoring service. Keep `p=quarantine` for now; tighten to `p=reject` after SPF+DKIM stable for 2+ weeks.

---

## End-to-End Verification (after all 4 steps complete)

1. Register a new account on cricverse360.com with a fresh Gmail address
2. Check inbox for verification email — should come from `no-reply@cricverse360.com`
3. In Gmail: "Show original" on the received email
4. Confirm headers show:
   - `SPF: PASS` (domain: cricverse360.com)
   - `DKIM: PASS` (domain: cricverse360.com)
   - `DMARC: PASS`
5. Repeat with Outlook/Hotmail
6. Use https://www.mail-tester.com for a deliverability score (target: 9+/10)

---

## Rollback

SPF/DKIM are purely additive — removing them returns to the status quo:
1. Remove SPF TXT record
2. Remove 3 DKIM CNAMEs
3. Revert CDK Cognito email config to default (remove `email:` prop)
4. Redeploy CDK stack

Cognito will revert to sending from `verificationemail.com`.

---

## Action Checklist for Product Owner

- [ ] Run `aws sesv2 create-email-identity --identity-name cricverse360.com --region us-east-1`
- [ ] Note the 3 DKIM tokens returned
- [ ] Add SPF TXT record in GoDaddy
- [ ] Add 3 DKIM CNAME records in GoDaddy
- [ ] Wait for SES to show "Verified" status (check in Console)
- [ ] Request SES production access (exit sandbox)
- [ ] Confirm whether DMARC `rua` to `onsecureserver.net` is intentional
- [ ] Approve CDK stack update (Step 2 code changes in cricverse360-infra)
- [ ] After CDK deploy: test signup with fresh Gmail → verify SPF=PASS, DKIM=PASS
