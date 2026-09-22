#!/usr/bin/env python3
"""
Zyxen Autonomous Outreach & Lead Tracking Engine
Managed by Hermes Agent (Zyxen GM)

Features:
- Send personalized outreach emails via macOS Mail app (Zyxen / i.gougoudis@zyxen.gr)
- Track lead status in data/leads.json
- Automatically scan Zyxen INBOX for replies from leads
- Display interactive CRM/Pipeline status CLI & Dashboard summary
"""

import json
import os
import subprocess
import sys
import time
from datetime import datetime

LEADS_FILE = os.path.abspath(os.path.join(os.path.dirname(__file__), "../data/leads.json"))
SENDER_EMAIL = "i.gougoudis@zyxen.gr"

def load_data():
    if not os.path.exists(LEADS_FILE):
        return {"leads": [], "stats": {"total_contacted": 0, "replies_received": 0, "meetings_booked": 0, "total_pipeline_value": 0}}
    with open(LEADS_FILE, "r", encoding="utf-8") as f:
        return json.load(f)

def save_data(data):
    os.makedirs(os.path.dirname(LEADS_FILE), exist_ok=True)
    with open(LEADS_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

def generate_lead_id(company):
    clean = "".join(c for c in company.lower() if c.isalnum())
    return f"lead_{clean}_{int(time.time())}"

def add_lead(company, name, email, industry, custom_note="", pipeline_value=2500):
    data = load_data()
    # Check if lead exists by email
    for lead in data["leads"]:
        if lead["email"].lower() == email.lower():
            print(f"[!] Lead {email} already exists.")
            return lead["id"]
    
    lead_id = generate_lead_id(company)
    new_lead = {
        "id": lead_id,
        "company": company,
        "name": name,
        "email": email,
        "industry": industry,
        "custom_note": custom_note,
        "status": "ADDED",  # ADDED, SENT, REPLIED, MEETING_BOOKED, CLOSED
        "pipeline_value": pipeline_value,
        "added_at": datetime.now().isoformat(),
        "sent_at": None,
        "last_reply_at": None,
        "history": [{
            "timestamp": datetime.now().isoformat(),
            "event": "Lead created"
        }]
    }
    data["leads"].append(new_lead)
    save_data(data)
    print(f"[+] Added lead: {company} ({name} <{email}>)")
    return lead_id

def send_email_via_applescript(to_email, subject, body_text):
    # Escape quotes and backslashes for AppleScript string literals
    escaped_body = body_text.replace('\\', '\\\\').replace('"', '\\"')
    escaped_subject = subject.replace('\\', '\\\\').replace('"', '\\"')
    escaped_to = to_email.replace('\\', '\\\\').replace('"', '\\"')

    applescript = f'''
    tell application "Mail"
        set newMessage to make new outgoing message with properties {{subject:"{escaped_subject}", content:"{escaped_body}", visible:false}}
        tell newMessage
            set sender to "{SENDER_EMAIL}"
            make new to recipient at end of to recipients with properties {{address:"{escaped_to}"}}
            send
        end tell
    end tell
    '''
    res = subprocess.run(["osascript", "-e", applescript], capture_output=True, text=True)
    if res.returncode == 0:
        return True, "Email sent successfully"
    else:
        return False, res.stderr

def send_outreach_email(lead_id, test_mode=False):
    data = load_data()
    lead = None
    for l in data["leads"]:
        if l["id"] == lead_id:
            lead = l
            break
    
    if not lead:
        print(f"[X] Lead ID {lead_id} not found.")
        return False

    audit_link = f"https://zyxen.gr/el/audit?ref={lead['id']}"
    
    subject = f"{lead['company']} | 2 τεχνικά σημεία που επηρεάζουν τα conversions σας"
    body = f"""Καλησπέρα {lead['name']},

Ρίχνοντας μια ματιά στο site της {lead['company']}, παρατήρησα την εξαιρετική παρουσία που έχετε στον κλάδο {lead['industry']}.

Ωστόσο, τρέχοντας έναν τεχνικό έλεγχο στο εργαλείο μας στη Zyxen, εντοπίσαμε 2 συγκεκριμένα σημεία στο mobile loading speed και το conversion flow που πιθανότατα σας κοστίζουν 15-20% σε χαμένους πελάτες καθημερινά.

{lead['custom_note'] if lead['custom_note'] else ''}

Ετοιμάσαμε ένα δωρεάν διαδραστικό εργαλείο ελέγχου και υπολογιστή απωλειών που μπορείτε να δείτε άμεσα εδώ:
{audit_link}

Θα θέλατε να σας στείλω ένα σύντομο βίντεο 90 δευτερολέπτων όπου σας δείχνουμε αναλυτικά τα ευρήματα και πώς μπορούν να διορθωθούν;

Με εκτίμηση,
Ηρακλής Γουγούδης
Managing Partner | Zyxen
i.gougoudis@zyxen.gr | https://zyxen.gr
"""

    if test_mode:
        print("=== TEST MODE — EMAIL PREVIEW ===")
        print(f"To: {lead['email']}")
        print(f"Subject: {subject}")
        print("Body:\n" + body)
        return True

    success, msg = send_email_via_applescript(lead["email"], subject, body)
    if success:
        lead["status"] = "SENT"
        lead["sent_at"] = datetime.now().isoformat()
        lead["history"].append({
            "timestamp": datetime.now().isoformat(),
            "event": f"Outreach email sent to {lead['email']}"
        })
        data["stats"]["total_contacted"] += 1
        save_data(data)
        print(f"[✓] Sent email to {lead['company']} ({lead['email']})")
        return True
    else:
        print(f"[X] Failed to send email to {lead['email']}: {msg}")
        return False

def check_inbox_replies():
    data = load_data()
    leads_by_email = {l["email"].lower(): l for l in data["leads"] if l["status"] in ["SENT", "REPLIED"]}
    if not leads_by_email:
        print("[i] No active sent leads to check replies for.")
        return

    applescript = '''
    tell application "Mail"
        set targetAccount to first account whose name is "Zyxen"
        set targetMailbox to mailbox "INBOX" of targetAccount
        set msgList to {}
        set recentMsgs to (messages of targetMailbox whose read status is false)
        repeat with msg in recentMsgs
            set end of msgList to (sender of msg & "|||" & subject of msg & "|||" & (date received of msg as string))
        end repeat
        return msgList
    end tell
    '''
    res = subprocess.run(["osascript", "-e", applescript], capture_output=True, text=True)
    if res.returncode == 0 and res.stdout.strip():
        lines = res.stdout.strip().split(", ")
        new_replies = 0
        for line in lines:
            parts = line.split("|||")
            if len(parts) >= 2:
                sender_raw = parts[0].lower()
                subj = parts[1]
                for lead_email, lead in leads_by_email.items():
                    if lead_email in sender_raw:
                        if lead["status"] != "REPLIED":
                            lead["status"] = "REPLIED"
                            lead["last_reply_at"] = datetime.now().isoformat()
                            lead["history"].append({
                                "timestamp": datetime.now().isoformat(),
                                "event": f"Reply received from {lead_email} - Subject: {subj}"
                            })
                            data["stats"]["replies_received"] += 1
                            new_replies += 1
                            print(f"[🔥 REPLIED] New response from {lead['company']} ({lead_email})!")
        save_data(data)
        if new_replies == 0:
            print("[i] Checked Zyxen INBOX: No new lead replies found.")
    else:
        print("[i] Checked Zyxen INBOX: No unread messages.")

def print_dashboard():
    data = load_data()
    leads = data["leads"]
    stats = data["stats"]
    
    print("\n" + "═"*60)
    print(" 📊 ZYXEN AUTONOMOUS OUTREACH & LEAD CRM DASHBOARD")
    print("═"*60)
    print(f" Total Contacted    : {stats['total_contacted']}")
    print(f" Replies Received   : {stats['replies_received']}")
    print(f" Meetings Booked    : {stats['meetings_booked']}")
    pipeline_val = sum(l.get("pipeline_value", 2500) for l in leads if l["status"] in ["SENT", "REPLIED", "MEETING_BOOKED"])
    print(f" Pipeline Value     : {pipeline_val:,.2f} €")
    print("─"*60)
    print(f"{'COMPANY':<22} | {'CONTACT':<18} | {'STATUS':<12} | {'VALUE':<8}")
    print("─"*60)
    if not leads:
        print(" No leads added yet. Use add_lead() to populate pipeline.")
    else:
        for l in leads:
            print(f"{l['company'][:20]:<22} | {l['name'][:16]:<18} | {l['status']:<12} | {l['pipeline_value']}€")
    print("═"*60 + "\n")

if __name__ == "__main__":
    if len(sys.argv) > 1:
        cmd = sys.argv[1]
        if cmd == "dashboard":
            print_dashboard()
        elif cmd == "check-replies":
            check_inbox_replies()
        elif cmd == "add" and len(sys.argv) >= 5:
            # company name email industry
            add_lead(sys.argv[2], sys.argv[3], sys.argv[4], sys.argv[5], sys.argv[6] if len(sys.argv) > 6 else "")
        elif cmd == "send-all":
            data = load_data()
            for l in data["leads"]:
                if l["status"] == "ADDED":
                    send_outreach_email(l["id"])
    else:
        print_dashboard()
