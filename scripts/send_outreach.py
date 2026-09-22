#!/usr/bin/env python3
"""
Zyxen Automated Email Dispatcher via Apple Mail (i.gougoudis@zyxen.gr)
Sends personalized B2B outreach to discovered leads and updates CRM state.
"""

import json
import subprocess
import time
from datetime import datetime

LEADS_PATH = '/Users/iraklisgougoudis/Desktop/Code/zyxen-digital-flow/data/leads.json'

def send_apple_mail(recipient, subject, body, sender="i.gougoudis@zyxen.gr"):
    escaped_body = body.replace('\\', '\\\\').replace('"', '\\"').replace('\n', '\\n')
    escaped_subject = subject.replace('\\', '\\\\').replace('"', '\\"')
    escaped_recipient = recipient.replace('\\', '\\\\').replace('"', '\\"')

    applescript = f'''
    tell application "Mail"
        set newMessage to make new outgoing message with properties {{subject:"{escaped_subject}", content:"{escaped_body}", visible:false}}
        tell newMessage
            set sender to "{sender}"
            make new to recipient at end of to recipients with properties {{address:"{escaped_recipient}"}}
            send
        end tell
    end tell
    '''
    try:
        res = subprocess.run(['osascript', '-e', applescript], capture_output=True, text=True, check=True)
        return True, res.stdout
    except subprocess.CalledProcessError as e:
        return False, e.stderr

def main():
    with open(LEADS_PATH, 'r', encoding='utf-8') as f:
        data = json.load(f)

    leads = data.get('leads', data) if isinstance(data, dict) else data

    sent_count = 0
    failed_count = 0

    print(f"🚀 Initiating Automated Outbound Campaign for {len(leads)} leads...")

    for lead in leads:
        if not isinstance(lead, dict):
            continue

        draft = lead.get('email_draft') or lead.get('emailDraft')
        status = lead.get('status')

        if status == 'ADDED' and draft:
            recipient = lead.get('email') or lead.get('contact', {}).get('email')
            subject = draft.get('subject')
            body = draft.get('body')
            company = lead.get('company', 'Prospective Client')

            if not recipient or not subject or not body:
                continue

            print(f"📧 Sending outreach to {company} ({recipient})...")
            success, msg = send_apple_mail(recipient, subject, body)

            now_str = datetime.now().strftime("%Y-%m-%d %H:%M")
            if success:
                lead['status'] = 'SENT'
                lead['sent_at'] = now_str
                lead['lastActivity'] = now_str
                if 'history' not in lead:
                    lead['history'] = []
                lead['history'].append({
                    "timestamp": now_str,
                    "event": f"Outbound B2B Email sent to {recipient} via i.gougoudis@zyxen.gr"
                })
                sent_count += 1
                print(f"  ✓ Successfully sent to {company}!")
            else:
                print(f"  ✗ Failed to send to {company}: {msg}")
                failed_count += 1

            time.sleep(1)

    output_data = {"leads": leads} if isinstance(data, dict) and 'leads' in data else leads
    with open(LEADS_PATH, 'w', encoding='utf-8') as f:
        json.dump(output_data, f, ensure_ascii=False, indent=2)

    print(f"\n✅ Dispatch Complete: {sent_count} emails sent, {failed_count} failed.")

if __name__ == '__main__':
    main()
